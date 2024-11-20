import { DID_SUBSCRIBER_WIN, UPDATE_LAST_SCRATCH_TIME } from "@/graphQL/apiRequests";
import { useToast } from "@/hooks/use-toast";
import { useLazyQuery, useMutation } from "@apollo/client";
import { useEffect, useState } from "react";
import Loader from "../loader";

const initialDelay = 10000;
const intervalDurationStartAt = 2000;
const maxIntervalDuration = 15000;
const updateLastScratchTimeout = 2000;

export default function CouponTools({ successCallback }: { successCallback: () => void }) {
  const [updateLastScratchTime] = useMutation(UPDATE_LAST_SCRATCH_TIME);
  const [didSubscriberWin] = useLazyQuery(DID_SUBSCRIBER_WIN, { fetchPolicy: 'no-cache' });
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = window.localStorage.getItem('token');
    if (!token) {
      return
    }
    const timeout = setTimeout(() => updateLastScratchTime({
      onCompleted(data) {
        data = data.updateLastScratchTime
        if (data) {
          window.localStorage.setItem("token", data.jwtToken);
        }
      },
      onError(error) {
        console.error(error)
      }
    }), updateLastScratchTimeout)

    let interval: NodeJS.Timeout;
    let intervalDuration = intervalDurationStartAt;
    const startInterval = () => {
      return setInterval(() => {
        didSubscriberWin({
          onCompleted(data) {
            data = data.didSubscriberWin
            if (data && data.isWon) {

              window.localStorage.setItem("token", data.jwtToken);
              successCallback()
            } else {
              window.location.reload();
            }
          },
          onError(err) {
            intervalDuration = Math.min(intervalDuration + Math.max(Math.floor(intervalDuration / 2), 1), maxIntervalDuration);
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
    let initialApitimeout: NodeJS.Timeout;
    if (!isLoading) {
      initialApitimeout = setTimeout(() => {
        document.addEventListener("visibilitychange", Listener);
        Listener()
      }, initialDelay);
    }

    return () => {
      document.removeEventListener("visibilitychange", Listener);
      clearTimeout(timeout);
      clearInterval(interval);
      clearTimeout(initialApitimeout);
    }
  }, [isLoading]);


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
