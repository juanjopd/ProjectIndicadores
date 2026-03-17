const MessageItem = ({ name, message, date, active }) => (
  <div className="mb-8 group cursor-pointer">
    <div className="flex items-start gap-3">
      <div className="w-10 h-10 rounded-full bg-gray-500 shrink-0"></div>
      <div className="flex-1">
        <div className="flex justify-between items-center mb-1">
          <h4 className="font-bold text-white text-sm">{name}</h4>
          <span className="text-yellow-400 text-lg">☆</span>
        </div>
        <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
          {message}
        </p>
        <span className="text-[10px] text-slate-500 mt-2 block text-right">
          {date}
        </span>
      </div>
    </div>
  </div>
);

export default MessageItem;
