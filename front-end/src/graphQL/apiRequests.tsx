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