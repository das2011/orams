import json


def test_referral_creation_failed_when_requested_by_supplier(client, supplier_user):
    res = client.post('/2/login', data=json.dumps({
        'emailAddress': supplier_user.email_address, 'password': 'testpassword'
    }), content_type='application/json')
    assert res.status_code == 200

    response = client.post(
        '/2/referrals',
        data=json.dumps({'serviceTypePriceId': 1}),
        content_type='application/json')
    assert response.status_code == 403


def test_referral_created_when_requested_by_buyer(client, users, agencies, service_prices_without_future):
    buyer = next(user for user in users if user.id == 7)
    res = client.post('/2/login', data=json.dumps({
        'emailAddress': buyer.email_address, 'password': 'testpassword'
    }), content_type='application/json')
    assert res.status_code == 200

    response = client.post(
        '/2/referrals',
        data=json.dumps({'serviceTypePriceId': service_prices_without_future[0].id}),
        content_type='application/json')
    assert response.status_code == 200


def test_referral_created(client, users, agencies, service_prices_without_future):
    from app.models import Referral

    buyer = next(user for user in users if user.id == 7)
    res = client.post('/2/login', data=json.dumps({
        'emailAddress': buyer.email_address, 'password': 'testpassword'
    }), content_type='application/json')
    assert res.status_code == 200

    response = client.post(
        '/2/referrals',
        data=json.dumps({'serviceTypePriceId': service_prices_without_future[0].id}),
        content_type='application/json')
    assert response.status_code == 200
    referral = json.loads(response.data)
    assert referral['referralId'] == 1
    referral = Referral.query\
        .filter(Referral.id == referral['referralId'])\
        .first()
    assert referral.agency_name == 'Digital Transformation Agency'
    assert referral.created_by == buyer.id
    assert referral.service_type_price.supplier_code == service_prices_without_future[0].supplier_code
    assert referral.service_type_price.price == service_prices_without_future[0].price


def test_referral_created_when_requested_by_admin(client, admin_users, agencies, service_prices_without_future):
    res = client.post('/2/login', data=json.dumps({
        'emailAddress': admin_users[0].email_address, 'password': 'testpassword'
    }), content_type='application/json')
    assert res.status_code == 200

    response = client.post(
        '/2/referrals',
        data=json.dumps({'serviceTypePriceId': service_prices_without_future[0].id}),
        content_type='application/json')
    assert response.status_code == 200


def test_referral_not_created_when_serviceTypePriceId_missing_from_request(client, admin_users):
    res = client.post('/2/login', data=json.dumps({
        'emailAddress': admin_users[0].email_address, 'password': 'testpassword'
    }), content_type='application/json')
    assert res.status_code == 200

    response = client.post(
        '/2/referrals',
        data=json.dumps({'unusedProperty': 0}),
        content_type='application/json')
    assert response.status_code == 400
    response_body = json.loads(response.get_data())
    assert response_body['message'] == '\'serviceTypePriceId\' is a required property'
