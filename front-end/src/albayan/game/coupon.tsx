import { useEffect, useState } from 'react';
import SubscriberInfo from './subscriberInfo';
import { cn } from '@/lib/utils';
import AfterGame from './afterGame';
import { add } from 'date-fns';
import { decodeJWT } from '@/jwtUtils';
import CountDown from './countDown';

export default function Coupon() {
  const [showScratchCard, setShowScratchCard] = useState(false);
  const [countDown, setCountDown] = useState(0)
  const [trigger, setTrigger] = useState(false);
  useEffect(() => {
    // TODO: store these in JWT token dont get it from local storage
    const subscriberToken = decodeJWT(window.localStorage.getItem('subscriberToken'));
    if (subscriberToken) {
      if (subscriberToken.lastScratchTime) {
        const lastScratchTime = new Date(subscriberToken.lastScratchTime);
        const nextScratchTime = add(lastScratchTime, { days: 1 });
        if (nextScratchTime.getTime() <= new Date().getTime()) {
          setShowScratchCard(true);
          setCountDown(0)
        } else {
          setCountDown(nextScratchTime.getTime())
        }
      }
    }
  }, [trigger]);
  const formComplete = () => {
    setTrigger((prev) => !prev);

  };
  return (
    <>
      <div className="w-full h-full flex justify-center mt-5">
        {countDown !== 0 && <CountDown targetDate={countDown} onComplete={formComplete} />}
        {/* <script src="https://hosting4images.com/popup/popup_0e095e054ee94774d6a496099eb1cf6a.js"></script> */}
        {countDown === 0 && !showScratchCard && <SubscriberInfo successCallback={formComplete} />}
        <div
          className={cn(
            'w-full h-[900px]',
            showScratchCard ? '' : 'hidden'
          )}
        >
          <iframe
            id="coupontools"
            src="https://digicpn.com/p/rptbsd&web=true"
            seamless={true}
            className="border-0 w-full h-full m-0 p-0"
            allow="geolocation"
          ></iframe>
          <AfterGame />
        </div>
      </div>
    </>
  );
}
