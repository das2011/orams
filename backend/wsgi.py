#!/usr/bin/env python

from __future__ import print_function

import os

from app import create_app
from sqlbag import S, load_sql_from_file
from flask import jsonify
from werkzeug.exceptions import HTTPException


port = int(os.getenv('PORT', '5000'))
application = create_app(os.getenv('DM_ENVIRONMENT') or 'development')

dburl = application.config['SQLALCHEMY_DATABASE_URI']

@application.errorhandler(Exception)
def handle_error(e):
    code = 500
    if isinstance(e, HTTPException):
        code = e.code
    return jsonify(error=str(e)), code

def do_startup():
    with S(dburl) as s:
        load_sql_from_file(s, 'DB/data/on_startup.sql')


do_startup()


if __name__ == '__main__':
    from waitress import serve
    serve(application, port=port, expose_tracebacks=application.config['DEBUG'])
