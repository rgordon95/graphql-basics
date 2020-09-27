export const locales = {
    errors: {
        emailInUse: 'email in use. Try logging in instead',
        commentNotFound: "sorry, this comment has been removed or never existed",
        postNotFound: 'sorry, this post no longer exists.',
        userNotFound: 'user not found.',
    },
    logs: {
        initialized: 'graphql initialized!',
        initializing: 'graphql initializing...'
    },
    userMessaging: {
        getGreeting: (name) => {
            return `welcome to the app ${name}`
        }
    },
};
