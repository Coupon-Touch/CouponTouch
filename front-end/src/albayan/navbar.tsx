import { Button } from '@/components/ui/button';
import { Link, useNavigate } from 'react-router-dom';
import logo from '@/assets/albanian/logo.png';
import { isJWTTokenValid } from '@/jwtUtils';
import albayanLogo from '@/assets/albanian/albayanLogo.svg';

export default function NavBar() {
  const navigate = useNavigate();
  return (
    <nav className="flex flex-row relative w-full h-24 bg-white/80 shadow-sm shadow-[#833b4b] justify-start lg:justify-center items-center">
      <div className="hidden lg:absolute left-0 lg:block h-28 md:w-52 md:h-24 m-0 p-0">
        {/* Replace with your logo */}
        <img src={logo} className="w-full h-full object-contain" />
      </div>
      <img src={albayanLogo} className="w-28 ml-4 lg:ml-0" onClick={() => navigate("/albayan")}></img>
      <div className="absolute right-0">
        {window.location.pathname.endsWith('/adminLogin') && (
          <Link to="/albayan">
            <Button
              className="border-2 border-[#843b4c] hover:bg-[#833b4b] transition-all hover:text-white hover:scale-125 mr-4 md:mr-10"
              variant="ghost"
            >
              Your Campaign
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="2em"
                height="2em"
                className="ml-1"
                viewBox="0 0 24 24"
              >
                <path
                  fill="currentColor"
                  d="M17.923 12.5v-1h3.23v1zm1.085 6.462l-2.585-1.939l.623-.792l2.585 1.938zm-2.039-11.27l-.623-.792l2.585-1.939l.623.793zM5.5 17.962v-3.808H4.462q-.671 0-1.144-.472t-.472-1.143v-1.077q0-.671.472-1.144t1.143-.472h3.731L12.154 7.5v9l-3.962-2.346H6.5v3.808zm5.654-3.243V9.281l-2.681 1.565H4.461q-.23 0-.423.193t-.192.423v1.077q0 .23.192.423t.423.192h4.012zm2.769.17V9.112q.502.465.809 1.222T15.038 12t-.306 1.666t-.809 1.222M7.5 12"
                />
              </svg>
            </Button>
          </Link>
        )}
        {isJWTTokenValid() ? (
          <Button
            variant="ghost"
            onClick={() => {
              localStorage.clear();
              window.location.reload();
            }}
            className="mr-2"
          >
            Logout
          </Button>
        ) : (
          <></>
        )}
      </div>
    </nav>
  );
}
