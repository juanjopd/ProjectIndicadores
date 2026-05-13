'use client';

import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { TriangleAlert } from 'lucide-react';
import { logout } from '@/services/authService';

export default function SessionTimeoutModal() {

  const [warningShown, setWarningShown] = useState(false);

  useEffect(() => {

    let warningTimer;
    let logoutTimer;

    const resetTimers = () => {

      clearTimeout(warningTimer);
      clearTimeout(logoutTimer);

      setWarningShown(false);

      // ⚠️ Mostrar advertencia después de 25 minutos
      warningTimer = setTimeout(() => {

        setWarningShown(true);

        let countdown = 60;

        Swal.fire({
          html: `
            <div style="display:flex;flex-direction:column;align-items:center;padding:10px;">

              <div style="
                width:70px;
                height:70px;
                border-radius:20px;
                background:#dc2626;
                display:flex;
                align-items:center;
                justify-content:center;
                margin-bottom:20px;
              ">
                <svg xmlns="http://www.w3.org/2000/svg" width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                  <line x1="12" y1="9" x2="12" y2="13"></line>
                  <line x1="12" y1="17" x2="12.01" y2="17"></line>
                </svg>
              </div>

              <h2 style="
                color:white;
                font-size:1.4rem;
                font-weight:900;
                margin:0 0 10px 0;
                text-transform:uppercase;
              ">
                Sesión por expirar
              </h2>

              <p style="
                color:#94a3b8;
                font-size:.9rem;
                text-align:center;
                line-height:1.6;
                margin-bottom:20px;
              ">
                Tu sesión se cerrará automáticamente por inactividad.
              </p>

              <div id="countdown" style="
                color:#60a5fa;
                font-size:2.5rem;
                font-weight:900;
                margin-bottom:20px;
              ">
                60
              </div>

              <button id="continue-session-btn" style="
                background:#2563eb;
                color:white;
                border:none;
                padding:14px 35px;
                border-radius:18px;
                font-weight:900;
                cursor:pointer;
                text-transform:uppercase;
                font-size:.8rem;
                transition:.3s;
              ">
                Continuar sesión
              </button>

            </div>
          `,

          background: '#1e212b',
          showConfirmButton: false,
          allowOutsideClick: false,
          allowEscapeKey: false,
          width: '450px',
          customClass: {
            popup: 'rounded-[35px] border border-slate-700',
          },

          didOpen: () => {

            const countdownEl = document.getElementById('countdown');
            const continueBtn = document.getElementById('continue-session-btn');

            const interval = setInterval(() => {

              countdown--;

              if (countdownEl) {
                countdownEl.innerText = countdown;
              }

              if (countdown <= 0) {
                clearInterval(interval);
              }

            }, 1000);

            continueBtn?.addEventListener('click', () => {

              clearInterval(interval);

              Swal.close();

              resetTimers();
            });
          },
        });

      }, 25 * 60 * 1000);

      // ⚠️ Logout automático a los 26 minutos
      logoutTimer = setTimeout(async () => {

        try {

          await logout();

          Swal.close();

          window.location.href = '/login';

        } catch (error) {

          console.error(error);
        }

      }, 26 * 60 * 1000);
    };

    resetTimers();

    const events = [
      'mousemove',
      'keydown',
      'click',
      'scroll',
    ];

    events.forEach((event) => {
      window.addEventListener(event, resetTimers);
    });

    return () => {

      clearTimeout(warningTimer);
      clearTimeout(logoutTimer);

      events.forEach((event) => {
        window.removeEventListener(event, resetTimers);
      });
    };

  }, []);

  return null;
}





