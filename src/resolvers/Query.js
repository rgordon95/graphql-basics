const Query = {
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
};

export { Query as default };