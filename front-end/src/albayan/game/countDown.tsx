'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';

type CountdownProps = {
  targetDate?: number;
  onComplete?: () => void;
};

const getNewTimeLeft = (target: number) => {
  const now = new Date().getTime();
  const difference = target - now;

  if (difference > 0) {
    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);
    return { days, hours, minutes, seconds };
  } else {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 }; // Return 0 time left
  }
};
export default function CountDown({
  targetDate = new Date().getTime(),
  onComplete,
}: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState(getNewTimeLeft(targetDate));
  useEffect(() => {
    const target = new Date(targetDate).getTime();

    const interval = setInterval(() => {
      const newTimeLeft = getNewTimeLeft(target);
      setTimeLeft(newTimeLeft); // Update the state
      if (
        newTimeLeft.days === 0 &&
        newTimeLeft.hours === 0 &&
        newTimeLeft.minutes === 0 &&
        newTimeLeft.seconds === 0
      ) {
        clearInterval(interval); // Clear the interval when time is up
        if (onComplete) onComplete();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate]); // Ensure targetDate is watched for changes

  return (
    <Card className="w-full lg:max-w-md mx-auto">
      <CardContent className="p-6">
        <h2 className="text-2xl font-bold text-center mb-4">
          You've reached your coupon limit for the day. <br></br>{' '}
          <span className="font-extralight text-lg">See you again in</span>
        </h2>
        <div className="grid grid-cols-4 gap-4 text-center">
          <div className="bg-primary/10 rounded-lg p-3">
            <div className="text-3xl font-bold">{timeLeft.days}</div>
            <div className="text-sm text-muted-foreground">Days</div>
          </div>
          <div className="bg-primary/10 rounded-lg p-3">
            <div className="text-3xl font-bold">{timeLeft.hours}</div>
            <div className="text-sm text-muted-foreground">Hours</div>
          </div>
          <div className="bg-primary/10 rounded-lg p-3">
            <div className="text-3xl font-bold">{timeLeft.minutes}</div>
            <div className="text-sm text-muted-foreground">Minutes</div>
          </div>
          <div className="bg-primary/10 rounded-lg p-3">
            <div className="text-3xl font-bold">{timeLeft.seconds}</div>
            <div className="text-sm text-muted-foreground">Seconds</div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="text-center">
        <p className="text-muted-foreground w-full">
          Change mobile number?{' '}
          <span
            className="text-blue-500 hover:underline cursor-pointer text-center w-full"
            onClick={() => {
              window.localStorage.clear();
              window.location.reload();
            }}
          >
            Reset
          </span>
        </p>
      </CardFooter>
    </Card>
  );
}
