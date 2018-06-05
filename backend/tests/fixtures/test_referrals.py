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


def test_referral_creation_suceeded_when_requested_by_buyer(client, users, agencies, service_prices_without_future):
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
