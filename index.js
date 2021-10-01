/**
 * index.js
 * Express server with static resources.
 */
"use strict";


const port = process.env.PORT || 1337;
// const path = require("path");

const express = require("express");
const session = require('express-session');
const app     = express();
const server = app.listen(port, logStartUpDetailsToConsole);
const morgan = require('morgan');
const cors = require('cors');

const authModel = require("./models/auth.js");
const index = require('./routes/index.js');
const mongo = require('./routes/mongo/mongo.js');
const auth = require('./routes/auth/auth.js');
const middleware = require("./middleware/index.js");
const path = require("path");

app.use(express.json());
app.use(cors());

const io = require("socket.io")(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

io.sockets.on('connection', function(socket) {
    console.log("socket.id: " + socket.id); // Nått lång och slumpat
    // console.log(socket);
    socket.on('create', function(room) {
        console.log("room: " + room);
        socket.join(room);
    });
    socket.on('doc', function(data) {
        console.log("socket.on(doc):");
        console.log(data);
        socket.to(data._id).emit("doc", data);
    });
});

app.set("view engine", "ejs");
app.use(express.urlencoded({extended: false}));

var ID = function () {
    // Math.random should be unique because of its seeding algorithm.
    // Convert it to base 36 (numbers + letters), and grab the first 9 characters
    // after the decimal.
    return '_' + Math.random().toString(36).substr(2, 9);
};

// console.log(ID(), '_' + Math.random().toString(36).substr(2, 9));
app.use(session({

    // It holds the secret key for session
    secret: ID(),

    // Forces the session to be saved
    // back to the session store
    resave: true,

    // Forces a session that is "uninitialized"
    // to be saved to the store
    saveUninitialized: true
}));

// don't show the log when it is not the test
if (process.env.NODE_ENV !== 'test') {
    // use morgan to log at command line
    app.use(morgan('combined')); // 'combined' outputs the Apache style LOGs
}

app.all('*', authModel.checkAPIKey);

app.use(middleware.logIncomingToConsole);

app.use(express.static(path.join(__dirname, "public")));
app.use('/', index);
app.use('/mongo', mongo);
app.use('/auth', auth);


app.use(middleware.StandardError);
app.use(middleware.CustomError);

module.exports = server; // used for testing purposes

/**
 * Log app details to console when starting up.
 *
 * @return {void}
 */
function logStartUpDetailsToConsole() {
    let routes = [];

    // Find what routes are supported
    app._router.stack.forEach((middleware) => {
        if (middleware.route) {
            // Routes registered directly on the app
            routes.push(middleware.route);
        } else if (middleware.name === "router") {
            // Routes added as router middleware
            middleware.handle.stack.forEach((handler) => {
                let route;

                route = handler.route;
                route && routes.push(route);
            });
        }
    });

    console.info(`Server is listening on port ${port}.`);
    // console.info("Available routes are:");
    // console.info(routes);
}
