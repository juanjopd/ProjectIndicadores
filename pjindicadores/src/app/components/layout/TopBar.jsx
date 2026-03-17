import { Search, Share2, Plus, Bell } from 'lucide-react';

const TopBar = () => {
  return (
    <header className="h-16 flex items-center justify-between px-2">
      {/* Buscador - Lado Izquierdo */}
      <div className="relative w-80">
        <span className="absolute inset-y-0 left-4 flex items-center text-slate-50">
          <Search size={18} />
        </span>
        <input
          type="text"
          placeholder="Search"
          className="w-full bg-[#1e212b] border-none rounded-full py-2.5 pl-12 pr-4 text-sm text-slate-300 focus:ring-1 focus:ring-slate-600 outline-none placeholder:text-slate-500"
        />
      </div>

      {/* Acciones y Perfil - Lado Derecho */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-5 text-slate-400">
          <button className="hover:text-white transition-colores">
            <Share2 size={20} />
          </button>
          <button className="hover:text-white transition-colors border border-slate-700 rounded-full p-1">
            <Plus size={20} />
          </button>
          <div className="relative cursor-pointer hover:text-white transition-colors">
            <Bell size={20} />
            {/* Punto de notificación opcional */}
            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border-2 border-[#0b0c12]"></span>
          </div>
        </div>

        {/* Avatar del usuario */}
        <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-slate-700 cursor-pointer">
          <img
            src="https://avatar.iran.liara.run/public/30"
            alt="User profile"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </header>
  );
};

export default TopBar;
