/**
 * A collection of useful auth functions.
 *
 * @author Nenad Cuturic
 */
/* jshint node: true */
/* jshint esversion: 8 */
"use strict";

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// MongoDB
const mongodb = require('../db/database.js');
const mongo = require("./mongo.js");
const config = require("../config/auth/auth.json");
// secret generated with: openssl rand -base64 64
const jwtSecret = process.env.JWT_SECRET || config.secret;
const trueApiKey = process.env.API_KEY || config.api_key;

// command line bcrypt hash manual generator:
//      htpasswd -bnBC 10 "" <password> | tr -d ':\n' | sed 's/$2y/$2a/'

const auth = {
    checkAPIKey: async function (req, res, next) {
        const apiKey = req.query.api_key || req.body.api_key;
        const path = req.path;

        if (apiKey === trueApiKey) {
            return next();
        }

        return res.status(401).json({
            errors: {
                status: 401,
                source: path,
                title: "API key validity",
                detail: "No valid API key provided."
            }
        });
    },

    login: async function(response, body) {
        const email = body.email;
        const password = body.password;

        // console.log(email + ' ' + password);

        if (!email || !password) {
            return response.status(401).json({
                errors: {
                    status: 401,
                    source: "/login",
                    title: "Email or password missing",
                    detail: "Email or password missing in request"
                }
            });
        }

        const filter = { email: email };

        await mongo.findInUsersCollection(filter, {}, 1)
            .then((users) => {
                if (users) {
                    return auth.comparePasswords(
                        response,
                        password,
                        users[0],
                    );
                } else {
                    return response.status(401).json({
                        errors: {
                            status: 401,
                            source: "/login",
                            title: "User not found",
                            detail: "User with provided email not found."
                        }
                    });
                }
            }).catch((err) => {
                console.log(err);
                return response.status(500).json({
                    errors: {
                        status: 500,
                        source: "/login",
                        title: "Database error",
                        detail: err.message
                    }
                });
            });
    },

    comparePasswords: function(response, password, user) {
        // console.log("pass: " + password + " hash: " + user.hash);
        bcrypt.compare(password, user.hash, (err, result) => {
            if (err) {
                return response.status(500).json({
                    errors: {
                        status: 500,
                        source: "/login",
                        title: "bcrypt error",
                        detail: "bcrypt error"
                    }
                });
            }

            if (result) {
                let payload = { email: user.email };
                let jwtToken = jwt.sign(payload, jwtSecret, { expiresIn: '24h' });

                return response.json({
                    data: {
                        type: "success",
                        message: "User logged in",
                        user: payload,
                        token: jwtToken
                    }
                });
            }

            return response.status(401).json({
                errors: {
                    status: 401,
                    source: "/login",
                    title: "Wrong password",
                    detail: "Password is incorrect."
                }
            });
        });
    },

    register: async function(response, body) {
        const email = body.email;
        const password = body.password;

        if (!email || !password) {
            return response.status(401).json({
                errors: {
                    status: 401,
                    source: "/register",
                    title: "Email or password missing",
                    detail: "Email or password missing in request"
                }
            });
        }

        bcrypt.hash(password, 10, async function(err, hash) {
            if (err) {
                return response.status(500).json({
                    errors: {
                        status: 500,
                        source: "/register",
                        title: "bcrypt error",
                        detail: "bcrypt error"
                    }
                });
            }

            let filter = { email: email };
            let newContent = { password: hash };

            await mongo.createUser(filter, newContent)
                .then(() => {
                    return response.status(201).json({
                        data: {
                            message: "User successfully registered if it didn't exist."
                        }
                    });
                }).catch((err) => {
                    console.log(err);
                    return response.status(500).json({
                        errors: {
                            status: 500,
                            source: "/register",
                            title: "Database error",
                            detail: err.message
                        }
                    });
                });
        });
    },

    checkToken: function(request, response, next) {
        let token = request.headers['x-access-token'];
        let apiKey = request.query.api_key || request.body.api_key;

        if (token) {
            jwt.verify(token, jwtSecret, function(err, decoded) {
                if (err) {
                    return response.status(500).json({
                        errors: {
                            status: 500,
                            source: request.path,
                            title: "Failed authentication",
                            detail: err.message
                        }
                    });
                }

                request.user = {};
                request.user.api_key = apiKey;
                request.user.email = decoded.email;

                return next();
            });
        } else {
            return response.status(401).json({
                errors: {
                    status: 401,
                    source: request.path,
                    title: "No token",
                    detail: "No token provided in request headers"
                }
            });
        }
    }
};

module.exports = auth;
