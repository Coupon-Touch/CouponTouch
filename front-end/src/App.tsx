import AdminPanel from './admin/createCoupon/adminPanel';
import Login from './admin/login';
import Home from './home/main';
import { Route, Routes } from 'react-router-dom';

function App() {
  return (
    <>
      {/* <Home /> */}

      <Routes>
        <Route path={'/admin'} element={<Login />} />
        <Route path={'/panel'} element={<AdminPanel />} />
        <Route
          path={'/albanian'}
          element={
            <iframe
              src="https://digicpn.com/p/rptbsd&web=true"
              seamless={true}
              className="border-0 w-full h-screen"
            />
          }
        />
        <Route path="/*" element={<Home />} />
      </Routes>
    </>
  );
}

export default App;
