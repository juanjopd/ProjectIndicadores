'use client';

import { useRouter } from 'next/navigation';

import {
  Search,
  Plus,
} from 'lucide-react';

import NotificationBell
from './NotificationBell';

const TopBar = () => {

  const router = useRouter();

  return (

    <header className="h-16 flex items-center justify-between px-2 relative">

      {/* =====================================================
          BUSCADOR
      ===================================================== */}

      <div className="relative w-80">

        <span className="absolute inset-y-0 left-4 flex items-center text-slate-50">

          <Search size={18} />

        </span>

        <input
          type="text"
          placeholder="Buscar indicadores..."
          className="
            w-full
            bg-[#1e212b]
            border-none
            rounded-full
            py-2.5
            pl-12
            pr-4
            text-sm
            text-slate-300
            focus:ring-1
            focus:ring-slate-600
            outline-none
            placeholder:text-slate-500
          "
        />

      </div>

      {/* =====================================================
          ACCIONES
      ===================================================== */}

      <div className="flex items-center gap-6">

        <div className="flex items-center gap-5 text-slate-400">

          {/* PLUS */}

          <button
            className="
              hover:text-white
              transition-colors
              border
              border-slate-700
              rounded-full
              p-1
            "
            onClick={() =>
              router.push(
                '/indicadores/crear'
              )
            }
          >

            <Plus size={20} />

          </button>

          {/* 🔔 NUEVO SISTEMA */}

          <NotificationBell />

        </div>

        {/* =====================================================
            AVATAR
        ===================================================== */}

        <div
          className="
            w-10
            h-10
            rounded-full
            overflow-hidden
            border-2
            border-slate-700
            cursor-pointer
          "
        >

          <img
            src="https://avatar.iran.liara.run/public/30"
            alt="User profile"
            className="
              w-full
              h-full
              object-cover
            "
          />

        </div>

      </div>

    </header>
  );
};

export default TopBar;