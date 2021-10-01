/**
 * db/database.js
 *
 * MongoDB setup.
*/
"use strict";

const MongoClient = require("mongodb").MongoClient;
let config = require("../config/db/config.json");

config.username = process.env.mongo_user || config.username;
config.password = process.env.mongo_pass || config.password;

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
        let collectionName = config.collectionName;

        if (process.env.NODE_ENV === 'test') {
            //  MongoDB Atlas is used even for testing but with different collection
            collectionName = config.testCollectionName;
        }

        const collection = db.collection(collectionName);

        return {
            collection: collection,
            client: client
        };
    }
};

module.exports = database;
