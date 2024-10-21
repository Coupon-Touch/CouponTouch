import { gql } from 'graphql-tag';
import { adminLoginController } from './controllers/loginFunctions.js';
import { initialDumpController } from './controllers/initialDump.js';
import { CountryCodes } from './utilities/countryCodes.js';
import { storeCouponSettingsController } from './controllers/couponSettings.js';
import { getLatestCouponSettingsAlbayanController } from './controllers/couponSettings.js';
import { updateLastScratchTimeController } from './controllers/lastScratchHandler.js';
import { addSubscriberController } from './controllers/csvFunctions.js';
import { getSubscriberDetailsController } from './controllers/loginFunctions.js';
import { updateSubscriberController } from './controllers/subscriberFunctions.js';

// GraphQL
export const typeDefs = gql`
  scalar JSON
  scalar Date

  type SubscriberInfo {
    jwtToken: String
    mobile: String
    countryCode: String
    isPaid: Boolean
    lastScratchTime: Float
    address: String
    email: String
    emirateID: String
    name: String
  }

  type Query {
    getCountryCodes: [Int]
    getCouponSettingsAlbayan: JSON
    getSubscriberDetails(
      PhoneNumber: String!
      CountryCode: String!
    ): SubscriberInfo
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

  type UpdateScratchTimeInfo {
    isSuccessful: Boolean!
    message: String
  }

  type AddSubscriberInfo {
    isSuccessful: Boolean!
    message: String
  }

  type UpdateSubscriberInfo {
    isSuccessful: Boolean!
    jwtToken: String
    message: String
  }

  type Mutation {
    adminLogin(username: String, password: String): AdminLoginInfo
    dumpInitialDatabase: DumpDatabaseInfo
    storeCouponSettings(input: JSON!): isCouponStoredInfo
    updateLastScratchTime(
      PhoneNumber: String!
      CountryCode: String!
    ): UpdateScratchTimeInfo
    addSubscriber(
      name: String!
      email: String!
      emirateID: String!
      countryCode: String!
      mobile: String!
      address: String!
    ): AddSubscriberInfo
    updateSubscriber(
      name: String
      email: String
      emirateID: String
      countryCode: String!
      mobile: String!
      address: String
      comment: String
    ): UpdateSubscriberInfo
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
    getSubscriberDetails: async (_, { PhoneNumber, CountryCode }, context) => {
      try {
        const response = await getSubscriberDetailsController(
          PhoneNumber,
          CountryCode
        );
        return response;
      } catch (error) {
        console.log('Error Fetching Subscriber Details : ', error);
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
    updateLastScratchTime: async (_, { PhoneNumber, CountryCode }) => {
      try {
        return await updateLastScratchTimeController(PhoneNumber, CountryCode);
      } catch (error) {
        console.error('Error in updateLastScratchTime resolver:', error);

        return {
          isSuccessful: false,
          message: 'An error occurred while updating last scratch time',
        };
      }
    },
    addSubscriber: async (
      _,
      { name, email, emirateID, countryCode, mobile, address }
    ) => {
      try {
        const subscriberInput = {
          name,
          email,
          emirateID,
          countryCode,
          mobile,
          address,
        };

        return await addSubscriberController(subscriberInput);
      } catch (error) {
        console.error('Error in addSubscriber resolver:', error);

        return {
          isSuccessful: false,
          message: 'An error occurred while adding the subscriber',
        };
      }
    },
    updateSubscriber: async (_, args) => {
      try {
        const { mobile, countryCode, ...updateFields } = args;
        return await updateSubscriberController(
          mobile,
          countryCode,
          updateFields
        );
      } catch (error) {
        console.error('Error in updateSubscriber resolver:', error);
        return {
          isSuccessful: false,
          message: 'An error occurred while updating the subscriber',
        };
      }
    },
  },
};
