// routes/mongo.js

"use strict";

var express = require('express');
var router = express.Router();
const func = require("../../src/functions.js");
const config = require("../../config/auth/auth.json");

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
    if (request.query.api_key !== config.api_key) {
        var err = new Error("API key is missing");

        err.status = 403;
        next(err);
    } else {
        await func.findInCollection({}, {}, 0)
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
    }
});

// Return a JSON object with list of all documents within the collection.
router.post("/update", async (request, response, next) => {
    const body = request.body;

    // console.log(body);
    if (body.api_key !== config.api_key) {
        var err = new Error("API key is missing");

        err.status = 403;
        next(err);
    } else {
        try {
            const myQuery = {
                docName: body.doc.docName
            };
            const updatedDoc = {
                content: body.doc.content
            };

            await func.updateDocument(myQuery, updatedDoc)
                .then(() => {
                    response.status(204).json();
                });
        } catch (err) {
            console.log(err);
            response.json(err);
        }
    }
});

module.exports = router;
