from app import db
from app.models import Application, AuditEvent, AuditTypes
from helpers import notify_team


def create_application(email_address=None, name=None):
    application = Application(
        status='saved',
        data={
            'framework': 'digital-marketplace',
            'email': email_address,
            'name': name
        }
    )

    db.session.add(application)
    db.session.flush()

    audit = AuditEvent(
        audit_type=AuditTypes.create_application,
        user='',
        data={},
        db_object=application
    )

    db.session.add(audit)
    db.session.commit()

    notify_team_new_applicant(
        application_id=application.id,
        name=name,
        email_address=email_address
    )

    return application


def notify_team_new_applicant(application_id, name, email_address):
    notification_message = 'Application Id:{}\nBy: {} ({})'.format(
        application_id,
        name,
        email_address
    )

    notify_team('A new seller has started an application', notification_message)
