import AdminPanel from './admin/createCoupon/adminPanel';
import Login from './admin/login';
import Home from './home/main';
import { Route, Routes } from 'react-router-dom';
import { ApolloProvider } from '@apollo/client';
import client from './apolloClient';

function App() {
  return (
    <>
      {/* <Home /> */}
      <ApolloProvider client={client}>
        <Routes>
          <Route path={'/albayan/adminLogin'} element={<Login />} />
          <Route path="/*" element={<Home />} />
        </Routes>
      </ApolloProvider>
      {/* <iframe src="https://digicpn.com/p/rptbsd&web=true" width="100%" height="100%" margin="0" padding="0" seamless="seamless" scrolling="yes" className='border-0 w-full h-screen'></iframe> */}
    </>
  );
}

export default App;
