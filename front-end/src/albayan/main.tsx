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


const Paths = [
  { path: "/adminLogin", element: <Login /> },
  { path: "/bulkupload", element: <BulkUpload /> },
  { path: "/couponSettings", element: <AdminPanel /> },
]
const allUrls = new Set(Paths.map((obj) => obj.path))

export default function Albayan() {
  const navigate = useNavigate();
  useEffect(() => {
    if (isJWTTokenValid()) {
      // Redirect to admin dashboard here
      if (window.location.pathname.endsWith('/adminLogin')) {

        navigate("bulkupload")
      }
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
  return <>
    <NavBar />
    <div className='flex justify-center'>

      <div className='container mt-5'>
        <Routes>
          {Paths.map((path, index) => (
            <Route key={index} path={path.path} element={path.element} />
          ))}
          <Route path={"/*"} element={<NotFound />} />
        </Routes>
      </div>
    </div>

  </>
}