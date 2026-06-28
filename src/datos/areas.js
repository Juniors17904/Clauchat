import { AreaEstudio } from '../modelos/area_estudio';

export const AREAS = [
  new AreaEstudio({
    id: 'bases-de-datos',
    nombre: 'SQL',
    descripcion: 'Desde SELECT hasta Window Functions',
    icono: '🛢️',
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
