# -*- coding: utf-8 -*-

from __future__ import unicode_literals
import six

from flask import current_app, session, jsonify
from app.models import Supplier, Application, User
from dmutils.email import (
    generate_token, EmailError, hash_email
)
import rollbar

from .util import render_email_template, send_or_handle_error, escape_token_markdown
from urllib import quote


def get_root_url(framework_slug):
    return current_app.config['APP_ROOT'].get(framework_slug)


def send_existing_seller_notification(email_address, supplier_code):
    TEMPLATE_FILENAME = 'user_existing_seller.md'

    supplier = Supplier.query.filter(Supplier.code == supplier_code).first()

    # prepare copy
    email_body = render_email_template(
        TEMPLATE_FILENAME,
        business_name=supplier.name,
        representative=supplier.data.get('representative'),
    )

    subject = "Duplicate application"

    send_or_handle_error(
        email_address,
        email_body,
        subject,
        current_app.config['DM_GENERIC_NOREPLY_EMAIL'],
        current_app.config['DM_GENERIC_SUPPORT_NAME'],
        event_description_for_errors='signup - existing seller'
    )


def send_existing_application_notification(email_address, application_id):
    TEMPLATE_FILENAME = 'user_existing_application.md'

    application = Application.query.get(application_id)

    business_name = application.data.get('name')
    representative = application.data.get('representative')

    if not business_name:
        TEMPLATE_FILENAME = 'user_existing_application_no_name.md'

    if not representative:
        user = User.query.filter(User.application_id == application_id).first()

        if user:
            representative = user.name

    # prepare copy
    email_body = render_email_template(
        TEMPLATE_FILENAME,
        business_name=business_name,
        representative=representative,
    )

    subject = "Duplicate application"

    send_or_handle_error(
        email_address,
        email_body,
        subject,
        current_app.config['DM_GENERIC_NOREPLY_EMAIL'],
        current_app.config['DM_GENERIC_SUPPORT_NAME'],
        event_description_for_errors='signup - existing seller'
    )


def generate_user_creation_token(name, email_address, user_type, framework, **unused):
    data = {
        'name': name,
        'email_address': email_address,
        'user_type': user_type,
        'framework': framework
    }

    token = generate_token(
        data,
        current_app.config['SECRET_KEY'],
        current_app.config['SIGNUP_INVITATION_TOKEN_SALT']
    )
    return token


def send_account_activation_email(name, email_address, user_type, framework):
    template = 'orams_create_user_email.md' if framework == 'orams' else 'create_user_email.md'
    subject = 'ORAMS_INVITE_EMAIL_SUBJECT' if framework == 'orams' else 'INVITE_EMAIL_SUBJECT'
    token = generate_user_creation_token(name=name, email_address=email_address,
                                         user_type=user_type, framework=framework)
    url = '{}{}/create-user/{}'.format(
        current_app.config['FRONTEND_ADDRESS'],
        get_root_url(framework),
        escape_token_markdown(quote(token))
    )

    email_body = render_email_template(template, url=url)

    try:
        send_or_handle_error(
            email_address,
            email_body,
            current_app.config[subject],
            current_app.config['INVITE_EMAIL_FROM'],
            current_app.config['INVITE_EMAIL_NAME'],
        )
        session['email_sent_to'] = email_address

    except EmailError as e:
        rollbar.report_exc_info()
        current_app.logger.error(
            'Invitation email failed to send. '
            'error {error} email_hash {email_hash}',
            extra={
                'error': six.text_type(e),
                'email_hash': hash_email(email_address)})


def send_account_activation_manager_email(manager_name, manager_email, applicant_name, applicant_email, framework):
    _send_account_activation_admin_email(
        manager_name=manager_name,
        manager_email=manager_email,
        applicant_name=applicant_name,
        applicant_email=applicant_email,
        framework=framework
    )

    email_body = render_email_template(
        'buyer_account_invite_manager_confirmation.md',
        manager_name=manager_name,
        applicant_name=applicant_name,
    )

    try:
        send_or_handle_error(
            manager_email,
            email_body,
            current_app.config['BUYER_INVITE_MANAGER_CONFIRMATION_SUBJECT'],
            current_app.config['INVITE_EMAIL_FROM'],
            current_app.config['INVITE_EMAIL_NAME'],
        )
        session['email_sent_to'] = manager_email

    except EmailError as e:
        rollbar.report_exc_info()
        current_app.logger.error(
            'Invitation email to manager failed to send. '
            'error {error} email_hash {email_hash}',
            extra={
                'error': six.text_type(e),
                'email_hash': hash_email(manager_email)})


def _send_account_activation_admin_email(manager_name, manager_email, applicant_name, applicant_email, framework):
    token = generate_user_creation_token(name=applicant_name, email_address=applicant_email,
                                         user_type="buyer", framework=framework)
    url = '{}/buyers/signup/send-invite/{}'.format(
        current_app.config['FRONTEND_ADDRESS'],
        escape_token_markdown(quote(token))
    )

    email_body = render_email_template(
        'buyer_account_invite_request_email.md',
        manager_name=manager_name,
        manager_email=manager_email,
        applicant_name=applicant_name,
        applicant_email=applicant_email,
        invite_url=url
    )

    try:
        send_or_handle_error(
            current_app.config['BUYER_INVITE_REQUEST_ADMIN_EMAIL'],
            email_body,
            current_app.config['BUYER_INVITE_MANAGER_CONFIRMATION_SUBJECT'],
            current_app.config['INVITE_EMAIL_FROM'],
            current_app.config['INVITE_EMAIL_NAME'],
        )
        session['email_sent_to'] = current_app.config['BUYER_INVITE_REQUEST_ADMIN_EMAIL']

    except EmailError as e:
        rollbar.report_exc_info()
        current_app.logger.error(
            'Invitation email to manager failed to send. '
            'error {error} email_hash {email_hash}',
            extra={
                'error': six.text_type(e),
                'email_hash': hash_email(manager_email)})


def orams_send_account_activation_admin_email(applicant_name, applicant_email, framework):
    token = generate_user_creation_token(name=applicant_name, email_address=applicant_email,
                                         user_type="buyer", framework=framework)
    url = '{}{}/send-invite/{}'.format(
        current_app.config['FRONTEND_ADDRESS'],
        get_root_url(framework),
        escape_token_markdown(quote(token))
    )

    email_body = render_email_template(
        'orams_buyer_account_invite_request_email.md',
        applicant_name=applicant_name,
        applicant_email=applicant_email,
        invite_url=url
    )

    try:
        send_or_handle_error(
            current_app.config['ORAMS_BUYER_INVITE_REQUEST_ADMIN_EMAIL'],
            email_body,
            'ORAMS Portal - New RCM Request',
            current_app.config['INVITE_EMAIL_FROM'],
            current_app.config['INVITE_EMAIL_NAME'],
        )
        session['email_sent_to'] = current_app.config['ORAMS_BUYER_INVITE_REQUEST_ADMIN_EMAIL']

    except EmailError as e:
        rollbar.report_exc_info()
        current_app.logger.error(
            'Invitation email to orams failed to send. '
            'error {error}',
            extra={'error': six.text_type(e)})


def send_new_user_onboarding_email(name, email_address, user_type, framework):
    if user_type != 'buyer' or framework == 'orams':
        return False

    assert user_type == 'buyer'

    email_body = render_email_template(
        'buyer_onboarding.md',
        name=name
    )

    try:
        send_or_handle_error(
            email_address,
            email_body,
            'Welcome to the Digital Marketplace',
            current_app.config['RESET_PASSWORD_EMAIL_FROM'],
            current_app.config['RESET_PASSWORD_EMAIL_NAME'],
        )
        session['email_sent_to'] = email_address
    except EmailError as error:
        rollbar.report_exc_info()
        current_app.logger.error(
            'buyeronboarding.fail: Buyer onboarding email failed to send. '
            'error {error} email_hash {email_hash}',
            extra={
                'error': six.text_type(error),
                'email_hash': hash_email(email_address)})
        return jsonify(message='Failed to send buyer onboarding email.'), 503


def send_reset_password_confirm_email(email_address, url, locked, framework):
    if framework == "orams":
        subject = current_app.config['ORAMS_RESET_PASSWORD_EMAIL_SUBJECT']
        name = current_app.config['ORAMS_GENERIC_SUPPORT_NAME']
        if locked:
            email_template = 'reset_password_email_locked_account_orams.md'
        else:
            email_template = 'reset_password_email_orams.md'
    else:
        subject = current_app.config['RESET_PASSWORD_EMAIL_SUBJECT']
        name = current_app.config['RESET_PASSWORD_EMAIL_NAME']
        if locked:
            email_template = 'reset_password_email_locked_account_marketplace.md'
        else:
            email_template = 'reset_password_email_marketplace.md'

    email_body = render_email_template(
        email_template,
        url=url
    )

    try:
        send_or_handle_error(
            email_address,
            email_body,
            subject,
            current_app.config['RESET_PASSWORD_EMAIL_FROM'],
            name
        )
        session['email_sent_to'] = email_address

    except EmailError as e:
        rollbar.report_exc_info()
        current_app.logger.error(
            'Password reset email failed to send. '
            'error {error} email_hash {email_hash}',
            extra={
                'error': six.text_type(e),
                'email_hash': hash_email(email_address)})
