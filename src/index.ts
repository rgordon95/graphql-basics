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
    greeting(name: String): String!
    me: User!
    post: Post!
}


type User {
    id: ID!
    name: String!
    email: String!
    age: Int
  }

type Post {
    id: ID!
    title: String!
    body: String!
    published: Boolean!
}

`

// Resolvers (operations)

const resolvers = {
    Query: {
        greeting(p, args, ctx, info) {
            return `Hello ${args.name}`
        },
         me() {
             return {
                 id: 'qijioa',
                 name: 'Richard',
                 email: 'rich@mail.com',
                 age: '25',
             }
         },
         post() {
              return {
                 title: 'titlee',
                 body: 'first post',
                 published: true,
                 id: '1'
            }
         },
    }
}

const server = new GraphQLServer({
    typeDefs,
    resolvers,
});

server.start(() => {
    console.log(locales.logs.initialized);
})