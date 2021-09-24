/**
 * A collection of useful functions.
 *
 * @author Nenad Cuturic
 */
/* jshint node: true */
/* jshint esversion: 8 */
"use strict";

// MongoDB
let mongodb = require('../db/database.js');

module.exports = {
    findInCollection,
    insertIntoCollection,
    createCollection,
    updateDocument
};

/**
 * Create collection.
 *
 * @async
 *
 * @param {string} colName    Name of collection.
 *
 * @throws Error when database operation fails.
 *
*/
async function createCollection(colName) {
    const db = await mongodb.getDb().client.db();

    await db.createCollection(colName, function(err) {
        if (err) {
            throw err;
        }
        console.log("Collection created!");
        db.client.close();
    });
}

/**
 * Find documents in an collection by matching search criteria.
 *
 * @async
 *
 * @param {object} criteria   Search criteria.
 * @param {object} projection What to project in results.
 * @param {number} limit      Limit the number of documents to retrieve.
 *
 * @throws Error when database operation fails.
 *
 * @return {Promise<array>} The resultset as an array.
 */
async function findInCollection(criteria, projection, limit) {
    const db = await mongodb.getDb();
    const col = await Promise.resolve(db.collection);
    const docs = await col.find(criteria, projection).limit(limit).toArray()
        .then(docs => {
            console.log("docs:");
            console.log(docs);
            return docs;
        }).catch((err) => {
            console.log(err);
        }).finally(() => {
            db.client.close();
        });

    return await Promise.resolve(docs);
}

/**
 * Insert into collection.
 *
 * @async
 *
 * @param {json object} docObj    Document object.
 *
 * @throws Error when database operation fails.
 *
*/
async function insertIntoCollection(docObj) {
    const db = await mongodb.getDb();
    const col = await Promise.resolve(db.collection);

    await Promise.resolve(col.insertOne(docObj, function(err) {
        if (err) {
            throw err;
        }
        console.log("Document inserted!");
        db.client.close();
    }));
}

/**
 * Update document.
 *
 * @async
 *
 * @param {json object} myQuery    Query object.
 *
 * @param {json object} updatedDoc    Updated document object.
 *
 * @throws Error when database operation fails.
 *
*/
async function updateDocument(myQuery, newContent) {
    const db = await mongodb.getDb();
    const col = await Promise.resolve(db.collection);

    console.log(newContent);
    await Promise.resolve(col.updateOne(myQuery, {$set: newContent}, {upsert: true},
        function(err) {
            if (err) {
                throw err;
            }
            console.log("Document updated!");
            db.client.close();
        }));
}
