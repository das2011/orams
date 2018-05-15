SHELL := /bin/bash

app_run:
	FLASK_DEBUG=true FLASK_APP=wsgi.py flask run --host=0.0.0.0

celery_run:
	./scripts/run_celery_worker_and_beat.sh

app_shell:
	FLASK_DEBUG=true FLASK_APP=wsgi.py flask shell

bootstrap:
	pip install -U pip
	pip install -r requirements_for_test.txt
	createdb digitalmarketplace
	python migrations.py sync

requirements:
	pip install -r requirements.txt

requirements_for_test:
	pip install -U pip
	pip install -r requirements_for_test.txt

requirements_freeze:
	pip install --upgrade pip
	pip install --upgrade -r requirements_for_test.txt
	pip freeze | grep -v marketplace-api.git > requirements.txt
	sed '/^-e /s/$$/==whatever/' -i requirements.txt
	sed '/^-e /s/-e //' -i requirements.txt

test: lint tox

tox:
	tox

test_pep8:
	pep8 .

lint:
	flake8 app
	flake8 tests

test_unit:
	py.test ${PYTEST_ARGS}

.PHONY: virtualenv requirements requirements_for_test test_pep8 test_migrations test_unit test test_all run_migrations run_app run_all
