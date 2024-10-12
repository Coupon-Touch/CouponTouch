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
