import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import logo from '@/assets/albanian/logo.png';
import { isJWTTokenValid } from '@/jwtUtils';

export default function NavBar() {
  return (
    <nav className="bg-white/80 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <div className="w-28 h-15 md:w-40 md:h-20 m-0 p-0">
          {/* Replace with your logo */}
          <img src={logo} className="w-full h-full object-contain" />
        </div>
        <div>

          <Link to="/albayan">
            <Button variant="ghost">Campaign</Button>
          </Link>
          {isJWTTokenValid() ?
            <Button variant="ghost" onClick={() => {
              localStorage.clear()
              window.location.reload()
            }}>Logout</Button> : <></>
          }
        </div>

      </div>
    </nav>
  );
}
