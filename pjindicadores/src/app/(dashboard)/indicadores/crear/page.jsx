'use client';
import React, { useState, useEffect } from 'react';
import { sileo } from 'sileo';
import { useForm, Controller } from 'react-hook-form';
import Select from 'react-select';

const entidadOptions = [
  { value: 'sistemas', label: 'Sistemas de Información' },
  { value: 'infraestructura', label: 'Infraestructura' },
  { value: 'seguridad', label: 'Seguridad Digital ' },
];

const tipoOptions = [
  { value: 'Eficacia', label: 'Eficacia' },
  { value: 'Eficiencia', label: 'Eficiencia' },
  { value: 'Efectividad', label: 'Efectividad' },
];

const tendenciaOptions = [
  { value: 'Aumentar', label: 'Aumentar' },
  { value: 'Disminuir', label: 'Disminuir' },
];

const darkSelectStyles = {
  control: (base) => ({
    ...base,
    backgroundColor: '#12141d',
    borderColor: '#334155',
    borderRadius: '0.75',
    padding: '2px',
    color: 'white',
  }),
  menu: (base) => ({ ...base, backgroundColor: '#1e212b' }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isFocused ? '#2563eb' : '#1e212b',
    color: 'white',
  }),
  SingleValue: (base) => ({ ...base, color: 'white' }),
};

export default function CrearIndicador() {
  const [hasMounted, setHasMounted] = useState(false);
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    console.log('Datos capturados:', data);

    sileo.success({
      title: 'Indicador creado',
      description: `El indicador "${data.nombre}" se ha registrado exitosamente`,
    });
  };

  useEffect(() => {
    setHasMounted(true);
  });

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
        className="grid grid-cols-1 md:grid-cols-2 gap-8"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
          </div>

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
                    options={entidadOptions}
                    styles={darkSelectStyles}
                  />
                )}
              />
            </div>
          </div>
        </div>

        {/* FILA 2: ESTRATEGIA (Selects y Frecuencia) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-slate-300 mb-2 block">
                  Tipo de Indicador
                </label>
                <Controller
                  name="tipo"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      instanceId="tipo-select"
                      options={tipoOptions}
                      styles={darkSelectStyles}
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
                  render={({ field }) => (
                    <Select
                      {...field}
                      instanceId="tendencia-select"
                      options={tendenciaOptions}
                      styles={darkSelectStyles}
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

          <div>
            <label className="text-sm font-medium text-slate-300 mb-2 block">
              ¿Para qué sirve este indicador?
            </label>
            <textarea
              {...register('utilidad')}
              rows="4"
              placeholder="Describa el propósito estratégico del indicador..."
              className="w-full bg-[#12141d] border border-slate-700 rounded-xl p-4 text-white outline-none"
            />
          </div>
        </div>

        {/* SECCIÓN: METAS Y UMBRALES (El semáforo de control [4]) */}
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
            className="px-12 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-2xl transition-all shadow-lg active:scale-95"
          >
            Guardar indicador
          </button>
        </div>
      </form>
    </section>
  );
}
