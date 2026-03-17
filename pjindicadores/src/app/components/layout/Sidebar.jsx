'use client';
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  PlusCircle,
  ClipboardList,
  Database,
  Settings,
  LogOut,
} from 'lucide-react';

function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    { id: 'home', icon: Home, label: 'Home', href: '/' },
    {
      id: 'crear',
      icon: PlusCircle,
      label: 'Crear Indicador',
      href: '/indicadores/crear',
    },
    {
      id: 'admin',
      icon: ClipboardList,
      label: 'Administrar',
      href: '/indicadores/admin',
    },
    {
      id: 'datos',
      icon: Database,
      label: 'Cargar Datos',
      href: '/indicadores/datos',
    },
    {
      id: 'settings',
      icon: Settings,
      label: 'Gestión de Entidad',
      href: '/entidades/crear',
    },
  ];

  return (
    <aside className="w-24 bg-[#1e212b] border-r border-slate-800 flex flex-col items-center py-10 gap-8 h-screen sticky top-0 z-50">
      {/* Logo corporativo (Fuente [1, 2]) */}
      <div className="w-12 h-12 bg-slate-800 rounded-2xl flex items-center justify-center text-blue-500 font-black italic text-xl mb-6 shadow-inner">
        EN
      </div>

      <nav className="flex flex-col gap-6 w-full px-4">
        {navItems.map((item) => {
          // Lógica para detectar si la ruta está activa
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.id}
              href={item.href}
              title={item.label}
              className={`group relative p-4 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                isActive
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/40 scale-110'
                  : 'text-slate-500 hover:bg-slate-800/50 hover:text-slate-200'
              }`}
            >
              <item.icon size={22} strokeWidth={isActive ? 2.5 : 2} />

              {/* Tooltip opcional para mejorar la UX */}
              <span className="absolute left-24 bg-[#12141d] text-white text-[10px] font-black uppercase px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none border border-slate-800 whitespace-nowrap z-50 shadow-2xl">
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Acción de salida (Redirige al Login sin barras) */}
      <div className="mt-auto pb-4">
        <Link
          href="/login"
          className="p-4 text-slate-600 hover:text-red-500 transition-all flex items-center justify-center hover:bg-red-900/10 rounded-2xl"
        >
          <LogOut size={22} />
        </Link>
      </div>
    </aside>
  );
}
export default Sidebar;
