import { useEffect, useState } from 'react';
import { decodeJWT } from '@/jwtUtils';
import { useLazyQuery } from '@apollo/client';
import { GET_SUBSCRIBER } from '@/graphQL/apiRequests';
import { useToast } from '@/hooks/use-toast';
import { DateTime } from 'luxon';
import AfterGame from './afterGame';
import CountDown from './countDown';
import PhoneForm, { SubscriberDetails } from './phoneForm';
import CouponTools from './couponTools';
import PaymentPage from '../payment/paymentPage';
import SubscriberInfo from './subscriberInfo';



export default function Coupon() {
  const [openPhoneInfo, setOpenPhoneInfo] = useState(false);
  const [openSubscriberInfo, setOpenSubscriberInfo] = useState(false);
  const [openCountDown, setOpenCountDown] = useState(false);
  const [openCouponTools, setOpenCouponTools] = useState(false);
  const [openAfterGame, setOpenAfterGame] = useState(false);
  const [data, setData] = useState<SubscriberDetails | null>(null);
  const [openPaymentPage, setOpenPaymentPage] = useState(false);

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

  const getTimeLeftToMidnightInDubai = (time: string | null) => {
    if (time === null) return 0;
    return DateTime.fromISO(time).setZone("Asia/Dubai").endOf('day').toMillis();

  };

  const { toast } = useToast();
  const fetchData = async (phone: string, countryCode: string) => {
    return new Promise(resolve => {
      getSubscriber({
        variables: { phoneNumber: `${phone}`, countryCode: `${countryCode}` },
        onCompleted: data => {
          data = data.getSubscriberDetails;
          if (data && data.jwtToken) {
            setData(data);
            localStorage.setItem('token', data.jwtToken);
          } else {
            localStorage.removeItem("token")

            setData(null)
          }
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
    if (data) {
      setData(data);
    }
    const token = getToken();
    if (!token) {
      setOpenPhoneInfo(true);
      setOpenSubscriberInfo(false);
      setOpenPaymentPage(false);
      setOpenCountDown(false);
      setOpenCouponTools(false);
      setOpenAfterGame(false);
      return;
    }
    if (token.subsriberMobile && !token.areDetailsFilled) {
      setOpenPhoneInfo(false);
      setOpenSubscriberInfo(true);
      setOpenPaymentPage(false);
      setOpenCountDown(false);
      setOpenCouponTools(false);
      setOpenAfterGame(false);
      return;
    }
    if (token.areDetailsFilled && !token.isPaidSubscriber) {
      setOpenPhoneInfo(false);
      setOpenSubscriberInfo(false);
      setOpenPaymentPage(true);
      setOpenCountDown(false);
      setOpenCouponTools(false);
      setOpenAfterGame(false);
      return;
    }
    if (token.isPaidSubscriber && token.isWon && !token.collectionDataCollected) {
      setOpenPhoneInfo(false);
      setOpenSubscriberInfo(false);
      setOpenPaymentPage(false);
      setOpenCountDown(false);
      setOpenCouponTools(false);
      setOpenAfterGame(true);
      return;
    }


    const nextScratchTime = getTimeLeftToMidnightInDubai(token.lastScratchTime);
    if (nextScratchTime > new Date().getTime()) {
      setCountDown(nextScratchTime);
      setOpenPhoneInfo(false);
      setOpenSubscriberInfo(false);
      setOpenPaymentPage(false);
      setOpenCountDown(true);
      setOpenCouponTools(false);
      setOpenAfterGame(false);
    } else {
      setCountDown(0);
      setOpenPhoneInfo(false);
      setOpenSubscriberInfo(false);
      setOpenPaymentPage(false);
      setOpenCountDown(false);
      setOpenCouponTools(true);
      setOpenAfterGame(false);
    }
  };
  useEffect(() => {
    (async () => {
      const token = getToken();
      if (token) {
        await fetchData(token.subsriberMobile, token.subscriberCountryCode);
      }
      updateState();
    })();
  }, []);

  return (
    <>
      <div className="w-full h-full flex justify-center mt-5">
        {openPhoneInfo && <PhoneForm successCallback={updateState} />}
        {openCountDown && (
          <CountDown targetDate={countDown} onComplete={updateState} />
        )}
        {data && openSubscriberInfo && (
          <SubscriberInfo subscriber={data} successCallback={updateState} />
        )}
        {openPaymentPage && <PaymentPage successCallback={updateState} />}
        {data && openCouponTools && (
          <CouponTools successCallback={updateState} />
        )}
        {openAfterGame && <AfterGame successCallback={updateState} />}
      </div>

    </>
  );
}
