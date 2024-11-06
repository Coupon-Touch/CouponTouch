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

export const GET_SUBSCRIBER = gql`query GetSubscriberDetails($phoneNumber: String!, $countryCode: String!) {
  getSubscriberDetails(PhoneNumber: $phoneNumber, CountryCode: $countryCode) {
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

export const UPDATE_SUBSCRIBER = gql`mutation UpdateSubscriber($name: String, $email: String, $emirateId: String, $address: String, $comment: String) {
  updateSubscriber(name: $name, email: $email, emirateID: $emirateId, address: $address, comment: $comment) {
    isSuccessful
    jwtToken
    message
  }
}`
export const UPDATE_LAST_SCRATCH_TIME = gql`mutation UpdateLastScratchTime($phoneNumber: String!, $countryCode: String!) {
  updateLastScratchTime(PhoneNumber: $phoneNumber, CountryCode: $countryCode) {
    isSuccessful
    message
    jwtToken
  }
}`

export const UPDATE_COLLECTION_DETAILS = gql`mutation UpdateCollectionDetails($phoneNumber: String!, $countryCode: String!, $collectionDate: Date!, $collectionLocation: String!, $comments: String!) {
  updateCollectionDetails(PhoneNumber: $phoneNumber, CountryCode: $countryCode, collectionDate: $collectionDate, collectionLocation: $collectionLocation, comments: $comments) {
    isSuccessful
    message
    jwtToken
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