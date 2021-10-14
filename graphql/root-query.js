// graphql/root-query.js

"use strict";

const mongo = require("../models/mongo.js");
const DocType = require("./doc.js");

const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLList,
    GraphQLNonNull
} = require('graphql');

const RootQueryType = new GraphQLObjectType({
    name: 'Query',
    description: 'Root Query',
    fields: () => ({
        docs: {
            type: GraphQLList(DocType),
            description: 'List of all documents, with content that user is allowed to edit',
            args: {
                email: { type: GraphQLNonNull(GraphQLString) }
            },
            resolve: async function(parent, args, context) {
                console.log("email: ");
                console.log(args.email);
                console.log("context: ");
                console.log(context);

                const filter = { allowed_users: args.email };

                console.log("filter: ");
                console.log(filter);

                return await mongo.findInCollection(filter, {}, 0)
                    .then((docs) => {
                        // console.log("docs in findincollection:");
                        // console.log(data);
                        return docs;
                    }).catch((err) => {
                        console.log(err);
                        return JSON.stringify(err);
                    });
            }
        }
    })
});

module.exports = RootQueryType;
