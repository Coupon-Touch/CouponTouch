import { isJWTTokenValid } from '@/jwtUtils';
import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

const httpLink = new HttpLink({ uri: '/api' });

const authLink = setContext((_, { headers }) => {
  let token;
  if (window.location.pathname.indexOf("/admin/") !== -1) {
    token = localStorage.getItem('adminToken');
    if (!isJWTTokenValid(token)) {
      localStorage.removeItem('adminToken');
      token = null
    }
  } else {
    token = localStorage.getItem('token');
    if (!isJWTTokenValid(token)) {
      localStorage.removeItem('token');
      token = null
    }
  }

  return {
    headers: {
      ...headers,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'authorization': token ? `Bearer ${token}` : '',
    }
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache({
    addTypename: false,
    resultCaching: false,
    possibleTypes: {}
  }),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'no-cache',
    },
    query: {
      fetchPolicy: 'no-cache',
    },
    mutate: {
      fetchPolicy: 'no-cache',
    },
  },
});

export default client;
