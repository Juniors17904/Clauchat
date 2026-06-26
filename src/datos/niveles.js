import { NivelEstudio } from '../modelos/nivel_estudio';

export const NIVELES = [
  new NivelEstudio({
    id: 'nivel1',
    nombre: 'Nivel 1 — Fundamentos',
    descripcion: 'SELECT, WHERE, ORDER BY, LIMIT, DISTINCT, NULL, LIKE',
    orden: 1,
    areaId: 'bases-de-datos',
  }),
  new NivelEstudio({
    id: 'nivel2',
    nombre: 'Nivel 2 — Agrupación',
    descripcion: 'COUNT, SUM, AVG, GROUP BY, HAVING, AS',
    orden: 2,
    areaId: 'bases-de-datos',
  }),
  new NivelEstudio({
    id: 'nivel3',
    nombre: 'Nivel 3 — Relaciones',
    descripcion: 'INNER JOIN, LEFT JOIN, RIGHT JOIN, FULL, SELF, CROSS',
    orden: 3,
    areaId: 'bases-de-datos',
  }),
  new NivelEstudio({
    id: 'nivel4',
    nombre: 'Nivel 4 — Subconsultas',
    descripcion: 'Subqueries en WHERE / FROM / SELECT, EXISTS, IN, ANY/ALL',
    orden: 4,
    areaId: 'bases-de-datos',
  }),
  new NivelEstudio({
    id: 'nivel5',
    nombre: 'Nivel 5 — Funciones',
    descripcion: 'Texto, fechas, numéricas, COALESCE, CASE WHEN, CAST',
    orden: 5,
    areaId: 'bases-de-datos',
  }),
  new NivelEstudio({
    id: 'nivel6',
    nombre: 'Nivel 6 — Avanzado',
    descripcion: 'CTEs, Window Functions, PARTITION BY, LAG/LEAD, ROLLUP',
    orden: 6,
    areaId: 'bases-de-datos',
  }),
  new NivelEstudio({
    id: 'nivel7',
    nombre: 'Nivel 7 — Performance',
    descripcion: 'Índices, EXPLAIN, Vistas, Vistas materializadas, Particionamiento',
    orden: 7,
    areaId: 'bases-de-datos',
  }),
  new NivelEstudio({
    id: 'nivel8',
    nombre: 'Nivel 8 — Administración',
    descripcion: 'Transacciones, Procedures, Triggers, GRANT, Backup, Replicación',
    orden: 8,
    areaId: 'bases-de-datos',
  }),
];
