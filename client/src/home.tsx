import GameSection from './gameSection';
import Navbar from './navbar';

export default function Home() {
  return (
    <>
      <div className="font-mono flex flex-col w-full min-h-screen bg-black text-white items-center">
        <Navbar></Navbar>
        <div className="flex flex-1 flex-col w-full justify-center items-center gap-4 m-4">
          <h2 className="w-full text-center text-2xl lg:text-4xl">
            IMPROVE CUSTOMER ENGAGEMENT THROUGH
          </h2>
          <h4 className="w-full text-center animate-pulse text-3xl lg:text-6xl text-pink-400 -mt-4">
            GAMIFICATION
          </h4>
          <GameSection></GameSection>
        </div>
      </div>

      {/* <Section
        image={gamification1}
        title="SCRATCH & WIN"
        description="Digital Scratch cards are sent to customers through social media or individual invitations. Customer gets various predetermined REWARDS that can be redeemed online or visit to physical stores."
      />
      <Section
        image={gamification2}
        title="SPIN WHEEL"
        description="Unline Scratch & Win, the REWARDS are visible to the customer. This brings more dedicated customers to this game thereby improving the target audience."
      />
      <Section
        image={gamification3}
        title="SLOT MACHINE"
        description="This could be a nice tool for in-store promotion. Using geo-fencing, customers are offered slot machine and store promotions can be offered if they win the game"
      />
      {/* <Section
        image={gamification4}
        title="SLIDE PUZZLE"
        description="Can be used to increase brand recall, especially in fashion stores. Can also be combined with store promotions once the puzzle is solved."
      /> */}

      {/* <div className="flex justify-center w-full bg-black text-white py-20 flex-col items-center">
        <div className="container flex flex-col gap-6">
          <div>
            <span className="text-4xl">Let’s talk......</span>
          </div>
          <div className="flex justify-center">
            <span className="text-pink-600">
              Please fill in the below details and our representative will
              schedule a call with you to discuss further
            </span>
          </div>
        </div>
        <div className="bg-gradient-to-l from-pink-500 to-blue-800 w-full h-36"></div>

        <div className="container flex flex-col items-start mt-10">
          <div className="font-bold">Or drop us a line at </div>
          <div>hello@coupontouch.me</div>
        </div>
      </div> */}
    </>
  );
}

// function Section(props: { image: string; title: string; description: string }) {
//   return (
//     <>
//       <section className="w-full  flex justify-center pb-36">
//         <div className="container ">
//           <div className="flex ">
//             <div>
//               <img src={props.image} />
//             </div>
//             <div className="w-full flex justify-center items-center">
//               <h2 className="text-3xl">{props.title}</h2>
//             </div>
//           </div>
//           <div className="flex justify-end ">
//             <div className="w-full md:w-1/2 flex flex-col gap-4">
//               <div className="bg-black w-full h-1"></div>
//               <div>
//                 <span>{props.description}</span>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>
//     </>
//   );
// }
