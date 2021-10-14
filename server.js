/**
 * index.js
 * Express server with static resources.
 */
"use strict";


const port = process.env.PORT || 1337;

const express = require("express");
const app     = express();
const server = app.listen(port, logStartUpDetailsToConsole);
const morgan = require('morgan');
const cors = require('cors');

const authModel = require("./models/auth.js");
const index = require('./routes/index.js');
const mongo = require('./routes/mongo/mongo.js');
const auth = require('./routes/auth/auth.js');
const graphql = require('./routes/graphql/graphql.js');
const htmlToPdf = require('./routes/htmlToPdf/htmlToPdf.js');
const middleware = require("./middleware/index.js");
const path = require("path");

app.use(express.json());
app.use(cors());
app.options('*', cors());

app.disable('x-powered-by');

const io = require("socket.io")(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST", "PUT"]
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

// don't show the log when it is not the test
if (process.env.NODE_ENV !== 'test') {
    // use morgan to log at command line
    app.use(morgan('combined')); // 'combined' outputs the Apache style LOGs
}

app.all('*', authModel.checkAPIKey);
app.all('*', authModel.checkToken);

app.use(middleware.logIncomingToConsole);

app.use(express.static(path.join(__dirname, "public")));
app.use('/', index);
app.use('/mongo', mongo);
app.use('/auth', auth);
app.use('/graphql', graphql);
app.use('/htmlToPdf', htmlToPdf);

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
