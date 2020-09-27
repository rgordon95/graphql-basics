import { GraphQLServer } from 'graphql-yoga';
import uuidv4 from 'uuid/v4';
import { locales } from './locales';

console.log(locales.logs.initializing);
console.log(locales.userMessaging.getGreeting('admin'));

let comments = [
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

let posts = [{
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

let users = [{
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
        const emailTaken = users.some((user) => user.email === args.data.email)
       
        if (emailTaken) {
            throw new Error(locales.errors.emailInUse)
        }

        const user = {
            id: uuidv4(),
            ...args.data,
        }

        users.push(user)

        return user;
    },
    deleteUser(parent, args, ctx, info) {
        const userIndex = users.findIndex((user) => user.id === args.id)

        if (userIndex === -1) {
            throw new Error(locales.errors.userNotFound)
        }

        const deletedUsers = users.splice(userIndex, 1);

        posts = posts.filter((post) => {
            const match = post.author === args.id

            if (match) {
                comments = comments.filter((comment) => {
                    return comment.post !== post.id
                })
            }

            return !match;
        })

        comments = comments.filter((comment) => comment.author !== args.id)

        return deletedUsers[0]
    },
    createPost(parents, args, ctx, info) {
        const userExists = users.some((user) => user.id === args.data.author)

        if (!userExists) {
            throw new Error(locales.errors.userNotFound)
        }

        const post = {
            id: uuidv4(),
           ...args.data,
        };

        posts.push(post);

        return post;
    },
    deletePost(parents, args, ctx, info) {
        const postIndex = posts.findIndex((post) => post.id === args.id);

        if (postIndex === -1) {
            throw new Error(locales.errors.postNotFound);
        }

        const deletedPost = posts.splice(postIndex, 1);

        comments = comments.filter((comment) => comment.post !== args.id)

        return deletedPost[0];

    },
    createComment(parent, args, ctx, info) {
        const userExists = users.some((user) => user.id === args.data.author);
        const postExists = posts.some((post) => {
            return post.id === args.data.post && post.published;
        });

        if (!userExists) {
            throw new Error(locales.errors.userNotFound);
        }

        if (!postExists) {
            throw new Error(locales.errors.postNotFound);
        }
        
        const comment = {
            id: uuidv4(),
            body: args.data.body,
            author: args.data.author,
            post: args.data.post,
        }

        comments.push(comment);

        return comment;
    
    },
    deleteComment(parent, args, ctx, info) {
        const commentIndex = comments.findIndex((comment) => comment.id === args.id);

        if (commentIndex === -1) {
            throw new Error(locales.errors.commentNotFound);
        }

        const deletedComment = comments.splice(commentIndex, 1);

        return deletedComment[0];
    },
  }
}

const server = new GraphQLServer({
    typeDefs: './src/schema.graphql',
    resolvers,
});

server.start(() => {
    console.log(locales.logs.initialized);
})