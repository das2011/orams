from flask import jsonify
from flask_login import current_user, login_required
from app.api import api
from app.api.helpers import abort, not_found
from ...models import AuditEvent
from app.api.services import brief_responses_service, audit_service, audit_types
from app.api.helpers import role_required
from ...datetime_utils import utcnow
import rollbar


@api.route('/brief-response/<int:brief_response_id>/withdraw', methods=['PUT'])
@login_required
@role_required('supplier')
def withdraw_brief_response(brief_response_id):
    """Withdraw brief responses (role=supplier)
    ---
    tags:
      - "Brief Response"
    security:
      - basicAuth: []
    parameters:
      - name: brief_response_id
        in: path
        type: number
        required: true
    responses:
      200:
        description: Successfully withdrawn a candidate
        schema:
          id: BriefResponse
      400:
        description: brief_response_id not found
    """
    brief_response = (brief_responses_service
                      .find(id=brief_response_id,
                            supplier_code=current_user.supplier_code)
                      .one_or_none())

    if brief_response:
        if brief_response.withdrawn_at is None:
            brief_response.withdrawn_at = utcnow()
            brief_responses_service.save(brief_response)

            try:
                audit = AuditEvent(
                    audit_type=audit_types.update_brief_response,
                    user=current_user.email_address,
                    data={
                        'briefResponseId': brief_response.id
                    },
                    db_object=brief_response
                )
                audit_service.save(audit)
            except Exception as e:
                extra_data = {'audit_type': audit_types.update_brief_response, 'briefResponseId': brief_response.id}
                rollbar.report_exc_info(extra_data=extra_data)
        else:
            abort('Brief response with brief_response_id "{}" is already withdrawn'.format(brief_response_id))
    else:
        not_found('Cannot find brief response with brief_response_id :{} and supplier_code: {}'
                  .format(brief_response_id, current_user.supplier_code))

    return jsonify(briefResponses=brief_response.serialize()), 200


@api.route('/brief-response/<int:brief_response_id>', methods=['GET'])
@login_required
@role_required('supplier')
def get_brief_response(brief_response_id):
    """Get brief response (role=supplier)
    ---
    tags:
      - "Brief Response"
    security:
      - basicAuth: []
    parameters:
      - name: brief_response_id
        in: path
        type: number
        required: true
    definitions:
      BriefResponse:
        type: object
        properties:
          id:
            type: number
          data:
            type: object
          brief_id:
            type: number
          supplier_code:
            type: number
    responses:
      200:
        description: A brief response on id
        schema:
          id: BriefResponse
      404:
        description: brief_response_id not found
    """

    brief_response = brief_responses_service.find(id=brief_response_id,
                                                  supplier_code=current_user.supplier_code).one_or_none()

    if brief_response:
        if brief_response.withdrawn_at is not None:
            abort('Brief response {} is withdrawn'.format(brief_response_id))
    else:
        not_found('Cannot find brief response with brief_response_id :{} and supplier_code: {}'
                  .format(brief_response_id, current_user.supplier_code))

    return jsonify(brief_response.serialize())
