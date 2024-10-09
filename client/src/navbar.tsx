import logo from './assets/logo.jpg';

export default function Navbar() {
  return (
    <div className="flex flex-row w-full h-40 items-center justify-center gap-3 border-b-[1px] shadow-2xl shadow-white border-white">
      <img className="w-20 lg:w-24" src={logo}></img>
      <div className="flex flex-col h-full items-center justify-center">
        <div className="flex flex-col">
          <h1 className="text-3xl lg:text-5xl">COUPONTOUCH</h1>
          <h1 className="text-xl lg:text-2xl ml-1">LOYALTY SOLUTIONS</h1>
        </div>
      </div>
    </div>
  );
}
