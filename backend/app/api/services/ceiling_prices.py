import pendulum
from flask_login import current_user
from flask import current_app
from app.api.helpers import Service, abort
from app.models import ServiceTypePriceCeiling
from app import db
from .prices import PricesService
from .audit import AuditService, AuditTypes


class CeilingPriceService(Service):
    __model__ = ServiceTypePriceCeiling

    def __init__(self, *args, **kwargs):
        super(CeilingPriceService, self).__init__(*args, **kwargs)
        self.audit = AuditService()
        self.prices_service = PricesService()

    def _match_price_to_ceiling(self, price_id, ceiling_price=None):
        """ Update the current price to the value of its ceiling.
        An optional ceiling_price is provided in case the current price does not exist

        This does not handle scenarios where the current_price may be updated
        by another request/transaction.

        :param price_id:        identifier of the db-record to be updated
        :param ceiling_price:   ServiceTypePriceCeiling object
        """
        existing_price = self.prices_service.get(price_id) if price_id else None

        date_from = pendulum.tomorrow(current_app.config['DEADLINES_TZ_NAME']).date()
        date_to = pendulum.Date.create(2050, 1, 1)

        if existing_price:
            existing_price.date_to = date_from.subtract(days=1)
            self.prices_service.add_price(
                existing_price, date_from, date_to, existing_price.service_type_price_ceiling.price)
        else:
            if not ceiling_price:
                raise Exception("Ceiling price required to create new price record")
            self.prices_service.create(
                supplier_code=ceiling_price.supplier_code,
                service_type_id=ceiling_price.service_type_id,
                region_id=ceiling_price.region_id,
                date_from=pendulum.today(current_app.config['DEADLINES_TZ_NAME']).date(),
                date_to=date_to,
                price=ceiling_price.price,
                sub_service_id=ceiling_price.sub_service_id,
                service_type_price_ceiling_id=ceiling_price.id
            )

    def update_ceiling_price(self, ceiling_id, new_ceiling, set_current_price_to_ceiling=False):
        """We only validate against a SINGLE (most recently updated) service_price.
        See the query in prices_service.get_prices() for further details on how prices are ordered.

        If multiple prices are related to the same ceiling_price, they will all be updated.

        In the case where the user has requested to update the current price to match the new
        ceiling price, these two operations are done in separate transactions. There is no
        requirement to ensure they are done atomically.

        The following risks are accepted:
        (1) Concurrent updates to a service-price or a ceiling-price are not considered.
        (2) Failure in any database interaction may result in partial state changes. For example, if the
        current_price fails to update, the ceiling price will have been changed but no audit record
        would be saved.

        :param set_current_price_to_ceiling: whether (or not) to set the current price to match the new ceiling price
        """
        ceiling_price = self.get(ceiling_id)
        if not ceiling_price:
            abort('Ceiling price with id {} does not exist'.format(ceiling_id))

        # Check if the new ceiling price is less than the current price
        supplier_prices = self.prices_service.get_prices(
            ceiling_price.supplier_code,
            ceiling_price.service_type_id,
            ceiling_price.sub_service_id,
            pendulum.today(current_app.config['DEADLINES_TZ_NAME']).date(),
            ceiling_price.region_id)
        if supplier_prices:
            current_price = supplier_prices[0]['price']
            current_price = current_price.translate(None, ',')
            if new_ceiling < float(current_price.strip(' "')):
                abort('Ceiling price cannot be lower than ${} (current price)'.format(
                    current_price))

        old_ceiling = ceiling_price.price
        ceiling_price.price = new_ceiling
        db.session.commit()

        # if there is a current_price, and it needs to match the ceiling, update it
        if set_current_price_to_ceiling:
            price_id = supplier_prices[0]['id'] if supplier_prices else None
            self._match_price_to_ceiling(price_id, ceiling_price)

        self.audit.create(
            audit_type=AuditTypes.update_ceiling_price,
            user=current_user.id,
            data={
                "old": old_ceiling,
                "new": new_ceiling
            },
            db_object=ceiling_price)
