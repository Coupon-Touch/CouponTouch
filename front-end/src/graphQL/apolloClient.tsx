import { ApolloClient, InMemoryCache } from '@apollo/client';

const client = new ApolloClient({
  uri: '/api',
  cache: new InMemoryCache(),
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'authorization': localStorage.getItem('token') ? `Bearer ${localStorage.getItem('token')}` : ''
  }
});

export default client;
