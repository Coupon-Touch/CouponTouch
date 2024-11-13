import { Route, Routes } from 'react-router-dom';
import NavBar from './navbar';
import { useEffect, lazy, Suspense } from 'react';
import background from '@/assets/albanian/bg.png';
import NotFound from './404';
import Coupon from './game/coupon';
import DefaultLoader from '@/DefaultLoader';

const AlbayanAdmin = lazy(() => import('./admin/main'));

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
  return (
    <div className="flex flex-col min-h-screen font-jetbrains">
      <NavBar />
      <div className="flex flex-1 justify-center items-center">
        <div className="container">
          <Suspense fallback={<DefaultLoader />}>
            <Routes>
              <Route path="/admin/*" element={<AlbayanAdmin />} />
              <Route path={'/'} element={<Coupon />} />
              <Route path={'/*'} element={<NotFound />} />
            </Routes>
          </Suspense>
        </div>
      </div>
      <footer className="mt-8 mb-6 w-full text-center text-gray-500 text-sm">
        © {new Date().getFullYear()}{' '}
        <a
          href="https://coupontouch.net/"
          className="underline"
          target="__blank"
        >
          coupontouch.net
        </a>{' '}
        - All rights reserved. Terms and conditions apply.
      </footer>
    </div>
  );
}
