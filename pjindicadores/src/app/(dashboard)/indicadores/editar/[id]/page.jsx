'use client';

import React, {
  useEffect,
  useState,
} from 'react';

import {
  useRouter,
  useParams,
} from 'next/navigation';

import Select from 'react-select';

import Swal from 'sweetalert2';

import { sileo } from 'sileo';

import {
  Loader2,
  Save,
  ArrowLeft,
} from 'lucide-react';

import {
  getIndicatorById,
  updateIndicator,
} from '@/services/indicatorServices';

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

export default function EditIndicatorPage() {

  const router = useRouter();

  const params = useParams();

  const { id } = params;

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [formData, setFormData] =
    useState({

      nombre: '',

      proceso: '',

      responsable: '',

      entidad: '',

      frecuencia: '',

      utilidad: '',

      meta: '',

      satisfactorio: '',

      critico: '',

      tipo: null,

      tendencia: null,
    });

  // =====================================================
  // OPTIONS
  // =====================================================

  const tipoOptions = [

    {
      value: 1,
      label: 'Eficacia',
    },

    {
      value: 2,
      label: 'Eficiencia',
    },

    {
      value: 3,
      label: 'Efectividad',
    },
  ];

  const tendenciaOptions = [

    {
      value: 1,
      label: 'Aumentar',
    },

    {
      value: 2,
      label: 'Disminuir',
    },

  ];

  // =====================================================
  // LOAD
  // =====================================================

  useEffect(() => {

    if (id) {
      loadIndicator();
    }

  }, [id]);

  const loadIndicator =
    async () => {

      try {

        setLoading(true);

        const data =
          await getIndicatorById(id);

        setFormData({

          nombre:
            data.nombre || '',

          proceso:
            data.proceso || '',

          responsable:
            data.responsable || '',

          entidad:
            data.entidad || '',

          frecuencia:
            data.frecuencia || '',

          utilidad:
            data.utilidad || '',

          meta:
            data.meta || '',

          satisfactorio:
            data.satisfactorio || '',

          critico:
            data.critico || '',

          tipo: data.tipo
            ? {
                value:
                  data.tipo.id,
                label:
                  data.tipo.name,
              }
            : null,

          tendencia:
            data.tendencia
              ? {
                  value:
                    data
                      .tendencia
                      .id,
                  label:
                    data
                      .tendencia
                      .name,
                }
              : null,
        });

      } catch (error) {

        console.error(error);

        sileo.error(
          'Error cargando indicador'
        );

      } finally {

        setLoading(false);
      }
    };

  // =====================================================
  // CHANGE
  // =====================================================

  const handleChange = (e) => {

    setFormData({

      ...formData,

      [e.target.name]:
        e.target.value,
    });
  };

  // =====================================================
  // SUBMIT
  // =====================================================

  const handleSubmit =
    async (e) => {

      e.preventDefault();

      try {

        setSaving(true);

        await updateIndicator(
          id,
          {

            nombre:
              formData.nombre,

            proceso:
              formData.proceso,

            responsable:
              formData.responsable,

            entidad:
              formData.entidad,

            frecuencia:
              formData.frecuencia,

            utilidad:
              formData.utilidad,

            meta:
              Number(
                formData.meta
              ),

            satisfactorio:
              Number(
                formData.satisfactorio
              ),

            critico:
              Number(
                formData.critico
              ),

            tipoId:
              formData.tipo
                ?.value,

            tendenciaId:
              formData
                .tendencia
                ?.value,
          }
        );

        Swal.fire({

          icon: 'success',

          title:
            'Indicador actualizado',

          background:
            '#1e212b',

          color: '#fff',

          confirmButtonColor:
            '#2563eb',
        });

        router.push(
          '/indicadores/admin'
        );

      } catch (error) {

        console.error(error);

        sileo.error(
          'Error actualizando indicador'
        );

      } finally {

        setSaving(false);
      }
    };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {

    return (

      <section className="bg-[#1e212b] rounded-[40px] p-10 h-full flex items-center justify-center border border-slate-800">

        <div className="flex flex-col items-center gap-5">

          <Loader2
            size={55}
            className="text-blue-500 animate-spin"
          />

          <p className="text-slate-400 font-semibold">
            Cargando indicador...
          </p>

        </div>

      </section>
    );
  }

  // =====================================================
  // UI
  // =====================================================

  return (

    <section className="bg-[#1e212b] rounded-[40px] p-10 border border-slate-800 shadow-2xl">

      {/* HEADER */}

      <div className="flex items-center justify-between mb-10">

        <div>

          <h1 className="text-4xl font-black text-white uppercase italic tracking-tight mb-2">

            Editar Indicador

          </h1>

          <p className="text-slate-400 text-sm">

            Modifica la información del indicador

          </p>

        </div>

        <button
          onClick={() =>
            router.back()
          }
          className="
            flex
            items-center
            gap-2
            px-5
            h-[50px]
            rounded-2xl
            bg-[#12141d]
            border
            border-slate-700
            text-white
            font-bold
            hover:bg-slate-800
            transition-all
          "
        >

          <ArrowLeft size={18} />

          Volver

        </button>

      </div>

      {/* FORM */}

      <form
        onSubmit={handleSubmit}
        className="space-y-8"
      >

        {/* GRID */}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          <Input
            label="Nombre"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
          />

          <Input
            label="Proceso"
            name="proceso"
            value={formData.proceso}
            onChange={handleChange}
          />

          <Input
            label="Responsable"
            name="responsable"
            value={formData.responsable}
            onChange={handleChange}
          />

          <Input
            label="Entidad"
            name="entidad"
            value={formData.entidad}
            onChange={handleChange}
          />

          <Input
            label="Frecuencia"
            name="frecuencia"
            value={formData.frecuencia}
            onChange={handleChange}
          />

          <div>

            <label className="block text-[11px] text-slate-400 font-black uppercase mb-2">

              Tipo

            </label>

            <Select
              value={formData.tipo}
              onChange={(value) =>
                setFormData({
                  ...formData,
                  tipo: value,
                })
              }
             styles={darkSelectStyles}
              options={tipoOptions}
            />

          </div>

          <div>

            <label className="block text-[11px] text-slate-400 font-black uppercase mb-2">

              Tendencia

            </label>

            <Select
              value={
                formData.tendencia
              }
              onChange={(value) =>
                setFormData({
                  ...formData,
                  tendencia:
                    value,
                })
              }
               styles={darkSelectStyles}
              options={
                tendenciaOptions
              }
            />

          </div>

          <Input
            label="Meta"
            name="meta"
            type="number"
            value={formData.meta}
            onChange={handleChange}
          />

          <Input
            label="Satisfactorio"
            name="satisfactorio"
            type="number"
            value={
              formData.satisfactorio
            }
            onChange={handleChange}
          />

          <Input
            label="Crítico"
            name="critico"
            type="number"
            value={formData.critico}
            onChange={handleChange}
          />

        </div>

        {/* UTILIDAD */}

        <div>

          <label className="block text-[11px] text-slate-400 font-black uppercase mb-2">

            Utilidad

          </label>

          <textarea
            name="utilidad"
            rows="5"
            value={formData.utilidad}
            onChange={handleChange}
            className="
              w-full
              rounded-2xl
              bg-[#12141d]
              border
              border-slate-700
              p-5
              text-white
              outline-none
            "
          />

        </div>

        {/* BUTTON */}

        <div className="flex justify-end">

          <button
            type="submit"
            disabled={saving}
            className="
              h-[58px]
              px-10
              rounded-2xl
              bg-blue-600
              hover:bg-blue-500
              transition-all
              text-white
              font-black
              uppercase
              tracking-wider
              flex
              items-center
              gap-3
            "
          >

            {saving ? (

              <Loader2
                size={20}
                className="animate-spin"
              />

            ) : (

              <Save size={20} />

            )}

            Guardar Cambios

          </button>

        </div>

      </form>

    </section>
  );
}

// =====================================================
// INPUT COMPONENT
// =====================================================

function Input({
  label,
  name,
  value,
  onChange,
  type = 'text',
}) {

  return (

    <div>

      <label className="block text-[11px] text-slate-400 font-black uppercase mb-2">

        {label}

      </label>

      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className="
          w-full
          h-[58px]
          rounded-2xl
          bg-[#12141d]
          border
          border-slate-700
          px-5
          text-white
          outline-none
        "
      />

    </div>
  );
}