import { useState } from 'react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import PaymentIFrame from './iframe'
import Loader from '../loader'


const MasterCardIcon = () => (
  <svg viewBox="0 0 30 19" width="24" height="24" id="master" data-testid="MASTERCARD">
    <g fill="none" fillRule="evenodd">
      <path d="M11.591 9.795a9.18 9.18 0 013.41-7.146A9.158 9.158 0 009.203.591a9.205 9.205 0 000 18.409A9.158 9.158 0 0015 16.942a9.18 9.18 0 01-3.409-7.147" fill="#E71513"></path>
      <path d="M20.796.59A9.158 9.158 0 0015 2.65a9.18 9.18 0 013.409 7.146c0 2.887-1.33 5.46-3.41 7.148A9.163 9.163 0 0020.797 19a9.205 9.205 0 000-18.41" fill="#ED9027"></path>
      <path d="M18.409 9.795a9.18 9.18 0 00-3.41-7.146 9.18 9.18 0 00-3.408 7.146A9.18 9.18 0 0015 16.942a9.18 9.18 0 003.409-7.147" fill="#FE4E18"></path>
    </g>
  </svg>
);
const VisaIcon = () => (
  <svg viewBox="0 0 30 10" width="24" height="24" id="visa" data-testid="VISA">
    <defs>
      <linearGradient x1="16.148%" y1="34.401%" x2="85.832%" y2="66.349%" id="visa__c">
        <stop stopColor="#1434cb"></stop>
      </linearGradient>
      <path id="visa__a" d="M15.475 6.71c-.017-1.344 1.198-2.094 2.113-2.54.94-.458 1.256-.751 1.253-1.16-.008-.627-.75-.903-1.446-.914-1.213-.019-1.918.328-2.479.59L14.48.64c.563-.26 1.604-.485 2.685-.495 2.535 0 4.194 1.251 4.203 3.192.01 2.463-3.407 2.6-3.383 3.7.008.334.326.69 1.024.78.346.047 1.3.082 2.38-.416l.425 1.978a6.471 6.471 0 01-2.26.415c-2.386 0-4.064-1.27-4.078-3.085m10.416 2.914a1.1 1.1 0 01-1.027-.684L21.242.29h2.533l.505 1.393h3.096L27.67.291h2.233l-1.949 9.333h-2.062m.355-2.521l.73-3.505h-2.002l1.272 3.505M12.403 9.624L10.406.291h2.414l1.996 9.333h-2.413m-3.572 0L6.318 3.272 5.3 8.673c-.12.603-.59.951-1.113.951H.079l-.057-.27c.843-.184 1.801-.48 2.382-.795.355-.193.457-.361.573-.82L4.903.291h2.552l3.912 9.333H8.83" />
    </defs>
    <g transform="matrix(1 0 0 -1 0 10)" fill="none">
      <mask id="visa__b" fill="#fff">
        <use xlinkHref="#visa__a" />
      </mask>
      <g mask="url(#visa__b)">
        <path fill="url(#visa__c)" d="M0 18.244l29.44 10.842L36.139 10.9 6.698.057" transform="translate(-3.107 -9.602)" />
      </g>
    </g>
  </svg>
);

const JCBIcon = () => (
  <svg viewBox="0 0 26 19" width="24" height="24" id="JCB" data-testid="JCB">
    <defs>
      <linearGradient x1="-57.527%" y1="50.124%" x2="232.391%" y2="50.124%" id="JCB__a">
        <stop stopColor="#007940" offset="0%"></stop>
        <stop stopColor="#00873F" offset="22.85%"></stop>
        <stop stopColor="#40A737" offset="74.33%"></stop>
        <stop stopColor="#5CB531" offset="100%"></stop>
      </linearGradient>
      <linearGradient x1=".183%" y1="49.96%" x2="100.273%" y2="49.96%" id="JCB__b">
        <stop stopColor="#007940" offset="0%"></stop>
        <stop stopColor="#00873F" offset="22.85%"></stop>
        <stop stopColor="#40A737" offset="74.33%"></stop>
        <stop stopColor="#5CB531" offset="100%"></stop>
      </linearGradient>
      <linearGradient x1="-62.802%" y1="49.858%" x2="253.671%" y2="49.858%" id="JCB__c">
        <stop stopColor="#007940" offset="0%"></stop>
        <stop stopColor="#00873F" offset="22.85%"></stop>
        <stop stopColor="#40A737" offset="74.33%"></stop>
        <stop stopColor="#5CB531" offset="100%"></stop>
      </linearGradient>
      <linearGradient x1=".176%" y1="50.006%" x2="101.808%" y2="50.006%" id="JCB__d">
        <stop stopColor="#1F286F" offset="0%"></stop>
        <stop stopColor="#004E94" offset="47.51%"></stop>
        <stop stopColor="#0066B1" offset="82.61%"></stop>
        <stop stopColor="#006FBC" offset="100%"></stop>
      </linearGradient>
      <linearGradient x1="-.576%" y1="49.914%" x2="98.133%" y2="49.914%" id="JCB__e">
        <stop stopColor="#6C2C2F" offset="0%"></stop>
        <stop stopColor="#882730" offset="17.35%"></stop>
        <stop stopColor="#BE1833" offset="57.31%"></stop>
        <stop stopColor="#DC0436" offset="85.85%"></stop>
        <stop stopColor="#E60039" offset="100%"></stop>
      </linearGradient>
    </defs>
    <g fillRule="nonzero" fill="none">
      <path d="M1.55 11.45h1.808c.051 0 .172-.017.223-.017a.807.807 0 00.637-.81.836.836 0 00-.637-.809c-.051-.017-.155-.017-.223-.017H1.55v1.653z" fill="url(#JCB__a)" transform="translate(17.359 .011)"></path>
      <path d="M3.151.034A3.134 3.134 0 00.017 3.168v3.254h4.425c.104 0 .224 0 .31.018.999.051 1.74.568 1.74 1.463 0 .706-.5 1.309-1.43 1.43v.034c1.016.069 1.79.637 1.79 1.515 0 .947-.86 1.567-1.996 1.567H0v6.37h4.597a3.134 3.134 0 003.134-3.133V.034h-4.58z" fill="url(#JCB__b)" transform="translate(17.359 .011)"></path>
      <path d="M3.995 8.11a.733.733 0 00-.637-.74c-.035 0-.121-.018-.173-.018H1.55v1.515h1.635c.052 0 .155 0 .173-.017a.733.733 0 00.637-.74z" fill="url(#JCB__c)" transform="translate(17.359 .011)"></path>
      <path d="M3.188.046A3.134 3.134 0 00.054 3.179v7.731c.879.43 1.791.706 2.704.706 1.084 0 1.67-.654 1.67-1.55v-3.65h2.686v3.633c0 1.412-.878 2.566-3.857 2.566-1.808 0-3.22-.396-3.22-.396v6.595h4.597a3.134 3.134 0 003.134-3.134V.046h-4.58z" fill="url(#JCB__d)"></path>
      <path d="M11.849.046a3.134 3.134 0 00-3.134 3.133v4.098c.792-.671 2.17-1.102 4.39-.998 1.189.051 2.463.378 2.463.378v1.326c-.637-.327-1.395-.62-2.376-.688-1.687-.121-2.703.706-2.703 2.152 0 1.463 1.016 2.29 2.703 2.152.981-.069 1.739-.379 2.376-.689v1.326s-1.257.327-2.462.379c-2.221.103-3.599-.327-4.39-.999v7.232h4.597a3.134 3.134 0 003.133-3.134V.046H11.85z" fill="url(#JCB__e)"></path>
    </g>
  </svg>
);
const DinersClubIcon = () => (
  <svg viewBox="0 0 30 24" width="24" height="24" id="diners_club" data-testid="DINERS_CLUB_INTERNATIONAL">
    <g fillRule="nonzero" fill="none">
      <path d="M17.575 23.775C24.071 23.806 30 18.475 30 11.991 30 4.899 24.07-.002 17.575 0h-5.59C5.41-.002 0 4.9 0 11.99c0 6.487 5.41 11.816 11.985 11.785h5.59z" fill="#0079BE"></path>
      <path d="M11.973.951C5.981.953 1.125 5.828 1.123 11.845c.002 6.016 4.858 10.89 10.85 10.893 5.994-.002 10.85-4.877 10.851-10.893 0-6.017-4.857-10.892-10.85-10.894zM5.096 11.845a6.915 6.915 0 014.415-6.444v12.886a6.912 6.912 0 01-4.415-6.442zm9.338 6.445V5.4a6.911 6.911 0 010 12.89z" fill="#FFF"></path>
    </g>
  </svg>
);



export default function PaymentPage({ successCallback }: { successCallback: () => void }) {
  const [selectedPlan, setSelectedPlan] = useState("")
  const [paymentLink, setPaymentLink] = useState("");
  const [loading, setLoading] = useState(false);

  const plans = [
    { duration: "One Year", price: "300" },
    { duration: "6 months", price: "200" },
    { duration: "3 months", price: "125" },
  ]

  const handlePayment = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/payment/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${window.localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          amount: parseInt(selectedPlan) * 100,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data: { paymentLink: string } = await response.json();
      setPaymentLink(data.paymentLink);
    } catch (error: unknown) {
        console.error(error);
    } finally {
        setLoading(false);
    }
  }
  return (
    <>
      {loading && <Loader />}
      {paymentLink !== '' ? <PaymentIFrame link={paymentLink} successCallback={successCallback} /> :
        <Card className="w-full max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center text-primary">
              Please choose Subscription Plan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <RadioGroup onValueChange={setSelectedPlan} className="space-y-4">
              {plans.map((plan, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <RadioGroupItem value={plan.price} id={`plan-${index}`} />
                  <Label htmlFor={`plan-${index}`} className="flex-1 p-4 bg-secondary rounded-md">
                    {plan.duration} {plan.price}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </CardContent>
          <CardFooter className="flex flex-col items-center space-y-4">
            <div className="flex flex-wrap justify-center gap-4">
              <MasterCardIcon />
              <JCBIcon />
              <VisaIcon />
              <DinersClubIcon />
            </div>
            <Button className="w-full" disabled={!selectedPlan} onClick={handlePayment}>
              Proceed to Payment

            </Button>
          </CardFooter>
        </Card>
      }

    </>

  )
}