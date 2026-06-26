import { Tema } from '../modelos/tema';

export const TEMAS = [
  // ── NIVEL 1 — Fundamentos ────────────────────────────────────────────────
  new Tema({ id: 'n1-t1', nombre: 'SELECT, FROM',             descripcion: 'Consultas básicas de selección',          nivelId: 'nivel1', orden: 1 }),
  new Tema({ id: 'n1-t2', nombre: 'WHERE con =, !=, >, <',   descripcion: 'Filtrar filas por condición',             nivelId: 'nivel1', orden: 2 }),
  new Tema({ id: 'n1-t3', nombre: 'AND, OR, NOT',             descripcion: 'Operadores lógicos',                      nivelId: 'nivel1', orden: 3 }),
  new Tema({ id: 'n1-t4', nombre: 'ORDER BY ASC/DESC',        descripcion: 'Ordenar resultados',                      nivelId: 'nivel1', orden: 4 }),
  new Tema({ id: 'n1-t5', nombre: 'LIMIT',                    descripcion: 'Limitar el número de filas',              nivelId: 'nivel1', orden: 5 }),
  new Tema({ id: 'n1-t6', nombre: 'DISTINCT',                 descripcion: 'Eliminar duplicados',                     nivelId: 'nivel1', orden: 6 }),
  new Tema({ id: 'n1-t7', nombre: 'IS NULL / IS NOT NULL',    descripcion: 'Filtrar valores nulos',                   nivelId: 'nivel1', orden: 7 }),
  new Tema({ id: 'n1-t8', nombre: 'LIKE, BETWEEN, IN',        descripcion: 'Patrones, rangos y listas',               nivelId: 'nivel1', orden: 8 }),

  // ── NIVEL 2 — Agrupación ─────────────────────────────────────────────────
  new Tema({ id: 'n2-t1', nombre: 'COUNT, SUM, AVG, MAX, MIN', descripcion: 'Funciones de agregación',               nivelId: 'nivel2', orden: 1 }),
  new Tema({ id: 'n2-t2', nombre: 'GROUP BY',                  descripcion: 'Agrupar filas por columna',             nivelId: 'nivel2', orden: 2 }),
  new Tema({ id: 'n2-t3', nombre: 'HAVING',                    descripcion: 'Filtrar grupos',                        nivelId: 'nivel2', orden: 3 }),
  new Tema({ id: 'n2-t4', nombre: 'Alias con AS',              descripcion: 'Renombrar columnas y expresiones',      nivelId: 'nivel2', orden: 4 }),

  // ── NIVEL 3 — Relaciones ─────────────────────────────────────────────────
  new Tema({ id: 'n3-t1', nombre: 'INNER JOIN',     descripcion: 'Unión de filas con coincidencia en ambas tablas', nivelId: 'nivel3', orden: 1 }),
  new Tema({ id: 'n3-t2', nombre: 'LEFT JOIN',      descripcion: 'Todas las filas de la izquierda',                 nivelId: 'nivel3', orden: 2 }),
  new Tema({ id: 'n3-t3', nombre: 'RIGHT JOIN',     descripcion: 'Todas las filas de la derecha',                   nivelId: 'nivel3', orden: 3 }),
  new Tema({ id: 'n3-t4', nombre: 'FULL OUTER JOIN', descripcion: 'Todas las filas de ambas tablas',                nivelId: 'nivel3', orden: 4 }),
  new Tema({ id: 'n3-t5', nombre: 'SELF JOIN',      descripcion: 'Una tabla unida consigo misma',                   nivelId: 'nivel3', orden: 5 }),
  new Tema({ id: 'n3-t6', nombre: 'CROSS JOIN',     descripcion: 'Producto cartesiano',                             nivelId: 'nivel3', orden: 6 }),

  // ── NIVEL 4 — Subconsultas ───────────────────────────────────────────────
  new Tema({ id: 'n4-t1', nombre: 'Subquery en WHERE',    descripcion: 'Subconsulta como filtro',                 nivelId: 'nivel4', orden: 1 }),
  new Tema({ id: 'n4-t2', nombre: 'Subquery en FROM',     descripcion: 'Subconsulta como tabla derivada',         nivelId: 'nivel4', orden: 2 }),
  new Tema({ id: 'n4-t3', nombre: 'Subquery en SELECT',   descripcion: 'Subconsulta como columna calculada',      nivelId: 'nivel4', orden: 3 }),
  new Tema({ id: 'n4-t4', nombre: 'EXISTS / NOT EXISTS',  descripcion: 'Verificar existencia de filas',           nivelId: 'nivel4', orden: 4 }),
  new Tema({ id: 'n4-t5', nombre: 'IN con subquery',      descripcion: 'Filtrar con lista dinámica',              nivelId: 'nivel4', orden: 5 }),
  new Tema({ id: 'n4-t6', nombre: 'ANY / ALL',            descripcion: 'Comparar con un conjunto de valores',     nivelId: 'nivel4', orden: 6 }),

  // ── NIVEL 5 — Funciones ──────────────────────────────────────────────────
  new Tema({ id: 'n5-t1', nombre: 'Funciones de texto',    descripcion: 'UPPER, LOWER, TRIM, LENGTH, CONCAT',    nivelId: 'nivel5', orden: 1 }),
  new Tema({ id: 'n5-t2', nombre: 'Funciones de fecha',    descripcion: 'NOW, DATE, YEAR, MONTH, AGE',           nivelId: 'nivel5', orden: 2 }),
  new Tema({ id: 'n5-t3', nombre: 'Funciones numéricas',   descripcion: 'ROUND, FLOOR, CEIL, ABS, MOD',          nivelId: 'nivel5', orden: 3 }),
  new Tema({ id: 'n5-t4', nombre: 'COALESCE, NULLIF',      descripcion: 'Manejo de valores nulos',                nivelId: 'nivel5', orden: 4 }),
  new Tema({ id: 'n5-t5', nombre: 'CASE WHEN THEN ELSE',   descripcion: 'Lógica condicional en consultas',        nivelId: 'nivel5', orden: 5 }),
  new Tema({ id: 'n5-t6', nombre: 'CAST / CONVERT',        descripcion: 'Convertir tipos de datos',               nivelId: 'nivel5', orden: 6 }),

  // ── NIVEL 6 — Avanzado ───────────────────────────────────────────────────
  new Tema({ id: 'n6-t1', nombre: 'CTEs (WITH ... AS)',              descripcion: 'Expresiones de tabla comunes',        nivelId: 'nivel6', orden: 1 }),
  new Tema({ id: 'n6-t2', nombre: 'Window Functions',                descripcion: 'ROW_NUMBER, RANK, DENSE_RANK',        nivelId: 'nivel6', orden: 2 }),
  new Tema({ id: 'n6-t3', nombre: 'PARTITION BY',                    descripcion: 'Dividir datos en particiones',        nivelId: 'nivel6', orden: 3 }),
  new Tema({ id: 'n6-t4', nombre: 'LAG / LEAD',                      descripcion: 'Acceder a filas anteriores/siguientes', nivelId: 'nivel6', orden: 4 }),
  new Tema({ id: 'n6-t5', nombre: 'FIRST_VALUE / LAST_VALUE',        descripcion: 'Primer y último valor de partición',  nivelId: 'nivel6', orden: 5 }),
  new Tema({ id: 'n6-t6', nombre: 'ROLLUP / CUBE',                   descripcion: 'Subtotales y totales cruzados',       nivelId: 'nivel6', orden: 6 }),
  new Tema({ id: 'n6-t7', nombre: 'PIVOT / UNPIVOT',                 descripcion: 'Transponer filas y columnas',         nivelId: 'nivel6', orden: 7 }),

  // ── NIVEL 7 — Performance ────────────────────────────────────────────────
  new Tema({ id: 'n7-t1', nombre: 'Índices (CREATE INDEX)',          descripcion: 'Acelerar consultas con índices',      nivelId: 'nivel7', orden: 1 }),
  new Tema({ id: 'n7-t2', nombre: 'EXPLAIN / EXPLAIN ANALYZE',       descripcion: 'Analizar el plan de ejecución',       nivelId: 'nivel7', orden: 2 }),
  new Tema({ id: 'n7-t3', nombre: 'Query optimization',              descripcion: 'Técnicas para optimizar consultas',   nivelId: 'nivel7', orden: 3 }),
  new Tema({ id: 'n7-t4', nombre: 'Particionamiento de tablas',      descripcion: 'Dividir tablas grandes',              nivelId: 'nivel7', orden: 4 }),
  new Tema({ id: 'n7-t5', nombre: 'Vistas (CREATE VIEW)',            descripcion: 'Consultas guardadas reutilizables',   nivelId: 'nivel7', orden: 5 }),
  new Tema({ id: 'n7-t6', nombre: 'Vistas materializadas',           descripcion: 'Vistas con datos precalculados',      nivelId: 'nivel7', orden: 6 }),

  // ── NIVEL 8 — Administración ─────────────────────────────────────────────
  new Tema({ id: 'n8-t1', nombre: 'Transacciones',                   descripcion: 'BEGIN, COMMIT, ROLLBACK',             nivelId: 'nivel8', orden: 1 }),
  new Tema({ id: 'n8-t2', nombre: 'Stored Procedures',               descripcion: 'Procedimientos almacenados',          nivelId: 'nivel8', orden: 2 }),
  new Tema({ id: 'n8-t3', nombre: 'Triggers',                        descripcion: 'Disparadores automáticos',            nivelId: 'nivel8', orden: 3 }),
  new Tema({ id: 'n8-t4', nombre: 'Funciones almacenadas',           descripcion: 'Funciones definidas por el usuario',  nivelId: 'nivel8', orden: 4 }),
  new Tema({ id: 'n8-t5', nombre: 'Permisos (GRANT, REVOKE)',        descripcion: 'Control de acceso',                   nivelId: 'nivel8', orden: 5 }),
  new Tema({ id: 'n8-t6', nombre: 'Backup y restore',                descripcion: 'Respaldo y recuperación de datos',    nivelId: 'nivel8', orden: 6 }),
  new Tema({ id: 'n8-t7', nombre: 'Replicación',                     descripcion: 'Copiar datos entre servidores',       nivelId: 'nivel8', orden: 7 }),
];
