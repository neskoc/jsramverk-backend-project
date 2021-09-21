// routes/hello.js

"use strict";

var express = require('express');
var router = express.Router();

router.get("/:name", function(req, res) {
    const data = {
        data: {
            msg: req.params.name
        }
    };

    res.json(data);
});

module.exports = router;
