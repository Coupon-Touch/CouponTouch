import gamification1 from './assets/gamification1.jpg';
import gamification2 from './assets/gamification2.jpg';
import gamification3 from './assets/gamification3.jpg';
import gamification4 from './assets/gamification4.webp';
import GameCard from './gameCard';

export default function GameSection() {
  return (
    <div className="flex flex-col lg:flex-row w-full items-center px-4 gap-4">
      <GameCard
        image={gamification3}
        name="Scratch & Win"
        height="h-72"
        content="Digital Scratch cards are sent to customers through social media or individual invitations. Customer gets various predetermined REWARDS that can be redeemed online or visit to physical stores."
      ></GameCard>
      <GameCard
        image={gamification1}
        name="Spin Wheel"
        height="h-72"
        content="Unlike Scratch & Win, the REWARDS are visible to the customer. This brings more dedicated customers to this game thereby improving the target audience."
      ></GameCard>
      <GameCard
        image={gamification2}
        name="Slot Machine"
        height="h-72"
        content="This could be a nice tool for in-store promotion. Using geo-fencing, customers are offered slot machine and store promotions can be offered if they win the game."
      ></GameCard>
      <GameCard
        image={gamification4}
        name="Slide Puzzle"
        height="h-72"
        content="Can be used to increase brand recall, especially in fashion stores. Can also be combined with store promotions once the puzzle is solved."
      ></GameCard>
    </div>
  );
}
