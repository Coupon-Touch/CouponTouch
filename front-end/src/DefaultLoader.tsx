import { useEffect } from "react";

export default function DefaultLoader() {
  useEffect(() => {
    // disable body scroll
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    }
  }, [])
  return (
    <div className='bg-black/20 flex justify-center items-center h-screen w-full'>
      <div className="loader w-11 h-11 bg-gradient-conic"></div>
    </div>
  );
}