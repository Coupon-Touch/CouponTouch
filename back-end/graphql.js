import { gql } from 'graphql-tag';

// Model Imports


// GraphQL
export const typeDefs = gql`
  type Query {
    sayHello: String
  }

  type Mutation {
    echoBack(message: String!): String
  }
`;

export const resolvers = {
  Query: {
    sayHello: (_, args, context) => {
      return 'Hello, from GraphQL!';
    },
  },
  Mutation: {
    echoBack: (_, args, context) => {
      const { message } = args;
      return message;
    },
  },
};
