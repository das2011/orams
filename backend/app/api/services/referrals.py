from app.api.helpers import Service, get_email_domain
from app.models import Referral
from .users import UsersService
from .audit import AuditService


class ReferralService(Service):
    __model__ = Referral

    def __init__(self, *args, **kwargs):
        super(ReferralService, self).__init__(*args, **kwargs)
        self.audit = AuditService()
        self.user_service = UsersService()

    def create_referral(self, service_type_price_id, requested_by):
        user_org = self.user_service.get_user_organisation(get_email_domain(requested_by.email_address))
        return self.create(service_type_price_id=service_type_price_id,
                           agency_name=user_org,
                           created_by=requested_by.id)
