from sqlalchemy.sql import or_
from app.api.helpers import Service
from app.models import db, Supplier, SupplierFramework, SupplierContact, Framework, Contact


class SuppliersService(Service):
    __model__ = Supplier

    def __init__(self, *args, **kwargs):
        super(SuppliersService, self).__init__(*args, **kwargs)

    def find_suppliers(self, prefix):
        suppliers = Supplier.query.join(Supplier.frameworks) \
            .join(SupplierFramework.framework) \
            .filter(Framework.slug == 'orams') \
            .filter(Supplier.abn.is_(None) | (Supplier.abn != Supplier.DUMMY_ABN)) \
            .filter(Supplier.status != 'deleted')

        if prefix:
            suppliers = suppliers.outerjoin(SupplierContact).outerjoin(Contact)
            # case insensitive LIKE comparison for matching supplier names, supplier email and contact email
            suppliers = suppliers.filter(or_(
                Supplier.name.ilike(prefix + '%'),
                Supplier.data['email'].astext.ilike('%{}%'.format(prefix)),
                Contact.email.ilike('%{}%'.format(prefix))
                ))

        suppliers = suppliers.distinct(Supplier.name, Supplier.code)\
            .order_by(Supplier.name)

        return [supplier.serializable for supplier in suppliers.all()]

    def get_email_address(self, supplier_code):
        supplier, contact = db.session.query(Supplier, Contact) \
            .outerjoin(SupplierContact).outerjoin(Contact) \
            .filter(Supplier.code == supplier_code) \
            .filter(Supplier.status != 'deleted') \
            .first()
        return contact.email if contact else None
