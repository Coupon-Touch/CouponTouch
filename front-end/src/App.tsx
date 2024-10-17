import Home from './home/main';
import { Route, Routes } from 'react-router-dom';
import { ApolloProvider } from '@apollo/client';
import client from './apolloClient';
import Albayan from './albayan/main';

function App() {
  return (
    <>
      {/* <Home /> */}
      <ApolloProvider client={client}>
        <Routes>
          <Route path={'/albayan/*'} element={<Albayan />} />
          <Route path="/*" element={<Home />} />
        </Routes>
      </ApolloProvider>
    </>
  );
}

export default App;
