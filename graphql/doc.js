// graphql/doc.js

"use strict";

const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLList,
    GraphQLNonNull
} = require('graphql');

const DocType = new GraphQLObjectType({
    name: 'Document',
    description: 'This type represents a doc created by the owner',
    fields: () => ({
        _id: { type: GraphQLNonNull(GraphQLString) },
        docName: { type: GraphQLNonNull(GraphQLString) },
        content: { type: GraphQLNonNull(GraphQLString) },
        owner: { type: GraphQLNonNull(GraphQLString) },
        allowed_users: {
            type: GraphQLNonNull(GraphQLList(GraphQLString)),
            resolve: (doc) => {
                return doc.allowed_users;
            }
        },
    })
});

module.exports = DocType;
