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
    comments: [Comment!]!
}

type User {
    id: ID!
    name: String!
    email: String!
    age: Int
    posts: [Post!]!
    comments: [Comment!]!
  }

type Post {
    id: ID!
    title: String!
    body: String!
    published: Boolean!
    author: User!
    comments: [Comment!]!
}

type Comment {
    id: ID!
    body: String!
    author: User!
}

`
const comments = [
    {
        id: 5555,
        body: 'first',
        author: '1',
    },
    {
        id: 5552,
        body: 'snd',
        author: '2',
    },
    {
        id: 5553,
        body: 'not first',
        author: '2',
    },
    {
        id: 554,
        body: 'third',
        author: '3',
    },
]

const posts = [{
    id: '2341',
    title: 'title 1s',
    body: 'this is the bodyu',
    published: true,
    author: '1',
},
{
    id: '122342342',
    title: '2222',
    body: 'this is  bodyu',
    published: false,
    author: '2',
},
{
    id: '32324',
    title: 'Rich3',
    body: ' is the bodyu',
    published: true,
    author: '3',
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
                 id: '1',
                 author: '1',
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
    comments(parent, args, ctx, info) {
        if (!args.query) {
            return comments;
        }
    },

    },
    Post: {
        author(parent, args, ctx, info) {
            return users.find((user) => {
                return user.id === parent.author
        })
      }
    },
    Comment: {
        author(parent, args, ctx, info) {
            return users.find((user) => {
                return user.id === parent.author
        })
      }
    },
     User: {
    posts(parent, args, ctx, info) {
        return posts.filter((post) => {
            return post.author === parent.id 
        })
    },
    comments(parent, args, ctx, info) {
        return comments.filter((comment) => {
            return comment.author === parent.id 
        })
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