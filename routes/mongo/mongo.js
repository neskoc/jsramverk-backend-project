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
        var err = new Error("Aip key is missing");
        err.status = 403;
        next(err);
    } else {
        await func.findInCollection({}, {}, 0)
        .then((docs) => {
            const data = {
                data: docs
            };
            console.log("docs in findincollection:");
            console.log(data);
            response.status(201).json(data);
        }).catch((err) => {
            console.log(err);
            response.json(err);
        });

    }
});

// Return a JSON object with list of all documents within the collection.
router.get("/get", async (request, response, next) => {

    if (request.query.api_key !== config.api_key) {
        var err = new Error("Aip key is missing");
        err.status = 403;
        next(err);
    } else {
        await func.findInCollection({docName: `"${request.query.docName}"`}, {}, 0)
        .then((doc) => {
            const data = {
                data: doc
            };
            console.log("Found Document:");
            console.log(data);
            response.status(201).json(data);
        }).catch((err) => {
            console.log(err);
            response.json(err);
        });

    }
});

// Return a JSON object with list of all documents within the collection.
router.get("/getAll", async (request, response) => {
    try {
        let res = await func.findInCollection({}, {}, 0);

        console.log(res);
        response.status(201).json(res);
    } catch (err) {
        console.log(err);
        response.json(err);
    }
});

// Return a JSON object with list of all documents within the collection.
router.post("/insert", async (request, response, next) => {
    if (request.body.api_key !== config.api_key) {
        var err = new Error("Aip key is missing");
        err.status = 403;
        next(err);
    } else {
        try {
            let docObj = {
                docName: `"${request.body.doc.docName}"`,
                content: `"${request.body.doc.docContent}"`
            };
            let res = await func.insertIntoCollection(docObj);

            // console.log(res);
            response.status(204).json();
        } catch (err) {
            console.log(err);
            response.json(err);
        }
    }
});

// Return a JSON object with list of all documents within the collection.
router.post("/update", async (request, response, next) => {
    const body = request.body;
    // console.log(body);
    if (body.api_key !== config.api_key) {
        var err = new Error("Aip key is missing");
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
