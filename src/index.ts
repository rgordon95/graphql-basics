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
    users: [User!]!
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

const users = [{
    id: '1',
    name: 'Rich',
    age: 25,
    email: 'rich@gordonholdingsco.com',
},
{
    id: '2',
    name: 'Joe',
    age: 22,
    email: 'joe@gordonholdingsco.com',
},
{
    id: '3',
    name: 'Spencer',
    email: 'spencer@gordonholdingsco.com',
},
]

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
         },
         post() {
              return {
                 title: 'titlee',
                 body: 'first post',
                 published: true,
                 id: '1'
            }
         },
         users(parent, args, ctx, info) {
            return users;
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