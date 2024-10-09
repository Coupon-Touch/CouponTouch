import logo from './assets/logo.webp'
import gamification1 from './assets/gamification1.webp'
import gamification2 from './assets/gamification2.webp'
import gamification3 from './assets/gamification3.webp'
import gamification4 from './assets/gamification4.webp'

export default function Home() {
  return <>
    <div className='w-full bg-black text-white flex flex-col gap-8 items-center pb-20'>
      <div className='container flex flex-col gap-16'>


        <div className='flex w-full justify-between'>
          <div><img src={logo} /></div>
          <div className='gap-4 w-full flex flex-col items-center justify-end'>
            <h1 className='text-4xl'>COUPONTOUCH</h1>
            <h2 className='text-2xl'>LOYALTY SOLUTIONS</h2>
          </div>
        </div>
        <div className='w-full flex flex-col justify-center items-center gap-4 '>
          <h2 className='text-2xl'>Improve Customer engagement through</h2>
          <h4 className='text-pink-400 text-xl'>GAMIFICATION</h4>
        </div>
        <div className='flex justify-between mx-10 flex-col sm:flex-row items-center gap-10 sm:gap-0'>
          <div><img src={gamification1} /></div>
          <div><img src={gamification2} /></div>
          <div><img src={gamification3} /></div>
          <div><img src={gamification4} /></div>
        </div>
      </div>

    </div>

    <Section image={gamification1} title="SCRATCH & WIN" description='Digital Scratch cards are sent to customers through social media or individual invitations. Customer gets various predetermined REWARDS that can be redeemed online or visit to physical stores.' />
    <Section image={gamification2} title="SPIN WHEEL" description='Unline Scratch & Win, the REWARDS are visible to the customer. This brings more dedicated customers to this game thereby improving the target audience.' />
    <Section image={gamification3} title="SLOT MACHINE" description='This could be a nice tool for in-store promotion. Using geo-fencing, customers are offered slot machine and store promotions can be offered if they win the game' />
    <Section image={gamification4} title="SLIDE PUZZLE" description='Can be used to increase brand recall, especially in fashion stores. Can also be combined with store promotions once the puzzle is solved.' />

    <div className='flex justify-center w-full bg-black text-white py-20 flex-col items-center'>
      <div className="container flex flex-col gap-6">
        <div>
          <span className='text-4xl'>Let’s talk......</span>
        </div>
        <div className='flex justify-center'>

          <span className='text-pink-600'>Please fill in the below details and our representative will schedule a call with you to discuss further</span>
        </div>
      </div>
      <div className='bg-gradient-to-l from-pink-500 to-blue-800 w-full h-36'>
      </div>

      <div className="container flex flex-col items-start mt-10">
        <div className='font-bold'>Or drop us a line at  </div>
        <div>hello@coupontouch.me</div>
      </div>

    </div>
  </>
}

function Section(props: { image: string, title: string, description: string }) {
  return <>
    <section className='w-full  flex justify-center pb-36'>
      <div className='container '>

        <div className='flex '>
          <div><img src={props.image} /></div>
          <div className='w-full flex justify-center items-center'>
            <h2 className='text-3xl'>{props.title}</h2>
          </div>
        </div>
        <div className='flex justify-end '>
          <div className='w-full md:w-1/2 flex flex-col gap-4'>
            <div className='bg-black w-full h-1'></div>
            <div>
              <span>{props.description}</span>
            </div>
          </div>
        </div>
      </div>

    </section>
  </>
}