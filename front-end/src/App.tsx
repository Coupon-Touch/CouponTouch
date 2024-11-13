import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import { ApolloProvider } from '@apollo/client';
import client from './graphQL/apolloClient';
import DefaultLoader from './DefaultLoader';

const Home = lazy(() => import('./home/main'));
const Albayan = lazy(() => import('./albayan/main'));

function App() {
  return (
    <>
      <ApolloProvider client={client}>
        {/* <DefaultLoader /> */}
        <Suspense fallback={<DefaultLoader />}>
          <Routes>
            <Route path={'/albayan/*'} element={<Albayan />} />
            <Route path="/*" element={<Home />} />
          </Routes>
        </Suspense>
      </ApolloProvider>
    </>
  );
}

export default App;
