/**
 * db/database.js
 * 
 * MongoDB setup.
 */
 "use strict";

const mongo = require("mongodb").MongoClient;
const config = require("../config/db/config.json");
const collectionName = "docs";

const database = {
    getDb: async function getDb () {
        // let dsn = `mongodb://localhost:27017/folinodocs`;
        let dsn = `mongodb+srv://${config.username}:${config.password}@${config.cloud_db_url}`;

        if (process.env.NODE_ENV === 'test') {
            // dsn = "mongodb://localhost:27017/test";
            dsn = `${config.local_base_dsn}test`;
        }

        const client  = await mongo.connect(dsn, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        const db = await client.db();
        const collection = await db.collection(collectionName);

        return {
            collection: collection,
            client: client,
        };
    }
};

module.exports = database;