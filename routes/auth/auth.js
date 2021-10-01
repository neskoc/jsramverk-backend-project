// routes/mongo.js

"use strict";

const express = require('express');
const router = express.Router();
const auth = require("../../models/auth.js");

router.get("/", function(request, response) {
    const data = {
        data: {
            msg: "Auth API"
        }
    };

    response.json(data);
});

router.post('/login', (req, res) => auth.login(res, req.body));
router.post('/register', (req, res) => auth.register(res, req.body));

module.exports = router;
