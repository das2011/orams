from app.api.helpers import Service, get_email_domain
from app.models import Referral


class ReferralService(Service):
    __model__ = Referral

    def __init__(self, *args, **kwargs):
        super(ReferralService, self).__init__(*args, **kwargs)

    def create_referral(self, service_type_price_id, requested_by, details):
        return self.create(service_type_price_id=service_type_price_id,
                           domain=get_email_domain(requested_by.email_address),
                           created_by=requested_by.id,
                           details=details)
