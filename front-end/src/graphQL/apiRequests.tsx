import { gql } from '@apollo/client';

export const ADMIN_LOGIN = gql`
  mutation AdminLogin($username: String, $password: String) {
    adminLogin(username: $username, password: $password) {
      isSuccessful
      jwtToken
      message
    }
  }
`;

export const STORE_COUPONSETTINGS = gql`
  mutation StoreCouponSettings($input: JSON!) {
    storeCouponSettings(input: $input) {
      isSuccessful
      message
    }
  }
`;

export const GET_COUPONSETTINGS = gql`
  query Query {
    getCouponSettingsAlbayan
  }
`;
export const GET_LOCATION = gql`
  query Query {
  getLocation
} 
`;

export const GET_SUBSCRIBER = gql`query GetSubscriberDetails {
  getSubscriberDetails{
    jwtToken
    mobile
    countryCode
    isPaid
    lastScratchTime
    address
    email
    emirateID
    name
  }
}`

export const LOGIN = gql`query Login($phoneNumber: String!, $countryCode: String!) {
  login(PhoneNumber: $phoneNumber, CountryCode: $countryCode) {
    address
    countryCode
    email
    emirateID
    isPaid
    jwtToken
    lastScratchTime
    mobile
    name
  }
}`

export const DID_SUBSCRIBER_PAY = gql`query GetSubscriberDetails {
    getSubscriberDetails {
      isPaid
    jwtToken
    }
}`

export const IS_PAYMENT_SUCCESSFULL = gql`query DidSubscriberWin {
  didSubscriberWin {
    jwtToken
  }
}`
export const UPDATE_SUBSCRIBER = gql`mutation UpdateSubscriber($name: String, $email: String, $emirateId: String, $address: String, $comment: String) {
  updateSubscriber(name: $name, email: $email, emirateID: $emirateId, address: $address, comment: $comment) {
    isSuccessful
    jwtToken
    message
  }
}`
export const UPDATE_LAST_SCRATCH_TIME = gql`mutation UpdateLastScratchTime {
  updateLastScratchTime {
    jwtToken
    isSuccessful
  }
}`

export const UPDATE_COLLECTION_DETAILS = gql`mutation UpdateCollectionDetails($collectionDate: Date!, $collectionLocation: String!, $comments: String!) {
  updateCollectionDetails(collectionDate: $collectionDate, collectionLocation: $collectionLocation, comments: $comments) {
    jwtToken
    message
    isSuccessful
  }
}`

export const DID_SUBSCRIBER_WIN = gql`query DidSubscriberWin {
  didSubscriberWin {
    isWon
    jwtToken
    comments
    collectionLocation
    collectionDate
    campaignCode
  }
}`


export const GET_ALL_WINNERS = gql`query GetAllWinnerDetails {
  getAllWinnerDetails {
    _id
    winTime
    campaignCode
    collectionDate
    collectionLocation
    comments
    subscriber {
      _id
      mobile
      countryCode
      isPaid
      lastScratchTime
      address
      email
      name
    }
    status
  }
}`

export const UPDATE_WIN_STATUS = gql`mutation UpdateStatusofWinByWinnerID($winnerId: String!, $newStatus: String!) {
  updateStatusofWinByWinnerID(winnerID: $winnerId, newStatus: $newStatus) {
    isSuccessful
  }
}`


export const CREATE_ADMIN_USER = gql`mutation CreateAdminUser($username: String!, $password: String!, $userRole: String!) {
  createAdminUser(username: $username, password: $password, userRole: $userRole) {
    message
    isSuccessful
  }
}`

export const GET_ALL_ADMIN_USERS = gql`query GetAllAdminUsers {
  getAllAdminUsers {
    isSuccessful
    message
    adminUsers {
      userRole
      username
      _id
    }
  }
}`

export const UPDATE_ADMIN_USER = gql`mutation UpdateAdminUser($id: String!, $password: String, $userRole: String) {
  updateAdminUser(_id: $id, password: $password, userRole: $userRole) {
    isSuccessful
    message
  }
}`

export const DELETE_ADMIN_USER = gql`mutation DeleteAdminUser($id: String!) {
  deleteAdminUser(id: $id) {
    isSuccessful
    message
  }
}`