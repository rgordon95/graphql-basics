export const locales = {
    errors: {
        emailInUse: 'email in use. Try logging in instead',
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
