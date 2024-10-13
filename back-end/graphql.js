import { gql } from 'graphql-tag';
import { adminLoginController } from './controllers/loginFunctions.js';
import { initialDumpController } from './controllers/initialDump.js';
import { CountryCodes } from './utilities/countryCodes.js';

// GraphQL
export const typeDefs = gql`
  type CountryCode {
    countryName: String
    countryCode: String
    countryISO: String
  }

  type Query {
    getCountryCodes: [CountryCode]
  }

  type AdminLoginInfo {
    isSuccessful: Boolean
    message: String
    jwtToken: String
  }

  type DumpDatabaseInfo {
    isSuccessful: Boolean
    message: String
  }

  type Mutation {
    adminLogin(username: String, password: String): AdminLoginInfo
    dumpInitialDatabase: DumpDatabaseInfo
  }
`;

export const resolvers = {
  Query: {
    getCountryCodes: (_, args, context) => {
      return CountryCodes;
    },
  },
  Mutation: {
    dumpInitialDatabase: async (_, args, context) => {
      try {
        return await initialDumpController(context);
      } catch (error) {
        console.log('Initial dump failed : ', error);
        return { isSuccessful: false, message: 'Some error occurred' };
      }
    },
    adminLogin: async (_, args, context) => {
      try {
        return await adminLoginController(args, context);
      } catch (error) {
        console.log('Admin Login Failed : ', error);
        return {
          isSuccessful: false,
          message: 'Some error occurred',
          jwtToken: null,
        };
      }
    },
  },
};
