import { useState } from 'react';
import Loader from '../loader';

export default function PaymentIFrame({ link }: { link: string }) {
  const [isLoading, setIsLoading] = useState(true);

  const handleLoad = () => {
    setIsLoading(false);
  };

  return (
    <div className="relative w-full h-screen">
      {isLoading && (
        <Loader />
      )}
      <iframe
        src={link}
        onLoad={handleLoad}
        className="w-full h-screen"
        style={{ visibility: isLoading ? 'hidden' : 'visible' }}
      />
    </div>
  );
}
