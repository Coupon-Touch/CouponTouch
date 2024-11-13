import { DID_SUBSCRIBER_WIN, UPDATE_LAST_SCRATCH_TIME } from "@/graphQL/apiRequests";
import { useToast } from "@/hooks/use-toast";
import { useLazyQuery, useMutation } from "@apollo/client";
import { useEffect, useState } from "react";
import Loader from "../loader";


export default function CouponTools({ successCallback }: { successCallback: () => void }) {
  const [updateLastScratchTime] = useMutation(UPDATE_LAST_SCRATCH_TIME);
  const [didSubscriberWin] = useLazyQuery(DID_SUBSCRIBER_WIN, { fetchPolicy: 'no-cache' });
  const { toast } = useToast();

  useEffect(() => {
    const token = window.localStorage.getItem('token');
    if (!token) {
      return
    }
    const timeout = setTimeout(() => updateLastScratchTime({
      onCompleted(data) {
        data = data.updateLastScratchTime
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

  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className={'w-full h-[900px]'}>
      {isLoading && (
        <Loader />
      )}
      <iframe
        id="coupontools"
        src="https://digicpn.com/p/rptbsd&web=true"
        onLoad={() => setIsLoading(false)}
        seamless={true}
        className="border-0 w-full h-full m-0 p-0"
        allow="geolocation"
        style={{ visibility: isLoading ? 'hidden' : 'visible' }}
      ></iframe>
    </div>
  );
}
