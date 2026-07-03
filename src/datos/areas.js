import { AreaEstudio } from '../modelos/area_estudio';

export const AREAS_ESPECIALIZACION = [
  new AreaEstudio({ id: 'sql-estandar', nombre: 'SQL Estándar', descripcion: 'SQL puro, la base para cualquier motor de base de datos.', icono: '📘' }),
  new AreaEstudio({ id: 'postgresql', nombre: 'PostgreSQL', descripcion: 'Sintaxis y funciones propias de PostgreSQL.', icono: '🐘' }),
  new AreaEstudio({ id: 'sql-server', nombre: 'SQL Server', descripcion: 'T-SQL y funciones propias de SQL Server.', icono: '🪟' }),
  new AreaEstudio({ id: 'mysql', nombre: 'MySQL', descripcion: 'Funciones y sintaxis propias de MySQL.', icono: '🐬' }),
  new AreaEstudio({ id: 'oracle', nombre: 'Oracle', descripcion: 'PL/SQL y funciones propias de Oracle.', icono: '🔴' }),
];

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
