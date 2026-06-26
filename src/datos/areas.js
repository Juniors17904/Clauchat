import { AreaEstudio } from '../modelos/area_estudio';

export const AREAS = [
  new AreaEstudio({
    id: 'bases-de-datos',
    nombre: 'Base de Datos SQL Server',
    descripcion: 'Aprende SQL desde fundamentos hasta nivel senior',
    icono: '🗄️',
    disponible: true,
  }),
  new AreaEstudio({
    id: 'programacion',
    nombre: 'Programación',
    descripcion: 'Próximamente',
    icono: '💻',
    disponible: false,
  }),
  new AreaEstudio({
    id: 'redes',
    nombre: 'Redes',
    descripcion: 'Próximamente',
    icono: '🌐',
    disponible: false,
  }),
];
