import { AreaEstudio } from '../modelos/area_estudio';

export const AREAS = [
  new AreaEstudio({
    id: 'bases-de-datos',
    nombre: 'Bases de Datos',
    descripcion: 'Aprende SQL, PostgreSQL, SQL Server y MySQL.',
    icono: '🛢️',
    disponible: true,
  }),
  new AreaEstudio({
    id: 'programacion',
    nombre: 'Programación',
    descripcion: 'Aprende lenguajes de programación y desarrollo de software.',
    icono: '💻',
    disponible: false,
  }),
  new AreaEstudio({
    id: 'redes',
    nombre: 'Redes',
    descripcion: 'Aprende conceptos de redes, protocolos y conectividad.',
    icono: '🌐',
    disponible: false,
  }),
  new AreaEstudio({
    id: 'inteligencia-artificial',
    nombre: 'Inteligencia Artificial',
    descripcion: 'Próximamente',
    icono: '🚀',
    disponible: false,
  }),
];
