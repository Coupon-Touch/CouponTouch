import { gql } from 'graphql-tag';
import { adminLoginController } from './controllers/loginFunctions.js';
import {
  adminUserExists,
  createAdminUser,
  deleteAdminUser,
  getAllAdminUsersController,
  initialDumpController,
  updateAdminUser,
} from './controllers/initialDump.js';
import { CountryCodes } from './utilities/countryCodes.js';
import { storeCouponSettingsController } from './controllers/couponSettings.js';
import {
  getLatestCouponSettingsAlbayanController,
  getLocationAlbayanController,
} from './controllers/couponSettings.js';
import { updateLastScratchTimeController } from './controllers/lastScratchHandler.js';
import { addSubscriberController } from './controllers/csvFunctions.js';
import { getSubscriberDetailsController } from './controllers/loginFunctions.js';
import { updateSubscriberController } from './controllers/subscriberFunctions.js';
import { updateCollectionDetailsController } from './controllers/subscriberFunctions.js';
import {
  didSubscriberWinController,
  getAllWinnersController,
  updateStatusofWinByWinnerIDController,
} from './controllers/winFunctions.js';
import { getAllWinsBySubscriberIDController } from './controllers/winFunctions.js';
import { UserRole } from './utilities/userRoles.js';

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

  type SubscriberWinInfo {
    isWon: Boolean
    campaignCode: String
    collectionDate: Date
    collectionLocation: String
    comments: String
    jwtToken: String
  }

  type SubscriberWinnerFetchInfo {
    _id: String
    mobile: String
    countryCode: String
    isPaid: Boolean
    lastScratchTime: Float
    address: String
    email: String
    emirateID: String
    name: String
  }

  type WinnerInfo {
    _id: String
    winTime: Date
    campaignCode: String
    collectionDate: Date
    collectionLocation: String
    comments: String
    subscriber: SubscriberWinnerFetchInfo
    status: String
  }

  type AdminUser {
    _id: String
    username: String
    userRole: String
  }

  type AllAdminUsersInfo {
    isSuccessful: Boolean
    adminUsers: [AdminUser]
    message: String
  }

  type Query {
    getCountryCodes: [Int]
    getCouponSettingsAlbayan: JSON
    getSubscriberDetails: SubscriberInfo
    login(PhoneNumber: String!, CountryCode: String!): SubscriberInfo
    didSubscriberWin: SubscriberWinInfo
    getAllWinnerDetails: [WinnerInfo]
    getAllWinsBySubscriberID(subscriberID: String!): [WinnerInfo]
    getLocation: JSON
    getAllAdminUsers: AllAdminUsersInfo
    adminUserExists(username: String!): Boolean
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
    jwtToken: String
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

  type IsUpdatedInfo {
    isSuccessful: Boolean
    message: String
    jwtToken: String
  }

  type IsUpdatedWinnerInfo {
    isSuccessful: Boolean
    message: String
  }

  type AdminUserCreatedInfo {
    isSuccessful: Boolean
    message: String
  }

  type Mutation {
    adminLogin(username: String, password: String): AdminLoginInfo
    dumpInitialDatabase: DumpDatabaseInfo
    storeCouponSettings(input: JSON!): isCouponStoredInfo
    updateLastScratchTime: UpdateScratchTimeInfo
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
      address: String
      comment: String
    ): UpdateSubscriberInfo
    updateCollectionDetails(
      collectionDate: Date!
      collectionLocation: String!
      comments: String!
    ): IsUpdatedInfo
    updateStatusofWinByWinnerID(
      winnerID: String!
      newStatus: String!
    ): IsUpdatedWinnerInfo
    createAdminUser(
      username: String!
      password: String!
      userRole: String!
    ): AdminUserCreatedInfo
    updateAdminUser(
      _id: String!
      password: String
      userRole: String
    ): AdminUserCreatedInfo
    deleteAdminUser(id: String!): AdminUserCreatedInfo
  }
`;

export const resolvers = {
  Query: {
    adminUserExists: async (_, { username }, context) => {
      try {
        const { decodedToken, isValid } = context;
        if (isValid && decodedToken.userType === UserRole.ADMINUSER) {
          return await adminUserExists(username);
        }
      } catch (error) {
        console.error('Error in adminUserExists resolver:', error);
        return false;
      }
    },
    getAllAdminUsers: async (_, __, context) => {
      try {
        const { decodedToken, isValid } = context;
        if (isValid && decodedToken.userType === UserRole.ADMINUSER) {
          return await getAllAdminUsersController();
        } else {
          return [];
        }
      } catch (error) {
        return {
          isSuccessful: false,
          message: 'Error getting admin users',
          adminUsers: [],
        };
      }
    },
    getCountryCodes: (_, args, context) => {
      return CountryCodes;
    },
    getCouponSettingsAlbayan: async (_, args, context) => {
      try {
        const { decodedToken, isValid } = context;
        if (isValid && decodedToken.userType === UserRole.ADMINUSER) {
          return await getLatestCouponSettingsAlbayanController();
        } else {
          return {};
        }
      } catch (error) {
        console.error('Error Fetching coupon settings : ', error);
        return {};
      }
    },
    getLocation: async (_, args, context) => {
      try {
        const { decodedToken, isValid } = context;
        if (isValid && decodedToken.userType === UserRole.SUBSCRIBER) {
          return await getLocationAlbayanController();
        } else {
          return {};
        }
      } catch (error) {
        console.error('Error Fetching coupon settings : ', error);
        return {};
      }
    },
    getSubscriberDetails: async (_, args, context) => {
      try {
        const { decodedToken, isValid } = context;
        if (isValid) {
          const { subsriberMobile, subscriberCountryCode } = decodedToken;
          return await getSubscriberDetailsController(
            subsriberMobile,
            subscriberCountryCode
          );
        }
      } catch (error) {
        console.error('Error Fetching Subscriber Details : ', error);
        return {};
      }
    },
    login: async (_, { PhoneNumber, CountryCode }, context) => {
      try {
        const response = await getSubscriberDetailsController(
          PhoneNumber,
          CountryCode
        );
        return response;
      } catch (error) {
        console.error('Error Fetching Subscriber Details : ', error);
        return {};
      }
    },
    getAllWinnerDetails: async (_, __, context) => {
      try {
        const { decodedToken, isValid } = context;
        if (
          (isValid && decodedToken.userType === UserRole.ADMINUSER) ||
          decodedToken.userType === UserRole.DISTRIBUTOR
        ) {
          return await getAllWinnersController();
        } else {
          return [];
        }
      } catch (error) {
        console.error('Error Fetching Winner Details : ', error);
        return [];
      }
    },
    getAllWinsBySubscriberID: async (_, args, context) => {
      try {
        const { decodedToken, isValid } = context;
        const { subscriberID } = args;
        if (isValid && decodedToken.userType === UserRole.ADMINUSER) {
          return await getAllWinsBySubscriberIDController(subscriberID);
        } else {
          return [];
        }
      } catch (error) {
        console.error('Error Fetching Winner Details : ', error);
        return [];
      }
    },
    didSubscriberWin: async (_, __, context) => {
      try {
        const { decodedToken, isValid } = context;
        if (isValid && decodedToken.userType === UserRole.SUBSCRIBER) {
          return didSubscriberWinController(decodedToken);
        } else {
          return {
            isWon: false,
            campaignCode: null,
            collectionDate: null,
            collectionLocation: '',
            comments: '',
            jwtToken: null,
          };
        }
      } catch (error) {
        console.error('Error fetching subscriber win info:', error);
        return {
          isWon: false,
          campaignCode: null,
          collectionDate: null,
          collectionLocation: '',
          comments: '',
          jwtToken: null,
        };
      }
    },
  },
  Mutation: {
    createAdminUser: async (_, args, context) => {
      try {
        const { decodedToken, isValid } = context;
        if (isValid && decodedToken.userType === UserRole.ADMINUSER) {
          return await createAdminUser(
            args.username,
            args.password,
            args.userRole
          );
        } else {
          return {
            isSuccessful: false,
            message: 'Permission denied.',
          };
        }
      } catch (error) {
        console.error('Admin User Creation Failed : ', error);
        return { isSuccessful: false, message: 'Some error occurred' };
      }
    },
    updateAdminUser: async (_, { _id, password, userRole }, context) => {
      try {
        const { decodedToken, isValid } = context;
        if (isValid && decodedToken.userType === UserRole.ADMINUSER) {
          if (_id === decodedToken.adminId && userRole) {
            return {
              isSuccessful: false,
              message: 'Cannot Change your permission.',
            };
          }
          if (!password && !userRole) {
            return { isSuccessful: false, message: 'No fields to update' };
          }
          return await updateAdminUser(_id, password, userRole);
        } else {
          return {
            isSuccessful: false,
            message: 'Permission denied.',
          };
        }
      } catch (error) {
        return { isSuccessful: false, message: 'Some error occurred' };
      }
    },
    deleteAdminUser: async (_, args, context) => {
      try {
        const { decodedToken, isValid } = context;
        if (isValid && decodedToken.userType === UserRole.ADMINUSER) {
          if (args.id === decodedToken.adminId) {
            return {
              isSuccessful: false,
              message: 'Cannot delete your own account.',
            };
          }
          return await deleteAdminUser(args.id);
        } else {
          return {
            isSuccessful: false,
            message: 'Permission denied.',
          };
        }
      } catch (error) {
        return { isSuccessful: false, message: 'Some error occurred' };
      }
    },
    dumpInitialDatabase: async (_, args, context) => {
      try {
        const { decodedToken, isValid } = context;
        if (isValid && decodedToken.userType === UserRole.ADMINUSER) {
          return await initialDumpController(context);
        } else {
          return { isSuccessful: false, message: 'Permission denied.' };
        }
      } catch (error) {
        console.error('Initial dump failed : ', error);
        return { isSuccessful: false, message: 'Some error occurred' };
      }
    },
    adminLogin: async (_, args, context) => {
      try {
        return await adminLoginController(args, context);
      } catch (error) {
        console.error('Admin Login Failed : ', error);
        return {
          isSuccessful: false,
          message: 'Some error occurred',
          jwtToken: null,
        };
      }
    },
    updateStatusofWinByWinnerID: async (_, { winnerID, newStatus }) => {
      try {
        const result = await updateStatusofWinByWinnerIDController(
          winnerID,
          newStatus
        );
        return result;
      } catch (error) {
        console.error('Error in mutation:', error);
        return {
          isSuccessful: false,
          message: 'An error occurred while processing the mutation.',
        };
      }
    },
    storeCouponSettings: async (_, { input }, context) => {
      try {
        const { decodedToken, isValid } = context;
        if (isValid && decodedToken.userType === UserRole.ADMINUSER) {
          return await storeCouponSettingsController(input, context);
        } else {
          return {
            isSuccessful: false,
            message: 'Permission denied.',
          };
        }
      } catch (error) {
        console.error('Store Coupon Settings Failed : ', error);
        return {
          isSuccessful: false,
          message: 'Some error occurred',
        };
      }
    },
    updateLastScratchTime: async (_, __, context) => {
      try {
        const { decodedToken, isValid } = context;
        if (isValid && decodedToken.userType === UserRole.SUBSCRIBER) {
          return await updateLastScratchTimeController(decodedToken);
        } else {
          return {
            isSuccessful: false,
            message: 'An error occurred while updating last scratch time',
          };
        }
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
      { name, email, emirateID, countryCode, mobile, address },
      context
    ) => {
      try {
        const { decodedToken, isValid } = context;
        if (isValid && decodedToken.userType === UserRole.ADMINUSER) {
          const subscriberInput = {
            name,
            email,
            emirateID,
            countryCode,
            mobile,
            address,
          };

          return await addSubscriberController(subscriberInput);
        } else {
          return {
            isSuccessful: false,
            message:
              'An error occurred while adding the subscriber or you do not have permission to perform this action.',
          };
        }
      } catch (error) {
        console.error('Error in addSubscriber resolver:', error);

        return {
          isSuccessful: false,
          message: 'An error occurred while adding the subscriber',
        };
      }
    },
    updateSubscriber: async (_, args, context) => {
      try {
        const { decodedToken, isValid } = context;
        const { ...updateFields } = args;
        if (isValid && decodedToken.userType === UserRole.SUBSCRIBER) {
          return await updateSubscriberController(decodedToken, updateFields);
        }
      } catch (error) {
        console.error('Error in updateSubscriber resolver:', error);
        return {
          isSuccessful: false,
          message: 'An error occurred while updating the subscriber',
        };
      }
    },
    updateCollectionDetails: async (
      _,
      {
        PhoneNumber,
        CountryCode,
        collectionDate,
        collectionLocation,
        comments,
      },
      context
    ) => {
      try {
        const { decodedToken, isValid } = context;

        if (isValid && decodedToken.userType === UserRole.SUBSCRIBER) {
          const result = await updateCollectionDetailsController(
            decodedToken,
            collectionDate,
            collectionLocation,
            comments
          );
          return result;
        } else {
          return {
            isSuccessful: false,
            jwtToken: null,
            message: 'Permission denied!',
          };
        }
      } catch (error) {
        console.error('Error in updateCollectionDetails resolver:', error);

        return {
          isSuccessful: false,
          jwtToken: null,
          message: 'Something went wrong!',
        };
      }
    },
  },
};
