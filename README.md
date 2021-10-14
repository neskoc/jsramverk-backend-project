# jsramverk-backend-project
<!-- [![Build Status](https://app.travis-ci.com/neskoc/jsramverk-backend-projekt.svg?branch=master)](https://app.travis-ci.com/neskoc/jsramverk-backend-project) -->

## Node lokalt

- Init: `npm init --yes`
- Run (lokalt): `npm run watch` (använder nodemon)
- Run (Azure): `npm run start` (utan nodemon)

## Routes

Hudvudfilen `mongo.js` hittas i mappaen `routes/mongo/mongo.js`

- `/mongo/` - Root Databas API
  - `/list (GET)` - presenterar alla dokument i json format (auth via api_key)
  - `/update (POST)` - updaterar eller skapar ett dokument om inte finns (auth via body api_key)
  - `/get (POST)` - hämtar ett dokument (används inte av frontend)

Errorhantering sker via middleware i mappen `middleware/index.js`
