// routes/graphql.js

"use strict";

var express = require('express');
var router = express.Router();

const visual = true; // change to false in production
const { graphqlHTTP } = require('express-graphql');
const RootQueryType = require("../../graphql/root-query.js");

const {
    GraphQLSchema
} = require('graphql');

const schema = new GraphQLSchema({
    query: RootQueryType
});

router.post("/",  graphqlHTTP((req) => ({
    schema: schema,
    context: req.body,
    graphiql: visual, // Visual is sett to true during development
})));

router.get("/",  graphqlHTTP((req) => ({
    schema: schema,
    context: req.body,
    graphiql: visual, // Visual is sett to true during development
})));

module.exports = router;
