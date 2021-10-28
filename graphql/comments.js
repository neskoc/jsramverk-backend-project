// graphql/comments.js

"use strict";

const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLInt,
    GraphQLNonNull
} = require('graphql');

const CommentType = new GraphQLObjectType({
    name: 'Comment',
    description: 'This type represents a comment with a unique id',
    fields: () => ({
        id: { type: GraphQLNonNull(GraphQLInt) },
        comment: { type: GraphQLNonNull(GraphQLString) },
    })
});

module.exports = CommentType;
