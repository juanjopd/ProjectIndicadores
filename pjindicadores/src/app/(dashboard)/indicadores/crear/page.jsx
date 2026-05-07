'use client';

import React, { useState, useEffect } from 'react';
import { sileo } from 'sileo';
import { useForm, Controller } from 'react-hook-form';
import Select from 'react-select';

import { getEntities } from '@/services/entityServices';

import {
  createIndicator,
  getTypes,
  getTrends
} from '@/services/indicatorServices';

import { getMe } from '@/services/authService';

const darkSelectStyles = {
  control: (base) => ({
    ...base,
    backgroundColor: '#12141d',
    borderColor: '#334155',
    borderRadius: '0.75rem',
    padding: '2px',
    color: 'white',
    minHeight: '48px',
  }),

  menu: (base) => ({
    ...base,
    backgroundColor: '#1e212b',
  }),

  option: (base, state) => ({
    ...base,
    backgroundColor: state.isFocused ? '#2563eb' : '#1e212b',
    color: 'white',
  }),

  singleValue: (base) => ({
    ...base,
    color: 'white',
  }),

  input: (base) => ({
    ...base,
    color: 'white',
  }),

  placeholder: (base) => ({
    ...base,
    color: '#94a3b8',
  }),
};

export default function CrearIndicador() {

  const [loading, setLoading] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);
  const [user, setUser] = useState(null);
  const [entidades, setEntidades] = useState([]);
  const [tipos, setTipos] = useState([]);
  const [tendencias, setTendencias] = useState([]);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {

    const loadData = async () => {

      try {

        const userData = await getMe();

        setUser(userData.user);

        const typesData = await getTypes();

        const trendsData = await getTrends();

        setTipos(typesData);

        setTendencias(trendsData);

        if (userData.user.role === 'superadmin') {

          const entidadesData = await getEntities();

          setEntidades(entidadesData);

        }

      } catch (error) {

        console.error(error);

        sileo.error('Error cargando datos');

      }
    };

    loadData();

  }, []);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      
      const payload = {

        nombre: data.nombre,
        proceso: data.proceso,
        responsable: data.responsable,

        tipoId: data.tipo?.value,

        tendenciaId: data.tendencia?.value,

        frecuencia: data.frecuencia,
        utilidad: data.utilidad,

        meta: data.meta,
        satisfactorio: data.satisfactorio,
        critico: data.critico,

        entityId:
          user?.role === 'superadmin'
            ? data.entidad?.value
            : user?.id,
      };

      await createIndicator(payload);

      sileo.success({
        title: 'Indicador creado',
        description: `El indicador "${data.nombre}" se ha registrado exitosamente`,
      });

      reset();
      
    } catch (error) {

      console.error(error);

      sileo.error('No se pudo crear el indicador');

    } finally {
      setLoading(false);
    }
  };

  if (!hasMounted) {
    return (
      <div className="p-10 text-slate-500">
        Cargando formulario de indicadores...
      </div>
    );
  }

  return (
    <section className="bg-[#1e212b] rounded-[45px] p-10 h-full overflow-y-auto shadow-2xl">

      <div className="mb-8">
        <h1 className="text-4xl font-black text-white uppercase italic tracking-tighter mb-2">
          Crear nuevo indicador
        </h1>

        <p className="text-slate-400 fonr-medium">
          Define los párametros del indicador
        </p>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-1 gap-8"
      >

        {/* FILA 1 */}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

          {/* IZQUIERDA */}

          <div className="space-y-6">

            <div>
              <label className="text-sm font-medium text-slate-300 mb-2 block">
                Nombre del Indicador
              </label>

              <input
                {...register('nombre', { required: true })}
                placeholder="Ej: Porcentaje de proyectos..."
                className="w-full bg-[#12141d] border border-slate-700 rounded-xl p-3 text-white outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-slate-300 mb-2 block">
                Proceso
              </label>

              <input
                {...register('proceso')}
                placeholder="Ej: Sistemas de Información"
                className="w-full bg-[#12141d] border border-slate-700 rounded-xl p-3 text-white outline-none"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-slate-300 mb-2 block">
                ¿Para qué sirve este indicador?
              </label>

              <textarea
                {...register('utilidad')}
                rows="5"
                placeholder="Describa el propósito estratégico del indicador..."
                className="w-full bg-[#12141d] border border-slate-700 rounded-xl p-4 text-white outline-none"
              />
            </div>

          </div>

          {/* DERECHA */}

          <div className="space-y-6">

            <div>
              <label className="text-sm font-medium text-slate-300 mb-2 block">
                Responsable
              </label>

              <input
                {...register('responsable')}
                placeholder="Ej: Alejandro Ramírez Medina"
                className="w-full bg-[#12141d] border border-slate-700 rounded-xl p-3 text-white outline-none"
              />
            </div>

            {user?.role === 'superadmin' && (

              <div>
                <label className="text-sm font-medium text-slate-300 mb-2 block">
                  Entidad
                </label>

                <Controller
                  name="entidad"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      instanceId="crear-entidad-select"
                      options={entidades.map(e => ({
                        value: e.id,
                        label: e.name
                      }))}
                      styles={darkSelectStyles}
                    />
                  )}
                />
              </div>

            )}

            <div className="grid grid-cols-2 gap-4 items-start">

              <div>
                <label className="text-sm font-medium text-slate-300 mb-2 block">
                  Tipo de Indicador
                </label>

               <Controller
  name="tipo"
  control={control}
  defaultValue={null}
  render={({ field }) => (
    <Select
      instanceId="tipo-select"
      options={tipos.map(tipo => ({
        value: tipo.id,
        label: tipo.name
      }))}
      styles={darkSelectStyles}
      value={field.value}
      onChange={field.onChange}
    />
  )}
/>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-300 mb-2 block">
                  Tendencia Esperada
                </label>

               <Controller
  name="tendencia"
  control={control}
  defaultValue={null}
  render={({ field }) => (
    <Select
      instanceId="tendencia-select"
      options={tendencias.map(t => ({
        value: t.id,
        label: t.name
      }))}
      styles={darkSelectStyles}
      value={field.value}
      onChange={field.onChange}
    />
  )}
/>
              </div>

            </div>

            <div>
              <label className="text-sm font-medium text-slate-300 mb-2 block">
                Frecuencia de Medición
              </label>

              <input
                {...register('frecuencia')}
                placeholder="Ej: Anual o Semestral"
                className="w-full bg-[#12141d] border border-slate-700 rounded-xl p-3 text-white outline-none"
              />
            </div>

          </div>

        </div>

        {/* UMBRALES */}

        <div className="bg-[#12141d] p-8 rounded-[30px] border border-slate-800">

          <h2 className="text-xl font-semibold text-blue-400 mb-6 uppercase tracking-widest text-xs">
            Umbrales de Cumplimiento
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

            <div className="text-center">
              <label className="text-xs text-slate-500 font-bold block mb-2">
                META (%)
              </label>

              <input
                type="number"
                {...register('meta')}
                className="w-full bg-[#1e212b] border border-slate-700 rounded-xl p-4 text-2xl font-bold text-white text-center"
              />
            </div>

            <div className="text-center">
              <label className="text-xs text-green-500 font-bold block mb-2">
                SATISFACTORIO (%)
              </label>

              <input
                type="number"
                {...register('satisfactorio')}
                className="w-full bg-[#1e212b] border border-green-900/20 rounded-xl p-4 text-2xl font-bold text-green-400 text-center"
              />
            </div>

            <div className="text-center">
              <label className="text-xs text-red-500 font-bold block mb-2">
                CRÍTICO (%)
              </label>

              <input
                type="number"
                {...register('critico')}
                className="w-full bg-[#1e212b] border border-red-900/20 rounded-xl p-4 text-2xl font-bold text-red-400 text-center"
              />
            </div>

          </div>

        </div>

        <div className="flex justify-end gap-4 pb-10">

          <button
            type="submit"
            disabled={loading}
  className={`
    px-12 py-4 rounded-2xl font-bold text-white
    transition-all duration-300 shadow-lg
    active:scale-95
    ${loading
      ? 'bg-blue-400 animate-pulse cursor-not-allowed'
      : 'bg-blue-600 hover:bg-blue-500 hover:scale-[1.02]'
    }
  `}
>
  {loading ? 'Guardando...' : 'Guardar indicador'}
          </button>

        </div>

      </form>

    </section>
  );
}