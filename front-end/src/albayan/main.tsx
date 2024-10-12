import { Route, Routes } from 'react-router-dom';
import Login from './login';
import NavBar from './navbar';
import BulkUpload from './bulkUpload';
import { useEffect } from 'react';
import background from '@/assets/albanian/bg.png';

export default function Albayan() {
  useEffect(() => {
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
          <Route path={'/adminLogin'} element={<Login />} />
          <Route path={'/bulkupload'} element={<BulkUpload />} />
        </Routes>
      </div>
    </div>

  </>
}