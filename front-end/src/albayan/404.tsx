import React from 'react';

const NotFound: React.FC = () => {
  return (
    <div className='flex flex-col justify-center items-center w-full h-full py-10'>
      <h1 className='text-4xl font-bold'>404</h1>
      <p className="text-2xl">Sorry, the page you are looking for does not exist.</p>
    </div>
  );
};

export default NotFound;