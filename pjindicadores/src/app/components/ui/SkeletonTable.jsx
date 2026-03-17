export default function SkeletonTable({ rows = 5 }) {
  return (
    <tbody>
      {Array.from({ length: rows }).map((_, i) => (
        <tr
          key={i}
          className="bg-[#12141d] animate-pulse"
        >
          {/* Entidad */}
          <td className="px-6 py-5">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-slate-800"></div>
              <div className="h-4 w-32 bg-slate-800 rounded"></div>
            </div>
          </td>

          {/* Correo */}
          <td className="px-6 py-5">
            <div className="h-4 w-40 bg-slate-800 rounded"></div>
          </td>

          {/* Estado */}
          <td className="px-6 py-5">
            <div className="h-4 w-20 bg-slate-800 rounded-full"></div>
          </td>

          {/* Acciones */}
          <td className="px-6 py-5">
            <div className="flex justify-end gap-2">
              <div className="w-10 h-10 bg-slate-800 rounded-xl"></div>
              <div className="w-10 h-10 bg-slate-800 rounded-xl"></div>
            </div>
          </td>
        </tr>
      ))}
    </tbody>
  );
}
