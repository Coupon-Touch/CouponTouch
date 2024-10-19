import { Route, Routes } from 'react-router-dom';
import Login from './login';
import NavBar from './navbar';
import BulkUpload from './bulkUpload';
import { useEffect } from 'react';
import background from '@/assets/albanian/bg.png';
import { useNavigate } from 'react-router-dom';
import { isJWTTokenValid } from '@/jwtUtils';
import AdminPanel from './admin/createCoupon/adminPanel';
import NotFound from './404';
import Coupon from './game/coupon';

const Paths = [
  { path: '/adminLogin', element: <Login /> },
  { path: '/bulkupload', element: <BulkUpload /> },
  { path: '/couponSettings', element: <AdminPanel /> },
];

export default function Albayan() {
  const navigate = useNavigate();
  useEffect(() => {
    if (!isJWTTokenValid() && !window.location.pathname.endsWith('/albayan')) {
      navigate('adminLogin');
    }
    const body = document.body;

    const computedStyle = window.getComputedStyle(body);

    const oldBackgroundImage = computedStyle.backgroundImage;
    const oldBackgroundRepeat = computedStyle.backgroundRepeat;

    body.style.backgroundImage = `url('${background}')`;
    body.style.backgroundRepeat = 'repeat';

    return () => {
      body.style.backgroundImage = oldBackgroundImage;
      body.style.backgroundRepeat = oldBackgroundRepeat;
    };
  }, []);
  return (
    <div className="flex flex-col min-h-screen font-jetbrains">
      <NavBar />
      <div className="flex flex-1 justify-center items-center">
          <Routes>
            {Paths.map((path, index) => (
              <Route key={index} path={path.path} element={path.element} />
            ))}
            <Route path={'/'} element={<Coupon />} />
            <Route path={'/*'} element={<NotFound />} />
        </Routes>
      </div>
      <footer className="mt-8 mb-6 w-full text-center text-gray-500 text-sm">
        © {new Date().getFullYear()} CouponTouch Loyalty Solutions. All rights
        reserved. Terms and conditions apply.
      </footer>
    </div>
  );
}
