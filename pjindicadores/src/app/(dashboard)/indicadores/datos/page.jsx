'use client';

import React, {
  useState,
  useMemo,
  useEffect,
} from 'react';

import Select from 'react-select';

import Swal from 'sweetalert2';

import {
  Chart,
  registerables,
} from 'chart.js';

import {
  Filter,
  BarChart3,
  Loader2,
  Download,
} from 'lucide-react';

import { sileo } from 'sileo';

import { getIndicators } from '@/services/indicatorServices';

import {
  downloadIndicatorReport,
} from '@/services/reportServices';

import {
  getIndicatorData,
  saveIndicatorData,
} from '@/services/indicatorDataServices';

import { getMe } from '@/services/authService';

Chart.register(...registerables);

const MONTHS = [
  'Ene',
  'Feb',
  'Mar',
  'Abr',
  'May',
  'Jun',
  'Jul',
  'Ago',
  'Sep',
  'Oct',
  'Nov',
  'Dic',
];

export default function TableroOperativo() {

  const [hasMounted, setHasMounted] =
    useState(false);

  const [loading, setLoading] =
    useState(true);

  const [user, setUser] =
    useState(null);
 
  const [indicadores, setIndicadores] =
    useState([]);

  const currentYear = new Date().getFullYear();

/*
  SOLO años existentes
*/
const years = [currentYear];

const [yearIndex, setYearIndex] = useState(0);

const selectedYear =
  years[yearIndex] || currentYear;

  const [entidadFilter, setEntidadFilter] =
    useState({
      value: 'todos',
      label: 'Todas las Entidades',
    });

  useEffect(() => {

    setHasMounted(true);

  }, []);

  useEffect(() => {

    loadData();

  }, []);

  const loadData = async () => {

    try {

      setLoading(true);

      const userData =
        await getMe();

      setUser(userData.user);

      const indicators =
        await getIndicators();

      setIndicadores(indicators);

    } catch (error) {

      console.error(error);

      sileo.error(
        'Error cargando indicadores'
      );

    } finally {

      setLoading(false);

    }
  };

  const entidadOptions =
    useMemo(() => {

      const uniqueEntities = [
        ...new Set(
          indicadores.map(
            (i) => i.entidad
          )
        ),
      ];

      return [

        {
          value: 'todos',
          label:
            'Todas las Entidades',
        },

        ...uniqueEntities.map(
          (entity) => ({

            value: entity,

            label: entity,
          })
        ),
      ];

    }, [indicadores]);

  const filteredData =
    useMemo(() => {

      if (
        user?.role !==
        'superadmin'
      ) {

        return indicadores;
      }

      if (
        !entidadFilter ||
        entidadFilter.value ===
          'todos'
      ) {

        return indicadores;
      }

      return indicadores.filter(
        (item) =>
          item.entidad ===
          entidadFilter.value
      );

    }, [
      indicadores,
      entidadFilter,
      user,
    ]);

  const modalCargaMensual =
    async (
      indicador,
      monthData,
      refreshData
    ) => {

      const result =
        await Swal.fire({

          title: `
          <span class="text-white text-sm font-bold uppercase">
            Registro ${monthData.periodo}
          </span>
        `,

          background: '#12141d',

          html: `
          <div class="text-left space-y-4 p-2">

            <div class="grid grid-cols-2 gap-4">

              <div>

                <label class="block text-[10px] text-slate-500 font-black mb-1">
                  NUMERADOR
                </label>

                <input
                  id="swal-num"
                  type="number"
                  value="${monthData.numerador || 0}"
                  class="w-full bg-[#1e212b] border border-slate-700 rounded-xl p-3 text-white outline-none"
                />

              </div>

              <div>

                <label class="block text-[10px] text-slate-500 font-black mb-1">
                  DENOMINADOR
                </label>

                <input
                  id="swal-den"
                  type="number"
                  value="${monthData.denominador || 0}"
                  class="w-full bg-[#1e212b] border border-slate-700 rounded-xl p-3 text-white outline-none"
                />

              </div>

            </div>

            <div>

              <label class="block text-[10px] text-slate-500 font-black mb-1 uppercase">
                Análisis
              </label>

              <textarea
                id="swal-analisis"
                rows="3"
                class="w-full bg-[#1e212b] border border-slate-700 rounded-xl p-3 text-white text-xs outline-none"
              >${monthData.analisis || ''}</textarea>

            </div>

            <div>

              <label class="block text-[10px] text-slate-500 font-black mb-1 uppercase">
                Acciones
              </label>

              <textarea
                id="swal-acciones"
                rows="3"
                class="w-full bg-[#1e212b] border border-slate-700 rounded-xl p-3 text-white text-xs outline-none"
              >${monthData.acciones || ''}</textarea>

            </div>

          </div>
        `,

          showCancelButton: true,

          confirmButtonText:
            'Guardar',

          confirmButtonColor:
            '#2563eb',

          customClass: {

            popup:
               'rounded-[40px] border border-slate-800',
  title: '!mt-0 !pt-0 !mb-2',
  htmlContainer: '!mt-0',
          },
        });

      if (!result.isConfirmed)
        return;

      try {

        const numerador =
          Number(
            document.getElementById(
              'swal-num'
            ).value
          );

        const denominador =
          Number(
            document.getElementById(
              'swal-den'
            ).value
          );

        const analisis =
          document.getElementById(
            'swal-analisis'
          ).value;

        const acciones =
          document.getElementById(
            'swal-acciones'
          ).value;

        await saveIndicatorData({

          indicatorId:
            indicador.id,

          year: selectedYear,

          periodo:
            monthData.periodo,

          numerador,

          denominador,

          analisis,

          acciones,
        });

        sileo.success(
          'Datos guardados'
        );

        refreshData();

      } catch (error) {

        console.error(error);

        sileo.error(
          'Error guardando datos'
        );
      }
    };

  const abrirAuditoria =
    async (indicador) => {

      try {

        const response =
          await getIndicatorData(
            indicador.id,
            selectedYear
          );

        const mergedData =
          MONTHS.map((month) => {

            const existing =
              response.find(
                (d) =>
                  d.periodo ===
                  month
              );

            return (
              existing || {

                periodo: month,

                numerador: 0,

                denominador: 0,

                logro: 0,

                analisis: '',

                acciones: '',
              }
            );
          });

        const promedio =
          mergedData.length > 0
            ? (
                mergedData.reduce(
                  (
                    acc,
                    item
                  ) =>
                    acc +
                    Number(
                      item.logro ||
                        0
                    ),
                  0
                ) / 12
              ).toFixed(1)
            : '0.0';

        Swal.fire({

  title: `
    <div style="
      color:#fff;
      font-weight:900;
      font-size:1.2rem;
      letter-spacing:2px;
      text-transform:uppercase;
      margin-top:-25px;
      margin-bottom:10px;
    ">
      ${indicador.nombre}
    </div>
  `,

  background: '#1e212b',

  width: '1100px',

  showCloseButton: true,

  showConfirmButton: false,

  customClass: {
    popup:
      'rounded-[40px] border border-slate-800',
  },

  html: `
    <div class="p-4 text-left">

      <div class="flex justify-between items-center mb-6">

        <div class="flex gap-4">

          <div class="bg-[#12141d] p-4 rounded-2xl border border-blue-500/30 text-center w-40">
            <span class="text-[9px] text-slate-500 font-bold block mb-1 uppercase">
              Meta
            </span>

            <div class="text-blue-400 font-black text-xl">
              ${indicador.meta}%
            </div>
          </div>

          <div class="bg-[#12141d] p-4 rounded-2xl border border-green-500/30 text-center w-40">
            <span class="text-[9px] text-slate-500 font-bold block mb-1 uppercase">
              Satisfactorio
            </span>

            <div class="text-green-400 font-black text-xl">
              ${indicador.satisfactorio}%
            </div>
          </div>

          <div class="bg-[#12141d] p-4 rounded-2xl border border-red-500/30 text-center w-40">
            <span class="text-[9px] text-slate-500 font-bold block mb-1 uppercase">
              Crítico
            </span>

            <div class="text-red-500 font-black text-xl">
              ${indicador.critico}%
            </div>
          </div>

        </div>

        <div class="bg-[#12141d] border border-slate-700 rounded-2xl px-5 py-3">

          <span class="text-slate-500 text-[10px] uppercase font-black">
            Año:
          </span>

          <span class="text-white font-black text-lg ml-2">
            ${selectedYear}
          </span>

        </div>

      </div>

      <!-- GRAFICA -->

      <div class="bg-[#12141d] p-4 rounded-[30px] border border-slate-800 mb-6 h-[350px]">
        <canvas id="auditChart"></canvas>
      </div>

      <!-- TABLA -->

      <div class="overflow-x-auto max-h-80 custom-scrollbar">

        <table class="w-full text-[10px] border-separate border-s
          <thead class="sticky top-0 bg-[#1e212b] z-10">

            <tr class="text-slate-500 uppercase tracking-widest font-black">

              <th class="px-2 pb-2 text-left">
                Mes
              </th>

              <th class="px-2 pb-2 text-center">
                Num.
              </th>

              <th class="px-2 pb-2 text-center">
                Den.
              </th>

              <th class="px-2 pb-2 text-center">
                Logro
              </th>

              <th class="px-2 pb-2 text-left">
                Análisis
              </th>

              <th class="px-2 pb-2 text-left">
                Acciones
              </th>

              <th class="px-2 pb-2 text-center">
                Gestión
              </th>

            </tr>

          </thead>

          <tbody>

            ${mergedData
              .map((d, i) => {

                return `
                  <tr class="bg-[#12141d]/50 hover:bg-[#12141d] transition-all">

                    <td class="px-4 py-3 rounded-l-xl font-bold text-slate-400">
                      ${d.periodo}
                    </td>

                    <td class="px-2 py-3 text-center text-white">
                      ${d.numerador}
                    </td>

                    <td class="px-2 py-3 text-center text-white">
                      ${d.denominador}
                    </td>

                    <td class="px-2 py-3 text-center font-black text-blue-400">
                      ${d.logro}%
                    </td>

                    <td class="px-4 py-3 italic text-slate-500 text-[9px]">
                      ${d.analisis || '---'}
                    </td>

                    <td class="px-4 py-3 italic text-blue-400 text-[9px]">
                      ${d.acciones || '---'}
                    </td>

                    <td class="px-4 py-3 rounded-r-xl text-center">

                      <button
                        onclick="window.dispatchCarga(${i})"
                        class="px-4 py-2 bg-blue-600/20 text-blue-400 rounded-xl hover:bg-blue-600 hover:text-white transition-all font-black"
                      >
                        EDITAR
                      </button>

                    </td>

                  </tr>
                `;
              })
              .join('')}

            <tr class="bg-blue-600/10">

              <td
                class="px-4 py-4 rounded-l-xl font-black text-white uppercase text-right"
                colspan="3"
              >
                Promedio Anual:
              </td>

              <td class="px-4 py-4 text-center font-black text-blue-400 text-lg">
                ${promedio}%
              </td>

              <td colspan="3" class="rounded-r-xl"></td>

            </tr>

          </tbody>

        </table>

      </div>

    </div>
  `,

  didOpen: () => {

    const title =
    document.querySelector('.swal2-title');

  if (title) {

      title.style.margin = '0';
      title.style.padding = '0';
      title.style.marginTop = '-25px';
      title.style.marginBottom = '10px';

      title.style.color = '#fff';
      title.style.fontWeight = '900';
      title.style.fontSize = '1.2rem';
      title.style.letterSpacing = '2px';
  }

    window.dispatchCarga =
      async (index) => {

        await modalCargaMensual(
          indicador,
          mergedData[index],
          () =>
            abrirAuditoria(
              indicador
            )
        );
      };

    const ctx =
      document
        .getElementById(
          'auditChart'
        )
        .getContext('2d');

    new Chart(ctx, {

      data: {

        labels: mergedData.map(
          (d) => d.periodo
        ),

        datasets: [

          {
            type: 'bar',

            label: 'Logro',

            data: mergedData.map(
              (d) =>
                Number(
                  d.logro || 0
                )
            ),

            backgroundColor:
              'rgba(59,130,246,0.75)',

            borderRadius: 10,

            barThickness: 22,
          },

          {
            type: 'line',

            label: 'Meta',

            data:
              new Array(12).fill(
                Number(
                  indicador.meta || 0
                )
              ),

            borderColor:
              '#60a5fa',

            borderDash: [6, 6],

            borderWidth: 2,

            pointRadius: 0,

            tension: 0.4,
          },

          {
            type: 'line',

            label: 'Satisfactorio',

            data:
              new Array(12).fill(
                Number(
                  indicador.satisfactorio || 0
                )
              ),

            borderColor:
              '#10b981',

            borderDash: [6, 6],

            borderWidth: 2,

            pointRadius: 0,

            tension: 0.4,
          },

          {
            type: 'line',

            label: 'Crítico',

            data:
              new Array(12).fill(
                Number(
                  indicador.critico || 0
                )
              ),

            borderColor:
              '#ef4444',

            borderDash: [6, 6],

            borderWidth: 2,

            pointRadius: 0,

            tension: 0.4,
          },
        ],
      },

      options: {

        responsive: true,

        maintainAspectRatio: false,

        plugins: {

          legend: {
            display: false,
          },
        },

        scales: {

          x: {

            ticks: {
              color: '#64748b',
            },

            grid: {
              display: false,
            },
          },

          y: {

            min: 0,

            max: 100,

            ticks: {
              color: '#64748b',
            },

            grid: {
              color:
                'rgba(255,255,255,0.05)',
            },
          },
        },
      },
    });
  },
});

      } catch (error) {

        console.error(error);

        sileo.error(
          'Error cargando auditoría'
        );
      }
    };

  if (!hasMounted)
    return null;

  if (loading) {

    return (

      <section className="bg-[#1e212b] rounded-[40px] p-10 h-full flex items-center justify-center shadow-2xl border border-slate-800">

        <div className="flex flex-col items-center gap-5">

          <Loader2
            size={55}
            className="text-blue-500 animate-spin"
          />

          <p className="text-slate-400 font-semibold tracking-wide">
            Cargando indicadores...
          </p>

        </div>

      </section>
    );
  }

  return (

    <section className="bg-[#1e212b] rounded-[40px] p-10 h-full flex flex-col shadow-2xl border border-slate-800 overflow-y-auto">

      <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">

        <div>

          <h1 className="text-4xl font-black text-white uppercase italic tracking-tighter mb-2">
            Cargar Datos
          </h1>

        </div>

        {user?.role ===
          'superadmin' && (

          <div className="flex items-center gap-3 bg-[#12141d] p-2 rounded-2xl border border-slate-800">

            <Filter
              size={18}
              className="text-slate-500 ml-2"
            />

            <Select
              instanceId="admin-entidad-filter"
              value={
                entidadFilter
              }
              onChange={
                setEntidadFilter
              }
              options={
                entidadOptions
              }
              styles={{
                control: (base) => ({
                  ...base,
                  backgroundColor: 'transparent',
                  border: 'none',
                  boxShadow: 'none',
                  minWidth: '240px',
                }),

                singleValue: (base) => ({
                  ...base,
                  color: 'white',
                  fontWeight: '900',
                  textTransform: 'uppercase',
                  fontSize: '12px',
                }),

                menu: (base) => ({
                  ...base,
                  backgroundColor: '#1e212b',
                  borderRadius: '15px',
                  border: '1px solid #334155',
                }),

                option: (base, state) => ({
                  ...base,
                  backgroundColor: state.isFocused
                    ? '#2563eb'
                    : 'transparent',

                  color: 'white',

                  fontWeight: 'bold',

                  fontSize: '12px',
                }),
              }}
            />

          </div>
        )}

      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

        {filteredData.map(
          (indicador) => (

            <div
              key={
                indicador.id
              }
              className="
                relative
                overflow-hidden
                bg-gradient-to-b
                from-[#050816]
                to-[#090f1f]
                rounded-[35px]
                border
                border-[#1d2740]
                p-7
              "
            >

              <div className="absolute -top-24 right-[-50px] w-52 h-52 bg-blue-600/10 blur-3xl rounded-full" />

              <div className="relative z-10">

  <span className="text-[9px] text-blue-500 font-black uppercase tracking-[0.25em] block mb-4">
    {indicador.proceso || 'Sin proceso'}
  </span>

  <h2
    className="
      text-white
      font-black
      text-xl
      uppercase
      leading-tight
      mb-6
    "
  >
    {indicador.nombre}
  </h2>
                <div className="mb-6">

                  <div className="flex justify-between items-center mb-2">

                    <span className="text-[9px] text-slate-500 uppercase font-black tracking-widest">
                      Promedio acumulado
                    </span>

                    <span className="text-white font-black text-3xl italic">
                      {indicador.meta}%
                    </span>

                  </div>

                  <div className="w-full h-[8px] bg-[#18233b] rounded-full overflow-hidden">

                    <div
                      className="h-full bg-[#00e061] rounded-full"
                      style={{
                        width: `${indicador.meta}%`,
                      }}
                    />

                  </div>

                </div>

                <div className="border-t border-slate-800 pt-5 mb-7">

                  <div className="grid grid-cols-3 gap-3">

                    <div className="text-center">

                      <p className="text-[8px] uppercase text-slate-600 font-black mb-1">
                        Meta
                      </p>

                      <span className="text-blue-500 font-black text-sm">
                        {indicador.meta}%
                      </span>

                    </div>

                    <div className="text-center">

                      <p className="text-[8px] uppercase text-slate-600 font-black mb-1">
                        Satis.
                      </p>

                      <span className="text-[#00e061] font-black text-sm">
                        {indicador.satisfactorio}%
                      </span>

                    </div>

                    <div className="text-center">

                      <p className="text-[8px] uppercase text-slate-600 font-black mb-1">
                        Crit.
                      </p>

                      <span className="text-red-500 font-black text-sm">
                        {indicador.critico}%
                      </span>

                    </div>

                  </div>

                </div>

                <button
                  onClick={() =>
                    abrirAuditoria(
                      indicador
                    )
                  }
                  className="
                    w-full
                    h-[58px]
                    rounded-[18px]
                    bg-[#2563eb]
                    hover:bg-[#1d4ed8]
                    transition-all
                    text-white
                    font-black
                    uppercase
                    text-[11px]
                    tracking-wide
                    flex
                    items-center
                    justify-center
                    gap-3
                  "
                >

                  <BarChart3
                    size={16}
                  />

                  Abrir Auditoría

                </button>

                <br />
                <button
  onClick={() =>
    downloadIndicatorReport(
      indicador.id,
      selectedYear
    )
  }
   className="
                    w-full
                    h-[58px]
                    rounded-[18px]
                    bg-[#ED0C0C]
                    hover:bg-[#C70A0A]
                    transition-all
                    text-white
                    font-black
                    uppercase
                    text-[11px]
                    tracking-wide
                    flex
                    items-center
                    justify-center
                    gap-3
                  "
>

                <Download
                    size={16}
                  />

  Descargar PDF
</button>

              </div>

            </div>
          )
        )}

      </div>

    </section>
  );
}