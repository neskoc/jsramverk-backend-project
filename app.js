// app.js

"use strict";

const port = 1337;

const express = require("express");
const app = express();
const morgan = require('morgan');
const cors = require('cors');

const index = require('./routes/index.js');
const hello = require('./routes/hello.js');
const user = require('./routes/user.js');

app.use(express.json());
app.use(cors());

// This is middleware called for all routes.
// Middleware takes three parameters.
app.use((req, res, next) => {
    console.log(req.method);
    console.log(req.path);
    next();
});

// Add routes for 404 and error handling
// Catch 404 and forward to error handler
// Put this last
app.use((req, res, next) => {
    var err = new Error("Not Found");
    err.status = 404;
    next(err);
});

// don't show the log when it is test
if (process.env.NODE_ENV !== 'test') {
    // use morgan to log at command line
    app.use(morgan('combined')); // 'combined' outputs the Apache style LOGs
}

// Add a routes
app.use('/', index);
app.use('/hello', hello);
app.use('/user', user);

// Start up server
app.listen(port, () => console.log(`Example API listening on port ${port}!`));