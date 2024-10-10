import logo from '@/assets/logo.png';
import { Button } from '../components/ui/button';

export default function Navbar() {
  return (
    <div className="flex flex-col sm:flex-row w-full h-40 items-center justify-between gap-3 shadow-2xl px-4 lg:px-8 text-white">
      {/* Logo */}
      <div className="flex items-center gap-3">
        <img className="w-20 lg:w-24" src={logo} alt="Logo" />
        <div className="flex flex-col h-full items-center justify-center">
          <div className="flex flex-col">
            <h1 className="text-3xl lg:text-5xl">CouponTouch</h1>
            <h1 className="text-xl lg:text-2xl ml-1">LOYALTY SOLUTIONS</h1>
          </div>
        </div>
      </div>

      {/* Contact Us Button */}
      <ContactUs />
    </div>
  );
}

export function ContactUs() {
  return <>
    <a href="#contactUs">

      <Button type="submit" className=" bg-orange-500 hover:bg-orange-600  text-white text-lg lg:text-xl py-2 px-4 lg:py-3 lg:px-6 transition-all">
        Contact Us
      </Button>
    </a>
  </>
}