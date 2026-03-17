'use client';
import React, { useState, useMemo, useEffect } from 'react';
import Select from 'react-select';
import Swal from 'sweetalert2';
import { Chart, registerables } from 'chart.js';
import { Filter, BarChart3 } from 'lucide-react';

Chart.register(...registerables);

const entidadOptions = [
  { value: 'todos', label: 'Todas las Entidades' },
  { value: 'Sistemas de Información', label: 'Sistemas de Información' },
  { value: 'Infraestructura TI', label: 'Infraestructura TI' },
];

const inicialIndicadores = [
  {
    id: 1,
    nombre:
      'PORCENTAJE DE PROYECTOS QUE CUMPLEN CON LAS METAS DEL PLAN ESTRATÉGICO',
    entidad: 'Sistemas de Información',
    meta: 90,
    satis: 85,
    crit: 20,
    datos: [
      {
        mes: 'Ene',
        meta: 90,
        num: 10,
        den: 12,
        logro: 83.3,
        analisis: 'Falta personal',
        acciones: 'Contratar apoyo',
      },
      {
        mes: 'Feb',
        meta: 90,
        num: 11,
        den: 12,
        logro: 91.6,
        analisis: 'Optimizado',
        acciones: 'Mantener estándares',
      },
    ].concat(
      new Array(10).fill(null).map((_, i) => ({
        mes: [
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
        ][i],
        meta: 90,
        num: 0,
        den: 1,
        logro: 0,
        analisis: '',
        acciones: '',
      }))
    ),
  },
];

const AuditoriaCard = ({ indicador, onOpen }) => {
  const promedio = useMemo(() => {
    const logros = indicador.datos
      .filter((d) => d.num > 0)
      .map((d) => (d.num / d.den) * 100);
    return logros.length === 0
      ? '0.0'
      : (logros.reduce((a, b) => a + b, 0) / logros.length).toFixed(1);
  }, [indicador.datos]);

  return (
    <div className="bg-[#12141d] rounded-[40px] p-8 border border-slate-800 flex flex-col justify-between shadow-xl hover:scale-[1.02] transition-all">
      <div className="mb-6">
        <span className="text-[10px] text-blue-500 font-black uppercase tracking-widest block mb-2">
          Estado Estratégico
        </span>
        <h3 className="text-white font-black text-sm uppercase leading-tight mb-4">
          {indicador.nombre}
        </h3>

        <div className="flex justify-between items-end mb-2">
          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter">
            Promedio Acumulado
          </span>
          <span className="text-white font-black text-xl">{promedio}%</span>
        </div>
        <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-1000 ${parseFloat(promedio) >= indicador.satis ? 'bg-green-500' : parseFloat(promedio) <= indicador.crit ? 'bg-red-500' : 'bg-yellow-500'}`}
            style={{ width: `${promedio}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 mb-8 border-t border-slate-800 pt-6 text-center">
        <div>
          <span className="text-[8px] text-slate-500 font-bold block mb-1">
            META
          </span>
          <div className="text-blue-400 font-black text-[10px]">
            {indicador.meta}%
          </div>
        </div>
        <div>
          <span className="text-[8px] text-slate-500 font-bold block mb-1">
            SATIS.
          </span>
          <div className="text-green-500 font-black text-[10px]">
            {indicador.satis}%
          </div>
        </div>
        <div>
          <span className="text-[8px] text-slate-500 font-bold block mb-1">
            CRIT.
          </span>
          <div className="text-red-500 font-black text-[10px]">
            {indicador.crit}%
          </div>
        </div>
      </div>

      <button
        onClick={() => onOpen(indicador)}
        className="w-full bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-black uppercase py-4 rounded-2xl flex items-center justify-center gap-3 shadow-lg"
      >
        <BarChart3 size={16} /> Abrir Auditoría
      </button>
    </div>
  );
};

export default function TableroOperativo() {
  const [hasMounted, setHasMounted] = useState(false);
  const [entidadFilter, setEntidadFilter] = useState(entidadOptions);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  const dataFiltrada = useMemo(() => {
    if (!entidadFilter || entidadFilter.value === 'todos')
      return inicialIndicadores;
    return inicialIndicadores.filter((i) => i.entidad === entidadFilter.value);
  }, [entidadFilter]);

  const modalCargaMensual = (indicador, mesData) => {
    Swal.fire({
      title: `<span class="text-white text-sm font-bold uppercase">Registro: ${mesData.mes}</span>`,
      background: '#12141d',
      html: `
        <div class="text-left space-y-4 p-2">
          <div class="grid grid-cols-2 gap-4">
            <div><label class="block text-[10px] text-slate-500 font-black mb-1">NUMERADOR</label>
            <input id="swal-num" type="number" value="${mesData.num}" class="w-full bg-[#1e212b] border border-slate-700 rounded-xl p-3 text-white outline-none"></div>
            <div><label class="block text-[10px] text-slate-500 font-black mb-1">DENOMINADOR</label>
            <input id="swal-den" type="number" value="${mesData.den}" class="w-full bg-[#1e212b] border border-slate-700 rounded-xl p-3 text-white outline-none"></div>
          </div>
          <div><label class="block text-[10px] text-slate-500 font-black mb-1 uppercase">Análisis</label>
          <textarea id="swal-analisis" class="w-full bg-[#1e212b] border border-slate-700 rounded-xl p-3 text-white text-xs outline-none" rows="2">${mesData.analisis}</textarea></div>
          <div><label class="block text-[10px] text-slate-500 font-black mb-1 uppercase">Acciones</label>
          <textarea id="swal-acciones" class="w-full bg-[#1e212b] border border-slate-700 rounded-xl p-3 text-white text-xs outline-none" rows="2">${mesData.acciones}</textarea></div>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: 'Guardar',
      confirmButtonColor: '#2563eb',
      customClass: { popup: 'rounded-[30px] border border-slate-800' },
    });
  };

  const abrirAuditoria = (indicador) => {
    const logros = indicador.datos
      .filter((d) => d.num > 0)
      .map((d) => (d.num / d.den) * 100);
    const promedio = logros.length
      ? (logros.reduce((a, b) => a + b, 0) / logros.length).toFixed(1)
      : '0.0';

    Swal.fire({
      title: `<span class="text-white text-sm uppercase font-black">${indicador.nombre}</span>`,
      background: '#1e212b',
      width: '1100px',
      showCloseButton: true,
      showConfirmButton: false,
      customClass: { popup: 'rounded-[40px] border border-slate-800' },
      html: `
        <div class="p-4 text-left">
          <div class="grid grid-cols-3 gap-4 mb-6">
            <div class="bg-[#12141d] p-4 rounded-2xl border border-blue-500/30 text-center"><span class="text-[9px] text-slate-500 font-bold block mb-1 uppercase">Meta</span><div class="text-blue-400 font-black text-xl">${indicador.meta}%</div></div>
            <div class="bg-[#12141d] p-4 rounded-2xl border border-green-500/30 text-center"><span class="text-[9px] text-slate-500 font-bold block mb-1 uppercase">Satisfactorio</span><div class="text-green-400 font-black text-xl">${indicador.satis}%</div></div>
            <div class="bg-[#12141d] p-4 rounded-2xl border border-red-500/30 text-center"><span class="text-[9px] text-slate-500 font-bold block mb-1 uppercase">Crítico</span><div class="text-red-500 font-black text-xl">${indicador.crit}%</div></div>
          </div>
          <div class="bg-[#12141d] p-4 rounded-[30px] border border-slate-800 mb-6 h-62.5"><canvas id="auditChart"></canvas></div>
          
          <!-- TABLA DE AUDITORÍA (Restaurada) -->
          <div class="overflow-x-auto max-h-80 custom-scrollbar">
            <table class="w-full text-[10px] border-separate border-spacing-y-2">
              <thead class="sticky top-0 bg-[#1e212b] z-10">
                <tr class="text-slate-500 uppercase tracking-widest font-black">
                  <th class="px-2 pb-2 text-left">Mes</th>
                  <th class="px-2 pb-2 text-center">Meta</th>
                  <th class="px-2 pb-2 text-center">Num.</th>
                  <th class="px-2 pb-2 text-center">Den.</th>
                  <th class="px-2 pb-2 text-center">Logro</th>
                  <th class="px-2 pb-2 text-left">Análisis</th>
                  <th class="px-2 pb-2 text-left">Acciones</th>
                  <th class="px-2 pb-2 text-center">Gestión</th>
                </tr>
              </thead>
              <tbody>
                ${indicador.datos
                  .map((d, i) => {
                    const logroVal = ((d.num / d.den) * 100).toFixed(1);
                    return `
                    <tr class="bg-[#12141d]/50 hover:bg-[#12141d] transition-all">
                      <td class="px-4 py-3 rounded-l-xl font-bold text-slate-400">${d.mes}</td>
                      <td class="px-2 py-3 text-center text-slate-500">${d.meta}%</td>
                      <td class="px-2 py-3 text-center text-white">${d.num}</td>
                      <td class="px-2 py-3 text-center text-white">${d.den}</td>
                      <td class="px-2 py-3 text-center font-black ${logroVal >= indicador.satis ? 'text-green-400' : logroVal <= indicador.crit && logroVal > 0 ? 'text-red-500' : 'text-yellow-500'}">${logroVal}%</td>
                      <td class="px-4 py-3 italic text-slate-500 text-[9px]">${d.analisis || '---'}</td>
                      <td class="px-4 py-3 italic text-blue-400 text-[9px]">${d.acciones || '---'}</td>
                      <td class="px-4 py-3 rounded-r-xl text-center">
                        <button onclick="window.dispatchCarga(${indicador.id}, ${i})" class="p-2 bg-blue-600/20 text-blue-400 rounded-lg hover:bg-blue-600 hover:text-white transition-all"><Edit3 size={14}/></button>
                      </td>
                    </tr>
                  `;
                  })
                  .join('')}
                <tr class="bg-blue-600/10">
                  <td class="px-4 py-4 rounded-l-xl font-black text-white uppercase text-right" colspan="4">Promedio Anual Acumulado:</td>
                  <td class="px-4 py-4 text-center font-black text-blue-400 text-lg">${promedio}%</td>
                  <td colspan="3" class="rounded-r-xl"></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      `,
      didOpen: () => {
        window.dispatchCarga = (id, idx) =>
          modalCargaMensual(indicador, indicador.datos[idx]);
        const ctx = document.getElementById('auditChart').getContext('2d');
        new Chart(ctx, {
          type: 'line',
          data: {
            labels: indicador.datos.map((d) => d.mes),
            datasets: [
              {
                label: 'Logro',
                data: indicador.datos.map((d) => (d.num / d.den) * 100),
                borderColor: '#3b82f6',
                tension: 0.4,
                fill: true,
                backgroundColor: 'rgba(59, 130, 246, 0.05)',
              },
              {
                label: 'Meta',
                data: new Array(12).fill(indicador.meta),
                borderColor: '#60a5fa',
                borderDash: [5],
                pointRadius: 0,
              },
              {
                label: 'Satis.',
                data: new Array(12).fill(indicador.satis),
                borderColor: '#10b981',
                borderDash: [5],
                pointRadius: 0,
              },
              {
                label: 'Crítico',
                data: new Array(12).fill(indicador.crit),
                borderColor: '#ef4444',
                borderDash: [5],
                pointRadius: 0,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: { y: { min: 0, max: 100 } },
          },
        });
      },
    });
  };

  if (!hasMounted) return null;

  return (
    <section className="bg-[#1e212b] rounded-[40px] p-10 h-full flex flex-col shadow-2xl border border-slate-800 overflow-y-auto custom-scrollbar">
      <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
        <div>
          <h1 className="text-4xl font-black text-white uppercase italic tracking-tighter mb-2">
            Carga de datos
          </h1>
        </div>
        <div className="flex items-center gap-3 bg-[#12141d] p-2 rounded-2xl border border-slate-800 shadow-inner">
          <Filter size={18} className="text-slate-500 ml-2" />
          <Select
            instanceId="admin-entidad-filter"
            value={entidadFilter}
            onChange={setEntidadFilter}
            options={entidadOptions}
            styles={{
              control: (base) => ({
                ...base,
                backgroundColor: 'transparent',
                border: 'none',
                color: 'white',
                minWidth: '240px',
                boxShadow: 'none',
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
                backgroundColor: state.isFocused ? '#2563eb' : 'transparent',
                color: 'white',
                fontWeight: 'bold',
                fontSize: '12px',
              }),
            }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {dataFiltrada.map((indicador) => (
          <AuditoriaCard
            key={indicador.id}
            indicador={indicador}
            onOpen={abrirAuditoria}
          />
        ))}
      </div>
    </section>
  );
}
