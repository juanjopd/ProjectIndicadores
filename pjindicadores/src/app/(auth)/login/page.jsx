'use client';
import { useForm } from 'react-hook-form';
import { sileo } from 'sileo';
import { Lock, Mail, LogIn, ShieldCheck } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { login } from '@/services/authService';

export default function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const router = useRouter();

  const onSubmit = async (data) => {
    try {
      const response = await login(data.email, data.password);

      (sileo.success('Acceso concedido'),
        {
          description: 'Bienvenido al sistema de Gestión de Indicadores',
        });

        localStorage.setItem('user', JSON.stringify(response.user));

      router.push('/');
      router.refresh(); 
    } catch (error) {
      sileo.error('Error de acceso', {
        description: 'Correo o contraseña incorrectos',
      });
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#0f111a] p-4">
      {/* Contenedor Principal*/}
      <div className="bg-[#1e212b] w-full max-w-105 rounded-[40px] p-12 border border-slate-800 shadow-2xl">
        <div className="text-center mb-10">
          <div className="inline-flex p-4 bg-blue-600/10 rounded-2xl mb-4">
            <ShieldCheck className="text-blue-500" size={32} />
          </div>
          <h1 className="text-3xl font-black text-white uppercase italic tracking-tighter">
            Login
          </h1>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Input de Correo con Icono al lado */}
          <div className="space-y-1">
            <div className="flex items-center gap-3 bg-[#12141d] border border-slate-800 rounded-2xl px-4 py-1 focus-within:border-blue-500 transition-all">
              <Mail size={18} className="text-slate-500" />
              <input
                {...register('email', { required: 'El correo es obligatorio' })}
                type="email"
                placeholder="correo electrónico"
                className="w-full bg-transparent p-3 text-white text-xs outline-none"
              />
            </div>
            {errors.email && (
              <span className="text-red-500 text-[9px] font-bold uppercase ml-4">
                {errors.email.message}
              </span>
            )}
          </div>

          {/* Input de Contraseña con Icono al lado */}
          <div className="space-y-1">
            <div className="flex items-center gap-3 bg-[#12141d] border border-slate-800 rounded-2xl px-4 py-1 focus-within:border-blue-500 transition-all">
              <Lock size={18} className="text-slate-500" />
              <input
                {...register('password', {
                  required: 'La contraseña es obligatoria',
                })}
                type="password"
                placeholder="********"
                className="w-full bg-transparent p-3 text-white text-xs outline-none"
              />
            </div>
            {errors.password && (
              <span className="text-red-500 text-[9px] font-bold uppercase ml-4">
                {errors.password.message}
              </span>
            )}
          </div>

          {/* Checkbox al lado de Recordarme */}
          <div className="flex items-center justify-between px-2">
            <label className="flex items-center gap-2 cursor-pointer group">
              <input
                type="checkbox"
                className="w-4 h-4 rounded bg-slate-800 border-none text-blue-600 focus:ring-0 cursor-pointer"
              />
              <span className="text-[10px] text-slate-500 font-bold uppercase group-hover:text-slate-300 transition-colors">
                Recordarme
              </span>
            </label>
          </div>

          {/* Botón de Acción */}
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-500 text-white p-5 rounded-2xl flex justify-center items-center transition-all shadow-lg shadow-blue-900/20 active:scale-95"
          >
            <LogIn size={22} />
          </button>
        </form>

        <p className="mt-10 text-[10px] text-slate-700 font-black uppercase tracking-[0.3em] text-center">
          Acceso Restringido
        </p>
      </div>
    </main>
  );
}
