import { NivelEstudio } from '../modelos/nivel_estudio';

export const NIVELES = [
  new NivelEstudio({
    id: 'basico',
    nombre: 'Básico',
    descripcion: 'SELECT, FROM, WHERE, ORDER BY',
    orden: 1,
    areaId: 'bases-de-datos',
  }),
  new NivelEstudio({
    id: 'intermedio',
    nombre: 'Intermedio',
    descripcion: 'JOIN, GROUP BY, HAVING, subqueries',
    orden: 2,
    areaId: 'bases-de-datos',
  }),
  new NivelEstudio({
    id: 'avanzado',
    nombre: 'Avanzado',
    descripcion: 'Índices, vistas, transacciones, funciones',
    orden: 3,
    areaId: 'bases-de-datos',
  }),
];
