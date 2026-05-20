'use client';

import { useEffect, useState, useMemo } from 'react';

import Swal from 'sweetalert2';

import LiveDate from '../components/dashboard/LiveDate';

import IndicatorCardDashboard from '../components/Indicadores/IndicatorCardDashboard';

import { getIndicators } from '@/services/indicatorServices';

import { Loader2 } from 'lucide-react';

export default function DashboardMain() {

  const [indicadores, setIndicadores] = useState([]);

  const [loading, setLoading] = useState(true);

  // =====================================================
  // CARGAR INDICADORES
  // =====================================================

  useEffect(() => {

    const loadIndicators = async () => {

      try {

        setLoading(true);

        const data = await getIndicators();

        setIndicadores(data || []);

      } catch (error) {

        console.log(error);

      } finally {

        setLoading(false);

      }
    };

    loadIndicators();

  }, []);

  // =====================================================
  // TOTALES
  // =====================================================

  const stats = useMemo(() => {

    let cumplen = 0;

    let riesgo = 0;

    let critico = 0;

    indicadores.forEach((ind) => {

      const promedio =
        ind?.data?.length > 0
          ? (
              ind.data.reduce(
                (acc, item) =>
                  acc + Number(item.logro || 0),
                0
              ) / ind.data.length
            )
          : 0;

      if (promedio >= ind.satisfactorio) {

        cumplen++;

      } else if (promedio <= ind.critico) {

        critico++;

      } else {

        riesgo++;

      }
    });

    return {

      total: indicadores.length,

      cumplen,

      riesgo,

      critico,

    };

  }, [indicadores]);

  // =====================================================
  // MODAL
  // =====================================================

  const handleOpenModal = (indicador) => {

    Swal.fire({

      title:
        '<span class="text-white font-black uppercase italic text-sm">Carta de Indicador</span>',

      background: '#1e212b',

      width: '500px',

      showConfirmButton: true,

      confirmButtonText: 'Entendido',

      confirmButtonColor: '#2563eb',

      customClass: {
        popup:
          'rounded-[40px] border border-slate-800',
      },

      html: `

        <div class="text-left p-2">

          <div class="bg-[#12141d] p-4 rounded-3xl border border-slate-800 mb-6">

            <span class="text-[10px] text-blue-500 font-black uppercase block mb-1">
              Nombre:
            </span>

            <p class="text-white text-xs font-bold leading-relaxed uppercase">
              ${indicador.nombre}
            </p>

          </div>

          <div class="space-y-4 px-2">

            <p class="text-[11px] text-slate-400">
              <strong class="text-slate-200">
                Responsable:
              </strong>
              ${indicador.responsable || '-'}
            </p>

            <p class="text-[11px] text-slate-400">
              <strong class="text-slate-200">
                Proceso:
              </strong>
              ${indicador.proceso || '-'}
            </p>

            <p class="text-[11px] text-slate-400">
              <strong class="text-slate-200">
                Frecuencia:
              </strong>
              ${indicador.frecuencia || '-'}
            </p>

            <div class="flex justify-between items-center bg-slate-800/30 p-3 rounded-2xl border border-slate-800">

              <span class="text-green-500 font-black text-[10px]">
                META: ${indicador.meta}%
              </span>

              <span class="text-blue-400 font-black text-[10px]">
                TENDENCIA:
                ${indicador?.tendencia?.name || '-'}
              </span>

            </div>

          </div>

        </div>
      `,
    });
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {

    return (

      <div className="flex items-center justify-center h-full">

        <Loader2
          size={45}
          className="animate-spin text-blue-500"
        />

      </div>
    );
  }

  // =====================================================
  // RENDER
  // =====================================================

  return (

    <div className="flex flex-col gap-6 h-full p-2">

      <main className="flex-1 flex flex-col gap-6 overflow-hidden">

        <section className="bg-[#1e212b] rounded-[40px] p-10 border border-slate-800 shadow-2xl">

          <div className="flex justify-between items-start mb-8">

            <div>

              <h1 className="text-4xl font-black text-white italic tracking-tighter uppercase mb-4">
                Total Indicadores
              </h1>

              <div className="flex gap-10">

                <div>

                  <span className="block text-2xl font-black text-white">
                    {stats.total}
                  </span>

                  <span className="text-[10px] text-blue-500 font-black uppercase opacity-60 tracking-widest">
                    Total
                  </span>

                </div>

                <div>

                  <span className="block text-2xl font-black text-white">
                    {stats.cumplen}
                  </span>

                  <span className="text-[10px] text-green-500 font-black uppercase opacity-60 tracking-widest">
                    Cumplen
                  </span>

                </div>

                <div>

                  <span className="block text-2xl font-black text-white">
                    {stats.riesgo}
                  </span>

                  <span className="text-[10px] text-yellow-500 font-black uppercase opacity-60 tracking-widest">
                    En riesgo
                  </span>

                </div>

                <div>

                  <span className="block text-2xl font-black text-white">
                    {stats.critico}
                  </span>

                  <span className="text-[10px] text-red-500 font-black uppercase opacity-60 tracking-widest">
                    Crítico
                  </span>

                </div>

              </div>

            </div>

            <LiveDate />

          </div>

          {/* GRID */}

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 overflow-y-auto max-h-[70vh] pr-4 custom-scrollbar">

            {indicadores.map((ind) => (

              <IndicatorCardDashboard
                key={ind.id}
                indicador={ind}
                onClick={handleOpenModal}
              />

            ))}

          </div>

        </section>

      </main>

    </div>
  );
}