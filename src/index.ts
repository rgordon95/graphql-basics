import { GraphQLServer, PubSub } from 'graphql-yoga';

import db from './db';
import Query from './resolvers/Query';
import Mutation from './resolvers/Mutation';
import Subscription from './resolvers/Subscription';
import Comment from './resolvers/Comment';
import Post from './resolvers/Post';
import User from './resolvers/User';

import { locales } from './locales';

console.log(locales.logs.initializing);
console.log(locales.userMessaging.getGreeting('admin'));

const pubsub = new PubSub();

const server = new GraphQLServer({
    typeDefs: './src/schema.graphql',
    resolvers: {
        Query,
        Mutation,
        Subscription,
        Comment,
        Post,
        User
    },
    context: {
        db,
        pubsub,
    },
});

server.start(() => {
    console.log(locales.logs.initialized);
})