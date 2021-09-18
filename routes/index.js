// routes/index.js

"use strict";

var express = require('express');
var router = express.Router();

router.get(["/", "/index"], function(req, res) {
    const data = {
        data: {
            msg: "Hello World"
        }
    };

    res.json(data);
});

router.get('/hello/:msg', (req, res) => {
    const data = {
        data: {
            msg: req.params.msg
        }
    };

    res.json(data);
});

// Testing routes with method
router.get("/user", function(req, res) {
    res.json({
        data: {
            msg: "Got a GET request, sending back default 200"
        }
    });
});

router.post("/user", (req, res) => {
    res.status(201).json({
        data: {
            msg: "Got a POST request, sending back 201 Created"
        }
    });
});

router.put("/user", (req, res) => {
    // PUT requests should return 204 No Content
    res.status(204).send();
});

router.delete("/user", (req, res) => {
    // DELETE requests should return 204 No Content
    res.status(204).send();
});

module.exports = router;
