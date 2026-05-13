'use client';

import React, { useState, useMemo, useEffect } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
} from '@tanstack/react-table';
import Select from 'react-select';
import Swal from 'sweetalert2';
import { sileo } from 'sileo';
import {
  Eye,
  Edit,
  Trash2,
  Filter,
  Loader2,
} from 'lucide-react';
import { getIndicators } from '@/services/indicatorServices';
import { getMe } from '@/services/authService';
import IndicatorChart from '@/app/components/ui/IndicatorChart'; 
import { createRoot } from 'react-dom/client'

export default function AdminIndicadores() {

  const [hasMounted, setHasMounted] = useState(false);

  const [loading, setLoading] = useState(true);

  const [user, setUser] = useState(null);

  const [indicadores, setIndicadores] = useState([]);

  const [entidadFilter, setEntidadFilter] = useState({
    value: 'todos',
    label: 'Todas las Entidades',
  });

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {

    const loadData = async () => {

      try {

        setLoading(true);

        const userData = await getMe();

        setUser(userData.user);

        const data = await getIndicators();

        setIndicadores(data);

      } catch (error) {

        console.error(error);

        sileo.error('Error cargando indicadores');

      } finally {

        setLoading(false);

      }
    };

    loadData();

  }, []);

  const entidadOptions = useMemo(() => {

    const uniqueEntities = [
      ...new Set(indicadores.map((i) => i.entidad)),
    ];

    return [
      {
        value: 'todos',
        label: 'Todas las Entidades',
      },

      ...uniqueEntities.map((entity) => ({
        value: entity,
        label: entity,
      })),
    ];

  }, [indicadores]);

  const filteredData = useMemo(() => {

    if (user?.role !== 'superadmin') {
      return indicadores;
    }

    if (!entidadFilter || entidadFilter.value === 'todos') {
      return indicadores;
    }

    return indicadores.filter(
      (item) => item.entidad === entidadFilter.value
    );

  }, [indicadores, entidadFilter, user]);

  const handleViewDetails = (indicador) => {

  Swal.fire({

    title: `
      <div>
        CARTA DE INDICADOR
      </div>
    `,

    background: '#1e212b',

    width: '720px',

    showCloseButton: true,

    showConfirmButton: false,

    customClass: {
      popup:
        'rounded-[40px] border border-slate-700 shadow-2xl',
      title: '!mt-0 !pt-0 !mb-2',
      htmlContainer: '!mt-0',
    },

    didOpen: () => {

      const title = document.querySelector('.swal2-title');

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

      const chartContainer =
        document.getElementById('chart-container');

      if (chartContainer) {

        const root = createRoot(chartContainer);

        root.render(

          <IndicatorChart
            indicador={indicador}
            meta={indicador.meta}
            satisfactorio={indicador.satisfactorio}
            critico={indicador.critico}
            years={indicador.years || [new Date().getFullYear()]}
/>
        );
      }
    },

    html: `

      <div style="
        text-align:left;
        padding:10px;
        font-family:Inter,sans-serif;
      ">

        <!-- NOMBRE -->

        <div style="
          background:rgba(30,41,59,.5);
          padding:20px;
          border-radius:20px;
          border:1px solid #334155;
          margin-bottom:20px;
        ">

          <p style="
            margin:0;
            color:#60a5fa;
            font-size:.75rem;
            font-weight:800;
            text-transform:uppercase;
            margin-bottom:8px;
          ">
            Nombre:
          </p>

          <p style="
            margin:0;
            color:#fff;
            font-weight:700;
            font-size:.95rem;
            line-height:1.4;
          ">
            ${indicador.nombre}
          </p>

        </div>

        <!-- RESPONSABLE / PROCESO -->

        <div style="
          display:grid;
          grid-template-columns:1fr 1fr;
          gap:15px;
          margin-bottom:20px;
        ">

          <div>

            <p style="
              margin:0;
              color:#94a3b8;
              font-size:.7rem;
              font-weight:800;
              text-transform:uppercase;
            ">
              Responsable:
            </p>

            <p style="
              margin:4px 0 0 0;
              color:#fff;
              font-size:.85rem;
            ">
              ${indicador.responsable}
            </p>

          </div>

          <div>

            <p style="
              margin:0;
              color:#94a3b8;
              font-size:.7rem;
              font-weight:800;
              text-transform:uppercase;
            ">
              Proceso:
            </p>

            <p style="
              margin:4px 0 0 0;
              color:#fff;
              font-size:.85rem;
            ">
              ${indicador.proceso}
            </p>

          </div>

        </div>

        <!-- TIPO / FRECUENCIA -->

        <div style="
          display:grid;
          grid-template-columns:1fr 1fr;
          gap:15px;
          margin-bottom:20px;
        ">

          <div>

            <p style="
              margin:0;
              color:#94a3b8;
              font-size:.7rem;
              font-weight:800;
              text-transform:uppercase;
            ">
              Tipo de Indicador:
            </p>

            <p style="
              margin:4px 0 0 0;
              color:#3b82f6;
              font-weight:700;
              font-size:.85rem;
            ">
              ${indicador.tipo?.name || 'Sin tipo'}
            </p>

          </div>

          <div>

            <p style="
              margin:0;
              color:#94a3b8;
              font-size:.7rem;
              font-weight:800;
              text-transform:uppercase;
            ">
              Frecuencia:
            </p>

            <p style="
              margin:4px 0 0 0;
              color:#fff;
              font-size:.85rem;
            ">
              ${indicador.frecuencia}
            </p>

          </div>

        </div>

        <!-- UTILIDAD -->

        <div style="margin-bottom:25px;">

          <p style="
            margin:0;
            color:#94a3b8;
            font-size:.7rem;
            font-weight:800;
            text-transform:uppercase;
            margin-bottom:6px;
          ">
            ¿Para qué sirve este indicador?
          </p>

          <p style="
            margin:0;
            color:#cbd5e1;
            font-size:.8rem;
            font-style:italic;
            line-height:1.5;
            background:#12141d;
            padding:12px;
            border-radius:12px;
          ">
            "${indicador.utilidad}"
          </p>

        </div>

        <!-- LIMITES -->

        <div style="
          background:#12141d;
          padding:20px;
          border-radius:25px;
          border:1px solid #1e293b;
          margin-bottom:20px;
        ">

          <div style="
            display:grid;
            grid-template-columns:1fr 1fr 1fr;
            gap:10px;
            text-align:center;
          ">

            <div>

              <span style="
                display:block;
                font-size:.6rem;
                color:#3b82f6;
                font-weight:900;
                margin-bottom:5px;
              ">
                META
              </span>

              <span style="
                color:#60a5fa;
                font-size:1.1rem;
                font-weight:900;
              ">
                ${indicador.meta}%
              </span>

            </div>

            <div>

              <span style="
                display:block;
                font-size:.6rem;
                color:#10b981;
                font-weight:900;
                margin-bottom:5px;
              ">
                SATISFACTORIO
              </span>

              <span style="
                color:#10b981;
                font-size:1.1rem;
                font-weight:900;
              ">
                ${indicador.satisfactorio}%
              </span>

            </div>

            <div>

              <span style="
                display:block;
                font-size:.6rem;
                color:#ef4444;
                font-weight:900;
                margin-bottom:5px;
              ">
                CRÍTICO
              </span>

              <span style="
                color:#ef4444;
                font-size:1.1rem;
                font-weight:900;
              ">
                ${indicador.critico}%
              </span>

            </div>

          </div>

          <div style="
            margin-top:15px;
            text-align:center;
            border-top:1px solid #334155;
            padding-top:10px;
          ">

            <span style="
              font-size:.65rem;
              color:#64748b;
              font-weight:800;
              text-transform:uppercase;
            ">
              Tendencia:
            </span>

            <span style="
              font-size:.65rem;
              color:#60a5fa;
              font-weight:900;
            ">
              ${indicador.tendencia?.name || 'Sin tendencia'}
            </span>

          </div>

        </div>

        <!-- GRAFICA -->

        <div style="
          height:340px;
          background:#0f172a;
          border-radius:20px;
          border:1px dashed #334155;
          padding:20px;
          margin-bottom:20px;
        ">

          <div
            id="chart-container"
            style="
              width:100%;
              height:100%;
            "
          ></div>

        </div>

        <!-- BOTON -->

        <div style="
          margin-top:10px;
          text-align:center;
        ">

          <button
            onclick="Swal.close()"
            style="
              background:#2563eb;
              color:#fff;
              border:none;
              padding:12px 40px;
              border-radius:15px;
              font-weight:900;
              font-size:.8rem;
              cursor:pointer;
              transition:.3s;
              text-transform:uppercase;
            "
          >
            Entendido
          </button>

        </div>

      </div>
    `,
  });
};

  const handleDelete = async (id) => {

    const result = await Swal.fire({

      title: '¿Eliminar indicador?',

      text: 'Esta acción no se puede deshacer',

      icon: 'warning',

      background: '#1e212b',

      color: '#fff',

      showCancelButton: true,

      confirmButtonColor: '#dc2626',

      cancelButtonColor: '#334155',

      confirmButtonText: 'Eliminar',

      cancelButtonText: 'Cancelar',
    });

    if (!result.isConfirmed) return;

    try {

      // await deleteIndicator(id);

      setIndicadores((prev) =>
        prev.filter((item) => item.id !== id)
      );

      sileo.success('Indicador eliminado');

    } catch (error) {

      console.error(error);

      sileo.error('No se pudo eliminar');

    }
  };

  const columnHelper = createColumnHelper();

  const columns = [

    columnHelper.accessor('nombre', {
      header: 'INDICADOR',

      cell: (info) => (
        <div className="text-slate-200 text-xs font-bold leading-tight uppercase w-72">
          {info.getValue()}
        </div>
      ),
    }),

    columnHelper.accessor('entidad', {
      header: 'ENTIDAD',

      cell: (info) => (
        <span className="text-blue-500 text-[10px] font-black uppercase tracking-tight">
          {info.getValue()}
        </span>
      ),
    }),

    columnHelper.accessor('meta', {
      header: 'META',

      cell: (info) => (
        <span className="text-white font-black">
          {info.getValue()}%
        </span>
      ),
    }),

    columnHelper.display({

      id: 'acciones',

      header: () => (
        <div className="text-right pr-6">
          ACCIONES
        </div>
      ),

      cell: ({ row }) => {

        const indicador = row.original;

        return (

          <div className="flex justify-end items-center gap-4 pr-2">

            <button
              type="button"
              onClick={() => handleViewDetails(indicador)}
              className="text-slate-500 hover:text-white transition-all duration-200 hover:scale-125 active:scale-95"
            >
              <Eye size={20} />
            </button>

            <button
              type="button"
              onClick={() => sileo.info('Modo edición')}
              className="text-slate-500 hover:text-blue-400 transition-all duration-200 hover:scale-125 active:scale-95"
            >
              <Edit size={20} />
            </button>

            <button
              type="button"
              onClick={() => handleDelete(indicador.id)}
              className="text-slate-500 hover:text-red-500 transition-all duration-200 hover:scale-125 active:scale-95"
            >
              <Trash2 size={20} />
            </button>

          </div>
        );
      },
    }),
  ];

  const table = useReactTable({

    data: filteredData,

    columns,

    getCoreRowModel: getCoreRowModel(),
  });

  if (!hasMounted) return null;

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

    <section className="bg-[#1e212b] rounded-[40px] p-10 h-full flex flex-col shadow-2xl border border-slate-800 overflow-hidden">

      <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">

        <div>
          <h1 className="text-4xl font-black text-white italic tracking-tighter uppercase mb-1">
            Administrar Indicadores
          </h1>
        </div>

        {user?.role === 'superadmin' && (

          <div className="flex items-center gap-3 bg-[#12141d] p-2 rounded-2xl border border-slate-800 shadow-inner">

            <Filter
              size={18}
              className="text-slate-500 ml-2"
            />

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

                    {flexRender(
                      h.column.columnDef.header,
                      h.getContext()
                    )}

                  </th>

                ))}

              </tr>

            ))}

          </thead>

          <tbody>

            {table.getRowModel().rows.map((row) => (

              <tr
                key={row.id}
                className="bg-[#12141d]/50 hover:bg-[#12141d] transition-all"
              >

                {row.getVisibleCells().map((cell) => (

                  <td
                    key={cell.id}
                    className="px-6 py-5 first:rounded-l-[25px] last:rounded-r-[25px]"
                  >

                    {flexRender(
                      cell.column.columnDef.cell,
                      cell.getContext()
                    )}

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