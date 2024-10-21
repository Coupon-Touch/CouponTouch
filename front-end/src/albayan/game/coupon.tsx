import { useEffect, useState } from 'react';
import SubscriberInfo, { SubscriberUpdate } from './subscriberInfo';
import AfterGame from './afterGame';
import { decodeJWT } from '@/jwtUtils';
import CountDown from './countDown';
import PhoneForm, { SubscriberDetails } from './phoneForm';
import CouponTools from './couponTools';
import { useLazyQuery } from '@apollo/client';
import { GET_SUBSCRIBER } from '@/graphQL/apiRequests';
import { useToast } from '@/hooks/use-toast';




export default function Coupon() {
  const [askPhone, setAskPhone] = useState(true)
  const [data, setData] = useState<SubscriberDetails | null>(null)
  const [isSubscribed, setIsSubscribed] = useState(false);

  const [countDown, setCountDown] = useState(0)
  const [trigger, setTrigger] = useState(false);

  const [getSubscriber] = useLazyQuery(GET_SUBSCRIBER)
  const updateCountDown = () => {
    const token = window.localStorage.getItem('subscriberToken');
    if (token) {
      const decoded = decodeJWT(token);

      if (decoded) {
        if (decoded.subsriberMobile) {
          setAskPhone(false)
        }
        if (decoded.isSubscriber) {
          setIsSubscribed(true);
        }
        const lastScratchTime = decoded.lastScratchTime;
        if (lastScratchTime === null || lastScratchTime === 0) {
          setCountDown(0)
        } else {

          console.log(lastScratchTime + 24 * 60 * 60 * 1000)
          setCountDown(lastScratchTime + 24 * 60 * 60 * 1000)
        }
      }
    }
  }
  const { toast } = useToast();
  useEffect(() => {
    const token = window.localStorage.getItem('subscriberToken');
    if (token) {
      const decoded = decodeJWT(token);
      if (decoded) {
        if (decoded.subsriberMobile) {
          setAskPhone(false)
        }
        if (decoded.isSubscriber) {
          setIsSubscribed(true);
        } else if (decoded.subsriberMobile) {
          getSubscriber({
            variables: { phoneNumber: `${decoded.subsriberMobile}`, countryCode: `${decoded.subscriberCountryCode}` },
            onCompleted: (data) => {
              setData(data.getSubscriberDetails)
            },
            onError: () => {
              toast({
                variant: 'destructive',
                description: 'An error occurred. Please try again later.',
              })
            }
          })
        } else {
          updateCountDown()
        }

      }
    }
  }, []);

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
    updateCountDown()
  };

  const subscriberInfoSubmit = (data: SubscriberUpdate) => {
    if (data.jwtToken) {
      const token = decodeJWT(data.jwtToken);
      if (token && token.isSubscriber) {
        setIsSubscribed(true)
      } else {
        setIsSubscribed(false)
      }
    }
    updateCountDown()
  }

  return (
    <>
      <div className="w-full h-full flex justify-center mt-5">
        {askPhone && <PhoneForm successCallback={phoneSubmit} />}
        {countDown !== 0 && <CountDown targetDate={countDown} onComplete={() => setTrigger((prev) => !prev)} />}
        {data && !askPhone && !isSubscribed && <SubscriberInfo subscriber={data} successCallback={subscriberInfoSubmit} />}
        {data && countDown === 0 && !askPhone && isSubscribed && <CouponTools phone={data?.mobile} countryCode={data?.countryCode} />}
        <AfterGame />
      </div>
    </>
  );
}
