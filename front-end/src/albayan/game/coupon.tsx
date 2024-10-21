import { useEffect, useState } from 'react';
import SubscriberInfo from './subscriberInfo';
import { cn } from '@/lib/utils';
import AfterGame from './afterGame';
import { add } from 'date-fns';
import { decodeJWT } from '@/jwtUtils';
import CountDown from './countDown';
import PhoneForm, { SubscriberDetails } from './phoneForm';




export default function Coupon() {
  const [askPhone, setAskPhone] = useState(true)
  const [data, setData] = useState<SubscriberDetails | null>(null)
  const [isSubscribed, setIsSubscribed] = useState(false);

  const [countDown, setCountDown] = useState(0)
  const [trigger, setTrigger] = useState(false);



  useEffect(() => {
    // TODO: store these in JWT token dont get it from local storage

  }, [trigger]);

  const phoneSubmit = (data: SubscriberDetails) => {
    if (data) {
      setData(data)
    }
    setAskPhone(false)
    const token = decodeJWT(data.jwtToken);
    if (token && token.isSubscriber) {
      setIsSubscribed(true)
    } else {
      setIsSubscribed(false)
    }
  };

  const subscriberInfoSubmit = (data) => {

  }

  return (
    <>
      <div className="w-full h-full flex justify-center mt-5">
        {askPhone && <PhoneForm successCallback={phoneSubmit} />}
        {countDown !== 0 && <CountDown targetDate={countDown} onComplete={() => setTrigger((prev) => !prev)} />}
        {data && !askPhone && !isSubscribed && <SubscriberInfo subscriber={data} successCallback={subscriberInfoSubmit} />}
        <div
          className={cn(
            'w-full h-[900px]',
            isSubscribed ? '' : 'hidden'
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
