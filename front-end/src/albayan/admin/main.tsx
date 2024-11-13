import { Route, Routes, useNavigate } from 'react-router-dom';
import Login from './login';
import BulkUpload from '../bulkUpload';
import AdminPanel from './createCoupon/adminPanel';
import { useEffect } from 'react';
import { isJWTTokenValid } from '@/jwtUtils';


const Paths = [
  { path: '/login', element: <Login /> },
  { path: '/bulkupload', element: <BulkUpload /> },
  { path: '/couponSettings', element: <AdminPanel /> },
];


export default function AlbayanAdmin() {
  const navigate = useNavigate()
  useEffect(() => {
    if (window.location.pathname.endsWith('/admin/') || window.location.pathname.endsWith('/admin')) {
      navigate('/albayan/admin/login')
    }
    if (window.localStorage.getItem('adminToken') && !isJWTTokenValid(window.localStorage.getItem('adminToken')) || !window.localStorage.getItem('adminToken')) {
      window.localStorage.removeItem('adminToken');
      navigate('/albayan/admin/login/')
    } else if (window.localStorage.getItem('adminToken')) {
      navigate("/albayan/admin/couponSettings")
    }
  }, []);
  return <>
    <Routes>
      {Paths.map((path, index) => (
        <Route key={index} path={path.path} element={path.element} />
      ))}
    </Routes>
  </>
}