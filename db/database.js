/**
 * db/database.js
 *
 * MongoDB setup.
*/
"use strict";

const MongoClient = require("mongodb").MongoClient;
let config = require("../config/db/config.json");

require('dotenv').config({ path: '.env.development' });

config.username = process.env.mongo_user || config.username;
config.password = process.env.mongo_pass || config.password;

const database = {
    getDb: async function getDb() {
        // let dsn = `mongodb://localhost:27017/folinodocs`;
        // don't show the log when it is test
        let dsn = `mongodb+srv://${config.username}:${config.password}@${config.cloud_db_url}`;

        console.log(process.env.MONGODB_LOCAL);
        if (process.env.MONGODB_LOCAL === 'true') {
            //  use local MongoDB
            dsn = config.local_base_dsn;
        }
        const client  = await MongoClient.connect(dsn, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        const db = client.db();
        let collectionDocsName = config.collectionDocsName;

        if (process.env.NODE_ENV === 'test') {
            //  MongoDB Atlas is used even for testing but with different collection
            collectionDocsName = config.testCollectionDocsName;
        }

        const collectionDocs = db.collection(collectionDocsName);
        const collectionUsers = db.collection(config.collectionUsersName);

        return {
            collectionDocs,
            collectionUsers,
            client
        };
    }
};

module.exports = database;
