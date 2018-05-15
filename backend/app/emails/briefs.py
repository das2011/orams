# -*- coding: utf-8 -*-

from __future__ import unicode_literals

from flask import current_app

from .util import render_email_template, send_or_handle_error

import rollbar


def send_brief_response_received_email(supplier, brief, brief_response):
    TEMPLATE_FILENAME = 'brief_response_submitted_outcome.md' if brief.lot.slug == 'digital-outcome' \
        else 'brief_response_submitted.md'

    to_address = brief_response.data['respondToEmailAddress']
    specialist_name = brief_response.data.get('specialistName', None)

    brief_url = current_app.config['FRONTEND_ADDRESS'] + '/' + brief.framework.slug + '/opportunities/' + str(brief.id)
    attachment_url = current_app.config['FRONTEND_ADDRESS'] +\
        '/api/2/brief/' + str(brief.id) + '/respond/documents/' + str(supplier.code) + '/'

    ess = ""
    i = 0
    for req in brief.data['essentialRequirements']:
        ess += "####• {}\n{}\n\n".format(req, brief_response.data['essentialRequirements'][i])
        i += 1
    nth = ""
    i = 0
    for req in brief.data['niceToHaveRequirements']:
        nth += "####• {}\n{}\n\n".format(req,
                                           brief_response.data.get('niceToHaveRequirements', [])[i]
                                           if i < len(brief_response.data.get('niceToHaveRequirements', [])) else '')
        i += 1

    attachments = ""
    for attch in brief_response.data.get('attachedDocumentURL', []):
        attachments += "####• [{}]({}{})\n\n".format(attch, attachment_url, attch)

    subject = "We've received your application"
    response_title = "How you responded"
    if specialist_name:
        subject = "{}'s application for opportunity ID {} has been received".format(specialist_name, brief.id)
        response_title = "{}'s responses".format(specialist_name)

    # prepare copy
    email_body = render_email_template(
        TEMPLATE_FILENAME,
        brief_url=brief_url,
        brief_name=brief.data['title'],
        essential_requirements=ess,
        nice_to_have_requirements=nth,
        attachments=attachments,
        closing_at=brief.closed_at.to_formatted_date_string(),
        specialist_name=specialist_name,
        response_title=response_title,
        brief_response=brief_response.data,
        header='<div style="font-size: 1.8rem">'
               '<span style="color: #007554;padding-right: 1rem;">✔</span>'
               '<span>{}</span></div>'.format(subject)
    )

    send_or_handle_error(
        to_address,
        email_body,
        subject,
        current_app.config['DM_GENERIC_NOREPLY_EMAIL'],
        current_app.config['DM_GENERIC_SUPPORT_NAME'],
        event_description_for_errors='brief response recieved'
    )


def send_brief_closed_email(brief):
    from app.api.services import audit_service, audit_types  # to circumvent circular dependency
    from app.tasks.s3 import create_resumes_zip, CreateResumesZipException

    brief_email_sent_audit_event = audit_service.find(type=audit_types.sent_closed_brief_email.value,
                                                      object_type="Brief",
                                                      object_id=brief.id).count()

    if (brief_email_sent_audit_event > 0):
        return

    # create the resumes zip
    has_resumes_zip = False
    try:
        create_resumes_zip(brief.id)
        has_resumes_zip = True
    except Exception as e:
        rollbar.report_exc_info()
        pass

    to_addresses = [user.email_address
                    for user in brief.users
                    if user.active and user.email_address.endswith('@digital.gov.au')]

    # prepare copy
    email_body = render_email_template(
        'brief_closed.md',
        frontend_url=current_app.config['FRONTEND_ADDRESS'],
        brief_name=brief.data['title'],
        brief_id=brief.id,
        has_resumes_zip=has_resumes_zip
    )

    subject = "Your brief has closed - please review all responses."

    send_or_handle_error(
        to_addresses,
        email_body,
        subject,
        current_app.config['DM_GENERIC_NOREPLY_EMAIL'],
        current_app.config['DM_GENERIC_SUPPORT_NAME'],
        event_description_for_errors='brief closed'
    )

    audit_service.log_audit_event(
        audit_type=audit_types.sent_closed_brief_email,
        user='',
        data={
            "to_addresses": ', '.join(to_addresses),
            "email_body": email_body,
            "subject": subject
        },
        db_object=brief)
