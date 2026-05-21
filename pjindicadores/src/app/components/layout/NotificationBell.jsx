'use client';

import {
  useEffect,
  useState,
  useRef,
} from 'react';

import {
  Bell,
  Trash2,
} from 'lucide-react';

import moment from 'moment';

import 'moment/locale/es';

import {
  getNotifications,
  deleteNotification,
} from '@/services/notificationServices';

moment.locale('es');

export default function NotificationBell() {

  const [open, setOpen] =
    useState(false);

  const [notifications, setNotifications] =
    useState([]);

  const dropdownRef =
    useRef(null);

  // =====================================================
  // CARGAR NOTIFICACIONES
  // =====================================================

  useEffect(() => {

    loadNotifications();

    const interval =
      setInterval(() => {

        loadNotifications();

      }, 10000);

    return () =>
      clearInterval(interval);

  }, []);

  // =====================================================
  // CERRAR AL HACER CLICK FUERA
  // =====================================================

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

  // =====================================================
  // OBTENER NOTIFICACIONES
  // =====================================================

  const loadNotifications =
    async () => {

      try {

        const data =
          await getNotifications();

        setNotifications(data);

      } catch (error) {

        console.log(error);

      }

    };

  // =====================================================
  // ELIMINAR
  // =====================================================

  const handleDelete =
    async (id) => {

      try {

        await deleteNotification(id);

        setNotifications((prev) =>
          prev.filter(
            (n) => n.id !== id
          )
        );

      } catch (error) {

        console.log(error);

      }

    };

  return (

    <div
      ref={dropdownRef}
      className="relative"
    >

      {/* =====================================================
          BOTÓN CAMPANA
      ===================================================== */}

      <button
        onClick={() =>
          setOpen(!open)
        }
        className="
          relative
          text-slate-400
          hover:text-white
          transition-colors
        "
      >

        <Bell
          size={20}
          className={
            notifications.length > 0
              ? 'animate-pulse'
              : ''
          }
        />

        {/* CONTADOR */}

        {notifications.length > 0 && (

          <div
            className="
              absolute
              -top-2
              -right-2
              min-w-[20px]
              h-[20px]
              rounded-full
              bg-red-600
              text-white
              text-[10px]
              font-black
              flex
              items-center
              justify-center
              px-1
            "
          >

            {notifications.length}

          </div>

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
            mt-4
            w-[420px]
            max-h-[600px]
            overflow-y-auto
            bg-[#1e212b]
            border
            border-slate-800
            rounded-[30px]
            shadow-2xl
            z-50
            p-4
          "
        >

          {/* HEADER */}

          <div
            className="
              flex
              justify-between
              items-center
              mb-5
              px-2
            "
          >

            <h2
              className="
                text-white
                font-black
                uppercase
                text-sm
              "
            >

              Notificaciones

            </h2>

            <span
              className="
                text-[10px]
                uppercase
                text-blue-500
                font-black
              "
            >

              {notifications.length} nuevas

            </span>

          </div>

          {/* LISTA */}

          <div className="space-y-3">

            {notifications.length === 0 && (

              <div
                className="
                  text-center
                  text-slate-500
                  py-10
                  text-sm
                "
              >

                No hay notificaciones

              </div>

            )}

            {notifications.map(
              (notification) => (

                <div
                  key={notification.id}
                  className="
                    bg-[#12141d]
                    border
                    border-slate-800
                    rounded-2xl
                    p-4
                    hover:border-blue-500/30
                    transition-all
                  "
                >

                  <div
                    className="
                      flex
                      justify-between
                      items-start
                      gap-3
                    "
                  >

                    <div className="flex-1">

                      <p
                        className="
                          text-white
                          text-sm
                          font-bold
                          mb-2
                          leading-relaxed
                        "
                      >

                        {notification.message}

                      </p>

                      <span
                        className="
                          text-[10px]
                          uppercase
                          text-slate-500
                          font-black
                        "
                      >

                        {moment(
                          notification.createdAt
                        ).fromNow()}

                      </span>

                    </div>

                    {/* ELIMINAR */}

                    <button
                      onClick={() =>
                        handleDelete(
                          notification.id
                        )
                      }
                      className="
                        text-red-500
                        hover:text-red-400
                        transition-colors
                      "
                    >

                      <Trash2 size={16} />

                    </button>

                  </div>

                </div>

              )
            )}

          </div>

        </div>

      )}

    </div>
  );
}