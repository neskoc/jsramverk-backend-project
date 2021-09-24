/**
 * db/database.js
 *
 * MongoDB setup.
*/
"use strict";

const MongoClient = require("mongodb").MongoClient;
const config = require("../config/db/config.json");

const database = {
    getDb: async function getDb() {
        // let dsn = `mongodb://localhost:27017/folinodocs`;
        // don't show the log when it is test
        let dsn = `mongodb+srv://${config.username}:${config.password}@${config.cloud_db_url}`;

        const client  = await MongoClient.connect(dsn, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        const db = client.db();
        const collection = db.collection(config.collectionName);

        return {
            collection: collection,
            client: client
        };
    }
};

module.exports = database;
