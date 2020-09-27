import uuidv4 from 'uuid/v4';
import { locales } from '../locales';
import { Constants } from '../constants';

const Mutation = {
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
updateUser(parent, args, { db }, info) {
    const { id, data } = args;
   const user = db.users.find((user) => user.id === id);

   if (!user) {
    throw new Error(locales.errors.userNotFound)
}

if (typeof data.email === 'string') {
    const emailTaken = db.users.some((user) => user.email === data.email)

    if (emailTaken) {
        throw new Error(locales.errors.emailInUse);
    }

    user.email = data.email
}

if (typeof data.name === 'string') {
    user.name = data.name
}

if (typeof data.age !== 'undefined') {
    user.age = data.age
}

return user

},
createPost(parent, args, { db, pubsub }, info) {
    const userExists = db.users.some((user) => user.id === args.data.author)

    if (!userExists) {
        throw new Error(locales.errors.userNotFound)
    }

    const post = {
        id: uuidv4(),
       ...args.data,
    };

    db.posts.push(post);

    if (args.data.published) {
        pubsub.publish('post', {
            post: {
                mutation: Constants.MutationTypes.CREATED,
                data: post
            }
        });
    }
    
    return post;
},
deletePost(parents, args, { db, pubsub }, info) {
    const postIndex = db.posts.findIndex((post) => post.id === args.id);

    if (postIndex === -1) {
        throw new Error(locales.errors.postNotFound);
    }

    const [post] = db.posts.splice(postIndex, 1);

    db.comments = db.comments.filter((comment) => comment.post !== args.id)

    if (post.published) {
        pubsub.publish('post', {
            post: {
                mutation: Constants.MutationTypes.DELETED,
                data: post
            }
        });
    }

    return post;

},
updatePost(parents, { id, data }, { db, pubsub }, info ) {
    const post = db.posts.find((post) => post.id === id)
    const originalPost = { ...post }

    if (!post) {
        throw new Error(locales.errors.postNotFound);
    }

    if (typeof data.title === 'string') {
        post.title = data.title
    }
    
    if (typeof data.body === 'string') {
        post.body = data.body
    }

    if (typeof data.published === 'boolean') {
        post.published = data.published

        if (originalPost.published && !post.published) {
            pubsub.publish('post', {
                post: {
                    mutation: Constants.MutationTypes.DELETED,
                    data: originalPost
                }
            })
        } else if (!originalPost.published && post.published) {
            pubsub.publish('post', {
                post: {
                    mutation: Constants.MutationTypes.CREATED,
                    data: post
                }
            })
        }
    } else if (post.published) {
        pubsub.publish('post', {
            post: {
                mutation: Constants.MutationTypes.UPDATED,
                data: post
            }
        })
    }


    return post
},
createComment(parent, args, { db, pubsub }, info) {
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
    pubsub.publish(`comment ${args.data.post}`, {
     mutation: Constants.MutationTypes.CREATED,
     data: comment   
    });

    return comment;

},
deleteComment(parent, args, { db, pubsub }, info) {
    const commentIndex = db.comments.findIndex((comment) => comment.id === args.id);

    if (commentIndex === -1) {
        throw new Error(locales.errors.commentNotFound);
    }

    const deletedComment = db.comments.splice(commentIndex, 1);


    db.comments.push(comment);
    pubsub.publish(`comment ${deletedComment[0].post}`, {
     mutation: Constants.MutationTypes.DELETED,
     data: comment   
    });

    return deletedComment[0];
},
updateComment(parent, args, { db, pubsub }, info ) {
    const { id, body } = args;
    const comment = db.comments.find((comment) => comment.id === id)

    if (!comment) {
        throw new Error(locales.errors.commentNotFound)
    }

    if (typeof body === 'string') {
        comment.body = body
    }

    db.comments.push(comment);
    pubsub.publish(`comment ${comment.post}`, {
     mutation: Constants.MutationTypes.UPDATED,
     data: comment   
    });

    return comment
},
};

export { Mutation as default }