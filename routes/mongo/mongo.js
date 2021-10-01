// routes/mongo.js

"use strict";

var express = require('express');
var router = express.Router();
const mongo = require("../../models/mongo.js");
let config = require("../../config/auth/auth.json");

config.api_key = process.env.api_key || config.api_key;

router.get("/", function(request, response) {
    const data = {
        data: {
            msg: "Mongo API"
        }
    };

    response.json(data);
});

// Return a JSON object with list of all documents within the collection.
router.get("/list", async (request, response, next) => {
    await mongo.findInCollection({}, {}, 0)
        .then((docs) => {
            const data = {
                data: docs
            };

            // console.log("docs in findincollection:");
            // console.log(data);
            response.status(201).json(data);
        }).catch((err) => {
            console.log(err);
            response.json(err);
        });
});

// Return a JSON object with list of all documents within the collection.
router.post("/update", async (request, response, next) => {
    const body = request.body;

    // console.log(body);
    try {
        const myQuery = {
            docName: body.doc.docName
        };
        const updatedDoc = {
            content: body.doc.content
        };

        await mongo.updateDocument(myQuery, updatedDoc)
            .then(() => {
                response.status(204).json();
            });
    } catch (err) {
        console.log(err);
        response.json(err);
    }
});

module.exports = router;
