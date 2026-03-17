'use client';
import Swal from 'sweetalert2';
import LiveDate from '../components/dashboard/LiveDate';
import IndicatorCardDashboard from '../components/Indicadores/IndicatorCardDashboard';
import { inicialIndicadores } from '@/data/mockData';

export default function DashboardMain() {
  const handleOpenModal = (indicador) => {
    Swal.fire({
      title:
        '<span class="text-white font-black uppercase italic text-sm">Carta de Indicador</span>',
      background: '#1e212b',
      width: '500px',
      showConfirmButton: true,
      confirmButtonText: 'Entendido',
      confirmButtonColor: '#2563eb',
      customClass: { popup: 'rounded-[40px] border border-slate-800' },
      html: `
        <div class="text-left p-2">
          <div class="bg-[#12141d] p-4 rounded-3xl border border-slate-800 mb-6">
            <span class="text-[10px] text-blue-500 font-black uppercase block mb-1">Nombre:</span>
            <p class="text-white text-xs font-bold leading-relaxed uppercase">${indicador.nombre}</p>
          </div>
          <div class="space-y-4 px-2">
            <p class="text-[11px] text-slate-400"><strong class="text-slate-200">Responsable:</strong> ${indicador.responsable || 'Alejandro Ramírez'}</p>
            <p class="text-[11px] text-slate-400"><strong class="text-slate-200">Proceso:</strong> ${indicador.entidad}</p>
            <div class="flex justify-between items-center bg-slate-800/30 p-3 rounded-2xl border border-slate-800">
               <span class="text-green-500 font-black text-[10px]">META: ${indicador.meta}%</span>
               <span class="text-blue-400 font-black text-[10px]">TENDENCIA: AUMENTAR</span>
            </div>
          </div>
        </div>
      `,
    });
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-full p-2">
      <main className="flex-1 flex flex-col gap-6 overflow-hidden">
        {/* CABECERA MEJORADA */}
        <section className="bg-[#1e212b] rounded-[40px] p-10 border border-slate-800 shadow-2xl">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h1 className="text-4xl font-black text-white italic tracking-tighter uppercase mb-4">
                Total Indicadores
              </h1>
              <div className="flex gap-10">
                <div>
                  <span className="block text-2xl font-black text-white">
                    45
                  </span>
                  <span className="text-[10px] text-green-500 font-black uppercase opacity-60 tracking-widest">
                    Cumplen
                  </span>
                </div>
                <div>
                  <span className="block text-2xl font-black text-white">
                    24
                  </span>
                  <span className="text-[10px] text-yellow-500 font-black uppercase opacity-60 tracking-widest">
                    En riesgo
                  </span>
                </div>
                <div>
                  <span className="block text-2xl font-black text-white">
                    62
                  </span>
                  <span className="text-[10px] text-red-500 font-black uppercase opacity-60 tracking-widest">
                    Crítico
                  </span>
                </div>
              </div>
            </div>
            <LiveDate />
          </div>

          {/* GRID DE TARJETAS */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 overflow-y-auto max-h-[55vh] pr-4 custom-scrollbar">
            {inicialIndicadores.map((ind) => (
              <IndicatorCardDashboard
                key={ind.id}
                indicador={ind}
                onClick={handleOpenModal}
              />
            ))}
          </div>
        </section>
      </main>

      {/* ÚLTIMAS ACTUALIZACIONES MEJORADAS */}
      <aside className="w-full lg:w-100 bg-[#1e212b] rounded-[40px] p-8 border border-slate-800 shadow-2xl overflow-y-auto">
        <h2 className="text-white font-black uppercase italic text-lg mb-8 tracking-tighter border-b border-slate-800 pb-4 flex justify-between items-center">
          Últimas Actualizaciones
          <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
        </h2>
        <div className="space-y-6">
          {[1, 2, 6].map((i) => (
            <div
              key={i}
              className="flex gap-4 p-4 bg-[#12141d] rounded-3xl border border-slate-800/50 hover:bg-slate-800/30 transition-all cursor-default"
            >
              <div className="w-10 h-10 rounded-full bg-slate-800 border-2 border-slate-700 shrink-0" />
              <div>
                <p className="text-white text-[11px] font-black uppercase mb-1">
                  Sistema TI
                </p>
                <p className="text-slate-500 text-[10px] leading-relaxed line-clamp-2">
                  Se ha registrado el cierre de auditoría para el mes de
                  Diciembre con un cumplimiento del 92%.
                </p>
                <span className="text-[9px] text-blue-500 font-bold uppercase mt-2 block">
                  Hace 5 minutos
                </span>
              </div>
            </div>
          ))}
        </div>
      </aside>
    </div>
  );
}
