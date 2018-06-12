from app.api.views import referrals


class CurrentUser():
    def __init__(self, id, role, supplier_code, email):
        self.id = id
        self.role = role
        self.supplier_code = supplier_code
        self.email_address = email

    def get_id(self):
        return self.id


def test_buyer_can_retrieve_own_referral():
    current_user = CurrentUser(u'100', 'buyer', None, 'felix@digital.gov.au')
    assert referrals.can_view_referral(100, 123, 'digital.gov.au', current_user)


def test_buyer_cannot_retrieve_others_referral():
    current_user = CurrentUser(u'200', 'buyer', None, 'felix@digital.gov.au')
    assert not referrals.can_view_referral(100, 123, 'agency.gov.au', current_user)


def test_supplier_can_retrieve_referral_belonging_to_supplier():
    current_user = CurrentUser(u'300', 'supplier', 123, 'david@supplier.com.au')
    assert referrals.can_view_referral(100, 123, 'digital.gov.au', current_user)


def test_supplier_cannot_retrieve_referral_belonging_to_other_supplier():
    current_user = CurrentUser(u'300', 'supplier', 456, 'linda@othersupplier.com.au')
    assert not referrals.can_view_referral(100, 123, 'digital.gov.au', current_user)


def test_admin_can_view_referral_within_agency():
    current_user = CurrentUser(u'400', 'admin', None, 'alex@digital.gov.au')
    assert referrals.can_view_referral(100, 123, 'digital.gov.au', current_user)


def test_admin_cannot_view_referral_created_by_other_agency():
    current_user = CurrentUser(u'400', 'admin', None, 'alex@digital.gov.au')
    assert not referrals.can_view_referral(100, 123, 'other.gov.au', current_user)
