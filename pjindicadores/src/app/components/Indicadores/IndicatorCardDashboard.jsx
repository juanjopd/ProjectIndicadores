'use client';
import React, { useMemo } from 'react';

export default function IndicatorCardDashboard({ indicador, onClick }) {
  const promedio = useMemo(() => {
    // 1. Verificación de seguridad: Si no hay datos, devolvemos 0.0 inmediatamente
    if (!indicador?.datos || !Array.isArray(indicador.datos)) {
      return '0.0';
    }

    // 2. Procesamiento de logros siguiendo la fórmula corporativa (NMCP*100)/NMC [2, 3]
    const logros = indicador.datos
      .filter((d) => d && d.num > 0) // Solo meses con registros reales
      .map((d) => (d.num / d.den) * 100);

    return logros.length === 0
      ? '0.0'
      : (logros.reduce((a, b) => a + b, 0) / logros.length).toFixed(1);
  }, [indicador?.datos]);

  const colorClass =
    parseFloat(promedio) >= indicador.satis
      ? 'bg-green-500'
      : parseFloat(promedio) <= indicador.crit
        ? 'bg-red-500'
        : 'bg-yellow-500';

  // Extraemos las clases del tema o usamos una por defecto (Fuente 91)
  const theme =
    indicador.colorTheme || 'bg-[#fff4e6] text-orange-900 bar-orange-500';
  const [bgColor, textColor, barColor] = theme.split(' ');

  return (
    <div
      onClick={() => onClick(indicador)}
      className={`${bgColor} rounded-[40px] p-8 cursor-pointer shadow-lg 
                  transform transition-all duration-500 ease-out
                  hover:-translate-y-2 hover:shadow-2xl active:scale-95
                  flex flex-col justify-between h-72 w-full overflow-hidden border border-transparent hover:border-white/20`}
    >
      <div>
        <span
          className={`text-[10px] opacity-40 font-black uppercase tracking-widest block mb-4 ${textColor}`}
        >
          December 10, 2020
        </span>

        {/* Proceso encima del nombre como solicitaste  */}
        <p
          className={`text-[11px] font-bold uppercase opacity-60 mb-1 ${textColor}`}
        >
          {indicador.entidad || ''}
        </p>

        <h3
          className={`${textColor} font-black text-lg uppercase leading-tight italic line-clamp-2`}
        >
          {indicador.nombre}
        </h3>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span
            className={`text-[10px] font-black uppercase opacity-60 ${textColor}`}
          >
            Promedio
          </span>
          <span className={`text-[11px] font-black ${textColor}`}>
            {promedio}%
          </span>
        </div>

        {/* Barra de promedio real */}
        <div className="w-full h-1.5 bg-black/5 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-1000 ease-in-out ${barColor.replace('bar-', 'bg-')}`}
            style={{ width: `${promedio}%` }}
          />
        </div>

        <div className="flex justify-between items-center pt-2">
          <div className="flex -space-x-2"></div>
          <span
            className={`text-[10px] font-black uppercase opacity-50 ${textColor}`}
          >
            2 Days Left
          </span>
        </div>
      </div>
    </div>
  );
}
