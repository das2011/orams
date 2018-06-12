from flask import current_app
from flask_login import current_user
from app.api.services import suppliers
from .util import render_email_template, send_or_handle_error


def send_new_referral_email(referral_id, supplier_code):
    template = 'new_referral.md'
    subject = current_app.config['NEW_REFERRAL_EMAIL_SUBJECT']
    recipient = suppliers.get_email_address(supplier_code)
    if not recipient:
        current_app.logger.error(
            'No email sent for referral: {}, as no email address was found for supplier code: {}'
            .format(referral_id, supplier_code))
        return

    url = '{}/referrals/{}'.format(current_app.config['FRONTEND_ADDRESS'], referral_id)

    supplier = suppliers.first(code=supplier_code)
    if not supplier:
        current_app.logger.error(
            'No email sent for referral: {}, as no supplier was found having code: {}'
            .format(referral_id, supplier_code))
        return
    email_body = render_email_template(template, supplier_name=supplier.name, url=url)

    send_or_handle_error(
        recipient,
        email_body,
        subject,
        current_app.config['DM_GENERIC_NOREPLY_EMAIL'],
        current_user.name,
        event_description_for_errors='orams new referral'
    )
