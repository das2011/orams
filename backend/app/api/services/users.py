from app.api.helpers import Service
from app import db
from app.models import User, UserFramework, Framework
from sqlalchemy import func, desc
from sqlalchemy.sql.functions import concat


class UsersService(Service):
    __model__ = User

    def __init__(self, *args, **kwargs):
        super(UsersService, self).__init__(*args, **kwargs)

    def get_user_organisation(self, email_domain):
        """Returns the user's organisation based on their email domain."""
        query = db.session.execute("""SELECT name FROM govdomains WHERE domain = :domain""",
                                   {'domain': email_domain})
        results = list(query)

        try:
            name = results[0].name
        except IndexError:
            name = 'Unknown'

        return name

    def get_team_members(self, current_user_id, email_domain):
        """Returns a list of the user's team members."""
        team_ids = db.session.query(User.id).filter(User.id != current_user_id,
                                                    User.email_address.endswith(concat('@', email_domain)))

        results = (db.session.query(User.name, User.email_address.label('email'))
                   .filter(User.id != current_user_id, User.id.in_(team_ids), User.active.is_(True))
                   .order_by(func.lower(User.name)))

        return [r._asdict() for r in results]

    def get_supplier_last_login(self, application_id):
        user_by_application_query = (db.session.query(User.supplier_code)
                                     .filter(User.application_id == application_id))

        user_by_supplier_query = (db.session.query(User)
                                  .filter(User.supplier_code.in_(user_by_application_query))
                                  .order_by(desc(User.logged_in_at)))

        return user_by_supplier_query.first()

    def find_user_by_partial_email_address(self, search_string):
        """Returns a list of the users based on search string."""
        users = User.query \
            .join(User.frameworks) \
            .join(UserFramework.framework) \
            .filter(Framework.slug == 'orams') \
            .filter(User.email_address.contains(search_string.lower())) \
            .order_by(User.name) \
            .all()
        if users is not None:
            return users
        else:
            return None
