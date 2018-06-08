# ORAMS
A website to manage prices for the ATO ORAMS panel.
## Backend
The API runs at http://localhost:5000.
```
cd backend
virtualenv venv
source venv/bin/activate
pip install -r requirements.txt

# run app
make app_run

# tests 
# (note that you must have a db with the same name as your host machine)
./scripts/run_tests.sh

# non-DB tests
./scripts/run_unit_tests.sh
```

## Frontend
The frontend node server runs at http://localhost:60000.
```
cd frontend
npm i

# run build and watch files
npm run build:development

# run node server
npm run server:development

# tests
npm test
```
## Local Proxy
On local, `/api` frontend calls are proxied to http://localhost:5000. 

