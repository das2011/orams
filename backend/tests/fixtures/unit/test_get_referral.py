from app.api.views import referrals


class CurrentUser():
    def __init__(self, id, role, supplier_code):
        self.id = id
        self.role = role
        self.supplier_code = supplier_code

    def get_id(self):
        return self.id


def test_buyer_can_retrieve_own_referral():
    current_user = CurrentUser(u'100', 'buyer', None)
    assert referrals.can_view_referral(100, 123, current_user)


def test_buyer_cannot_retrieve_others_referral():
    current_user = CurrentUser(u'200', 'buyer', None)
    assert not referrals.can_view_referral(100, 123, current_user)


def test_supplier_can_retrieve_referral_belonging_to_supplier():
    current_user = CurrentUser(u'300', 'supplier', 123)
    assert referrals.can_view_referral(100, 123, current_user)


def test_supplier_cannot_retrieve_referral_belonging_to_other_supplier():
    current_user = CurrentUser(u'300', 'supplier', 456)
    assert not referrals.can_view_referral(100, 123, current_user)
