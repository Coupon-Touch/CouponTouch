import { DID_SUBSCRIBER_WIN, UPDATE_LAST_SCRATCH_TIME } from "@/graphQL/apiRequests";
import { useToast } from "@/hooks/use-toast";
import { decodeJWT } from "@/jwtUtils";
import { useLazyQuery, useMutation } from "@apollo/client";
import { useEffect } from "react";


export default function CouponTools({ successCallback }: { successCallback: () => void }) {
  const [updateLastScratchTime] = useMutation(UPDATE_LAST_SCRATCH_TIME);
  const [didSubscriberWin] = useLazyQuery(DID_SUBSCRIBER_WIN, { fetchPolicy: 'no-cache' });
  const { toast } = useToast();

  useEffect(() => {
    const token = window.localStorage.getItem('token');
    let phone: string, countryCode: string
    if (token) {
      const decoded = decodeJWT(token);
      phone = decoded.subsriberMobile
      countryCode = decoded.subscriberCountryCode

    }
    const timeout = setTimeout(() => updateLastScratchTime({
      variables: {
        countryCode: countryCode,
        phoneNumber: phone,
      },
      onCompleted(data) {
        data = data.updateLastScratchTime
        console.log(data)
        window.localStorage.setItem("token", data.jwtToken);
      },
      onError(error) {
        console.error(error)
      }
    }), 1000)

    let interval: NodeJS.Timeout;
    let intervalDuration = 5000;
    const maxIntervalDuration = 60000;
    const startInterval = () => {
      return setInterval(() => {
        didSubscriberWin({
          fetchPolicy: 'no-cache',
          onCompleted(data) {
            data = data.didSubscriberWin
            if (data.isWon) {
              window.localStorage.setItem("token", data.jwtToken);
              successCallback()
            }
          },
          onError(err) {
            intervalDuration = Math.min(intervalDuration * 2, maxIntervalDuration);
            if (intervalDuration === maxIntervalDuration) {
              toast({
                variant: 'destructive',
                description: 'Something went wrong. Please Reload the Page.',
              });
              clearInterval(interval);
            }
            console.error(err)
            clearInterval(interval);
            interval = startInterval();
          }
        })
      }, intervalDuration);
    }
    const Listener = () => {
      if (document.visibilityState === "hidden") {
        clearInterval(interval); // Stop the interval when the page is not visible
      } else if (document.visibilityState === "visible") {
        interval = startInterval(); // Restart the interval when the page becomes visible
      }
    }
    Listener()
    document.addEventListener("visibilitychange", Listener);

    return () => {
      document.removeEventListener("visibilitychange", Listener);
      clearTimeout(timeout);
      clearInterval(interval)
    }
  }, []);
  return (
    <div className={'w-full h-[900px]'}>
      <iframe
        id="coupontools"
        src="https://digicpn.com/p/rptbsd&web=true"
        seamless={true}
        className="border-0 w-full h-full m-0 p-0"
        allow="geolocation"
      ></iframe>
    </div>
  );
}
