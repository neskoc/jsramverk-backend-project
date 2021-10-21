// graphql/doc.js

"use strict";

const CommentType = require("./comments.js");

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
        type: { type: GraphQLString },
        content: { type: GraphQLNonNull(GraphQLString) },
        owner: { type: GraphQLNonNull(GraphQLString) },
        allowed_users: {
            type: GraphQLNonNull(GraphQLList(GraphQLString)),
            resolve: (doc) => {
                return doc.allowed_users;
            }
        },
        comments: {
            type: GraphQLList(CommentType),
            description: 'List of comments',
            resolve: (doc) => {
                return doc.comments;
            }
        },
    })
});

module.exports = DocType;
