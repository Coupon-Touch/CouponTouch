import { UPDATE_LAST_SCRATCH_TIME } from "@/graphQL/apiRequests";
import { useMutation } from "@apollo/client";
import { useEffect } from "react";

export default function CouponTools({ phone, countryCode }: { phone: string, countryCode: string }) {
  const [updateLastScratchTime] = useMutation(UPDATE_LAST_SCRATCH_TIME);

  useEffect(() => {
    updateLastScratchTime({
      variables: {
        countryCode: countryCode,
        phoneNumber: phone,
      },
      onCompleted(data) {
        data = data.updateLastScratchTime
        console.log(data)
        window.localStorage.setItem("subscriberToken", data.jwtToken);
      },
      onError(error) {
        console.error(error)
      }
    });
  });
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
