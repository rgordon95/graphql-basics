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
      id: ID!
      name: String!
      age: Int!
      employed: Boolean!
      gpa: Float
      title: String!
      price: Float!
      releaseYear: Int
      rating: Float
      inStock: Boolean!
  }
`

// Resolvers (operations)

const resolvers = {
    Query: {
        id() {
            return 'abc123'
        },
        name() {
            return 'admin'
        },
        age() {
            return 25
        },
        employed() {
            return true
        },
        gpa() {
            return null
        },
        title() {
            return 'Title here'
        },
        price() {
            return 800
        },
        releaseYear() {
            return 1995
        },
        rating() {
            return null;
        },
        inStock() {
            return false
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