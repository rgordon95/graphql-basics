import { GraphQLServer } from 'graphql-yoga';
import uuidv4 from 'uuid/v4';
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

type Mutation {
    createUser(name: String!, email: String!, age: Int): User!
    createPost(title: String!, body: String!, author: ID!, published: Boolean! ): Post!
    createComment(body: String!, post: ID!, author: ID!): Comment!
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
    post: Post!
}

`
const comments = [
    {
        id: '5555',
        body: 'first',
        author: '1',
        post: '2341',
    },
    {
        id: '5552',
        body: 'snd',
        author: '2',
        post: '2341',
    },
    {
        id: '5553',
        body: 'not first',
        author: '2',
        post: '2341',
    },
    {
        id: '554',
        body: 'third',
        author: '3',
        post: '32324',
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
      },
      comments(parent, args, ctx, info) {
        return comments.filter((comment) => {
            return comment.post === parent.id 
        })
    },
    },
    Comment: {
        author(parent, args, ctx, info) {
            return users.find((user) => {
                return user.id === parent.author
        })
      },
        post(parent, args, ctx, info) {
            return posts.find((post) => {
                return post.id === parent.post
            })
        },
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
  },
  Mutation: {
    createUser(parent, args, ctx, info) {
        const emailTaken = users.some((user) => user.email === args.email)
       
        if (emailTaken) {
            throw new Error(locales.errors.emailInUse)
        }

        const user = {
            id: uuidv4(),
            ...args,
        }

        users.push(user)

        return user;
    },
    createPost(parents, args, ctx, info) {
        const userExists = users.some((user) => user.id === args.author)

        if (!userExists) {
            throw new Error(locales.errors.userNotFound)
        }

        const post = {
            id: uuidv4(),
           ...args,
        };

        posts.push(post);

        return post;
    },
    createComment(parent, args, ctx, info) {
        const userExists = users.some((user) => user.id === args.author);
        const postExists = posts.some((post) => {
            return post.id === args.post && post.published;
        });

        if (!userExists) {
            throw new Error(locales.errors.userNotFound);
        }

        if (!postExists) {
            throw new Error(locales.errors.postNotFound);
        }
        
        const comment = {
            id: uuidv4(),
            body: args.body,
            author: args.author,
            post: args.post,
        }

        comments.push(comment);

        return comment;
    
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