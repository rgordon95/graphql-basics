import { GraphQLServer } from 'graphql-yoga';

import db from './db';
import Query from './resolvers/Query';
import Mutation from './resolvers/Mutation';
import Comment from './resolvers/Comment';
import Post from './resolvers/Post';
import User from './resolvers/User';

import { locales } from './locales';

console.log(locales.logs.initializing);
console.log(locales.userMessaging.getGreeting('admin'));

const server = new GraphQLServer({
    typeDefs: './src/schema.graphql',
    resolvers: {
        Query,
        Mutation,
        Comment,
        Post,
        User
    },
    context: {
        db
    },
});

server.start(() => {
    console.log(locales.logs.initialized);
})