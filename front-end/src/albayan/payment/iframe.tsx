import { useEffect, useState } from 'react';
import Loader from '../loader';
import { useToast } from '@/hooks/use-toast';
import { useLazyQuery } from '@apollo/client';
import { DID_SUBSCRIBER_PAY } from '@/graphQL/apiRequests';

const initialDelay = 10000;
const intervalDurationStartAt = 2000;
const maxIntervalDuration = 15000;

export default function PaymentIFrame({ link, successCallback }: { link: string, successCallback: Function }) {
  const [isLoading, setIsLoading] = useState(true);
  const [didSubscriberPAY] = useLazyQuery(DID_SUBSCRIBER_PAY, { fetchPolicy: 'no-cache' });


  const { toast } = useToast();

  useEffect(() => {
    const token = window.localStorage.getItem('token');
    if (!token) {
      return
    }
    let interval: NodeJS.Timeout;
    let intervalDuration = intervalDurationStartAt;

    const startInterval = () => {
      return setInterval(() => {
        didSubscriberPAY({
          fetchPolicy: 'no-cache',
          onCompleted(data) {
            data = data.getSubscriberDetails
            if (data.isPaid) {
              window.localStorage.setItem("token", data.jwtToken);
              successCallback()
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
            } else {
              toast({
                variant: 'destructive',
                description: `Couldn\'t connect to server. Retrying in ${Math.floor(intervalDuration / 1000)} seconds.`,
              });
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
      clearInterval(interval)
      clearTimeout(initialApitimeout);
    }
  }, [isLoading]);

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
