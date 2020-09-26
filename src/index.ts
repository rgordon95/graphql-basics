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
    users(query: String): [User!]!
    me: User!
    post: Post!
    posts(query: String): [Post!]!
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

const posts = [{
    id: '2341',
    title: 'title 1s',
    body: 'this is the bodyu',
    published: true,
},
{
    id: '122342342',
    title: '2222',
    body: 'this is  bodyu',
    published: false,
},
{
    id: '32324',
    title: 'Rich3',
    body: ' is the bodyu',
    published: true,
},
]

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
         posts(parent, args, ctx, info) {
            if (!args.query) {
                return posts;
            }
            
            return posts.filter((post) => {
                const isTitleMatch = post.title.toLowerCase().includes(args.query.toLowerCase());
                 const isBodyMatch = post.body.toLowerCase().includes(args.query.toLowerCase());
                return isTitleMatch || isBodyMatch;  
        })
    },
         users(parent, args, ctx, info) {
             if (!args.query) {
                 return users;
             } else {
                 return users.filter((user) => {
                     return user.name.toLowerCase().includes(args.query.toLowerCase())
                 })
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