import { gql } from 'graphql-tag';
import { adminLoginController } from './controllers/loginFunctions.js';
import { initialDumpController } from './controllers/initialDump.js';
import { CountryCodes } from './utilities/countryCodes.js';
import { storeCouponSettingsController } from './controllers/couponSettings.js';
import { getLatestCouponSettingsAlbayanController } from './controllers/couponSettings.js';

// GraphQL
export const typeDefs = gql`
  scalar JSON

  type Query {
    getCountryCodes: [Int]
    getCouponSettingsAlbayan: JSON
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

  type isCouponStoredInfo {
    isSuccessful: Boolean
    message: String
  }

  type Mutation {
    adminLogin(username: String, password: String): AdminLoginInfo
    dumpInitialDatabase: DumpDatabaseInfo
    storeCouponSettings(input: JSON!): isCouponStoredInfo
  }
`;

export const resolvers = {
  Query: {
    getCountryCodes: (_, args, context) => {
      return CountryCodes;
    },
    getCouponSettingsAlbayan: async (_, args, context) => {
      try {
        return await getLatestCouponSettingsAlbayanController();
      } catch (error) {
        console.log('Error Fetching coupon settings : ', error);
        return {};
      }
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
    storeCouponSettings: async (_, { input }, context) => {
      try {
        return await storeCouponSettingsController(input, context);
      } catch (error) {
        console.log('Store Coupon Settings Failed : ', error);
        return {
          isSuccessful: false,
          message: 'Some error occurred',
        };
      }
    },
  },
};
