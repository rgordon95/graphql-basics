import { GraphQLServer } from 'graphql-yoga';
import uuidv4 from 'uuid/v4';

import db from './db';
import { locales } from './locales';

console.log(locales.logs.initializing);
console.log(locales.userMessaging.getGreeting('admin'));

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
         posts(parent, args, { db }, info) {
            if (!args.query) {
                return db.posts;
            }
            
            return db.posts.filter((post) => {
                 const isTitleMatch = post.title.toLowerCase().includes(args.query.toLowerCase());
                 const isBodyMatch = post.body.toLowerCase().includes(args.query.toLowerCase());
                return isTitleMatch || isBodyMatch;  
        })
    },
    users(parent, args, { db }, info) {
        if (!args.query) {
            return db.users;
        } else {
            return db.users.filter((user) => {
                return user.name.toLowerCase().includes(args.query.toLowerCase())
            })
        }
    },
    comments(parent, args, { db }, info) {
        if (!args.query) {
            return db.comments;
    }
},
    },
    Post: {
        author(parent, args, { db }, info) {
            return db.users.find((user) => {
                return user.id === parent.author
        })
      },
      comments(parent, args, { db }, info) {
        return db.comments.filter((comment) => {
            return comment.post === parent.id 
        })
    },
    },
    Comment: {
        author(parent, args, { db }, info) {
            return db.users.find((user) => {
                return user.id === parent.author
        })
      },
        post(parent, args, { db }, info) {
            return db.posts.find((post) => {
                return post.id === parent.post
            })
        },
    },
     User: {
    posts(parent, args, { db }, info) {
        return db.posts.filter((post) => {
            return post.author === parent.id 
        })
    },
    comments(parent, args, { db }, info) {
        return db.comments.filter((comment) => {
            return comment.author === parent.id 
        })
    },
  },
  Mutation: {
    createUser(parent, args, { db }, info) {
        const emailTaken = db.users.some((user) => user.email === args.data.email)
       
        if (emailTaken) {
            throw new Error(locales.errors.emailInUse)
        }

        const user = {
            id: uuidv4(),
            ...args.data,
        }

        db.users.push(user)

        return user;
    },
    deleteUser(parent, args, { db }, info) {
        const userIndex = db.users.findIndex((user) => user.id === args.id)

        if (userIndex === -1) {
            throw new Error(locales.errors.userNotFound)
        }

        const deletedUsers = db.users.splice(userIndex, 1);

        db.posts = db.posts.filter((post) => {
            const match = post.author === args.id

            if (match) {
                db.comments = db.comments.filter((comment) => {
                    return comment.post !== post.id
                })
            }

            return !match;
        })

        db.comments = db.comments.filter((comment) => comment.author !== args.id)

        return deletedUsers[0]
    },
    createPost(parents, args, { db }, info) {
        const userExists = db.users.some((user) => user.id === args.data.author)

        if (!userExists) {
            throw new Error(locales.errors.userNotFound)
        }

        const post = {
            id: uuidv4(),
           ...args.data,
        };

        db.posts.push(post);

        return post;
    },
    deletePost(parents, args, { db }, info) {
        const postIndex = db.posts.findIndex((post) => post.id === args.id);

        if (postIndex === -1) {
            throw new Error(locales.errors.postNotFound);
        }

        const deletedPost = db.posts.splice(postIndex, 1);

        db.comments = db.comments.filter((comment) => comment.post !== args.id)

        return deletedPost[0];

    },
    createComment(parent, args, { db }, info) {
        const userExists = db.users.some((user) => user.id === args.data.author);
        const postExists = db.posts.some((post) => {
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

        db.comments.push(comment);

        return comment;
    
    },
    deleteComment(parent, args, { db }, info) {
        const commentIndex = db.comments.findIndex((comment) => comment.id === args.id);

        if (commentIndex === -1) {
            throw new Error(locales.errors.commentNotFound);
        }

        const deletedComment = db.comments.splice(commentIndex, 1);

        return deletedComment[0];
    },
  }
}

const server = new GraphQLServer({
    typeDefs: './src/schema.graphql',
    resolvers,
    context: {
        db
    },
});

server.start(() => {
    console.log(locales.logs.initialized);
})