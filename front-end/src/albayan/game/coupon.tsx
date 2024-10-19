import { useEffect, useState } from 'react';
import SubscriberInfo from './subscriberInfo';
import { cn } from '@/lib/utils';
import AfterGame from './afterGame';

export default function Coupon() {
  const [isNewUser, setIsNewUser] = useState(false); // tells if the user has session or not
  const [isSubscribed, setIsSubscribed] = useState(false); // tells if the user is subscribed
  useEffect(() => {
    // TODO: store these in JWT token dont get it from local storage
    const isNewUser = Boolean(window.localStorage.getItem('isNewUser'));
    setIsNewUser(!isNewUser);
    setIsSubscribed(Boolean(window.localStorage.getItem('isSubscribed')));
  });
  const handleMobileSubmit = () => {
    setIsNewUser(false);

    //TODO: post the values to the server and get true or false if the user is subscribed
    const isSubscribed = true;
    window.localStorage.setItem('isNewUser', 'true'); // TODO: store in JWT Token

    if (isSubscribed) {
      // TODO: store in JWT Token
      window.localStorage.setItem('isSubscribed', 'true');
      setIsSubscribed(true);
    } else {
      setIsSubscribed(false);
    }
  };
  return (
    <>
      <div className="w-full h-full flex justify-center mt-5">
        {/* <script src="https://hosting4images.com/popup/popup_0e095e054ee94774d6a496099eb1cf6a.js"></script> */}
        {isNewUser && <SubscriberInfo successCallback={handleMobileSubmit} />}
        <div
          className={cn('w-full', !isNewUser && isSubscribed ? '' : 'hidden')}
        >
          <iframe
            id="coupontools"
            src="https://digicpn.com/p/rptbsd&web=true"
            seamless={true}
            className="border-0 w-full h-screen m-0 p-0"
          ></iframe>
          <AfterGame />
        </div>
      </div>
    </>
  );
}
