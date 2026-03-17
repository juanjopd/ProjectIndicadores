export const entidadOptions = [
  { value: 'todos', label: 'Todas las Entidades' },
  { value: 'Sistemas de Información', label: 'Sistemas de Información' },
  { value: 'Infraestructura TI', label: 'Infraestructura TI' },
];

// Datos maestros de los indicadores
export const inicialIndicadores = [
  {
    id: 1,
    nombre: 'PORCENTAJE DE PROYECTOS QUE CUMPLEN CON LAS METAS',
    entidad: 'Sistemas de Información',
    colorTheme: 'bg-[#fff4e6] text-orange-900 bar-orange-500', // Naranja (Fuente 91)
    // ... resto de datos
  },
  {
    id: 2,
    nombre: 'NIVEL DE SATISFACCIÓN DE LOS GRUPOS',
    entidad: 'Sistemas de Información',
    colorTheme: 'bg-[#e7f5ff] text-blue-900 bar-blue-500', // Azul (Fuente 91)
    // ... resto de datos
  },
];
// Estilos para mantener la coherencia visual oscura (Fuentes [3], [4])
export const customSelectStyles = {
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
    backgroundColor: state.isFocused ? '#2563eb' : 'transparent',
    color: 'white',
    fontWeight: 'bold',
    fontSize: '12px',
    cursor: 'pointer',
  }),
};
