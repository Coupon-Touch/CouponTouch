import { useEffect, useState } from 'react';
import SubscriberInfo from './subscriberInfo';
import AfterGame from './afterGame';
import { decodeJWT } from '@/jwtUtils';
import CountDown from './countDown';
import PhoneForm, { SubscriberDetails } from './phoneForm';
import CouponTools from './couponTools';
import { useLazyQuery } from '@apollo/client';
import { GET_SUBSCRIBER } from '@/graphQL/apiRequests';
import { useToast } from '@/hooks/use-toast';
import ThankYou from './thankYou';

export default function Coupon() {
  const [openPhoneInfo, setOpenPhoneInfo] = useState(false);
  const [openSubscriberInfo, setOpenSubscriberInfo] = useState(false);
  const [openCountDown, setOpenCountDown] = useState(false);
  const [openCouponTools, setOpenCouponTools] = useState(false);
  const [openAfterGame, setOpenAfterGame] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);
  const [data, setData] = useState<SubscriberDetails | null>(null);
  const [collectionDataCollected, setCollectionDataCollected] = useState(false);

  const [countDown, setCountDown] = useState(0);

  const [getSubscriber] = useLazyQuery(GET_SUBSCRIBER);

  const getToken = () => {
    const token = window.localStorage.getItem('token');
    if (token) {
      const decoded = decodeJWT(token);
      return decoded;
    }
    return null;
  };

  const getNextScratchTime = (time: number | null) => {
    if (time === 0 || time === null) return new Date().getTime();
    const lastScratch = new Date(time);
    lastScratch.setDate(lastScratch.getDate());
    lastScratch.setHours(24, 0, 0, 0);
    return lastScratch.getTime();
  };

  const { toast } = useToast();
  const fetchData = async (phone: string, countryCode: string) => {
    return new Promise((resolve) => {
      getSubscriber({
        variables: { phoneNumber: `${phone}`, countryCode: `${countryCode}` },
        onCompleted: data => {
          data = data.getSubscriberDetails;
          setData(data);
          localStorage.setItem(
            'token',
            data.jwtToken
          );
          resolve(data);
        },
        onError: () => {
          resolve(0);
          toast({
            variant: 'destructive',
            description: 'An error occurred. Please try again later.',
          });
        },
      });
    });

  };
  const updateState = (data?: SubscriberDetails | null) => {
    const alreadyShownThankyou = localStorage.getItem('alreadyShownThankyou');
    if (data) {
      setData(data);
    }
    const token = getToken();
    if (!token) {
      setOpenPhoneInfo(true);
      setOpenSubscriberInfo(false);
      setOpenCountDown(false);
      setOpenCouponTools(false);
      setOpenAfterGame(false);
      setShowThankYou(false);
      return;
    }
    setCollectionDataCollected(token.collectionDataCollected);
    if (token.subsriberMobile && !token.isSubscriber) {
      setOpenPhoneInfo(false);
      setOpenSubscriberInfo(true);
      setOpenCountDown(false);
      setOpenCouponTools(false);
      setOpenAfterGame(false);
      setShowThankYou(false);
      return;
    }
    if (token.isWon && !token.collectionDataCollected) {
      setOpenPhoneInfo(false);
      setOpenSubscriberInfo(false);
      setOpenCountDown(false);
      setOpenCouponTools(false);
      setOpenAfterGame(true);
      setShowThankYou(false);

      return;
    }
    if (token.isWon && token.collectionDataCollected && alreadyShownThankyou !== 'true') {
      setOpenPhoneInfo(false);
      setOpenSubscriberInfo(false);
      setOpenCountDown(false);
      setOpenCouponTools(false);
      setOpenAfterGame(false);
      setShowThankYou(true);

      return;
    }

    const nextScratchTime = getNextScratchTime(token.lastScratchTime);
    if (nextScratchTime > new Date().getTime()) {
      setCountDown(nextScratchTime);
      setOpenPhoneInfo(false);
      setOpenSubscriberInfo(false);
      setOpenCountDown(true);
      setOpenCouponTools(false);
      setOpenAfterGame(false);
      setShowThankYou(false);
    } else {
      setCountDown(0);
      setOpenPhoneInfo(false);
      setOpenSubscriberInfo(false);
      setOpenCountDown(false);
      setOpenCouponTools(true);
      setOpenAfterGame(false);
      setShowThankYou(false);
    }
  };
  useEffect(() => {
    (async () => {
      const token = getToken();
      if (token) {
        await fetchData(token.subsriberMobile, token.subscriberCountryCode);
      }
      updateState();
    })()

  }, []);

  return (
    <>
      <div className="w-full h-full flex justify-center mt-5">
        {openPhoneInfo && <PhoneForm successCallback={updateState} />}
        {openCountDown && (
          <CountDown targetDate={countDown} onComplete={updateState} collectionDataCollected={collectionDataCollected} />
        )}
        {data && openSubscriberInfo && (
          <SubscriberInfo subscriber={data} successCallback={updateState} />
        )}
        {data && openCouponTools && (
          <CouponTools successCallback={updateState} />
        )}
        {openAfterGame && <AfterGame successCallback={updateState} />}
        {showThankYou &&
          <ThankYou />}
      </div>
    </>
  );
}
