import { useEffect } from "react"

export default function Loader() {
  useEffect(() => {
    // disable body scroll
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    }
  }, [])
  return <>
    <div className="w-full h-full bg-black/40 top-0 left-0 fixed z-10 flex justify-center items-center">

      <div className="loader w-11 h-11 bg-gradient-conic"></div>
    </div>
  </>
}