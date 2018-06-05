from flask import request, jsonify
from flask_login import login_required, current_user
from app.api import api
from app.api.services import referral_service
from app.api.helpers import role_required
from app.swagger import swag


@api.route('/referrals', methods=['POST'], endpoint='create_referral')
@login_required
@role_required('buyer')
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
