// routes/mongo.js

"use strict";

var express = require('express');
var router = express.Router();

router.get("/register", function(request, response) {
    const data = {
        data: {
            msg: "Mongo API"
        }
    };

    response.json(data);
});
