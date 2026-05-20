'use client';

import { useEffect, useRef, useState } from 'react';

import {
  Search,
  Share2,
  Plus,
  Bell,
} from 'lucide-react';

const TopBar = () => {

  // =====================================================
  // ESTADOS
  // =====================================================

  const [open, setOpen] =
    useState(false);

  const [notifications] =
    useState([

      {
        id: 1,

        title:
          'Sistema TI',

        message:
          'Se actualizó el indicador de auditoría interna con cumplimiento del 92%.',

        time:
          'Hace 5 minutos',
      },

      {
        id: 2,

        title:
          'Calidad',

        message:
          'Nuevo análisis agregado al indicador de satisfacción.',

        time:
          'Hace 12 minutos',
      },

      {
        id: 3,

        title:
          'Talento Humano',

        message:
          'Se registró un nuevo periodo para el indicador de desempeño.',

        time:
          'Hace 20 minutos',
      },
    ]);

  // =====================================================
  // CERRAR DROPDOWN
  // =====================================================

  const dropdownRef =
    useRef(null);

  useEffect(() => {

    const handleClickOutside =
      (event) => {

        if (
          dropdownRef.current &&
          !dropdownRef.current.contains(
            event.target
          )
        ) {

          setOpen(false);
        }
      };

    document.addEventListener(
      'mousedown',
      handleClickOutside
    );

    return () => {

      document.removeEventListener(
        'mousedown',
        handleClickOutside
      );
    };

  }, []);

  return (

    <header className="h-16 flex items-center justify-between px-2 relative">

      {/* =====================================================
          BUSCADOR
      ===================================================== */}

      <div className="relative w-80">

        <span className="absolute inset-y-0 left-4 flex items-center text-slate-50">

          <Search size={18} />

        </span>

        <input
          type="text"
          placeholder="Buscar indicadores..."
          className="
            w-full
            bg-[#1e212b]
            border-none
            rounded-full
            py-2.5
            pl-12
            pr-4
            text-sm
            text-slate-300
            focus:ring-1
            focus:ring-slate-600
            outline-none
            placeholder:text-slate-500
          "
        />

      </div>

      {/* =====================================================
          ACCIONES
      ===================================================== */}

      <div className="flex items-center gap-6">

        <div className="flex items-center gap-5 text-slate-400">

          {/* SHARE */}

          <button
            className="
              hover:text-white
              transition-colors
            "
          >

            <Share2 size={20} />

          </button>

          {/* PLUS */}

          <button
            className="
              hover:text-white
              transition-colors
              border
              border-slate-700
              rounded-full
              p-1
            "
          >

            <Plus size={20} />

          </button>

          {/* =====================================================
              NOTIFICACIONES
          ===================================================== */}

          <div
            ref={dropdownRef}
            className="relative"
          >

            <button
              onClick={() =>
                setOpen(!open)
              }
              className="
                relative
                hover:text-white
                transition-colors
              "
            >

              <Bell
                size={20}
                className={
                  notifications.length >
                  0
                    ? 'animate-pulse'
                    : ''
                }
              />

              {/* PUNTO ROJO */}

              {notifications.length >
                0 && (

                <span
                  className="
                    absolute
                    top-0
                    right-0
                    w-2
                    h-2
                    bg-red-500
                    rounded-full
                    border-2
                    border-[#0b0c12]
                  "
                ></span>

              )}

            </button>

            {/* =====================================================
                DROPDOWN
            ===================================================== */}

            {open && (

              <div
                className="
                  absolute
                  right-0
                  top-12
                  w-96
                  bg-[#1e212b]
                  border
                  border-slate-800
                  rounded-[30px]
                  shadow-2xl
                  z-50
                  overflow-hidden
                "
              >

                {/* HEADER */}

                <div
                  className="
                    px-6
                    py-4
                    border-b
                    border-slate-800
                    flex
                    justify-between
                    items-center
                  "
                >

                  <h2
                    className="
                      text-white
                      text-sm
                      font-black
                      uppercase
                      tracking-wider
                    "
                  >

                    Actualizaciones

                  </h2>

                  <span
                    className="
                      text-[10px]
                      text-blue-500
                      font-black
                      uppercase
                    "
                  >

                    {
                      notifications.length
                    } nuevas

                  </span>

                </div>

                {/* LISTA */}

                <div
                  className="
                    max-h-[420px]
                    overflow-y-auto
                    p-4
                    space-y-4
                    custom-scrollbar
                  "
                >

                  {notifications.map(
                    (n) => (

                      <div
                        key={n.id}
                        className="
                          p-4
                          rounded-3xl
                          bg-[#12141d]
                          border
                          border-slate-800
                          hover:bg-slate-800/30
                          transition-all
                          cursor-pointer
                        "
                      >

                        <div
                          className="
                            flex
                            items-start
                            gap-4
                          "
                        >

                          {/* ICONO */}

                          <div
                            className="
                              w-10
                              h-10
                              rounded-full
                              bg-blue-500/10
                              border
                              border-blue-500/20
                              flex
                              items-center
                              justify-center
                              shrink-0
                            "
                          >

                            <Bell
                              size={16}
                              className="
                                text-blue-400
                              "
                            />

                          </div>

                          {/* TEXTO */}

                          <div>

                            <p
                              className="
                                text-white
                                text-[11px]
                                font-black
                                uppercase
                                mb-1
                              "
                            >

                              {n.title}

                            </p>

                            <p
                              className="
                                text-slate-500
                                text-[10px]
                                leading-relaxed
                              "
                            >

                              {n.message}

                            </p>

                            <span
                              className="
                                text-[9px]
                                text-blue-500
                                font-bold
                                uppercase
                                mt-2
                                block
                              "
                            >

                              {n.time}

                            </span>

                          </div>

                        </div>

                      </div>
                    )
                  )}

                </div>

              </div>

            )}

          </div>

        </div>

        {/* =====================================================
            AVATAR
        ===================================================== */}

        <div
          className="
            w-10
            h-10
            rounded-full
            overflow-hidden
            border-2
            border-slate-700
            cursor-pointer
          "
        >

          <img
            src="https://avatar.iran.liara.run/public/30"
            alt="User profile"
            className="
              w-full
              h-full
              object-cover
            "
          />

        </div>

      </div>

    </header>
  );
};

export default TopBar;