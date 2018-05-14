import json
import mimetypes
import os

import botocore
import rollbar
from flask import Response, current_app, jsonify, request
from flask_login import current_user, login_required
from sqlalchemy.exc import DataError

from app.api import api
from app.api.helpers import abort, forbidden, not_found, role_required
from app.api.services import (audit_service, brief_overview_service,
                              brief_responses_service, briefs, lots_service)
from app.emails import send_brief_response_received_email
from dmapiclient.audit import AuditTypes
from dmutils.file import s3_download_file, s3_upload_file_from_request

from ...models import (AuditEvent, Brief, BriefResponse, Framework, Supplier,
                       ValidationError, db)
from ...utils import get_json_from_request


def _can_do_brief_response(brief_id):
    try:
        brief = Brief.query.get(brief_id)
    except DataError:
        brief = None

    if brief is None:
        abort("Invalid brief ID '{}'".format(brief_id))

    if brief.status != 'live':
        abort("Brief must be live")

    if brief.framework.status != 'live':
        abort("Brief framework must be live")

    if not hasattr(current_user, 'role') or current_user.role != 'supplier':
        forbidden("Only supplier role users can respond to briefs")

    try:
        supplier = Supplier.query.filter(
            Supplier.code == current_user.supplier_code
        ).first()
    except DataError:
        supplier = None

    if not supplier:
        forbidden("Invalid supplier Code '{}'".format(current_user.supplier_code))

    def domain(email):
        return email.split('@')[-1]

    current_user_domain = domain(current_user.email_address) \
        if domain(current_user.email_address) not in current_app.config.get('GENERIC_EMAIL_DOMAINS') \
        else None

    if brief.data.get('sellerSelector', '') == 'someSellers':
        seller_domain_list = [domain(x).lower() for x in brief.data['sellerEmailList']]
        if current_user.email_address not in brief.data['sellerEmailList'] \
                and (not current_user_domain or current_user_domain.lower() not in seller_domain_list):
            forbidden("Supplier not selected for this brief")
    if brief.data.get('sellerSelector', '') == 'oneSeller':
        if current_user.email_address.lower() != brief.data['sellerEmail'].lower() \
                and (not current_user_domain or
                     current_user_domain.lower() != domain(brief.data['sellerEmail'].lower())):
            forbidden("Supplier not selected for this brief")

    if len(supplier.frameworks) == 0 \
            or 'digital-marketplace' != supplier.frameworks[0].framework.slug \
            or len(supplier.assessed_domains) == 0:
        abort("Supplier does not have Digital Marketplace framework "
              "or does not have at least one assessed domain")

    lot = lots_service.first(slug='digital-professionals')
    if brief.lot_id == lot.id:
        # Check if there are more than 3 brief response already from this supplier when professional aka specialists
        brief_response_count = brief_responses_service.find(supplier_code=supplier.code,
                                                            brief_id=brief.id,
                                                            withdrawn_at=None).count()
        if (brief_response_count > 2):  # TODO magic number
            abort("There are already 3 brief responses for supplier '{}'".format(supplier.code))
    else:
        # Check if brief response already exists from this supplier when outcome for all other types
        if brief_responses_service.find(supplier_code=supplier.code,
                                        brief_id=brief.id,
                                        withdrawn_at=None).one_or_none():
            abort("Brief response already exists for supplier '{}'".format(supplier.code))

    return supplier, brief


@api.route('/brief/<int:brief_id>', methods=["GET"])
def get_brief(brief_id):
    brief = Brief.query.filter(
        Brief.id == brief_id
    ).first_or_404()
    if brief.status == 'draft':
        brief_user_ids = [user.id for user in brief.users]
        if hasattr(current_user, 'role') and current_user.role == 'buyer' and current_user.id in brief_user_ids:
            return jsonify(brief.serialize(with_users=True))
        else:
            return forbidden("Unauthorised to view brief or brief does not exist")
    else:
        return jsonify(brief.serialize(with_users=False))


@api.route('/brief/<int:brief_id>', methods=['DELETE'])
@login_required
@role_required('buyer')
def delete_brief(brief_id):
    """Delete brief (role=buyer)
    ---
    tags:
        - Brief
    definitions:
        DeleteBrief:
            type: object
            properties:
                message:
                    type: string
    responses:
        200:
            description: Brief deleted successfully.
            schema:
                $ref: '#/definitions/DeleteBrief'
        400:
            description: Bad request. Brief status must be 'draft'.
        403:
            description: Unauthorised to delete brief.
        404:
            description: brief_id not found.
        500:
            description: Unexpected error.
    """
    brief = briefs.get(brief_id)

    if not brief:
        not_found("Invalid brief id '{}'".format(brief_id))

    if current_user.role == 'buyer':
        brief_user_ids = [user.id for user in brief.users]
        if current_user.id not in brief_user_ids:
            return forbidden('Unauthorised to delete brief')

    if brief.status != 'draft':
        abort('Cannot delete a {} brief'.format(brief.status))

    audit = AuditEvent(
        audit_type=AuditTypes.delete_brief,
        user=current_user.email_address,
        data={
            'briefId': brief_id
        },
        db_object=None
    )

    try:
        audit_service.save(audit)
        briefs.delete(brief)
    except Exception as e:
        extra_data = {'audit_type': AuditTypes.delete_brief, 'briefId': brief.id, 'exception': e.message}
        rollbar.report_exc_info(extra_data=extra_data)

    return jsonify(message='Brief {} deleted'.format(brief_id)), 200


@api.route('/brief/<int:brief_id>/overview', methods=["GET"])
@login_required
@role_required('buyer')
def get_brief_overview(brief_id):
    """Overview (role=buyer)
    ---
    tags:
        - overview
    definitions:
        BriefOverview:
            type: object
            properties:
                sections:
                    type: array
                    items:
                        $ref: '#/definitions/BriefOverviewSections'
                title:
                    type: string
        BriefOverviewSections:
            type: array
            items:
                $ref: '#/definitions/BriefOverviewSection'
        BriefOverviewSection:
            type: object
            properties:
                links:
                    type: array
                    items:
                        $ref: '#/definitions/BriefOverviewSectionLinks'
                title:
                    type: string
        BriefOverviewSectionLinks:
            type: array
            items:
                $ref: '#/definitions/BriefOverviewSectionLink'
        BriefOverviewSectionLink:
            type: object
            properties:
                complete:
                    type: boolean
                path:
                    type: string
                    nullable: true
                text:
                    type: string
    responses:
        200:
            description: Data for the Overview page
            schema:
                $ref: '#/definitions/BriefOverview'
        400:
            description: Lot not supported.
        403:
            description: Unauthorised to view brief.
        404:
            description: brief_id not found
    """
    brief = briefs.get(brief_id)

    if not brief:
        not_found("Invalid brief id '{}'".format(brief_id))

    if current_user.role == 'buyer':
        brief_user_ids = [user.id for user in brief.users]
        if current_user.id not in brief_user_ids:
            return forbidden('Unauthorised to view brief')

    if brief.lot.slug != 'digital-professionals':
        abort('Lot {} is not supported'.format(brief.lot.slug))

    sections = brief_overview_service.get_sections(brief)

    return jsonify(sections=sections, status=brief.status, title=brief.data['title']), 200


@api.route('/brief/<int:brief_id>/responses', methods=['GET'])
@login_required
def get_brief_responses(brief_id):
    """All brief responses (role=supplier,buyer)
    ---
    tags:
      - "Brief"
    security:
      - basicAuth: []
    parameters:
      - name: brief_id
        in: path
        type: number
        required: true
    definitions:
      BriefResponses:
        properties:
          briefResponses:
            type: array
            items:
              id: BriefResponse
    responses:
      200:
        description: A list of brief responses
        schema:
          id: BriefResponses
      404:
        description: brief_id not found
    """
    brief = briefs.get(brief_id)
    if not brief:
        not_found("Invalid brief id '{}'".format(brief_id))

    if current_user.role == 'buyer':
        brief_user_ids = [user.id for user in brief.users]
        if current_user.id not in brief_user_ids:
            return forbidden("Unauthorised to view brief or brief does not exist")

    supplier_code = getattr(current_user, 'supplier_code', None)
    if current_user.role == 'buyer' and brief.status != 'closed':
        brief_responses = []
    else:
        brief_responses = brief_responses_service.get_brief_responses(brief_id, supplier_code)

    return jsonify(brief=brief.serialize(with_users=False), briefResponses=brief_responses)


@api.route('/brief/<int:brief_id>/respond/documents/<string:supplier_code>/<slug>', methods=['POST'])
@login_required
def upload_brief_response_file(brief_id, supplier_code, slug):
    supplier, brief = _can_do_brief_response(brief_id)
    return jsonify({"filename": s3_upload_file_from_request(request, slug,
                                                            os.path.join(brief.framework.slug, 'documents',
                                                                         'brief-' + str(brief_id),
                                                                         'supplier-' + str(supplier.code)))
                    })


@api.route('/brief/<int:brief_id>/respond/documents')
@login_required
@role_required('buyer')
def download_brief_responses(brief_id):
    brief = Brief.query.filter(
        Brief.id == brief_id
    ).first_or_404()
    brief_user_ids = [user.id for user in brief.users]
    if current_user.id not in brief_user_ids:
        return forbidden("Unauthorised to view brief or brief does not exist")
    if brief.status != 'closed':
        return forbidden("You can only download documents for closed briefs")
    try:
        file = s3_download_file(
            'brief-{}-resumes.zip'.format(brief_id),
            os.path.join(brief.framework.slug, 'archives', 'brief-{}'.format(brief_id))
        )
    except botocore.exceptions.ClientError as e:
        rollbar.report_exc_info()
        not_found("Brief documents not found for brief id '{}'".format(brief_id))

    response = Response(file, mimetype='application/zip')
    response.headers['Content-Disposition'] = 'attachment; filename="brief-{}-resumes.zip"'.format(brief_id)
    return response


@api.route('/brief/<int:brief_id>/respond/documents/<int:supplier_code>/<slug>', methods=['GET'])
@login_required
def download_brief_response_file(brief_id, supplier_code, slug):
    brief = Brief.query.filter(
        Brief.id == brief_id
    ).first_or_404()
    brief_user_ids = [user.id for user in brief.users]
    if hasattr(current_user, 'role') and (current_user.role == 'buyer' and current_user.id in brief_user_ids) \
            or (current_user.role == 'supplier' and current_user.supplier_code == supplier_code):
        file = s3_download_file(slug, os.path.join(brief.framework.slug, 'documents',
                                                   'brief-' + str(brief_id),
                                                   'supplier-' + str(supplier_code)))

        mimetype = mimetypes.guess_type(slug)[0] or 'binary/octet-stream'
        return Response(file, mimetype=mimetype)
    else:
        return forbidden("Unauthorised to view brief or brief does not exist")


@api.route('/brief/<int:brief_id>/respond', methods=["POST"])
@login_required
def post_brief_response(brief_id):

    brief_response_json = get_json_from_request()
    supplier, brief = _can_do_brief_response(brief_id)
    try:
        brief_response = BriefResponse(
            data=brief_response_json,
            supplier=supplier,
            brief=brief
        )

        brief_response.validate()
        db.session.add(brief_response)
        db.session.flush()

    except ValidationError as e:
        brief_response_json['brief_id'] = brief_id
        rollbar.report_exc_info(extra_data=brief_response_json)
        message = ""
        if 'essentialRequirements' in e.message and e.message['essentialRequirements'] == 'answer_required':
            message = "Essential requirements must be completed"
            del e.message['essentialRequirements']
        if len(e.message) > 0:
            message += json.dumps(e.message)
        return jsonify(message=message), 400
    except Exception as e:
        brief_response_json['brief_id'] = brief_id
        rollbar.report_exc_info(extra_data=brief_response_json)
        return jsonify(message=e.message), 400

    try:
        send_brief_response_received_email(supplier, brief, brief_response)
    except Exception as e:
        brief_response_json['brief_id'] = brief_id
        rollbar.report_exc_info(extra_data=brief_response_json)

    audit_service.log_audit_event(
        audit_type=AuditTypes.create_brief_response,
        user=current_user.email_address,
        data={
            'briefResponseId': brief_response.id,
            'briefResponseJson': brief_response_json,
        },
        db_object=brief_response)

    return jsonify(briefResponses=brief_response.serialize()), 201


@api.route('/framework/<string:framework_slug>', methods=["GET"])
def get_framework(framework_slug):
    framework = Framework.query.filter(
        Framework.slug == framework_slug
    ).first_or_404()

    return jsonify(framework.serialize())
