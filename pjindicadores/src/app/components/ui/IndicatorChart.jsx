'use client';

import { useState } from 'react';

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

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Tooltip,
  Legend
);

export default function IndicatorChart({
  meta,
  satisfactorio,
  critico,
}) {

  const currentYear = new Date().getFullYear();

  const years = [
    currentYear,
    currentYear - 1,
    currentYear - 2,
  ];

  const [yearIndex, setYearIndex] = useState(0);

  const selectedYear = years[yearIndex];

  const labels = [
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

  const data = {

    labels,

    datasets: [

      // BARRAS VACÍAS
      {
        type: 'bar',

        label: 'Cumplimiento',

        data: new Array(12).fill(null),

        backgroundColor: '#3b82f6',

        borderRadius: 8,

        barThickness: 18,
      },

      // META
      {
        type: 'line',

        label: 'Meta',

        data: new Array(12).fill(meta),

        borderColor: '#3b82f6',

        borderDash: [6, 6],

        borderWidth: 2,

        pointRadius: 0,
      },

      // SATISFACTORIO
      {
        type: 'line',

        label: 'Satisfactorio',

        data: new Array(12).fill(satisfactorio),

        borderColor: '#10b981',

        borderDash: [6, 6],

        borderWidth: 2,

        pointRadius: 0,
      },

      // CRÍTICO
      {
        type: 'line',

        label: 'Crítico',

        data: new Array(12).fill(critico),

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
        onClick={() =>
          setYearIndex((prev) =>
            prev > 0 ? prev - 1 : prev
          )
        }
        className="
          absolute left-0
          w-9 h-9
          rounded-xl
          bg-[#1e293b]
          hover:bg-[#334155]
          transition-all
          flex items-center justify-center
          text-white
        "
      >
        <ChevronLeft size={18} />
      </button>

      {/* CENTER */}

      <div className="text-center">

        <p className="
          text-[10px]
          uppercase
          tracking-[0.25em]
          text-slate-500
          font-black
        ">
          Año gráfico
        </p>

        <h2 className="
          text-white
          font-black
          text-2xl
          leading-none
        ">
          {selectedYear}
        </h2>

      </div>

      {/* RIGHT */}

      <button
        onClick={() =>
          setYearIndex((prev) =>
            prev < years.length - 1
              ? prev + 1
              : prev
          )
        }
        className="
          absolute right-0
          w-9 h-9
          rounded-xl
          bg-[#1e293b]
          hover:bg-[#334155]
          transition-all
          flex items-center justify-center
          text-white
        "
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