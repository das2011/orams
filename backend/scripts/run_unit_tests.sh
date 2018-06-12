#!/bin/bash

# This script is for use for local development to avoid having to run db tests which may be slow
set -ex
pep8 app
pep8 tests
py.test tests/fixtures/unit --cov=app --cov-report term-missing --cov-report=html:${CIRCLE_ARTIFACTS-.}/htmlcov
