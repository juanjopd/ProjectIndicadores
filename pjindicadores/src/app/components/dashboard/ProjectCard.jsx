const ProjectCard = ({ date, title, subTitle, progress, color, timeLeft }) => {
  // Mapeo de colores basado en la imagen
  const bgColors = {
    yellow: 'bg-orange-100',
    blue: 'bg-blue-100',
    green: 'bg-green-100',
    lightblue: 'bg-cyan-100',
    pink: 'bg-red-100',
    purple: 'bg-purple-100',
  };

  const progressColors = {
    yellow: 'bg-orange-400',
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    lightblue: 'bg-cyan-400',
    pink: 'bg-red-400',
    purple: 'bg-purple-500',
  };

  return (
    <div
      className={`${bgColors[color]} p-6 rounded-3xl text-slate-800 shadow-sm flex flex-col justify-between h-64`}
    >
      <div>
        <span className="text-xs font-medium opacity-60">{date}</span>
        <h3 className="text-xl font-bold mt-4">{title}</h3>
        <p className="text-sm opacity-70">{subTitle}</p>
      </div>

      <div>
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-bold tracking-tight">Progress</span>
          <span className="text-sm font-bold">{progress}%</span>
        </div>
        <div className="w-full bg-white/50 rounded-full h-1.5">
          <div
            className={`${progressColors[color]} h-1.5 rounded-full`}
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        <div className="flex justify-between items-center mt-6">
          <div className="flex -space-x-2">
            {/* Avatares de ejemplo */}
            <div className="w-8 h-8 rounded-full border-2 border-white bg-gray-300"></div>
            <div className="w-8 h-8 rounded-full border-2 border-white bg-gray-400 flex items-center justify-center text-[10px] font-bold">
              +
            </div>
          </div>
          <span className="text-sm font-bold text-blue-600">{timeLeft}</span>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
