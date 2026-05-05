'use client';

import { Plus, Pencil, Eye, UserX, Building2 } from 'lucide-react';
import Swal from 'sweetalert2';
import { useState, useEffect } from 'react';
import { sileo } from 'sileo';

import {
  createEntity,
  getEntities,
  updateEntity,
  toggleEntity
} from '@/services/entityServices';

export default function CrearEntidad() {

  const [entidades, setEntidades] = useState([]);

  /* =========================
     CARGAR ENTIDADES
  ========================= */

  const loadEntities = async () => {
    try {
      const data = await getEntities();
      setEntidades(data);
    } catch (error) {
      console.error(error);
      sileo.error('No se pudieron cargar las entidades');
    }
  };

  useEffect(() => {
    loadEntities();
  }, []);

  /* =========================
     CREAR ENTIDAD
  ========================= */

  const abrirModalCreacion = () => {
    Swal.fire({
      title:
        '<span class="text-white italic font-black uppercase text-xl">Nueva Entidad</span>',
      background: '#1e212b',
      html: `
        <div class="p-4 flex flex-col gap-5 text-left">
          <input id="swal-nombre"
          placeholder="Nombre"
          class="w-full bg-[#12141d] border border-slate-800 rounded-2xl p-4 text-white">

          <input id="swal-correo"
          type="email"
          placeholder="Correo"
          class="w-full bg-[#12141d] border border-slate-800 rounded-2xl p-4 text-white">

          <input id="swal-pass"
          type="password"
          placeholder="Contraseña"
          class="w-full bg-[#12141d] border border-slate-800 rounded-2xl p-4 text-white">
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: 'Guardar Entidad',
      confirmButtonColor: '#2563eb',

      preConfirm: () => {
        const nombre = document.getElementById('swal-nombre').value;
        const correo = document.getElementById('swal-correo').value;
        const pass = document.getElementById('swal-pass').value;

        if (!nombre || !correo || !pass) {
          Swal.showValidationMessage('Todos los campos son obligatorios');
          return false;
        }

        return { name: nombre, email: correo, pass };
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {

          const nuevaEntidad = await createEntity(result.value);

          // 🔥 FIX IMPORTANTE (asegura formato correcto)
          const entidadFinal = nuevaEntidad.entity || nuevaEntidad;

          setEntidades(prev => [entidadFinal, ...prev]);

          sileo.success('Entidad registrada');

        } catch (error) {
          console.error(error);
          sileo.error('No se pudo crear la entidad');
        }
      }
    });
  };

  /* =========================
     VER PASSWORD (FIX)
  ========================= */

  const verPassword = () => {
    Swal.fire({
      title: 'Seguridad',
      text: 'La contraseña no puede ser visualizada',
      icon: 'info'
    });
  };

  /* =========================
     EDITAR ENTIDAD
  ========================= */

  const abrirModalEdicion = (entidad) => {
    Swal.fire({
      title:
        '<span class="text-white italic font-black uppercase text-xl">Editar Entidad</span>',
      background: '#1e212b',
      html: `
        <div class="p-4 flex flex-col gap-5">
          <input id="edit-nombre"
          value="${entidad.name}"
          class="w-full bg-[#12141d] border border-slate-800 rounded-2xl p-4 text-white">

          <input id="edit-correo"
          value="${entidad.email}"
          class="w-full bg-[#12141d] border border-slate-800 rounded-2xl p-4 text-white">
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: 'Actualizar',
      confirmButtonColor: '#2563eb',

      preConfirm: () => {
        const nombre = document.getElementById('edit-nombre').value;
        const correo = document.getElementById('edit-correo').value;

        if (!nombre || !correo) {
          Swal.showValidationMessage('Campos obligatorios');
          return false;
        }

        return { name: nombre, email: correo };
      },

    }).then(async (result) => {
      if (result.isConfirmed) {
        try {

          const updated = await updateEntity(entidad.id, result.value);

          const entidadFinal = updated.user || updated;

          setEntidades(prev =>
            prev.map(e => e.id === entidad.id ? entidadFinal : e)
          );

          sileo.success('Entidad actualizada');

        } catch (error) {
          console.error(error);
          sileo.error('No se pudo actualizar');
        }
      }
    });
  };

  /* =========================
     ACTIVAR / DESACTIVAR
  ========================= */

  const cambiarEstado = async (entidad) => {

    const confirm = await Swal.fire({
      title: 'Cambiar estado',
      text: entidad.estado
        ? '¿Desactivar entidad?'
        : '¿Activar entidad?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444'
    });

    if (!confirm.isConfirmed) return;

    try {

      const updated = await toggleEntity(entidad.id);

      const entidadFinal = updated.entity || updated;

      setEntidades(prev =>
        prev.map(e => e.id === entidad.id ? entidadFinal : e)
      );

      sileo.success('Estado actualizado');

    } catch (error) {

      console.error(error);
      sileo.error('Error al cambiar estado');

    }
  };

  /* =========================
     RENDER
  ========================= */

  return (
    <section className="bg-[#1e212b] rounded-[40px] p-10 border border-slate-800 shadow-2xl">

      <div className="flex justify-between items-center mb-10">
        <h1 className="text-4xl font-black text-white italic uppercase">
          Gestión de Entidades
        </h1>

        <button
          onClick={abrirModalCreacion}
          className="bg-blue-600 hover:bg-blue-500 text-white font-black text-xs px-8 py-5 rounded-2xl flex items-center gap-3"
        >
          <Plus size={18} /> Nueva Entidad
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-separate border-spacing-y-3">
          <thead>
            <tr className="text-slate-500 text-[10px] font-black uppercase">
              <th className="px-6">Entidad</th>
              <th className="px-6">Correo</th>
              <th className="px-6">Estado</th>
              <th className="px-6 text-right">Acciones</th>
            </tr>
          </thead>

          <tbody>
            {entidades.map((entidad, index) => (
              <tr key={entidad.id ?? `entidad-${index}`} className="bg-[#12141d] hover:bg-[#1a1d29]">

                <td className="px-6 py-5">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-600/10 rounded-xl text-blue-500">
                      <Building2 size={20} />
                    </div>
                    <span className="text-white font-black text-sm">
                      {entidad.name}
                    </span>
                  </div>
                </td>

                <td className="px-6 py-5 text-slate-400 text-xs">
                  {entidad.email}
                </td>

                <td className="px-6 py-5">
                  <span className={`text-[9px] font-black px-3 py-1 rounded-full uppercase
                    ${entidad.estado
                      ? "bg-green-500/10 text-green-500"
                      : "bg-red-500/10 text-red-500"
                    }`}>
                    {entidad.estado ? "Activo" : "Inactivo"}
                  </span>
                </td>

                <td className="px-6 py-5 text-right">
                  <div className="flex justify-end gap-2">

                    <button
                      onClick={() => abrirModalEdicion(entidad)}
                      className="p-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl"
                    >
                      <Pencil size={16} />
                    </button>

                    <button
                      onClick={() => verPassword()}
                      className="p-3 bg-slate-800 hover:bg-slate-700 text-blue-400 rounded-xl"
                    >
                      <Eye size={16} />
                    </button>

                    <button
                      onClick={() => cambiarEstado(entidad)}
                      className="p-3 bg-slate-800 hover:bg-red-900/30 text-red-500 rounded-xl"
                    >
                      <UserX size={16} />
                    </button>

                  </div>
                </td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </section>
  );
}