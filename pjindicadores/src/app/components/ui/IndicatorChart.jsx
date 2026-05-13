'use client';

import {
  useState,
  useEffect,
} from 'react';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Tooltip,
  Legend,
} from 'chart.js';

import { Bar } from 'react-chartjs-2';

import {
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

import {
  getIndicatorData,
} from '@/services/indicatorDataServices';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Tooltip,
  Legend
);

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

export default function IndicatorChart({
  indicador,
  meta,
  satisfactorio,
  critico,
}) {

  const currentYear =
    new Date().getFullYear();

  /*
    SOLO EL AÑO ACTUAL
  */
  const years = [currentYear];

  const [yearIndex, setYearIndex] =
    useState(0);

  const selectedYear =
    years[yearIndex] || currentYear;

  const [chartData, setChartData] =
    useState([]);

  useEffect(() => {

    loadChartData();

  }, [selectedYear]);

  const loadChartData = async () => {

    try {

      const response =
        await getIndicatorData(
          indicador.id,
          selectedYear
        );

      const merged = MONTHS.map(
        (month) => {

          const existing =
            response.find(
              (d) =>
                d.periodo === month
            );

          return (
            existing || {
              periodo: month,
              logro: 0,
            }
          );
        }
      );

      setChartData(merged);

    } catch (error) {

      console.error(error);

    }
  };

  const data = {

    labels: MONTHS,

    datasets: [

      // BARRAS
      {
        type: 'bar',

        label: 'Cumplimiento',

        data: chartData.map(
          (d) =>
            Number(d.logro || 0)
        ),

        backgroundColor:
          'rgba(59,130,246,0.85)',

        borderColor: '#3b82f6',

        borderWidth: 1,

        borderRadius: 8,

        barThickness: 18,
      },

      // META
      {
        type: 'line',

        label: 'Meta',

        data:
          new Array(12).fill(
            Number(meta || 0)
          ),

        borderColor: '#3b82f6',

        borderDash: [6, 6],

        borderWidth: 2,

        pointRadius: 0,
      },

      // SATISFACTORIO
      {
        type: 'line',

        label: 'Satisfactorio',

        data:
          new Array(12).fill(
            Number(
              satisfactorio || 0
            )
          ),

        borderColor: '#10b981',

        borderDash: [6, 6],

        borderWidth: 2,

        pointRadius: 0,
      },

      // CRÍTICO
      {
        type: 'line',

        label: 'Crítico',

        data:
          new Array(12).fill(
            Number(critico || 0)
          ),

        borderColor: '#ef4444',

        borderDash: [6, 6],

        borderWidth: 2,

        pointRadius: 0,
      },
    ],
  };

  const options = {

    responsive: true,

    maintainAspectRatio: false,

    layout: {
      padding: 0,
    },

    plugins: {

      legend: {
        display: false,
      },
    },

    elements: {

      bar: {
        borderRadius: 8,
      },
    },

    scales: {

      y: {

        min: 0,

        max: 100,

        ticks: {
          color: '#64748b',
        },

        grid: {
          color: '#1e293b',
        },
      },

      x: {

        ticks: {
          color: '#64748b',
        },

        grid: {
          display: false,
        },
      },
    },
  };

  return (

    <div className="w-full h-full flex flex-col">

      {/* HEADER */}

      <div className="relative flex items-center justify-center mb-4 h-10">

        {/* LEFT */}

        <button
          disabled={yearIndex === 0}
          onClick={() =>
            setYearIndex((prev) =>
              prev > 0
                ? prev - 1
                : prev
            )
          }
          className={`
            absolute left-0
            w-9 h-9
            rounded-xl
            transition-all
            flex items-center justify-center
            ${
              yearIndex === 0
                ? 'bg-[#111827] text-slate-700 cursor-not-allowed'
                : 'bg-[#1e293b] hover:bg-[#334155] text-white'
            }
          `}
        >
          <ChevronLeft size={18} />
        </button>

        {/* CENTER */}

        <div className="text-center">

          <p
            className="
              text-[10px]
              uppercase
              tracking-[0.25em]
              text-slate-500
              font-black
            "
          >
            Año gráfico
          </p>

          <h2
            className="
              text-white
              font-black
              text-2xl
              leading-none
            "
          >
            {selectedYear}
          </h2>

        </div>

        {/* RIGHT */}

        <button
          disabled={
            yearIndex ===
            years.length - 1
          }
          onClick={() =>
            setYearIndex((prev) =>
              prev <
              years.length - 1
                ? prev + 1
                : prev
            )
          }
          className={`
            absolute right-0
            w-9 h-9
            rounded-xl
            transition-all
            flex items-center justify-center
            ${
              yearIndex ===
              years.length - 1
                ? 'bg-[#111827] text-slate-700 cursor-not-allowed'
                : 'bg-[#1e293b] hover:bg-[#334155] text-white'
            }
          `}
        >
          <ChevronRight size={18} />
        </button>

      </div>

      {/* CHART */}

      <div className="flex-1 min-h-0">

        <Bar
          data={data}
          options={options}
        />

      </div>

    </div>
  );
}