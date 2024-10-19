import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';

export default function GameCard(props: {
  className?: string;
  image: string;
  content: string;
  name: string;
  link: string;
}) {
  return (
    <Link
      to={props.link}
      className={cn(
        `rounded-lg transition-all w-80 mt-1 hover:scale-105 hover:border-[1px] p-3 pb-5 bg-gray-900/70 backdrop-blur-lg border-gray-800 cursor-pointer`,
        props.className
      )}
    >
        <div className="h-72 flex justify-center">
          <img
            className="rounded-lg object-contain"
            src={props.image}
            alt={props.name}
          />
        </div>
        <div className="w-full mt-3">
          <div className="font-bold text-xl mb-2">{props.name}</div>
          <p className="text-gray-700 text-base text-ellipsis overflow-hidden truncate">
            {props.content}
          </p>
        </div>
        <div className="w-full mt-3">
          <Link to={props.link}>
            <span className="bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2 hover:bg-gray-300 cursor-pointer">
              Read more
            </span>
          </Link>
        </div>
    </Link>
  );
}
