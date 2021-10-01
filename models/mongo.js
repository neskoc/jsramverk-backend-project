/**
 * A collection of useful mongodb-functions.
 *
 * @author Nenad Cuturic
 */
/* jshint node: true */
/* jshint esversion: 8 */
"use strict";

// MongoDB
const mongodb = require('../db/database.js');

module.exports = {
    findInCollection,
    findInUsersCollection,
    updateDocument,
    createUser
};

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
    const col = await Promise.resolve(db.collectionDocs);
    const docs = await col.find(criteria, projection).limit(limit).toArray()
        .then(docs => {
            // console.log("docs:");
            // console.log(docs);
            return docs;
        }).catch((err) => {
            console.log(err);
        }).finally(() => {
            db.client.close();
        });

    return await Promise.resolve(docs);
}

/**
 * Find users in an collection by matching search criteria.
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
async function findInUsersCollection(criteria, projection, limit) {
    const db = await mongodb.getDb();
    const col = await Promise.resolve(db.collectionUsers);
    const users = await col.find(criteria, projection).limit(limit).toArray()
        .then(users => {
            // console.log("users:");
            // console.log(users);
            return users;
        }).catch((err) => {
            console.log(err);
        }).finally(() => {
            db.client.close();
        });

    return await Promise.resolve(users);
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
    const col = await Promise.resolve(db.collectionDocs);

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

/**
 * Create new user.
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
async function createUser(myQuery, newContent) {
    const db = await mongodb.getDb();
    const col = await Promise.resolve(db.collectionUsers);

    // console.log(newContent);
    await Promise.resolve(col.updateOne(myQuery, {$setOnInsert: newContent}, {upsert: true},
        function(err) {
            if (err) {
                throw err;
            }
            console.log("User created if not in collection!");
            db.client.close();
        }));
}
