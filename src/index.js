import { GraphQLServer } from 'graphql-yoga';
import { locales } from './locales';

console.log(locales.logs.initializing);
console.log(locales.userMessaging.getGreeting('admin'));

// Type Definitions (schema)

const typeDefs = `
  type Query {
      hello: String!
      name: String!
      email: String!
      location: String
  }
`

// Resolvers (operations)

const resolvers = {
    Query: {
        hello() {
            return 'This is my first query!'
        },
        name() {
            return 'admin'
        },
        email() {
            return 'email'
        },
        location() {
            return 'location'
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