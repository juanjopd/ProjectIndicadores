'use client';
import React, { useState, useMemo, useEffect } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
} from '@tanstack/react-table';
import Select from 'react-select';
import { sileo } from 'sileo';
import Swal from 'sweetalert2';
import {
  Eye,
  Edit,
  Trash2,
  Filter,
  Target,
  Activity,
  ShieldCheck,
  AlertCircle,
} from 'lucide-react';

// Opciones de Entidades (Fuente [3])
const entidadOptions = [
  { value: 'todos', label: 'Todas las Entidades' },
  { value: 'Sistemas de Información', label: 'Sistemas de Información' },
  { value: 'Infraestructura TI', label: 'Infraestructura TI' },
];

// Datos enriquecidos basados en las fuentes [2-4]
const dataIndicadores = [
  {
    id: 1,
    nombre:
      'PORCENTAJE DE PROYECTOS QUE CUMPLEN CON LAS METAS DEL PLAN ESTRATÉGICO',
    entidad: 'Sistemas de Información',
    meta: 90,
    satis: 85,
    crit: 20,
    responsable: 'Alejandro Ramírez Medina',
    proceso: 'Sistemas de Información',
    tendencia: 'AUMENTAR',
    tipo: 'EFICACIA',
    frecuencia: 'Anual',
    utilidad:
      'El 70% de las metas del plan de desarrollo y requerimientos este cubierto por los Proyectos de TI.',
  },
];

export default function AdminIndicadores() {
  const [hasMounted, setHasMounted] = useState(false);
  const [entidadFilter, setEntidadFilter] = useState(entidadOptions);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  const filteredData = useMemo(() => {
    if (!entidadFilter || entidadFilter.value === 'todos')
      return dataIndicadores;
    return dataIndicadores.filter(
      (item) => item.entidad === entidadFilter.value
    );
  }, [entidadFilter]);

  // Modal de Carta de Indicador Actualizado (Inspirado en Fuente [1])
  const handleViewDetails = (indicador) => {
    Swal.fire({
      title: `<span style="color: #fff; font-size: 1.2rem; font-weight: 900; letter-spacing: 2px;">CARTA DE INDICADOR</span>`,
      background: '#1e212b',
      width: '600px',
      showCloseButton: true,
      showConfirmButton: false,
      customClass: {
        popup: 'rounded-[40px] border border-slate-700 shadow-2xl',
      },
      html: `
        <div style="text-align: left; padding: 10px; font-family: 'Inter', sans-serif;">
          
          <!-- Bloque de Nombre (Fuente [1]) -->
          <div style="background: rgba(30, 41, 59, 0.5); padding: 20px; border-radius: 20px; border: 1px solid #334155; margin-bottom: 20px;">
            <p style="margin: 0; color: #60a5fa; font-size: 0.75rem; font-weight: 800; text-transform: uppercase; margin-bottom: 8px;">Nombre:</p>
            <p style="margin: 0; color: #fff; font-weight: 700; font-size: 0.95rem; line-height: 1.4;">${indicador.nombre}</p>
          </div>

          <!-- Grid de Identificación (Responsable y Proceso) -->
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 20px;">
            <div>
              <p style="margin: 0; color: #94a3b8; font-size: 0.7rem; font-weight: 800; text-transform: uppercase;">Responsable:</p>
              <p style="margin: 4px 0 0 0; color: #fff; font-size: 0.85rem;">${indicador.responsable}</p>
            </div>
            <div>
              <p style="margin: 0; color: #94a3b8; font-size: 0.7rem; font-weight: 800; text-transform: uppercase;">Proceso:</p>
              <p style="margin: 4px 0 0 0; color: #fff; font-size: 0.85rem;">${indicador.proceso}</p>
            </div>
          </div>

          <!-- Grid Técnico (Tipo y Frecuencia) (Fuentes [2, 3]) -->
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 20px;">
            <div>
              <p style="margin: 0; color: #94a3b8; font-size: 0.7rem; font-weight: 800; text-transform: uppercase;">Tipo de Indicador:</p>
              <p style="margin: 4px 0 0 0; color: #3b82f6; font-weight: 700; font-size: 0.85rem;">${indicador.tipo}</p>
            </div>
            <div>
              <p style="margin: 0; color: #94a3b8; font-size: 0.7rem; font-weight: 800; text-transform: uppercase;">Frecuencia:</p>
              <p style="margin: 4px 0 0 0; color: #fff; font-size: 0.85rem;">${indicador.frecuencia}</p>
            </div>
          </div>

          <!-- Utilidad (Fuente [3]) -->
          <div style="margin-bottom: 25px;">
            <p style="margin: 0; color: #94a3b8; font-size: 0.7rem; font-weight: 800; text-transform: uppercase; margin-bottom: 6px;">¿Para qué sirve este indicador?</p>
            <p style="margin: 0; color: #cbd5e1; font-size: 0.8rem; font-style: italic; line-height: 1.5; background: #12141d; padding: 12px; border-radius: 12px;">"${indicador.utilidad}"</p>
          </div>

          <!-- Umbrales de Cumplimiento (Fuentes [2, 4]) -->
          <div style="background: #12141d; padding: 20px; border-radius: 25px; border: 1px solid #1e293b; margin-bottom: 20px;">
            <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px; text-align: center;">
              <div>
                <span style="display:block; font-size: 0.6rem; color: #3b82f6; font-weight: 900; margin-bottom: 5px;">META</span>
                <span style="color: #4ade80; font-size: 1.1rem; font-weight: 900;">${indicador.meta}%</span>
              </div>
              <div>
                <span style="display:block; font-size: 0.6rem; color: #10b981; font-weight: 900; margin-bottom: 5px;">SATISFACTORIO</span>
                <span style="color: #fff; font-size: 1.1rem; font-weight: 900;">${indicador.satis}%</span>
              </div>
              <div>
                <span style="display:block; font-size: 0.6rem; color: #ef4444; font-weight: 900; margin-bottom: 5px;">CRÍTICO</span>
                <span style="color: #fff; font-size: 1.1rem; font-weight: 900;">${indicador.crit}%</span>
              </div>
            </div>
            <div style="margin-top: 15px; text-align: center; border-top: 1px solid #334155; pt-10px; padding-top: 10px;">
               <span style="font-size: 0.65rem; color: #64748b; font-weight: 800; text-transform: uppercase;">Tendencia: </span>
               <span style="font-size: 0.65rem; color: #60a5fa; font-weight: 900;">${indicador.tendencia}</span>
            </div>
          </div>

          <!-- Placeholder para Chart.js -->
          <div style="height: 150px; background: #0f172a; border-radius: 20px; display: flex; flex-direction: column; align-items: center; justify-content: center; border: 1px dashed #334155; color: #475569;">
            <p style="margin:0; font-size: 0.7rem;">[ Espacio para Chart.js ]</p>
            <p style="margin:5px 0 0 0; font-size: 0.6rem; font-weight: bold; color: #1e40af;">TENDENCIA DE CUMPLIMIENTO</p>
          </div>

          <div style="margin-top: 25px; text-align: center;">
            <button onclick="Swal.close()" style="background: #2563eb; color: #fff; border: none; padding: 12px 40px; border-radius: 15px; font-weight: 900; font-size: 0.8rem; cursor: pointer; transition: 0.3s; text-transform: uppercase;">Entendido</button>
          </div>
        </div>
      `,
    });
  };

  const columnHelper = createColumnHelper();
  const columns = [
    columnHelper.accessor('nombre', {
      header: 'INDICADOR',
      cell: (info) => (
        <div className="text-slate-200 text-xs font-bold leading-tight uppercase w-64">
          {info.getValue()}
        </div>
      ),
    }),
    columnHelper.accessor('entidad', {
      header: 'ENTIDAD',
      cell: (info) => (
        <span className="text-blue-500 text-[9px] font-black uppercase tracking-tighter">
          {info.getValue()}
        </span>
      ),
    }),
    columnHelper.accessor('meta', {
      header: 'META',
      cell: (info) => (
        <span className="text-white font-black">{info.getValue()}%</span>
      ),
    }),
    columnHelper.display({
      id: 'acciones',
      header: () => <div className="text-right px-4">ACCIONES</div>,
      cell: (props) => (
        <div className="flex justify-end gap-2 px-2">
          <button
            onClick={() => handleViewDetails(props.row.original)}
            className="p-2 text-slate-500 hover:text-white hover:bg-slate-800 rounded-xl transition-all"
            title="Ver Carta"
          >
            <Eye size={18} />
          </button>
          <button
            onClick={() => sileo.info('Modo Edición')}
            className="p-2 text-slate-500 hover:text-blue-400 hover:bg-blue-900/20 rounded-xl transition-all"
          >
            <Edit size={18} />
          </button>
          <button
            onClick={() => sileo.error('Acceso denegado')}
            className="p-2 text-slate-500 hover:text-red-500 hover:bg-red-900/20 rounded-xl transition-all"
          >
            <Trash2 size={18} />
          </button>
        </div>
      ),
    }),
  ];

  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (!hasMounted) return null;

  return (
    <section className="bg-[#1e212b] rounded-[40px] p-10 h-full flex flex-col shadow-2xl border border-slate-800 overflow-hidden">
      <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
        <div>
          <h1 className="text-4xl font-black text-white italic tracking-tighter uppercase mb-1">
            Administrar Indicadores
          </h1>
        </div>

        {/* Filtro con Estilo Preservado */}
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

      {/* Tabla con Estilo Preservado */}
      <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
        <table className="w-full border-separate border-spacing-y-3">
          <thead>
            {table.getHeaderGroups().map((hg) => (
              <tr key={hg.id}>
                {hg.headers.map((h) => (
                  <th
                    key={h.id}
                    className="px-6 text-left text-[9px] font-black text-slate-600 uppercase tracking-[0.2em] pb-2"
                  >
                    {flexRender(h.column.columnDef.header, h.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                className="bg-[#12141d]/50 hover:bg-[#12141d] transition-all group"
              >
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className="px-6 py-4 first:rounded-l-[25px] last:rounded-r-[25px] border-y border-transparent group-hover:border-slate-800 transition-all"
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
