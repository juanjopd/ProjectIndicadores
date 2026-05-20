'use client';

import React, { useMemo } from 'react';

import {
  TrendingUp,
  AlertTriangle,
  ShieldAlert,
  Activity,
} from 'lucide-react';

export default function IndicatorCardDashboard({
  indicador,
  onClick,
}) {

  const themes = [

    {
      bg: 'from-[#1e1b4b] via-[#312e81] to-[#4338ca]',
      border: 'border-violet-400/20',
      accent: 'text-violet-300',
      soft: 'bg-violet-400/10',
      progress:
        'from-violet-300 to-fuchsia-300',
    },

    {
      bg: 'from-[#052e16] via-[#064e3b] to-[#065f46]',
      border: 'border-emerald-400/20',
      accent: 'text-emerald-300',
      soft: 'bg-emerald-400/10',
      progress:
        'from-emerald-300 to-green-300',
    },

    {
      bg: 'from-[#172554] via-[#1e3a8a] to-[#2563eb]',
      border: 'border-blue-400/20',
      accent: 'text-blue-300',
      soft: 'bg-blue-400/10',
      progress:
        'from-blue-300 to-cyan-300',
    },

    {
      bg: 'from-[#451a03] via-[#78350f] to-[#b45309]',
      border: 'border-orange-400/20',
      accent: 'text-orange-300',
      soft: 'bg-orange-400/10',
      progress:
        'from-orange-300 to-yellow-300',
    },

  ];

  const theme =
    themes[
      (indicador?.id || 0) %
        themes.length
    ];

  const promedio = useMemo(() => {

    if (
      !indicador?.data ||
      !Array.isArray(indicador.data)
    ) {
      return 0;
    }

    const valores =
      indicador.data.map(
        (d) =>
          Number(d.logro || 0)
      );

    if (!valores.length) {
      return 0;
    }

    return (
      valores.reduce(
        (a, b) => a + b,
        0
      ) / valores.length
    ).toFixed(1);

  }, [indicador]);

  const estado = useMemo(() => {

    const value =
      Number(promedio);

    if (
      value >=
      Number(
        indicador?.satisfactorio || 0
      )
    ) {

      return {
        text: 'Cumple',
        color:
          'text-emerald-300',
        bg:
          'bg-emerald-500/15',
        icon: TrendingUp,
      };
    }

    if (
      value <=
      Number(
        indicador?.critico || 0
      )
    ) {

      return {
        text: 'Crítico',
        color: 'text-red-300',
        bg: 'bg-red-500/15',
        icon: ShieldAlert,
      };
    }

    return {
      text: 'Riesgo',
      color:
        'text-yellow-300',
      bg:
        'bg-yellow-500/15',
      icon: AlertTriangle,
    };

  }, [promedio, indicador]);

  const StatusIcon = estado.icon;

  return (

    <div
      onClick={() =>
        onClick(indicador)
      }
      className={`
        relative
        rounded-[28px]
        overflow-hidden
        border
        ${theme.border}
        bg-gradient-to-br
        ${theme.bg}
        p-5
        min-h-[255px]
        cursor-pointer
        transition-all
        duration-300
        hover:-translate-y-1
        hover:shadow-2xl
        group
      `}
    >

      {/* Glow */}

      <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 blur-3xl rounded-full" />

      {/* HEADER */}

      <div className="relative z-10 flex items-start justify-between mb-5">

        <div>

          <div className="flex items-center gap-2 mb-2">

            <Activity
              size={13}
              className={theme.accent}
            />

            <span
              className={`
                text-[9px]
                font-black
                uppercase
                tracking-[0.25em]
                ${theme.accent}
              `}
            >
              {indicador?.proceso ||
                'Indicador'}
            </span>

          </div>

          <h2 className="text-white text-2xl font-black italic uppercase leading-tight line-clamp-2 max-w-[180px]">

            {indicador?.nombre ||
              'Sin nombre'}

          </h2>

        </div>

        <div
          className={`
            flex
            items-center
            gap-1
            px-3
            py-1.5
            rounded-xl
            ${estado.bg}
          `}
        >

          <StatusIcon
            size={12}
            className={estado.color}
          />

          <span
            className={`
              text-[9px]
              font-black
              uppercase
              tracking-wider
              ${estado.color}
            `}
          >
            {estado.text}
          </span>

        </div>

      </div>

      {/* INFO */}

      <div className="grid grid-cols-2 gap-3 mb-4">

        <div className="bg-black/15 border border-white/10 rounded-[18px] p-3">

          <span className="text-[8px] uppercase tracking-[0.2em] text-slate-300 font-black block mb-2">

            Responsable

          </span>

          <p className="text-white text-xs font-bold line-clamp-1">

            {indicador?.responsable ||
              '-'}

          </p>

        </div>

        <div className="bg-black/15 border border-white/10 rounded-[18px] p-3">

          <span className="text-[8px] uppercase tracking-[0.2em] text-slate-300 font-black block mb-2">

            Frecuencia

          </span>

          <p className="text-white text-xs font-bold uppercase">

            {indicador?.frecuencia ||
              '-'}

          </p>

        </div>

      </div>

      {/* CUMPLIMIENTO */}

      <div className="bg-black/15 border border-white/10 rounded-[22px] p-4">

        <div className="flex justify-between items-end mb-3">

          <div>

            <span className="text-[9px] uppercase tracking-[0.2em] text-slate-300 font-black block mb-1">

              Cumplimiento

            </span>

            <p className="text-slate-400 text-[10px] uppercase font-bold">

              Promedio anual

            </p>

          </div>

          <h3 className="text-white text-4xl font-black leading-none">

            {promedio}

            <span className="text-xl">
              %
            </span>

          </h3>

        </div>

        {/* BARRA */}

        <div className="w-full h-3 rounded-full bg-white/10 overflow-hidden mb-4">

          <div
            className={`
              h-full
              rounded-full
              bg-gradient-to-r
              ${theme.progress}
              transition-all
              duration-1000
            `}
            style={{
              width: `${Math.min(
                promedio,
                100
              )}%`,
            }}
          />

        </div>

        {/* FOOTER */}

        <div className="grid grid-cols-3 gap-2">

          <div>

            <span className="text-[8px] text-slate-400 uppercase font-black block mb-1">

              Meta

            </span>

            <p className="text-white text-xs font-black">

              {indicador?.meta || 0}%

            </p>

          </div>

          <div>

            <span className="text-[8px] text-slate-400 uppercase font-black block mb-1">

              Entidad

            </span>

            <p className="text-white text-xs font-black uppercase line-clamp-1">

              {indicador?.entidad ||
                '-'}

            </p>

          </div>

          <div className="text-right">

            <span className="text-[8px] text-slate-400 uppercase font-black block mb-1">

              Tendencia

            </span>

            <p
              className={`
                text-xs
                font-black
                uppercase
                ${theme.accent}
              `}
            >

              {indicador?.tendencia
                ?.name || '-'}

            </p>

          </div>

        </div>

      </div>

    </div>
  );
}