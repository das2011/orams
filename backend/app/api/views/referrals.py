from flask import request, jsonify
from flask_login import login_required, current_user
from app.api import api
from app.api.services import referral_service, suppliers
from app.api.helpers import role_required
from app.swagger import swag


@api.route('/referrals', methods=['POST'], endpoint='create_referral')
@login_required
@role_required('buyer', 'admin')
@swag.validate('CreateReferral')
def create_referral():
    """Create Referral
    ---
    tags:
      - referrals
    consumes:
      - application/json
    parameters:
      - name: body
        in: body
        required: true
        schema:
          id: CreateReferral
          required:
            - serviceTypePriceId
          properties:
            serviceTypePriceId:
              type: integer
    responses:
      200:
        description: Unique Id of the created referral
        properties:
          referralId:
            type: integer
    """
    json_data = request.get_json()
    service_type_price_id = json_data.get('serviceTypePriceId')
    new_referral = referral_service.create_referral(service_type_price_id, current_user)
    return jsonify({'referralId': new_referral.id}), 200


def can_view_referral(created_by, supplier_code, current_user):
    return (current_user.role == 'buyer' and created_by == int(current_user.get_id()) or
            current_user.role == 'supplier' and supplier_code == current_user.supplier_code)


def referral_view(referral_id, referral):
    supplier_code = referral.service_type_price.supplier_code
    supplier_name = suppliers.first(code=supplier_code).name

    return jsonify({
        'supplier': supplier_name,
        'price': referral.service_type_price.price,
        'dateCreated': referral.created_at,
        'regionName': referral.service_type_price.region.name,
        'regionState': referral.service_type_price.region.state,
        'createdBy': referral.created_by,
        'referralId': referral_id,
        'agency': referral.agency_name,
        'info': 'Info'
    })


@api.route('/referrals/<int:referral_id>', methods=['GET'], endpoint='get_referral')
@login_required
@role_required('buyer', 'supplier')
def get_referral(referral_id):
    referral = referral_service.get(referral_id)
    supplier_code = referral.service_type_price.supplier_code

    return (referral_view(referral_id, referral), 200) \
        if can_view_referral(referral.created_by, supplier_code, current_user) \
        else ('', 403)
