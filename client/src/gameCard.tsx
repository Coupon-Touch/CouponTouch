export default function GameCard(props: any) {
  return (
    <div className="lg:hover:border-white rounded-lg transition-all lg:hover:scale-105 lg:hover:border-[1px] p-3 pb-5 w-full md:w-1/4 h-full">
      <img className={`w-full ${props.height}`} src={props.image} />
      <div className="w-full">
        <div className="font-bold text-xl mb-2">{props.name}</div>
        <p className="text-gray-700 text-base w-80 text-ellipsis overflow-hidden truncate">
          {props.content}
        </p>
      </div>
      <div className="w-full mt-3">
        <span className="bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
          Read more
        </span>
      </div>
    </div>
  );
}
