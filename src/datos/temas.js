import { Tema } from '../modelos/tema';
import { ConceptoTema } from '../modelos/concepto_tema';

const TEMAS_BASE = [
  // ── NIVEL 1 — Fundamentos ────────────────────────────────────────────────
  new Tema({
    id: 'n1-t1', nombre: 'SELECT, FROM', descripcion: 'Consultas básicas de selección', nivelId: 'nivel1', orden: 1,
    concepto: new ConceptoTema({
      queEs: 'SELECT indica qué columnas quieres ver y FROM indica de qué tabla. Son las dos palabras clave que toda consulta SQL necesita. Con SELECT * traes todas las columnas sin escribir cada nombre.',
      sintaxis: 'SELECT columna1, columna2\nFROM tabla\n\n-- O para traer todo:\nSELECT *\nFROM tabla',
      ejemplo: 'SELECT nombre, apellido, promedio\nFROM estudiantes\n\n-- Todas las columnas:\nSELECT * FROM estudiantes',
    }),
  }),
  new Tema({
    id: 'n1-t2', nombre: 'WHERE con =, !=, >, <', descripcion: 'Filtrar filas por condición', nivelId: 'nivel1', orden: 2,
    concepto: new ConceptoTema({
      queEs: 'WHERE filtra las filas de la tabla. Solo se devuelven las filas donde la condición es verdadera. Puedes usar = (igual), != (distinto), > (mayor), < (menor), >= y <=.',
      sintaxis: 'SELECT columnas\nFROM tabla\nWHERE columna = valor',
      ejemplo: 'SELECT nombre, promedio\nFROM estudiantes\nWHERE promedio >= 6.5',
    }),
  }),
  new Tema({
    id: 'n1-t3', nombre: 'AND, OR, NOT', descripcion: 'Operadores lógicos', nivelId: 'nivel1', orden: 3,
    concepto: new ConceptoTema({
      queEs: 'AND exige que todas las condiciones sean verdaderas. OR basta con que una lo sea. NOT niega la condición que le sigue.',
      sintaxis: 'WHERE cond1 AND cond2\nWHERE cond1 OR cond2\nWHERE NOT condicion',
      ejemplo: "SELECT nombre, posicion\nFROM jugadores\nWHERE posicion = 'Delantero'\n  AND nacionalidad = 'Chile'",
    }),
  }),
  new Tema({
    id: 'n1-t4', nombre: 'ORDER BY ASC/DESC', descripcion: 'Ordenar resultados', nivelId: 'nivel1', orden: 4,
    concepto: new ConceptoTema({
      queEs: 'ORDER BY ordena los resultados según una columna. ASC ordena de menor a mayor (A→Z, 1→9). DESC ordena de mayor a menor (Z→A, 9→1).',
      sintaxis: 'SELECT columnas\nFROM tabla\nORDER BY columna ASC\nORDER BY columna DESC',
      ejemplo: 'SELECT nombre, apellido, promedio\nFROM estudiantes\nORDER BY promedio DESC',
    }),
  }),
  new Tema({
    id: 'n1-t5', nombre: 'LIMIT', descripcion: 'Limitar el número de filas', nivelId: 'nivel1', orden: 5, motores: ['pg', 'my'],
    concepto: new ConceptoTema({
      queEs: 'LIMIT restringe cuántas filas devuelve la consulta. Siempre va al final. Se usa junto con ORDER BY para obtener los "top N" de algo.',
      sintaxis: 'SELECT columnas\nFROM tabla\nORDER BY columna DESC\nLIMIT n',
      ejemplo: 'SELECT nombre, apellido, promedio\nFROM estudiantes\nORDER BY promedio DESC\nLIMIT 5',
    }),
  }),
  new Tema({
    id: 'n1-t6', nombre: 'DISTINCT', descripcion: 'Eliminar duplicados', nivelId: 'nivel1', orden: 6,
    concepto: new ConceptoTema({
      queEs: 'DISTINCT elimina las filas duplicadas del resultado. Se escribe justo después de SELECT. Si una columna repite valores, con DISTINCT aparece cada valor solo una vez.',
      sintaxis: 'SELECT DISTINCT columna\nFROM tabla',
      ejemplo: 'SELECT DISTINCT nacionalidad\nFROM jugadores',
    }),
  }),
  new Tema({
    id: 'n1-t7', nombre: 'IS NULL / IS NOT NULL', descripcion: 'Filtrar valores nulos', nivelId: 'nivel1', orden: 7,
    concepto: new ConceptoTema({
      queEs: 'NULL significa que un campo no tiene valor. No se puede comparar con = o !=. Se usa IS NULL para encontrar los vacíos e IS NOT NULL para los que sí tienen valor.',
      sintaxis: 'WHERE columna IS NULL\nWHERE columna IS NOT NULL',
      ejemplo: 'SELECT nombre, apellido, email\nFROM profesores\nWHERE email IS NOT NULL',
    }),
  }),
  new Tema({
    id: 'n1-t8', nombre: 'LIKE, BETWEEN, IN', descripcion: 'Patrones, rangos y listas', nivelId: 'nivel1', orden: 8,
    concepto: new ConceptoTema({
      queEs: "LIKE busca por patrón de texto (% = cualquier texto). BETWEEN filtra un rango incluyendo los extremos. IN filtra por una lista de valores posibles.",
      sintaxis: "WHERE nombre LIKE 'A%'\nWHERE precio BETWEEN 100 AND 500\nWHERE pais IN ('Chile', 'Argentina')",
      ejemplo: 'SELECT nombre, promedio\nFROM estudiantes\nWHERE promedio BETWEEN 6.0 AND 7.0',
    }),
  }),
  new Tema({
    id: 'n1-t9', nombre: 'Alias con AS', descripcion: 'Renombrar columnas y expresiones', nivelId: 'nivel1', orden: 9,
    concepto: new ConceptoTema({
      queEs: 'AS le da un nombre alternativo (alias) a una columna en el resultado. Es el nombre que aparece como título de la columna. Se usa para aclarar nombres, renombrar cálculos o abreviar nombres largos.',
      sintaxis: 'SELECT columna AS alias\nFROM tabla\n\n-- El alias se puede usar en ORDER BY:\nSELECT precio AS costo FROM medicamentos\nORDER BY costo ASC',
      ejemplo: 'SELECT nombre AS alumno, promedio AS nota\nFROM estudiantes\nORDER BY nota DESC',
    }),
  }),
  new Tema({
    id: 'n1-t10', nombre: 'Operadores aritméticos', descripcion: 'Cálculos con +, -, *, /, %', nivelId: 'nivel1', orden: 10,
    concepto: new ConceptoTema({
      queEs: 'Puedes hacer cálculos matemáticos directamente en el SELECT. Los operadores son + (suma), - (resta), * (multiplicación), / (división) y % (módulo o resto). El resultado aparece como una columna calculada y se combina con AS para ponerle nombre.',
      sintaxis: 'SELECT columna * numero AS resultado\nSELECT columna1 + columna2 AS suma\nSELECT numero - columna AS diferencia',
      ejemplo: 'SELECT nombre, precio * 1.19 AS precio_con_iva\nFROM medicamentos',
    }),
  }),

  // ── NIVEL 2 — Agrupación ─────────────────────────────────────────────────
  new Tema({ id: 'n2-t1', nombre: 'COUNT, SUM, AVG, MAX, MIN', descripcion: 'Funciones de agregación',               nivelId: 'nivel2', orden: 1 }),
  new Tema({ id: 'n2-t2', nombre: 'GROUP BY',                  descripcion: 'Agrupar filas por columna',             nivelId: 'nivel2', orden: 2 }),
  new Tema({ id: 'n2-t3', nombre: 'HAVING',                    descripcion: 'Filtrar grupos',                        nivelId: 'nivel2', orden: 3 }),
  new Tema({ id: 'n2-t4', nombre: 'INSERT INTO',    descripcion: 'Insertar nuevas filas en una tabla',        nivelId: 'nivel2', orden: 4 }),
  new Tema({ id: 'n2-t5', nombre: 'UPDATE ... SET', descripcion: 'Modificar filas existentes',                nivelId: 'nivel2', orden: 5 }),
  new Tema({ id: 'n2-t6', nombre: 'DELETE FROM',    descripcion: 'Eliminar filas de una tabla',               nivelId: 'nivel2', orden: 6 }),

  // ── NIVEL 3 — Relaciones ─────────────────────────────────────────────────
  new Tema({ id: 'n3-t1', nombre: 'INNER JOIN',     descripcion: 'Unión de filas con coincidencia en ambas tablas', nivelId: 'nivel3', orden: 1 }),
  new Tema({ id: 'n3-t2', nombre: 'LEFT JOIN',      descripcion: 'Todas las filas de la izquierda',                 nivelId: 'nivel3', orden: 2 }),
  new Tema({ id: 'n3-t3', nombre: 'RIGHT JOIN',     descripcion: 'Todas las filas de la derecha',                   nivelId: 'nivel3', orden: 3 }),
  new Tema({ id: 'n3-t4', nombre: 'FULL OUTER JOIN', descripcion: 'Todas las filas de ambas tablas',                nivelId: 'nivel3', orden: 4, motores: ['pg', 'ss', 'or'] }),
  new Tema({ id: 'n3-t5', nombre: 'SELF JOIN',      descripcion: 'Una tabla unida consigo misma',                   nivelId: 'nivel3', orden: 5 }),
  new Tema({ id: 'n3-t6', nombre: 'CROSS JOIN',        descripcion: 'Producto cartesiano',                        nivelId: 'nivel3', orden: 6 }),
  new Tema({ id: 'n3-t7', nombre: 'UNION / UNION ALL', descripcion: 'Combinar resultados de varias consultas',    nivelId: 'nivel3', orden: 7 }),

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
  new Tema({ id: 'n6-t7', nombre: 'PIVOT / UNPIVOT',                 descripcion: 'Transponer filas y columnas',         nivelId: 'nivel6', orden: 7, motores: ['ss', 'or'] }),

  // ── NIVEL 7 — Performance ────────────────────────────────────────────────
  new Tema({ id: 'n7-t1', nombre: 'Índices (CREATE INDEX)',          descripcion: 'Acelerar consultas con índices',      nivelId: 'nivel7', orden: 1 }),
  new Tema({ id: 'n7-t2', nombre: 'EXPLAIN / EXPLAIN ANALYZE',       descripcion: 'Analizar el plan de ejecución',       nivelId: 'nivel7', orden: 2 }),
  new Tema({ id: 'n7-t3', nombre: 'Query optimization',              descripcion: 'Técnicas para optimizar consultas',   nivelId: 'nivel7', orden: 3 }),
  new Tema({ id: 'n7-t4', nombre: 'Particionamiento de tablas',      descripcion: 'Dividir tablas grandes',              nivelId: 'nivel7', orden: 4 }),
  new Tema({ id: 'n7-t5', nombre: 'Vistas (CREATE VIEW)',            descripcion: 'Consultas guardadas reutilizables',   nivelId: 'nivel7', orden: 5 }),
  new Tema({ id: 'n7-t6', nombre: 'Vistas materializadas',           descripcion: 'Vistas con datos precalculados',      nivelId: 'nivel7', orden: 6, motores: ['pg', 'or'] }),

  // ── NIVEL 8 — Administración ─────────────────────────────────────────────
  new Tema({ id: 'n8-t1', nombre: 'Transacciones',                   descripcion: 'BEGIN, COMMIT, ROLLBACK',             nivelId: 'nivel8', orden: 1 }),
  new Tema({ id: 'n8-t2', nombre: 'Stored Procedures',               descripcion: 'Procedimientos almacenados',          nivelId: 'nivel8', orden: 2 }),
  new Tema({ id: 'n8-t3', nombre: 'Triggers',                        descripcion: 'Disparadores automáticos',            nivelId: 'nivel8', orden: 3 }),
  new Tema({ id: 'n8-t4', nombre: 'Funciones almacenadas',           descripcion: 'Funciones definidas por el usuario',  nivelId: 'nivel8', orden: 4 }),
  new Tema({ id: 'n8-t5', nombre: 'Permisos (GRANT, REVOKE)',        descripcion: 'Control de acceso',                   nivelId: 'nivel8', orden: 5 }),
  new Tema({ id: 'n8-t6', nombre: 'Backup y restore',                descripcion: 'Respaldo y recuperación de datos',    nivelId: 'nivel8', orden: 6 }),
  new Tema({ id: 'n8-t7', nombre: 'Replicación',                     descripcion: 'Copiar datos entre servidores',       nivelId: 'nivel8', orden: 7 }),
];

// ── POSTGRESQL ──────────────────────────────────────────────────────────────
const TEMAS_PG = [
  // Nivel 1 — Fundamentos
  new Tema({ id: 'pg-n1-t1', nombre: 'LIMIT / OFFSET',              descripcion: 'Paginación al estilo PostgreSQL',              nivelId: 'pg-nivel1', orden: 1, motores: ['pg'] }),
  new Tema({ id: 'pg-n1-t2', nombre: 'ILIKE',                       descripcion: 'LIKE sin distinguir mayúsculas/minúsculas',    nivelId: 'pg-nivel1', orden: 2, motores: ['pg'] }),
  new Tema({ id: 'pg-n1-t3', nombre: ':: (type casting)',            descripcion: 'Conversión de tipos al estilo PG',             nivelId: 'pg-nivel1', orden: 3, motores: ['pg'] }),
  // Nivel 2 — Agrupación
  new Tema({ id: 'pg-n2-t1', nombre: 'string_agg()',                descripcion: 'Concatenar valores agrupados con separador',    nivelId: 'pg-nivel2', orden: 1, motores: ['pg'] }),
  new Tema({ id: 'pg-n2-t2', nombre: 'array_agg()',                 descripcion: 'Agregar valores en un array',                   nivelId: 'pg-nivel2', orden: 2, motores: ['pg'] }),
  // Nivel 5 — Funciones
  new Tema({ id: 'pg-n5-t1', nombre: '|| (concatenación)',           descripcion: 'Concatenar texto con operador ||',             nivelId: 'pg-nivel5', orden: 1, motores: ['pg'] }),
  new Tema({ id: 'pg-n5-t2', nombre: 'AGE(), EXTRACT(), INTERVAL',  descripcion: 'Funciones de fecha propias de PostgreSQL',     nivelId: 'pg-nivel5', orden: 2, motores: ['pg'] }),
  new Tema({ id: 'pg-n5-t3', nombre: 'TO_CHAR(), TO_DATE()',        descripcion: 'Conversión y formato de tipos',                nivelId: 'pg-nivel5', orden: 3, motores: ['pg'] }),
  new Tema({ id: 'pg-n5-t4', nombre: 'GENERATE_SERIES()',           descripcion: 'Generar secuencias de números o fechas',       nivelId: 'pg-nivel5', orden: 4, motores: ['pg'] }),
  // Nivel 6 — Avanzado
  new Tema({ id: 'pg-n6-t1', nombre: 'JSONB',                       descripcion: 'Operaciones con JSON binario',                 nivelId: 'pg-nivel6', orden: 1, motores: ['pg'] }),
  new Tema({ id: 'pg-n6-t2', nombre: 'ARRAYS',                      descripcion: 'Tipos array nativos y operadores',             nivelId: 'pg-nivel6', orden: 2, motores: ['pg'] }),
  new Tema({ id: 'pg-n6-t3', nombre: 'DISTINCT ON',                 descripcion: 'Seleccionar el primero de cada grupo',         nivelId: 'pg-nivel6', orden: 3, motores: ['pg'] }),
  new Tema({ id: 'pg-n6-t4', nombre: 'ON CONFLICT (UPSERT)',        descripcion: 'INSERT ... ON CONFLICT DO UPDATE',             nivelId: 'pg-nivel6', orden: 4, motores: ['pg'] }),
  new Tema({ id: 'pg-n6-t5', nombre: 'RETURNING',                   descripcion: 'Devolver filas afectadas por INSERT/UPDATE/DELETE', nivelId: 'pg-nivel6', orden: 5, motores: ['pg'] }),
  new Tema({ id: 'pg-n6-t6', nombre: 'CROSSTAB',                    descripcion: 'Tablas cruzadas con tablefunc',                nivelId: 'pg-nivel6', orden: 6, motores: ['pg'] }),
  new Tema({ id: 'pg-n6-t7', nombre: 'LATERAL JOIN',                descripcion: 'Subconsultas laterales',                       nivelId: 'pg-nivel6', orden: 7, motores: ['pg'] }),
  // Nivel 7 — Performance
  new Tema({ id: 'pg-n7-t1', nombre: 'EXPLAIN ANALYZE',             descripcion: 'Plan de ejecución con tiempos reales',         nivelId: 'pg-nivel7', orden: 1, motores: ['pg'] }),
  new Tema({ id: 'pg-n7-t2', nombre: 'Vistas materializadas',       descripcion: 'REFRESH MATERIALIZED VIEW',                    nivelId: 'pg-nivel7', orden: 2, motores: ['pg'] }),
  new Tema({ id: 'pg-n7-t3', nombre: 'Índices GIN y GiST',         descripcion: 'Índices especializados de PostgreSQL',          nivelId: 'pg-nivel7', orden: 3, motores: ['pg'] }),
  new Tema({ id: 'pg-n7-t4', nombre: 'Índices parciales',           descripcion: 'CREATE INDEX ... WHERE condición',             nivelId: 'pg-nivel7', orden: 4, motores: ['pg'] }),
  new Tema({ id: 'pg-n7-t5', nombre: 'Particionamiento declarativo', descripcion: 'PARTITION BY RANGE/LIST/HASH',               nivelId: 'pg-nivel7', orden: 5, motores: ['pg'] }),
  new Tema({ id: 'pg-n7-t6', nombre: 'VACUUM',                      descripcion: 'Mantenimiento y limpieza de tablas',           nivelId: 'pg-nivel7', orden: 6, motores: ['pg'] }),
  // Nivel 8 — Administración
  new Tema({ id: 'pg-n8-t1', nombre: 'PL/pgSQL',                    descripcion: 'Lenguaje procedural de PostgreSQL',            nivelId: 'pg-nivel8', orden: 1, motores: ['pg'] }),
  new Tema({ id: 'pg-n8-t2', nombre: 'pg_dump / pg_restore',        descripcion: 'Backup y restauración',                        nivelId: 'pg-nivel8', orden: 2, motores: ['pg'] }),
  new Tema({ id: 'pg-n8-t3', nombre: 'Replicación lógica',          descripcion: 'Publicaciones y suscripciones',                nivelId: 'pg-nivel8', orden: 3, motores: ['pg'] }),
  new Tema({ id: 'pg-n8-t4', nombre: 'Extensiones',                 descripcion: 'pg_trgm, PostGIS, uuid-ossp',                  nivelId: 'pg-nivel8', orden: 4, motores: ['pg'] }),
  new Tema({ id: 'pg-n8-t5', nombre: 'LISTEN / NOTIFY',             descripcion: 'Sistema pub/sub integrado',                    nivelId: 'pg-nivel8', orden: 5, motores: ['pg'] }),
  new Tema({ id: 'pg-n8-t6', nombre: 'Foreign Data Wrappers',       descripcion: 'Consultar datos de fuentes externas',          nivelId: 'pg-nivel8', orden: 6, motores: ['pg'] }),
  new Tema({ id: 'pg-n8-t7', nombre: 'ENUM types',                  descripcion: 'Tipos enumerados personalizados',              nivelId: 'pg-nivel8', orden: 7, motores: ['pg'] }),
  new Tema({ id: 'pg-n8-t8', nombre: 'Row-Level Security',          descripcion: 'Políticas de acceso por fila',                 nivelId: 'pg-nivel8', orden: 8, motores: ['pg'] }),
];

// ── SQL SERVER ──────────────────────────────────────────────────────────────
const TEMAS_SS = [
  new Tema({ id: 'ss-n1-t1', nombre: 'TOP',                         descripcion: 'Limitar filas al estilo SQL Server',           nivelId: 'ss-nivel1', orden: 1 }),
  new Tema({ id: 'ss-n1-t2', nombre: 'OFFSET FETCH',                descripcion: 'Paginación con ORDER BY',                      nivelId: 'ss-nivel1', orden: 2 }),
  new Tema({ id: 'ss-n5-t1', nombre: 'GETDATE(), SYSDATETIME()',    descripcion: 'Funciones de fecha de SQL Server',              nivelId: 'ss-nivel5', orden: 1 }),
  new Tema({ id: 'ss-n5-t2', nombre: 'DATEDIFF(), DATEADD()',       descripcion: 'Aritmética de fechas',                         nivelId: 'ss-nivel5', orden: 2 }),
  new Tema({ id: 'ss-n5-t3', nombre: 'FORMAT(), CONVERT()',         descripcion: 'Formato y conversión de tipos',                nivelId: 'ss-nivel5', orden: 3 }),
  new Tema({ id: 'ss-n5-t4', nombre: 'STRING_AGG()',                descripcion: 'Concatenar valores agrupados',                 nivelId: 'ss-nivel5', orden: 4 }),
  new Tema({ id: 'ss-n6-t1', nombre: 'PIVOT / UNPIVOT',             descripcion: 'Transponer filas y columnas',                  nivelId: 'ss-nivel6', orden: 1 }),
  new Tema({ id: 'ss-n6-t2', nombre: 'CROSS APPLY / OUTER APPLY',   descripcion: 'Aplicar funciones tabla por fila',             nivelId: 'ss-nivel6', orden: 2 }),
  new Tema({ id: 'ss-n6-t3', nombre: 'MERGE',                       descripcion: 'INSERT, UPDATE o DELETE en una sentencia',     nivelId: 'ss-nivel6', orden: 3 }),
  new Tema({ id: 'ss-n7-t1', nombre: 'Execution Plans',             descripcion: 'SET STATISTICS y planes gráficos',             nivelId: 'ss-nivel7', orden: 1 }),
  new Tema({ id: 'ss-n7-t2', nombre: 'Índices columnstore',         descripcion: 'Índices orientados a columnas',                nivelId: 'ss-nivel7', orden: 2 }),
  new Tema({ id: 'ss-n7-t3', nombre: 'Extended Events',             descripcion: 'Monitoreo y diagnóstico',                      nivelId: 'ss-nivel7', orden: 3 }),
  new Tema({ id: 'ss-n8-t1', nombre: 'T-SQL (procedimientos)',      descripcion: 'Procedimientos almacenados en T-SQL',          nivelId: 'ss-nivel8', orden: 1 }),
  new Tema({ id: 'ss-n8-t2', nombre: 'SQL Agent',                   descripcion: 'Programar tareas automáticas',                 nivelId: 'ss-nivel8', orden: 2 }),
  new Tema({ id: 'ss-n8-t3', nombre: 'BACKUP / RESTORE',            descripcion: 'Respaldo y recuperación SQL Server',           nivelId: 'ss-nivel8', orden: 3 }),
  new Tema({ id: 'ss-n8-t4', nombre: 'Always On',                   descripcion: 'Alta disponibilidad y replicación',            nivelId: 'ss-nivel8', orden: 4 }),
];

// ── MYSQL ───────────────────────────────────────────────────────────────────
const TEMAS_MY = [
  new Tema({ id: 'my-n1-t1', nombre: 'LIMIT con OFFSET',            descripcion: 'Paginación al estilo MySQL',                   nivelId: 'my-nivel1', orden: 1 }),
  new Tema({ id: 'my-n5-t1', nombre: 'NOW(), CURDATE()',            descripcion: 'Funciones de fecha de MySQL',                  nivelId: 'my-nivel5', orden: 1 }),
  new Tema({ id: 'my-n5-t2', nombre: 'DATE_FORMAT()',               descripcion: 'Formatear fechas con patrones',                nivelId: 'my-nivel5', orden: 2 }),
  new Tema({ id: 'my-n5-t3', nombre: 'IFNULL(), COALESCE()',        descripcion: 'Manejo de nulos en MySQL',                     nivelId: 'my-nivel5', orden: 3 }),
  new Tema({ id: 'my-n5-t4', nombre: 'GROUP_CONCAT()',              descripcion: 'Concatenar valores de un grupo',               nivelId: 'my-nivel5', orden: 4 }),
  new Tema({ id: 'my-n5-t5', nombre: 'CONCAT(), CONCAT_WS()',      descripcion: 'Concatenar cadenas de texto',                  nivelId: 'my-nivel5', orden: 5 }),
  new Tema({ id: 'my-n6-t1', nombre: 'Variables de usuario',        descripcion: 'Usar @variables en consultas',                 nivelId: 'my-nivel6', orden: 1 }),
  new Tema({ id: 'my-n6-t2', nombre: 'CTEs en MySQL 8+',            descripcion: 'WITH ... AS en versiones recientes',           nivelId: 'my-nivel6', orden: 2 }),
  new Tema({ id: 'my-n7-t1', nombre: 'EXPLAIN en MySQL',            descripcion: 'Interpretar planes de ejecución',              nivelId: 'my-nivel7', orden: 1 }),
  new Tema({ id: 'my-n7-t2', nombre: 'InnoDB vs MyISAM',            descripcion: 'Motores de almacenamiento',                    nivelId: 'my-nivel7', orden: 2 }),
  new Tema({ id: 'my-n7-t3', nombre: 'SHOW INDEX / STATUS',         descripcion: 'Inspeccionar índices y tablas',                nivelId: 'my-nivel7', orden: 3 }),
  new Tema({ id: 'my-n8-t1', nombre: 'DELIMITER y procedures',      descripcion: 'Procedimientos almacenados MySQL',             nivelId: 'my-nivel8', orden: 1 }),
  new Tema({ id: 'my-n8-t2', nombre: 'mysqldump',                   descripcion: 'Backup y restauración',                        nivelId: 'my-nivel8', orden: 2 }),
  new Tema({ id: 'my-n8-t3', nombre: 'Replicación master-replica',  descripcion: 'Copiar datos entre servidores MySQL',          nivelId: 'my-nivel8', orden: 3 }),
  new Tema({ id: 'my-n8-t4', nombre: 'AUTO_INCREMENT',              descripcion: 'IDs autoincremntales en MySQL',                nivelId: 'my-nivel8', orden: 4 }),
];

// ── ORACLE ──────────────────────────────────────────────────────────────────
const TEMAS_OR = [
  new Tema({ id: 'or-n1-t1', nombre: 'ROWNUM',                      descripcion: 'Limitar filas al estilo Oracle clásico',       nivelId: 'or-nivel1', orden: 1 }),
  new Tema({ id: 'or-n1-t2', nombre: 'FETCH FIRST',                 descripcion: 'Paginación moderna (Oracle 12c+)',             nivelId: 'or-nivel1', orden: 2 }),
  new Tema({ id: 'or-n5-t1', nombre: 'SYSDATE, SYSTIMESTAMP',       descripcion: 'Funciones de fecha de Oracle',                 nivelId: 'or-nivel5', orden: 1 }),
  new Tema({ id: 'or-n5-t2', nombre: 'NVL(), NVL2()',               descripcion: 'Manejo de nulos en Oracle',                    nivelId: 'or-nivel5', orden: 2 }),
  new Tema({ id: 'or-n5-t3', nombre: 'DECODE()',                    descripcion: 'Condicional inline de Oracle',                 nivelId: 'or-nivel5', orden: 3 }),
  new Tema({ id: 'or-n5-t4', nombre: 'TO_CHAR(), TO_DATE()',        descripcion: 'Conversión y formato de tipos',                nivelId: 'or-nivel5', orden: 4 }),
  new Tema({ id: 'or-n6-t1', nombre: 'PIVOT / UNPIVOT',             descripcion: 'Transponer filas y columnas',                  nivelId: 'or-nivel6', orden: 1 }),
  new Tema({ id: 'or-n6-t2', nombre: 'CONNECT BY',                  descripcion: 'Consultas jerárquicas',                        nivelId: 'or-nivel6', orden: 2 }),
  new Tema({ id: 'or-n6-t3', nombre: 'MODEL clause',                descripcion: 'Cálculos multidimensionales',                  nivelId: 'or-nivel6', orden: 3 }),
  new Tema({ id: 'or-n7-t1', nombre: 'EXPLAIN PLAN',                descripcion: 'Plan de ejecución Oracle',                     nivelId: 'or-nivel7', orden: 1 }),
  new Tema({ id: 'or-n7-t2', nombre: 'Bitmap indexes',              descripcion: 'Índices para columnas de baja cardinalidad',   nivelId: 'or-nivel7', orden: 2 }),
  new Tema({ id: 'or-n7-t3', nombre: 'Vistas materializadas',       descripcion: 'Vistas precalculadas en Oracle',               nivelId: 'or-nivel7', orden: 3 }),
  new Tema({ id: 'or-n8-t1', nombre: 'PL/SQL',                      descripcion: 'Lenguaje procedural de Oracle',                nivelId: 'or-nivel8', orden: 1 }),
  new Tema({ id: 'or-n8-t2', nombre: 'RMAN',                        descripcion: 'Recovery Manager para backups',                nivelId: 'or-nivel8', orden: 2 }),
  new Tema({ id: 'or-n8-t3', nombre: 'Data Guard',                  descripcion: 'Alta disponibilidad y disaster recovery',      nivelId: 'or-nivel8', orden: 3 }),
  new Tema({ id: 'or-n8-t4', nombre: 'Sequences',                   descripcion: 'Generadores de IDs secuenciales',             nivelId: 'or-nivel8', orden: 4 }),
];

export const TEMAS = [...TEMAS_BASE, ...TEMAS_PG, ...TEMAS_SS, ...TEMAS_MY, ...TEMAS_OR];
