import Navbar from './navbar';
import ContactForm from './contactForm';
import gamification1 from '@/assets/gamification1.png';
import gamification2 from '@/assets/gamification2.png';
import gamification3 from '@/assets/gamification3.png';
import gamification4 from '@/assets/gamification4.png';
import { Link, Route, Routes } from 'react-router-dom';
import GameCard from './gameCard';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

const Games = [
  {
    title: 'Scratch & Win',
    description:
      'Digital Scratch cards are sent to customers through social media or individual invitations. Customer gets various predetermined REWARDS that can be redeemed online or visit to physical stores.',
    link: '/scratch',
    image: gamification3,
  },
  {
    title: 'Spin Wheel',
    description:
      'Unline Scratch & Win, the REWARDS are visible to the customer. This brings more dedicated customers to this game thereby improving the target audience.',
    link: '/spin',
    image: gamification1,
  },
  {
    title: 'Slot Machine',
    description:
      'This could be a nice tool for in-store promotion. Using geo-fencing, customers are offered slot machine and store promotions can be offered if they win the game',
    link: '/slot',
    image: gamification2,
  },
  {
    title: 'Slide Puzzle',
    description:
      'Can be used to increase brand recall, especially in fashion stores. Can also be combined with store promotions once the puzzle is solved.',
    link: '/slide',
    image: gamification4,
  },
];
export default function Home() {
  const routeElementRef = useRef<HTMLDivElement>(null); // Step 1: Create a ref for route elements
  const location = useLocation(); // Get current location

  useEffect(() => {
    const bodyElement = document.body;
    const computedStyles = getComputedStyle(bodyElement);
    const bodyColor = computedStyles.backgroundColor;
    bodyElement.style.backgroundColor = 'black';

    return () => {
      bodyElement.style.backgroundColor = bodyColor;
    };
  }, []);
  // write useEffect
  useEffect(() => {
    if (routeElementRef.current) {
      routeElementRef.current.scrollIntoView({ behavior: 'instant' }); // Scroll to the route element on route change
    }
  }, [location]); // Trigger when the location changes

  return (
    <div className="flex flex-col font-jetbrains w-full min-h-screen bg-black text-white items-center">
      <Navbar />
      <div ref={routeElementRef}>
        {' '}
        {/* Step 2: Attach ref here */}
        <Routes>
          <Route path={'/'} element={<Landing />} />
          {Games.map(game => (
            <Route
              key={game.title}
              path={game.link}
              element={
                <Section
                  title={game.title}
                  description={game.description}
                  image={game.image}
                />
              }
            />
          ))}
        </Routes>
      </div>
      <ContactForm />
      <footer className="mt-8 mb-8 text-center text-gray-500 text-sm">
        © {new Date().getFullYear()} CouponTouch Loyalty Solutions. All rights
        reserved. Terms and conditions apply.
      </footer>
    </div>
  );
}

function Landing() {
  return (
    <>
      <div className="flex flex-1 flex-col w-full justify-center md:items-center gap-4">
        <main className="flex flex-col w-96 sm:w-auto md:items-center text-center mt-10">
          <h2 className="text-xl md:text-4xl mx-1 font-">
            IMPROVE CUSTOMER ENGAGEMENT THROUGH
          </h2>
          <h3 className="text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-pink-600">
            GAMIFICATION
          </h3>
          <p className="text-lg md:text-xl w-full max-w-2xl mt-10 text-center">
            Boost loyalty and increase customer retention with our innovative
            gamification solutions.
          </p>
        </main>
        <div className="flex flex-col sm:flex-row w-full justify-center items-center gap-3">
          {Games.map(game => (
            <GameCard
              key={game.title}
              image={game.image}
              name={game.title}
              link={game.link}
              content={game.description}
            />
          ))}
        </div>
      </div>
    </>
  );
}

function Section(props: { title: string; description: string; image: string }) {
  return (
    <>
      <div className="flex-grow flex items-center justify-center p-4">
        <div className="max-w-4xl w-full">
          <Card className="bg-[#0c111b] border-0 shadow-xl">
            <CardContent className="p-6 md:p-10">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className="space-y-4">
                  <h1 className="text-3xl md:text-4xl font-bold text-white leading-tight">
                    {props.title}
                  </h1>
                  <p className="text-lg text-gray-300">{props.description}</p>
                </div>
                <div className="relative">
                  <img
                    className="rounded-lg object-contain"
                    src={props.image}
                    alt={'scratch and win'}
                  />
                  {/* <Smartphone className="w-full h-auto text-gray-800" /> */}
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-center md:justify-start">
              <Link to="/">
                <Button>View All Games</Button>
              </Link>
            </CardFooter>
          </Card>
        </div>
      </div>
    </>
  );
}
