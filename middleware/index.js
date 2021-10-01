/**
 * General middleware.
 */
"use strict";

module.exports = {
    logIncomingToConsole,
    StandardError,
    CustomError
};


/**
  * Log incoming requests to console to see who accesses the server
  * on what route.
  *
  * @param {Request}  req  The incoming request.
  * @param {Response} res  The outgoing response.
  * @param {Function} next Next to call in chain of middleware.
  *
  * @returns {void}
*/
function logIncomingToConsole(req, res, next) {
    console.info(`Got request on ${req.path} (${req.method}).`);
    next();
}

function StandardError(req, res, next) {
    var err = new Error("Not Found");

    err.status = 404;
    next(err);
}

function CustomError(err, req, res, next) {
    if (res.headersSent) {
        return next(err);
    }

    res.status(err.status || 500).json({
        "errors": [
            {
                "status": err.status,
                "title":  err.message,
                "stack": err.stack
            }
        ]
    });
}
