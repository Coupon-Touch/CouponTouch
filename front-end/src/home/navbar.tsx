import logo from '@/assets/logo.png';
import { Button } from '../components/ui/button';

export default function Navbar() {
  return (
    <div className="flex flex-col sm:flex-row w-full h-40 items-center md:justify-between gap-3 shadow-2xl shadow-slate-600 px-4 lg:px-8 text-white border-b-[1px] border-b-slate-100">
      {/* Logo */}
      <div className="flex items-center gap-3 mt-4 md:mt-0">
        <img className="w-12 lg:w-[3.75rem]" src={logo} alt="Logo" />
        <div className="flex flex-col h-full items-center justify-center">
          <div className="flex flex-col">
            <h1 className="text-3xl lg:text-4xl font-medium">CouponTouch</h1>
            <h1 className="text-xl lg:text-2xl font-extralight text">
              Loyalty Solutions
            </h1>
          </div>
        </div>
      </div>

      {/* Contact Us Button */}
      <ContactUs />
    </div>
  );
}

export function ContactUs() {
  return (
    <a href="#contactUs">
      <Button
        type="submit"
        className="w-full bg-orange-500 hover:bg-orange-600  text-white text-lg lg:text-xl py-2 px-4 lg:py-3 lg:px-6 transition-all"
      >
        Contact Us
      </Button>
    </a>
  );
}
