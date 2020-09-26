import { GraphQLServer } from 'graphql-yoga';
import { locales } from './locales';

console.log(locales.logs.initializing);
console.log(locales.userMessaging.getGreeting('admin'));

// Type Definitions (schema)


/* 
Scalar Types

ID
Boolean
String
Int
Float,

*/

const typeDefs = `

type Query {
    me: User!
}

type User {
    id: ID!
    name: String!
    email: String!
    age: Int
  }

`

// Resolvers (operations)

const resolvers = {
    Query: {
         me() {
             return {
                 id: 'qijioa',
                 name: 'Richard',
                 email: 'rich@mail.com',
                 age: '25',
             }
         }
    }
}

const server = new GraphQLServer({
    typeDefs,
    resolvers,
});

server.start(() => {
    console.log(locales.logs.initialized);
})