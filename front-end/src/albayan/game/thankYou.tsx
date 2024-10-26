import { useEffect } from "react"

export default function ThankYou() {

  useEffect(() => {
    localStorage.setItem('alreadyShownThankyou', 'true');
    const timeout = setTimeout(() => {
      window.location.reload()
    }, 3000);
    return () => {
      clearTimeout(timeout)
    }
  }, [])
  return (
    <div>
      <h1>Thank you for playing!</h1>
      <p>Check your email for your coupon code</p>
    </div>
  )
}