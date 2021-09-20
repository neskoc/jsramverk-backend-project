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

module.exports = router;
