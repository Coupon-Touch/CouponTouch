import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"
import logo from "@/assets/albanian/logo.png"

export default function NavBar() {
  return <nav className="bg-white/80 shadow-md">
    <div className="container mx-auto flex justify-between items-center">
      <div className="w-40 h-20 m-0 p-0">
        {/* Replace with your logo */}
        <img src={logo} className='w-full h-full object-contain' />
      </div>
      <Link to="/albanian">
        <Button variant="outline">
          Return to Campaign
        </Button>
      </Link>
    </div>
  </nav>
}