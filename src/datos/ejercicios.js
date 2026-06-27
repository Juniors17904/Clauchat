import { Ejercicio } from '../modelos/ejercicio';

export const EJERCICIOS = [
  // ── NIVEL 1 · TEMA 1 — SELECT, FROM ─────────────────────────────────────
  new Ejercicio({
    id: 'n1-t1-01',
    titulo: 'Todos los estudiantes',
    enunciado: 'Obtén el nombre, apellido y promedio de todos los estudiantes.',
    nivelId: 'nivel1', temaId: 'n1-t1', baseDatosId: 'universidad',
    consultaEsperada: 'SELECT nombre, apellido, promedio FROM estudiantes',
    pistas: [
      'Usa SELECT para elegir columnas específicas',
      'Separa las columnas con comas',
      'FROM indica la tabla: estudiantes',
    ],
  }),
  new Ejercicio({
    id: 'n1-t1-02',
    titulo: 'Todos los datos de equipos',
    enunciado: 'Obtén todas las columnas de todos los equipos.',
    nivelId: 'nivel1', temaId: 'n1-t1', baseDatosId: 'deportes',
    consultaEsperada: 'SELECT * FROM equipos',
    pistas: [
      'El asterisco (*) selecciona todas las columnas',
      'No necesitas escribir cada columna por su nombre',
      'SELECT * FROM equipos',
    ],
  }),
  new Ejercicio({
    id: 'n1-t1-03',
    titulo: 'Lista de médicos',
    enunciado: 'Obtén el nombre y apellido de todos los médicos.',
    nivelId: 'nivel1', temaId: 'n1-t1', baseDatosId: 'hospital',
    consultaEsperada: 'SELECT nombre, apellido FROM medicos',
    pistas: [
      'La tabla se llama medicos',
      'Solo necesitas dos columnas: nombre y apellido',
    ],
  }),
  new Ejercicio({
    id: 'n1-t1-04',
    titulo: 'Carreras universitarias',
    enunciado: 'Obtén el nombre y la duración en años de todas las carreras.',
    nivelId: 'nivel1', temaId: 'n1-t1', baseDatosId: 'universidad',
    consultaEsperada: 'SELECT nombre, duracion_anios FROM carreras',
    pistas: [
      'La tabla se llama carreras',
      'La columna de duración se llama duracion_anios',
    ],
  }),
  new Ejercicio({
    id: 'n1-t1-05',
    titulo: 'Todos los datos de medicamentos',
    enunciado: 'Obtén todas las columnas de todos los medicamentos disponibles.',
    nivelId: 'nivel1', temaId: 'n1-t1', baseDatosId: 'hospital',
    consultaEsperada: 'SELECT * FROM medicamentos',
    pistas: [
      'Usa * para seleccionar todo sin escribir cada columna',
      'SELECT * FROM nombre_tabla',
    ],
  }),
  new Ejercicio({
    id: 'n1-t1-06',
    titulo: 'Medicamentos disponibles',
    enunciado: 'Obtén el nombre y precio de todos los medicamentos.',
    nivelId: 'nivel1', temaId: 'n1-t1', baseDatosId: 'hospital',
    consultaEsperada: 'SELECT nombre, precio FROM medicamentos',
    pistas: [
      'La tabla se llama medicamentos',
      'Selecciona las columnas nombre y precio',
    ],
  }),

  // ── NIVEL 1 · TEMA 2 — WHERE con =, !=, >, < ────────────────────────────
  new Ejercicio({
    id: 'n1-t2-01',
    titulo: 'Jugadores de Chile',
    enunciado: 'Obtén el nombre, apellido y posición de todos los jugadores de nacionalidad chilena.',
    nivelId: 'nivel1', temaId: 'n1-t2', baseDatosId: 'deportes',
    consultaEsperada: "SELECT nombre, apellido, posicion FROM jugadores WHERE nacionalidad = 'Chile'",
    pistas: [
      'Usa WHERE para filtrar por nacionalidad',
      "Los textos van entre comillas simples: 'Chile'",
      'La tabla se llama jugadores',
    ],
  }),
  new Ejercicio({
    id: 'n1-t2-02',
    titulo: 'Médicos del turno mañana',
    enunciado: "Obtén el nombre, apellido y especialidad_id de todos los médicos que trabajan en el turno 'Mañana'.",
    nivelId: 'nivel1', temaId: 'n1-t2', baseDatosId: 'hospital',
    consultaEsperada: "SELECT nombre, apellido, especialidad_id FROM medicos WHERE turno = 'Mañana'",
    pistas: [
      'La tabla se llama medicos',
      "El turno es un texto: 'Mañana'",
      'Usa WHERE turno = ...',
    ],
  }),
  new Ejercicio({
    id: 'n1-t2-03',
    titulo: 'Estudiantes con buen promedio',
    enunciado: 'Obtén todos los datos de los estudiantes cuyo promedio sea mayor o igual a 6.5.',
    nivelId: 'nivel1', temaId: 'n1-t2', baseDatosId: 'universidad',
    consultaEsperada: 'SELECT * FROM estudiantes WHERE promedio >= 6.5',
    pistas: [
      'Usa WHERE para filtrar filas',
      '>= significa "mayor o igual que"',
      'Ejemplo: WHERE columna >= valor',
    ],
  }),

  new Ejercicio({
    id: 'n1-t2-04',
    titulo: 'Pacientes mujeres',
    enunciado: "Obtén el nombre, apellido y tipo de sangre de todos los pacientes de género femenino ('F').",
    nivelId: 'nivel1', temaId: 'n1-t2', baseDatosId: 'hospital',
    consultaEsperada: "SELECT nombre, apellido, tipo_sangre FROM pacientes WHERE genero = 'F'",
    pistas: [
      'La tabla se llama pacientes',
      "El género femenino está guardado como 'F'",
      'Usa WHERE genero = ...',
    ],
  }),
  new Ejercicio({
    id: 'n1-t2-05',
    titulo: 'Medicamentos baratos',
    enunciado: 'Obtén el nombre y precio de los medicamentos con precio menor a 5000.',
    nivelId: 'nivel1', temaId: 'n1-t2', baseDatosId: 'hospital',
    consultaEsperada: 'SELECT nombre, precio FROM medicamentos WHERE precio < 5000',
    pistas: [
      'La tabla se llama medicamentos',
      'Usa < para "menor que"',
      'WHERE precio < 5000',
    ],
  }),
  new Ejercicio({
    id: 'n1-t2-06',
    titulo: 'Profesores bien pagados',
    enunciado: 'Obtén el nombre, apellido y salario de los profesores con salario mayor a 4500000.',
    nivelId: 'nivel1', temaId: 'n1-t2', baseDatosId: 'universidad',
    consultaEsperada: 'SELECT nombre, apellido, salario FROM profesores WHERE salario > 4500000',
    pistas: [
      'La tabla se llama profesores',
      'Usa > para "mayor que"',
      'WHERE salario > 4500000',
    ],
  }),

  // ── NIVEL 1 · TEMA 3 — AND, OR, NOT ─────────────────────────────────────
  new Ejercicio({
    id: 'n1-t3-01',
    titulo: 'Delanteros argentinos',
    enunciado: "Obtén el nombre, apellido y edad de los jugadores que sean delanteros Y de nacionalidad argentina.",
    nivelId: 'nivel1', temaId: 'n1-t3', baseDatosId: 'deportes',
    consultaEsperada: "SELECT nombre, apellido, edad FROM jugadores WHERE posicion = 'Delantero' AND nacionalidad = 'Argentina'",
    pistas: [
      'AND requiere que ambas condiciones sean verdaderas',
      "posicion = 'Delantero' y nacionalidad = 'Argentina'",
      'Combina las dos condiciones con AND',
    ],
  }),
  new Ejercicio({
    id: 'n1-t3-02',
    titulo: 'Estudiantes jóvenes con buen promedio',
    enunciado: 'Obtén el nombre, apellido, edad y promedio de los estudiantes menores de 21 años con promedio mayor a 6.5.',
    nivelId: 'nivel1', temaId: 'n1-t3', baseDatosId: 'universidad',
    consultaEsperada: 'SELECT nombre, apellido, edad, promedio FROM estudiantes WHERE edad < 21 AND promedio > 6.5',
    pistas: [
      'Necesitas dos condiciones unidas con AND',
      'edad < 21 filtra los más jóvenes',
      'promedio > 6.5 filtra los de buen rendimiento',
    ],
  }),
  new Ejercicio({
    id: 'n1-t3-03',
    titulo: 'Médicos de mañana o tarde',
    enunciado: "Obtén el nombre, apellido y turno de los médicos que trabajen en turno 'Mañana' o en turno 'Tarde'.",
    nivelId: 'nivel1', temaId: 'n1-t3', baseDatosId: 'hospital',
    consultaEsperada: "SELECT nombre, apellido, turno FROM medicos WHERE turno = 'Mañana' OR turno = 'Tarde'",
    pistas: [
      'OR es verdadero si al menos una condición se cumple',
      "Filtra por turno = 'Mañana' OR turno = 'Tarde'",
      'Esto excluye el turno Rotativo',
    ],
  }),
  new Ejercicio({
    id: 'n1-t3-04',
    titulo: 'Equipos fuera de Santiago',
    enunciado: "Obtén el nombre y ciudad de los equipos que NO sean de Santiago.",
    nivelId: 'nivel1', temaId: 'n1-t3', baseDatosId: 'deportes',
    consultaEsperada: "SELECT nombre, ciudad FROM equipos WHERE NOT ciudad = 'Santiago'",
    pistas: [
      'NOT niega la condición que le sigue',
      "NOT ciudad = 'Santiago' equivale a ciudad != 'Santiago'",
      'Úsalo justo después de WHERE',
    ],
  }),
  new Ejercicio({
    id: 'n1-t3-05',
    titulo: 'Jugadores veteranos o chilenos',
    enunciado: "Obtén el nombre, apellido, edad y nacionalidad de los jugadores mayores de 33 años O de nacionalidad chilena.",
    nivelId: 'nivel1', temaId: 'n1-t3', baseDatosId: 'deportes',
    consultaEsperada: "SELECT nombre, apellido, edad, nacionalidad FROM jugadores WHERE edad > 33 OR nacionalidad = 'Chile'",
    pistas: [
      'OR devuelve filas donde se cumple al menos una condición',
      'edad > 33 para los veteranos',
      "nacionalidad = 'Chile' para los chilenos",
    ],
  }),
  new Ejercicio({
    id: 'n1-t3-06',
    titulo: 'Habitaciones disponibles no UCI',
    enunciado: "Obtén el número, tipo y precio por día de las habitaciones que estén 'Disponible' y NO sean de tipo 'UCI'.",
    nivelId: 'nivel1', temaId: 'n1-t3', baseDatosId: 'hospital',
    consultaEsperada: "SELECT numero, tipo, precio_dia FROM habitaciones WHERE estado = 'Disponible' AND NOT tipo = 'UCI'",
    pistas: [
      "Filtra por estado = 'Disponible' con AND",
      "NOT tipo = 'UCI' excluye las UCI",
      'Combina AND con NOT para ambas restricciones',
    ],
  }),

  // ── NIVEL 1 · TEMA 4 — ORDER BY ASC/DESC ────────────────────────────────
  new Ejercicio({
    id: 'n1-t4-01',
    titulo: 'Equipos fundados antes de 1910',
    enunciado: 'Obtén el nombre y año de fundación de los equipos fundados antes de 1910, ordenados por fundación ascendente.',
    nivelId: 'nivel1', temaId: 'n1-t4', baseDatosId: 'deportes',
    consultaEsperada: 'SELECT nombre, fundacion FROM equipos WHERE fundacion < 1910 ORDER BY fundacion ASC',
    pistas: [
      'La columna de año se llama fundacion',
      'Usa < para "menor que"',
      'ORDER BY fundacion ASC para ordenar de más antiguo a más nuevo',
    ],
  }),
  new Ejercicio({
    id: 'n1-t4-02',
    titulo: 'Medicamentos económicos',
    enunciado: 'Obtén el nombre y precio de los medicamentos con precio menor a 6000, ordenados por precio ascendente.',
    nivelId: 'nivel1', temaId: 'n1-t4', baseDatosId: 'hospital',
    consultaEsperada: 'SELECT nombre, precio FROM medicamentos WHERE precio < 6000 ORDER BY precio ASC',
    pistas: [
      'La tabla se llama medicamentos',
      'Usa WHERE precio < 6000',
      'Luego ORDER BY precio ASC',
    ],
  }),

  new Ejercicio({
    id: 'n1-t4-03',
    titulo: 'Jugadores más veteranos',
    enunciado: 'Obtén el nombre, apellido y edad de todos los jugadores, ordenados de mayor a menor edad.',
    nivelId: 'nivel1', temaId: 'n1-t4', baseDatosId: 'deportes',
    consultaEsperada: 'SELECT nombre, apellido, edad FROM jugadores ORDER BY edad DESC',
    pistas: [
      'ORDER BY va al final de la consulta',
      'DESC ordena de mayor a menor',
      'Ordena por la columna edad',
    ],
  }),
  new Ejercicio({
    id: 'n1-t4-04',
    titulo: 'Médicos por salario',
    enunciado: 'Obtén el nombre, apellido y salario de todos los médicos, ordenados de mayor a menor salario.',
    nivelId: 'nivel1', temaId: 'n1-t4', baseDatosId: 'hospital',
    consultaEsperada: 'SELECT nombre, apellido, salario FROM medicos ORDER BY salario DESC',
    pistas: [
      'La tabla se llama medicos',
      'ORDER BY salario DESC para mayor a menor',
    ],
  }),
  new Ejercicio({
    id: 'n1-t4-05',
    titulo: 'Estudiantes en orden alfabético',
    enunciado: 'Obtén el nombre y apellido de todos los estudiantes, ordenados por apellido de forma ascendente (A→Z).',
    nivelId: 'nivel1', temaId: 'n1-t4', baseDatosId: 'universidad',
    consultaEsperada: 'SELECT nombre, apellido FROM estudiantes ORDER BY apellido ASC',
    pistas: [
      'ASC ordena de menor a mayor (A a Z para texto)',
      'ORDER BY apellido ASC',
      'ASC es el orden predeterminado, pero escríbelo igual',
    ],
  }),
  new Ejercicio({
    id: 'n1-t4-06',
    titulo: 'Medicamentos por stock',
    enunciado: 'Obtén el nombre y stock de todos los medicamentos, ordenados por stock de menor a mayor.',
    nivelId: 'nivel1', temaId: 'n1-t4', baseDatosId: 'hospital',
    consultaEsperada: 'SELECT nombre, stock FROM medicamentos ORDER BY stock ASC',
    pistas: [
      'La tabla se llama medicamentos',
      'stock es la columna de cantidad disponible',
      'ORDER BY stock ASC para menor a mayor',
    ],
  }),

  // ── NIVEL 1 · TEMA 5 — LIMIT ─────────────────────────────────────────────
  new Ejercicio({
    id: 'n1-t5-01',
    titulo: 'Top 5 estudiantes',
    enunciado: 'Obtén el nombre, apellido y promedio de los 5 estudiantes con mayor promedio.',
    nivelId: 'nivel1', temaId: 'n1-t5', baseDatosId: 'universidad',
    consultaEsperada: 'SELECT nombre, apellido, promedio FROM estudiantes ORDER BY promedio DESC LIMIT 5',
    pistas: [
      'Primero ordena de mayor a menor con ORDER BY promedio DESC',
      'Luego usa LIMIT para limitar el número de resultados',
      'LIMIT va al final de la consulta',
    ],
  }),

  new Ejercicio({
    id: 'n1-t5-02',
    titulo: '3 medicamentos más caros',
    enunciado: 'Obtén el nombre y precio de los 3 medicamentos con mayor precio.',
    nivelId: 'nivel1', temaId: 'n1-t5', baseDatosId: 'hospital',
    consultaEsperada: 'SELECT nombre, precio FROM medicamentos ORDER BY precio DESC LIMIT 3',
    pistas: [
      'Ordena de mayor a menor con ORDER BY precio DESC',
      'LIMIT 3 limita a los 3 primeros resultados',
    ],
  }),
  new Ejercicio({
    id: 'n1-t5-03',
    titulo: '10 estudiantes más jóvenes',
    enunciado: 'Obtén el nombre, apellido y edad de los 10 estudiantes más jóvenes.',
    nivelId: 'nivel1', temaId: 'n1-t5', baseDatosId: 'universidad',
    consultaEsperada: 'SELECT nombre, apellido, edad FROM estudiantes ORDER BY edad ASC LIMIT 10',
    pistas: [
      'Ordena por edad ASC para que los más jóvenes queden primero',
      'LIMIT 10 para obtener solo los 10 primeros',
    ],
  }),
  new Ejercicio({
    id: 'n1-t5-04',
    titulo: 'Equipo más antiguo',
    enunciado: 'Obtén el nombre y año de fundación del equipo más antiguo (solo 1 resultado).',
    nivelId: 'nivel1', temaId: 'n1-t5', baseDatosId: 'deportes',
    consultaEsperada: 'SELECT nombre, fundacion FROM equipos ORDER BY fundacion ASC LIMIT 1',
    pistas: [
      'El más antiguo tiene el menor año de fundación',
      'ORDER BY fundacion ASC para que el más antiguo quede primero',
      'LIMIT 1 para obtener solo ese resultado',
    ],
  }),
  new Ejercicio({
    id: 'n1-t5-05',
    titulo: 'Top 3 médicos mejor pagados',
    enunciado: 'Obtén el nombre, apellido y salario de los 3 médicos con mayor salario.',
    nivelId: 'nivel1', temaId: 'n1-t5', baseDatosId: 'hospital',
    consultaEsperada: 'SELECT nombre, apellido, salario FROM medicos ORDER BY salario DESC LIMIT 3',
    pistas: [
      'ORDER BY salario DESC para mayor a menor',
      'LIMIT 3 para los 3 primeros',
    ],
  }),
  new Ejercicio({
    id: 'n1-t5-06',
    titulo: 'Top 5 jugadores más valiosos',
    enunciado: 'Obtén el nombre, apellido y valor de mercado de los 5 jugadores con mayor valor de mercado.',
    nivelId: 'nivel1', temaId: 'n1-t5', baseDatosId: 'deportes',
    consultaEsperada: 'SELECT nombre, apellido, valor_mercado FROM jugadores ORDER BY valor_mercado DESC LIMIT 5',
    pistas: [
      'La columna se llama valor_mercado',
      'ORDER BY valor_mercado DESC para mayor a menor',
      'LIMIT 5 para los 5 primeros',
    ],
  }),

  // ── NIVEL 1 · TEMA 6 — DISTINCT ──────────────────────────────────────────
  new Ejercicio({
    id: 'n1-t6-01',
    titulo: 'Nacionalidades únicas',
    enunciado: 'Obtén la lista de todas las nacionalidades diferentes que tienen los jugadores.',
    nivelId: 'nivel1', temaId: 'n1-t6', baseDatosId: 'deportes',
    consultaEsperada: 'SELECT DISTINCT nacionalidad FROM jugadores',
    pistas: [
      'DISTINCT elimina duplicados',
      'Úsalo justo después de SELECT',
      'Solo necesitas una columna: nacionalidad',
    ],
  }),

  new Ejercicio({
    id: 'n1-t6-02',
    titulo: 'Posiciones únicas',
    enunciado: 'Obtén la lista de todas las posiciones diferentes que existen entre los jugadores.',
    nivelId: 'nivel1', temaId: 'n1-t6', baseDatosId: 'deportes',
    consultaEsperada: 'SELECT DISTINCT posicion FROM jugadores',
    pistas: [
      'DISTINCT elimina los valores repetidos',
      'Úsalo justo después de SELECT',
      'Solo necesitas la columna posicion',
    ],
  }),
  new Ejercicio({
    id: 'n1-t6-03',
    titulo: 'Turnos únicos de médicos',
    enunciado: 'Obtén los tipos de turno diferentes que existen entre los médicos.',
    nivelId: 'nivel1', temaId: 'n1-t6', baseDatosId: 'hospital',
    consultaEsperada: 'SELECT DISTINCT turno FROM medicos',
    pistas: [
      'DISTINCT elimina duplicados de la columna',
      'Solo necesitas la columna turno',
    ],
  }),
  new Ejercicio({
    id: 'n1-t6-04',
    titulo: 'Tipos de habitación',
    enunciado: 'Obtén la lista de todos los tipos de habitación diferentes que hay en el hospital.',
    nivelId: 'nivel1', temaId: 'n1-t6', baseDatosId: 'hospital',
    consultaEsperada: 'SELECT DISTINCT tipo FROM habitaciones',
    pistas: [
      'La tabla se llama habitaciones',
      'La columna es tipo',
      'DISTINCT elimina los repetidos',
    ],
  }),
  new Ejercicio({
    id: 'n1-t6-05',
    titulo: 'Laboratorios únicos',
    enunciado: 'Obtén la lista de todos los laboratorios diferentes que fabrican medicamentos.',
    nivelId: 'nivel1', temaId: 'n1-t6', baseDatosId: 'hospital',
    consultaEsperada: 'SELECT DISTINCT laboratorio FROM medicamentos',
    pistas: [
      'La tabla se llama medicamentos',
      'La columna es laboratorio',
      'DISTINCT elimina laboratorios repetidos',
    ],
  }),
  new Ejercicio({
    id: 'n1-t6-06',
    titulo: 'Ciudades únicas de equipos',
    enunciado: 'Obtén la lista de todas las ciudades diferentes en las que hay equipos registrados.',
    nivelId: 'nivel1', temaId: 'n1-t6', baseDatosId: 'deportes',
    consultaEsperada: 'SELECT DISTINCT ciudad FROM equipos',
    pistas: [
      'La tabla se llama equipos',
      'La columna es ciudad',
      'DISTINCT devuelve cada ciudad solo una vez',
    ],
  }),

  // ── NIVEL 1 · TEMA 7 — IS NULL / IS NOT NULL ─────────────────────────────
  new Ejercicio({
    id: 'n1-t7-01',
    titulo: 'Profesores con email',
    enunciado: 'Obtén el nombre, apellido y email de los profesores que tienen email registrado.',
    nivelId: 'nivel1', temaId: 'n1-t7', baseDatosId: 'universidad',
    consultaEsperada: 'SELECT nombre, apellido, email FROM profesores WHERE email IS NOT NULL',
    pistas: [
      'IS NOT NULL filtra las filas donde la columna tiene valor',
      'WHERE email IS NOT NULL',
      'No uses = sino IS NOT NULL',
    ],
  }),
  new Ejercicio({
    id: 'n1-t7-02',
    titulo: 'Estudiantes sin email',
    enunciado: 'Obtén el nombre y apellido de los estudiantes que no tienen email registrado.',
    nivelId: 'nivel1', temaId: 'n1-t7', baseDatosId: 'universidad',
    consultaEsperada: 'SELECT nombre, apellido FROM estudiantes WHERE email IS NULL',
    pistas: [
      'IS NULL filtra las filas donde la columna está vacía (sin valor)',
      'WHERE email IS NULL',
      'No se puede usar = NULL, siempre IS NULL',
    ],
  }),
  new Ejercicio({
    id: 'n1-t7-03',
    titulo: 'Médicos con email registrado',
    enunciado: 'Obtén el nombre, apellido y email de los médicos que tienen email registrado.',
    nivelId: 'nivel1', temaId: 'n1-t7', baseDatosId: 'hospital',
    consultaEsperada: 'SELECT nombre, apellido, email FROM medicos WHERE email IS NOT NULL',
    pistas: [
      'La tabla se llama medicos',
      'IS NOT NULL verifica que la columna no sea NULL',
    ],
  }),
  new Ejercicio({
    id: 'n1-t7-04',
    titulo: 'Medicamentos con principio activo',
    enunciado: 'Obtén el nombre y principio activo de los medicamentos que tienen principio activo registrado.',
    nivelId: 'nivel1', temaId: 'n1-t7', baseDatosId: 'hospital',
    consultaEsperada: 'SELECT nombre, principio_activo FROM medicamentos WHERE principio_activo IS NOT NULL',
    pistas: [
      'La columna se llama principio_activo',
      'IS NOT NULL para los que sí tienen valor',
    ],
  }),
  new Ejercicio({
    id: 'n1-t7-05',
    titulo: 'Pacientes sin seguro',
    enunciado: 'Obtén el nombre y apellido de los pacientes que no tienen seguro médico asignado.',
    nivelId: 'nivel1', temaId: 'n1-t7', baseDatosId: 'hospital',
    consultaEsperada: 'SELECT nombre, apellido FROM pacientes WHERE seguro_id IS NULL',
    pistas: [
      'La tabla se llama pacientes',
      'seguro_id es la columna del seguro',
      'IS NULL para los que no tienen seguro',
    ],
  }),
  new Ejercicio({
    id: 'n1-t7-06',
    titulo: 'Equipos con estadio',
    enunciado: 'Obtén el nombre y ciudad de los equipos que tienen estadio asignado.',
    nivelId: 'nivel1', temaId: 'n1-t7', baseDatosId: 'deportes',
    consultaEsperada: 'SELECT nombre, ciudad FROM equipos WHERE estadio_id IS NOT NULL',
    pistas: [
      'La tabla se llama equipos',
      'estadio_id es la columna del estadio',
      'IS NOT NULL para los que tienen estadio',
    ],
  }),

  // ── NIVEL 1 · TEMA 8 — LIKE, BETWEEN, IN ─────────────────────────────────
  new Ejercicio({
    id: 'n1-t8-01',
    titulo: "Estudiantes cuyo nombre empieza con 'A'",
    enunciado: "Obtén el nombre y apellido de los estudiantes cuyo nombre empiece con la letra 'A'.",
    nivelId: 'nivel1', temaId: 'n1-t8', baseDatosId: 'universidad',
    consultaEsperada: "SELECT nombre, apellido FROM estudiantes WHERE nombre LIKE 'A%'",
    pistas: [
      "LIKE permite buscar por patrón de texto",
      "% representa cualquier cantidad de caracteres",
      "'A%' significa que empiece con A",
    ],
  }),
  new Ejercicio({
    id: 'n1-t8-02',
    titulo: "Medicamentos que contienen 'ina'",
    enunciado: "Obtén el nombre y precio de los medicamentos cuyo nombre contenga el texto 'ina'.",
    nivelId: 'nivel1', temaId: 'n1-t8', baseDatosId: 'hospital',
    consultaEsperada: "SELECT nombre, precio FROM medicamentos WHERE nombre LIKE '%ina%'",
    pistas: [
      "'%ina%' busca 'ina' en cualquier posición del nombre",
      "% antes y después significa que puede haber texto de cualquier tipo alrededor",
    ],
  }),
  new Ejercicio({
    id: 'n1-t8-03',
    titulo: 'Jugadores con valor de mercado medio',
    enunciado: 'Obtén el nombre, apellido y valor de mercado de los jugadores con valor entre 1000000 y 10000000.',
    nivelId: 'nivel1', temaId: 'n1-t8', baseDatosId: 'deportes',
    consultaEsperada: 'SELECT nombre, apellido, valor_mercado FROM jugadores WHERE valor_mercado BETWEEN 1000000 AND 10000000',
    pistas: [
      'BETWEEN incluye los dos extremos del rango',
      'BETWEEN valor1 AND valor2',
      'La columna se llama valor_mercado',
    ],
  }),
  new Ejercicio({
    id: 'n1-t8-04',
    titulo: 'Estudiantes con promedio entre 6.0 y 7.0',
    enunciado: 'Obtén el nombre, apellido y promedio de los estudiantes con promedio entre 6.0 y 7.0 (ambos inclusive).',
    nivelId: 'nivel1', temaId: 'n1-t8', baseDatosId: 'universidad',
    consultaEsperada: 'SELECT nombre, apellido, promedio FROM estudiantes WHERE promedio BETWEEN 6.0 AND 7.0',
    pistas: [
      'BETWEEN 6.0 AND 7.0 incluye el 6.0 y el 7.0',
      'Es equivalente a >= 6.0 AND <= 7.0',
    ],
  }),
  new Ejercicio({
    id: 'n1-t8-05',
    titulo: 'Médicos de ciertas especialidades',
    enunciado: 'Obtén el nombre, apellido y especialidad_id de los médicos cuya especialidad sea 1, 2 o 3.',
    nivelId: 'nivel1', temaId: 'n1-t8', baseDatosId: 'hospital',
    consultaEsperada: 'SELECT nombre, apellido, especialidad_id FROM medicos WHERE especialidad_id IN (1, 2, 3)',
    pistas: [
      'IN permite filtrar por una lista de valores',
      'IN (1, 2, 3) equivale a = 1 OR = 2 OR = 3',
      'Los valores van entre paréntesis separados por comas',
    ],
  }),
  new Ejercicio({
    id: 'n1-t8-06',
    titulo: 'Jugadores por posición',
    enunciado: "Obtén el nombre, apellido y posición de los jugadores que sean Delantero, Portero o Defensa.",
    nivelId: 'nivel1', temaId: 'n1-t8', baseDatosId: 'deportes',
    consultaEsperada: "SELECT nombre, apellido, posicion FROM jugadores WHERE posicion IN ('Delantero', 'Portero', 'Defensa')",
    pistas: [
      'IN funciona también con textos',
      "IN ('Delantero', 'Portero', 'Defensa')",
      'Las cadenas de texto van entre comillas simples dentro del IN',
    ],
  }),

  // ── NIVEL 2 · TEMA 1 — COUNT, SUM, AVG, MAX, MIN ─────────────────────────
  new Ejercicio({
    id: 'n2-t1-01',
    titulo: 'Promedio general',
    enunciado: 'Obtén el promedio de todos los promedios de estudiantes, el máximo y el mínimo. Llama a las columnas promedio_general, maximo y minimo.',
    nivelId: 'nivel2', temaId: 'n2-t1', baseDatosId: 'universidad',
    consultaEsperada: 'SELECT AVG(promedio) AS promedio_general, MAX(promedio) AS maximo, MIN(promedio) AS minimo FROM estudiantes',
    pistas: [
      'Usa AVG() para el promedio, MAX() y MIN()',
      'AS permite renombrar cada columna resultado',
      'No necesitas GROUP BY porque es un solo resultado global',
    ],
  }),

  // ── NIVEL 2 · TEMA 2 — GROUP BY ──────────────────────────────────────────
  new Ejercicio({
    id: 'n2-t2-01',
    titulo: 'Jugadores por equipo',
    enunciado: 'Obtén el id de cada equipo y la cantidad de jugadores que tiene. Llama a la cuenta total_jugadores.',
    nivelId: 'nivel2', temaId: 'n2-t2', baseDatosId: 'deportes',
    consultaEsperada: 'SELECT equipo_id, COUNT(*) AS total_jugadores FROM jugadores GROUP BY equipo_id',
    pistas: [
      'COUNT(*) cuenta todas las filas del grupo',
      'GROUP BY equipo_id agrupa por equipo',
      'Llama a la columna total_jugadores con AS',
    ],
  }),
  new Ejercicio({
    id: 'n2-t2-02',
    titulo: 'Promedio por carrera',
    enunciado: 'Obtén el id de cada carrera y el promedio de sus estudiantes. Llama al resultado promedio_carrera.',
    nivelId: 'nivel2', temaId: 'n2-t2', baseDatosId: 'universidad',
    consultaEsperada: 'SELECT carrera_id, AVG(promedio) AS promedio_carrera FROM estudiantes GROUP BY carrera_id',
    pistas: [
      'GROUP BY carrera_id agrupa por carrera',
      'AVG(promedio) calcula el promedio del grupo',
    ],
  }),

  // ── NIVEL 2 · TEMA 3 — HAVING ────────────────────────────────────────────
  new Ejercicio({
    id: 'n2-t3-01',
    titulo: 'Médicos con más de 2 consultas',
    enunciado: 'Obtén el id de cada médico y su número de consultas. Muestra solo los que tienen más de 2 consultas.',
    nivelId: 'nivel2', temaId: 'n2-t3', baseDatosId: 'hospital',
    consultaEsperada: 'SELECT medico_id, COUNT(*) AS total_consultas FROM consultas GROUP BY medico_id HAVING COUNT(*) > 2',
    pistas: [
      'GROUP BY medico_id para agrupar por médico',
      'HAVING filtra grupos, no filas (no uses WHERE aquí)',
      'COUNT(*) > 2 dentro de HAVING',
    ],
  }),
  new Ejercicio({
    id: 'n2-t3-02',
    titulo: 'Carreras con promedio alto',
    enunciado: 'Obtén el id de cada carrera y el promedio de sus estudiantes. Muestra solo las carreras con promedio mayor a 6.0. Llama al resultado promedio_carrera.',
    nivelId: 'nivel2', temaId: 'n2-t3', baseDatosId: 'universidad',
    consultaEsperada: 'SELECT carrera_id, AVG(promedio) AS promedio_carrera FROM estudiantes GROUP BY carrera_id HAVING AVG(promedio) > 6.0',
    pistas: [
      'GROUP BY carrera_id agrupa por carrera',
      'HAVING AVG(promedio) > 6.0 filtra los grupos',
    ],
  }),

  // ── NIVEL 3 · TEMA 1 — INNER JOIN ────────────────────────────────────────
  new Ejercicio({
    id: 'n3-t1-01',
    titulo: 'Estudiantes con su carrera',
    enunciado: 'Obtén el nombre y apellido del estudiante junto con el nombre de su carrera. Llama a la columna de carrera "carrera".',
    nivelId: 'nivel3', temaId: 'n3-t1', baseDatosId: 'universidad',
    consultaEsperada: 'SELECT e.nombre, e.apellido, c.nombre AS carrera FROM estudiantes e JOIN carreras c ON e.carrera_id = c.id',
    pistas: [
      'Usa JOIN para unir dos tablas',
      'estudiantes.carrera_id apunta a carreras.id',
      'Usa alias: estudiantes e, carreras c',
    ],
  }),
  new Ejercicio({
    id: 'n3-t1-02',
    titulo: 'Jugadores con su equipo',
    enunciado: 'Obtén el nombre, apellido y posición del jugador junto con el nombre de su equipo. Llama a la columna del equipo "equipo".',
    nivelId: 'nivel3', temaId: 'n3-t1', baseDatosId: 'deportes',
    consultaEsperada: 'SELECT j.nombre, j.apellido, j.posicion, e.nombre AS equipo FROM jugadores j JOIN equipos e ON j.equipo_id = e.id',
    pistas: [
      'jugadores.equipo_id apunta a equipos.id',
      'Usa JOIN ... ON para relacionar las tablas',
    ],
  }),
  new Ejercicio({
    id: 'n3-t1-03',
    titulo: 'Consultas con médico y paciente',
    enunciado: 'Obtén la fecha de cada consulta, el nombre del paciente y el nombre del médico. Llama a las columnas "paciente" y "medico".',
    nivelId: 'nivel3', temaId: 'n3-t1', baseDatosId: 'hospital',
    consultaEsperada: 'SELECT c.fecha, p.nombre AS paciente, m.nombre AS medico FROM consultas c JOIN pacientes p ON c.paciente_id = p.id JOIN medicos m ON c.medico_id = m.id',
    pistas: [
      'Necesitas dos JOIN: uno para pacientes y otro para médicos',
      'consultas.paciente_id → pacientes.id',
      'consultas.medico_id → medicos.id',
    ],
  }),

  // ── NIVEL 3 · TEMA 2 — LEFT JOIN ─────────────────────────────────────────
  new Ejercicio({
    id: 'n3-t2-01',
    titulo: 'Estudiantes sin matrícula',
    enunciado: 'Obtén el nombre y apellido de los estudiantes que NO tienen ninguna matrícula registrada.',
    nivelId: 'nivel3', temaId: 'n3-t2', baseDatosId: 'universidad',
    consultaEsperada: 'SELECT e.nombre, e.apellido FROM estudiantes e LEFT JOIN matriculas m ON e.id = m.estudiante_id WHERE m.id IS NULL',
    pistas: [
      'LEFT JOIN incluye todos los estudiantes aunque no tengan matrícula',
      'Cuando no hay match, las columnas de matriculas quedan en NULL',
      'Filtra con WHERE m.id IS NULL',
    ],
  }),

  // ── NIVEL 3 · TEMA 1 — INNER JOIN (JOIN + GROUP BY) ─────────────────────
  new Ejercicio({
    id: 'n3-t1-04',
    titulo: 'Goles por jugador',
    enunciado: 'Obtén el nombre, apellido y total de goles de cada jugador que haya marcado al menos 2 goles. Ordena de más goles a menos.',
    nivelId: 'nivel3', temaId: 'n3-t1', baseDatosId: 'deportes',
    consultaEsperada: 'SELECT j.nombre, j.apellido, COUNT(g.id) AS total_goles FROM jugadores j JOIN goles g ON j.id = g.jugador_id GROUP BY j.id HAVING COUNT(g.id) >= 2 ORDER BY total_goles DESC',
    pistas: [
      'JOIN jugadores con goles usando jugador_id',
      'GROUP BY j.id para agrupar por jugador',
      'HAVING COUNT(g.id) >= 2 filtra los que marcaron al menos 2',
    ],
  }),
];
