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

  // ── NIVEL 1 · TEMA 9 — Alias con AS ──────────────────────────────────────
  new Ejercicio({
    id: 'n1-t9-01',
    titulo: 'Estudiantes con alias',
    enunciado: 'Obtén el nombre, apellido y promedio de todos los estudiantes. Llama a las columnas: alumno, apellidos y nota.',
    nivelId: 'nivel1', temaId: 'n1-t9', baseDatosId: 'universidad',
    consultaEsperada: 'SELECT nombre AS alumno, apellido AS apellidos, promedio AS nota FROM estudiantes',
    pistas: [
      'AS va justo después del nombre original de la columna',
      'SELECT nombre AS alumno, apellido AS apellidos, ...',
      'Cada columna tiene su propio alias separado',
    ],
  }),
  new Ejercicio({
    id: 'n1-t9-02',
    titulo: 'Equipos con alias',
    enunciado: 'Obtén el nombre y ciudad de todos los equipos. Llama a las columnas: club y sede.',
    nivelId: 'nivel1', temaId: 'n1-t9', baseDatosId: 'deportes',
    consultaEsperada: 'SELECT nombre AS club, ciudad AS sede FROM equipos',
    pistas: [
      'SELECT nombre AS club, ciudad AS sede',
      'FROM equipos',
    ],
  }),
  new Ejercicio({
    id: 'n1-t9-03',
    titulo: 'Medicamentos ordenados por alias',
    enunciado: 'Obtén el nombre y precio de todos los medicamentos. Llama a las columnas: medicamento y costo. Ordénalos de menor a mayor costo.',
    nivelId: 'nivel1', temaId: 'n1-t9', baseDatosId: 'hospital',
    consultaEsperada: 'SELECT nombre AS medicamento, precio AS costo FROM medicamentos ORDER BY costo ASC',
    pistas: [
      'Define el alias en SELECT: precio AS costo',
      'Puedes usar el alias en ORDER BY: ORDER BY costo ASC',
    ],
  }),
  new Ejercicio({
    id: 'n1-t9-04',
    titulo: 'Top jugadores con alias',
    enunciado: 'Obtén el nombre y valor de mercado de los 5 jugadores más valiosos. Llama a las columnas: jugador y valor.',
    nivelId: 'nivel1', temaId: 'n1-t9', baseDatosId: 'deportes',
    consultaEsperada: 'SELECT nombre AS jugador, valor_mercado AS valor FROM jugadores ORDER BY valor DESC LIMIT 5',
    pistas: [
      'nombre AS jugador, valor_mercado AS valor',
      'ORDER BY valor DESC para ordenar de mayor a menor',
      'LIMIT 5 para los 5 primeros',
    ],
  }),
  new Ejercicio({
    id: 'n1-t9-05',
    titulo: 'Profesores con alias',
    enunciado: 'Obtén el nombre, apellido y salario de todos los profesores. Llama a las columnas: nombre_profe, apellido_profe y sueldo.',
    nivelId: 'nivel1', temaId: 'n1-t9', baseDatosId: 'universidad',
    consultaEsperada: 'SELECT nombre AS nombre_profe, apellido AS apellido_profe, salario AS sueldo FROM profesores',
    pistas: [
      'Cada columna necesita su propio AS con el alias indicado',
      'nombre AS nombre_profe, apellido AS apellido_profe, salario AS sueldo',
    ],
  }),
  new Ejercicio({
    id: 'n1-t9-06',
    titulo: 'Pacientes con alias y filtro',
    enunciado: "Obtén el nombre, apellido y tipo de sangre de los pacientes de género masculino ('M'). Llama a las columnas: paciente, apellidos y sangre.",
    nivelId: 'nivel1', temaId: 'n1-t9', baseDatosId: 'hospital',
    consultaEsperada: "SELECT nombre AS paciente, apellido AS apellidos, tipo_sangre AS sangre FROM pacientes WHERE genero = 'M'",
    pistas: [
      'Escribe el SELECT con los alias primero',
      "WHERE genero = 'M' para filtrar masculinos",
      'Los alias no afectan el WHERE',
    ],
  }),

  // ── NIVEL 1 · TEMA 10 — Operadores aritméticos ───────────────────────────
  new Ejercicio({
    id: 'n1-t10-01',
    titulo: 'Precio con IVA',
    enunciado: 'Obtén el nombre de cada medicamento y su precio con IVA del 19% (precio multiplicado por 1.19). Llama a la columna calculada: precio_con_iva.',
    nivelId: 'nivel1', temaId: 'n1-t10', baseDatosId: 'hospital',
    consultaEsperada: 'SELECT nombre, precio * 1.19 AS precio_con_iva FROM medicamentos',
    pistas: [
      'Multiplica precio por 1.19 directamente en el SELECT',
      'precio * 1.19 AS precio_con_iva',
    ],
  }),
  new Ejercicio({
    id: 'n1-t10-02',
    titulo: 'Salario mensual de profesores',
    enunciado: 'Los salarios están en formato anual. Obtén el nombre y el salario mensual de cada profesor (divide entre 12). Llama a la columna: salario_mensual.',
    nivelId: 'nivel1', temaId: 'n1-t10', baseDatosId: 'universidad',
    consultaEsperada: 'SELECT nombre, salario / 12 AS salario_mensual FROM profesores',
    pistas: [
      'Divide salario entre 12 directamente en el SELECT',
      'salario / 12 AS salario_mensual',
    ],
  }),
  new Ejercicio({
    id: 'n1-t10-03',
    titulo: 'Años de existencia de los equipos',
    enunciado: 'Obtén el nombre de cada equipo y cuántos años tiene desde su fundación (usa 2024 como año actual, resta la columna fundacion). Llama a la columna: anos_existencia.',
    nivelId: 'nivel1', temaId: 'n1-t10', baseDatosId: 'deportes',
    consultaEsperada: 'SELECT nombre, 2024 - fundacion AS anos_existencia FROM equipos',
    pistas: [
      'Resta la columna fundacion a un número: 2024 - fundacion',
      '2024 - fundacion AS anos_existencia',
    ],
  }),
  new Ejercicio({
    id: 'n1-t10-04',
    titulo: 'Precio con descuento',
    enunciado: 'Obtén el nombre y precio con descuento del 10% de cada medicamento (multiplica el precio por 0.9). Llama a la columna: precio_oferta.',
    nivelId: 'nivel1', temaId: 'n1-t10', baseDatosId: 'hospital',
    consultaEsperada: 'SELECT nombre, precio * 0.9 AS precio_oferta FROM medicamentos',
    pistas: [
      'Un descuento del 10% equivale a multiplicar por 0.9',
      'precio * 0.9 AS precio_oferta',
    ],
  }),
  new Ejercicio({
    id: 'n1-t10-05',
    titulo: 'Valor de mercado en millones',
    enunciado: 'Obtén el nombre de cada jugador y su valor de mercado en millones (divide entre 1000000). Llama a la columna: valor_millones.',
    nivelId: 'nivel1', temaId: 'n1-t10', baseDatosId: 'deportes',
    consultaEsperada: 'SELECT nombre, valor_mercado / 1000000 AS valor_millones FROM jugadores',
    pistas: [
      'Divide valor_mercado entre 1000000',
      'valor_mercado / 1000000 AS valor_millones',
    ],
  }),
  new Ejercicio({
    id: 'n1-t10-06',
    titulo: 'Cajas de medicamentos',
    enunciado: 'Cada caja trae 30 unidades. Obtén el nombre de cada medicamento y cuántas cajas completas hay en el stock (divide stock entre 30). Llama a la columna: cajas_disponibles.',
    nivelId: 'nivel1', temaId: 'n1-t10', baseDatosId: 'hospital',
    consultaEsperada: 'SELECT nombre, stock / 30 AS cajas_disponibles FROM medicamentos',
    pistas: [
      'Divide stock entre 30 para obtener las cajas',
      'stock / 30 AS cajas_disponibles',
    ],
  }),

  // ══════════════════════════════════════════════════════════════════════════
  // ██ POSTGRESQL                                                          ██
  // ══════════════════════════════════════════════════════════════════════════

  // ── PG · NIVEL 1 · TEMA 1 — LIMIT / OFFSET ─────────────────────────────
  new Ejercicio({
    id: 'pg-n1-t1-01',
    titulo: 'Los 5 mejores promedios',
    enunciado: 'Obtén nombre, apellido y promedio de los 5 estudiantes con mejor promedio. Ordena de mayor a menor.',
    nivelId: 'pg-nivel1', temaId: 'pg-n1-t1', baseDatosId: 'universidad',
    consultaEsperada: 'SELECT nombre, apellido, promedio FROM estudiantes ORDER BY promedio DESC LIMIT 5',
    pistas: [
      'Usa ORDER BY promedio DESC para ordenar de mayor a menor',
      'LIMIT 5 al final restringe a 5 resultados',
      'SELECT nombre, apellido, promedio FROM estudiantes ORDER BY promedio DESC LIMIT 5',
    ],
  }),
  new Ejercicio({
    id: 'pg-n1-t1-02',
    titulo: 'Segunda página de estudiantes',
    enunciado: 'Obtén nombre, apellido y promedio de los estudiantes del 6° al 10° lugar por promedio (de mayor a menor). Usa paginación.',
    nivelId: 'pg-nivel1', temaId: 'pg-n1-t1', baseDatosId: 'universidad',
    consultaEsperada: 'SELECT nombre, apellido, promedio FROM estudiantes ORDER BY promedio DESC LIMIT 5 OFFSET 5',
    pistas: [
      'OFFSET salta las primeras filas antes de aplicar LIMIT',
      'OFFSET 5 salta los primeros 5 resultados',
      'SELECT nombre, apellido, promedio FROM estudiantes ORDER BY promedio DESC LIMIT 5 OFFSET 5',
    ],
  }),
  new Ejercicio({
    id: 'pg-n1-t1-03',
    titulo: 'Jugadores de la tercera página',
    enunciado: 'Muestra nombre, apellido y valor_mercado de los jugadores, paginando de 3 en 3 por valor de mercado (de mayor a menor). Obtén la tercera página (posiciones 7 a 9).',
    nivelId: 'pg-nivel1', temaId: 'pg-n1-t1', baseDatosId: 'deportes',
    consultaEsperada: 'SELECT nombre, apellido, valor_mercado FROM jugadores ORDER BY valor_mercado DESC LIMIT 3 OFFSET 6',
    pistas: [
      'La tercera página de 3 elementos empieza en la posición 7 (OFFSET 6)',
      'LIMIT 3 OFFSET 6 salta los primeros 6 y toma los siguientes 3',
      'SELECT nombre, apellido, valor_mercado FROM jugadores ORDER BY valor_mercado DESC LIMIT 3 OFFSET 6',
    ],
  }),

  // ── PG · NIVEL 1 · TEMA 2 — ILIKE ──────────────────────────────────────
  new Ejercicio({
    id: 'pg-n1-t2-01',
    titulo: 'Nombres que empiezan con A',
    enunciado: 'Busca estudiantes cuyo nombre empiece con "a", sin importar si es mayúscula o minúscula. Muestra nombre y apellido.',
    nivelId: 'pg-nivel1', temaId: 'pg-n1-t2', baseDatosId: 'universidad',
    consultaEsperada: "SELECT nombre, apellido FROM estudiantes WHERE nombre ILIKE 'a%'",
    pistas: [
      'ILIKE funciona igual que LIKE pero ignora mayúsculas/minúsculas',
      "Usa ILIKE 'a%' para buscar nombres que empiecen con a o A",
      "SELECT nombre, apellido FROM estudiantes WHERE nombre ILIKE 'a%'",
    ],
  }),
  new Ejercicio({
    id: 'pg-n1-t2-02',
    titulo: 'Apellidos que contienen "ez"',
    enunciado: 'Busca jugadores cuyo apellido contenga "ez" (como Fernández, González), sin importar mayúsculas. Muestra nombre, apellido y posición.',
    nivelId: 'pg-nivel1', temaId: 'pg-n1-t2', baseDatosId: 'deportes',
    consultaEsperada: "SELECT nombre, apellido, posicion FROM jugadores WHERE apellido ILIKE '%ez%'",
    pistas: [
      'Usa % al inicio y al final para buscar en cualquier posición del texto',
      "ILIKE '%ez%' busca 'ez' en cualquier parte del apellido",
      "SELECT nombre, apellido, posicion FROM jugadores WHERE apellido ILIKE '%ez%'",
    ],
  }),
  new Ejercicio({
    id: 'pg-n1-t2-03',
    titulo: 'Médicos con apellido que empiece con C',
    enunciado: 'Busca médicos cuyo apellido empiece con "c", sin importar mayúsculas. Muestra nombre, apellido y turno.',
    nivelId: 'pg-nivel1', temaId: 'pg-n1-t2', baseDatosId: 'hospital',
    consultaEsperada: "SELECT nombre, apellido, turno FROM medicos WHERE apellido ILIKE 'c%'",
    pistas: [
      'ILIKE es exclusivo de PostgreSQL — en SQL estándar usarías LOWER() con LIKE',
      "ILIKE 'c%' busca apellidos que empiecen con c o C",
      "SELECT nombre, apellido, turno FROM medicos WHERE apellido ILIKE 'c%'",
    ],
  }),

  // ── PG · NIVEL 1 · TEMA 3 — :: (type casting) ──────────────────────────
  new Ejercicio({
    id: 'pg-n1-t3-01',
    titulo: 'Promedio como entero',
    enunciado: 'Obtén nombre, promedio original y promedio truncado a entero de los 5 mejores estudiantes. Llama a la columna truncada: promedio_entero.',
    nivelId: 'pg-nivel1', temaId: 'pg-n1-t3', baseDatosId: 'universidad',
    consultaEsperada: 'SELECT nombre, promedio, promedio::INTEGER AS promedio_entero FROM estudiantes ORDER BY promedio DESC LIMIT 5',
    pistas: [
      ':: es el operador de casting de PostgreSQL',
      'promedio::INTEGER convierte el decimal a entero (trunca)',
      'SELECT nombre, promedio, promedio::INTEGER AS promedio_entero FROM estudiantes ORDER BY promedio DESC LIMIT 5',
    ],
  }),
  new Ejercicio({
    id: 'pg-n1-t3-02',
    titulo: 'Profesores contratados antes de 2013',
    enunciado: 'Obtén nombre, apellido y fecha_contrato de profesores contratados antes del 2013-01-01. Convierte la fecha de TEXT a DATE con :: para comparar correctamente. Ordena por fecha.',
    nivelId: 'pg-nivel1', temaId: 'pg-n1-t3', baseDatosId: 'universidad',
    consultaEsperada: "SELECT nombre, apellido, fecha_contrato FROM profesores WHERE fecha_contrato::DATE < '2013-01-01'::DATE ORDER BY fecha_contrato::DATE",
    pistas: [
      'Las fechas están guardadas como TEXT, necesitas convertirlas a DATE',
      "fecha_contrato::DATE convierte el texto a fecha real",
      "SELECT nombre, apellido, fecha_contrato FROM profesores WHERE fecha_contrato::DATE < '2013-01-01'::DATE ORDER BY fecha_contrato::DATE",
    ],
  }),
  new Ejercicio({
    id: 'pg-n1-t3-03',
    titulo: 'Valor en millones',
    enunciado: 'Obtén nombre, apellido y valor de mercado en millones (como entero) de los jugadores que valgan más de 10 millones. Llama a la columna: millones. Ordena de mayor a menor.',
    nivelId: 'pg-nivel1', temaId: 'pg-n1-t3', baseDatosId: 'deportes',
    consultaEsperada: 'SELECT nombre, apellido, (valor_mercado / 1000000)::INTEGER AS millones FROM jugadores WHERE (valor_mercado / 1000000)::INTEGER > 10 ORDER BY valor_mercado DESC',
    pistas: [
      'Divide valor_mercado entre 1000000 y luego aplica ::INTEGER',
      '(valor_mercado / 1000000)::INTEGER convierte a millones enteros',
      'SELECT nombre, apellido, (valor_mercado / 1000000)::INTEGER AS millones FROM jugadores WHERE (valor_mercado / 1000000)::INTEGER > 10 ORDER BY valor_mercado DESC',
    ],
  }),

  // ── PG · NIVEL 2 · TEMA 1 — string_agg() ───────────────────────────────
  new Ejercicio({
    id: 'pg-n2-t1-01',
    titulo: 'Jugadores por posición',
    enunciado: 'Para cada posición, muestra todos los nombres de jugadores concatenados con ", ". Ordena los nombres dentro de cada grupo alfabéticamente. Llama a la columna: jugadores.',
    nivelId: 'pg-nivel2', temaId: 'pg-n2-t1', baseDatosId: 'deportes',
    consultaEsperada: "SELECT posicion, string_agg(nombre, ', ' ORDER BY nombre) AS jugadores FROM jugadores GROUP BY posicion",
    pistas: [
      'string_agg(columna, separador) concatena valores de un grupo',
      'Puedes usar ORDER BY dentro de string_agg para ordenar los valores',
      "SELECT posicion, string_agg(nombre, ', ' ORDER BY nombre) AS jugadores FROM jugadores GROUP BY posicion",
    ],
  }),
  new Ejercicio({
    id: 'pg-n2-t1-02',
    titulo: 'Médicos por turno',
    enunciado: 'Para cada turno, concatena los nombres de los médicos separados por " - ". Ordena los nombres dentro del grupo. Llama a la columna: medicos. Ordena por turno.',
    nivelId: 'pg-nivel2', temaId: 'pg-n2-t1', baseDatosId: 'hospital',
    consultaEsperada: "SELECT turno, string_agg(nombre, ' - ' ORDER BY nombre) AS medicos FROM medicos GROUP BY turno ORDER BY turno",
    pistas: [
      'El separador puede ser cualquier texto, no solo coma',
      "string_agg(nombre, ' - ' ORDER BY nombre) separa con guión",
      "SELECT turno, string_agg(nombre, ' - ' ORDER BY nombre) AS medicos FROM medicos GROUP BY turno ORDER BY turno",
    ],
  }),
  new Ejercicio({
    id: 'pg-n2-t1-03',
    titulo: 'Estudiantes por carrera',
    enunciado: 'Muestra el nombre de cada carrera y los nombres de sus estudiantes concatenados con ", ". Usa JOIN con la tabla carreras. Llama a la columna de nombres: estudiantes. Ordena por carrera.',
    nivelId: 'pg-nivel2', temaId: 'pg-n2-t1', baseDatosId: 'universidad',
    consultaEsperada: "SELECT c.nombre AS carrera, string_agg(e.nombre, ', ' ORDER BY e.nombre) AS estudiantes FROM estudiantes e JOIN carreras c ON e.carrera_id = c.id GROUP BY c.nombre ORDER BY c.nombre",
    pistas: [
      'Necesitas un JOIN entre estudiantes y carreras',
      'Agrupa por c.nombre (nombre de la carrera)',
      "SELECT c.nombre AS carrera, string_agg(e.nombre, ', ' ORDER BY e.nombre) AS estudiantes FROM estudiantes e JOIN carreras c ON e.carrera_id = c.id GROUP BY c.nombre ORDER BY c.nombre",
    ],
  }),

  // ── PG · NIVEL 2 · TEMA 2 — array_agg() ────────────────────────────────
  new Ejercicio({
    id: 'pg-n2-t2-01',
    titulo: 'Posiciones por equipo',
    enunciado: 'Para cada equipo, genera un array con las posiciones únicas de sus jugadores, ordenadas alfabéticamente. Usa JOIN con equipos. Llama a la columna: posiciones. Ordena por equipo.',
    nivelId: 'pg-nivel2', temaId: 'pg-n2-t2', baseDatosId: 'deportes',
    consultaEsperada: 'SELECT e.nombre AS equipo, array_agg(DISTINCT j.posicion ORDER BY j.posicion) AS posiciones FROM equipos e JOIN jugadores j ON j.equipo_id = e.id GROUP BY e.nombre ORDER BY e.nombre',
    pistas: [
      'array_agg() es como string_agg() pero devuelve un array PostgreSQL',
      'DISTINCT dentro de array_agg elimina duplicados',
      'SELECT e.nombre AS equipo, array_agg(DISTINCT j.posicion ORDER BY j.posicion) AS posiciones FROM equipos e JOIN jugadores j ON j.equipo_id = e.id GROUP BY e.nombre ORDER BY e.nombre',
    ],
  }),
  new Ejercicio({
    id: 'pg-n2-t2-02',
    titulo: 'Array de jugadores por posición',
    enunciado: 'Para cada posición, genera un array con los nombres de los jugadores ordenados. Llama a la columna: jugadores. Ordena por posición.',
    nivelId: 'pg-nivel2', temaId: 'pg-n2-t2', baseDatosId: 'deportes',
    consultaEsperada: 'SELECT posicion, array_agg(nombre ORDER BY nombre) AS jugadores FROM jugadores GROUP BY posicion ORDER BY posicion',
    pistas: [
      'array_agg devuelve los valores como un array {val1,val2,...}',
      'Usa ORDER BY dentro de array_agg para ordenar los elementos',
      'SELECT posicion, array_agg(nombre ORDER BY nombre) AS jugadores FROM jugadores GROUP BY posicion ORDER BY posicion',
    ],
  }),
  new Ejercicio({
    id: 'pg-n2-t2-03',
    titulo: 'Médicos por especialidad',
    enunciado: 'Para cada especialidad, genera un array con los nombres de sus médicos ordenados. Usa JOIN con especialidades. Llama a la columna: medicos. Ordena por especialidad.',
    nivelId: 'pg-nivel2', temaId: 'pg-n2-t2', baseDatosId: 'hospital',
    consultaEsperada: 'SELECT e.nombre AS especialidad, array_agg(m.nombre ORDER BY m.nombre) AS medicos FROM especialidades e JOIN medicos m ON m.especialidad_id = e.id GROUP BY e.nombre ORDER BY e.nombre',
    pistas: [
      'El JOIN conecta medicos con especialidades por especialidad_id',
      'array_agg genera un array PostgreSQL nativo',
      'SELECT e.nombre AS especialidad, array_agg(m.nombre ORDER BY m.nombre) AS medicos FROM especialidades e JOIN medicos m ON m.especialidad_id = e.id GROUP BY e.nombre ORDER BY e.nombre',
    ],
  }),

  // ── PG · NIVEL 5 · TEMA 1 — || (concatenación) ─────────────────────────
  new Ejercicio({
    id: 'pg-n5-t1-01',
    titulo: 'Nombre completo con ||',
    enunciado: 'Genera el nombre completo de los 10 primeros estudiantes (nombre + espacio + apellido) usando el operador ||. Llama a la columna: nombre_completo. Ordena por nombre.',
    nivelId: 'pg-nivel5', temaId: 'pg-n5-t1', baseDatosId: 'universidad',
    consultaEsperada: "SELECT nombre || ' ' || apellido AS nombre_completo FROM estudiantes ORDER BY nombre LIMIT 10",
    pistas: [
      'En PostgreSQL, || concatena textos (en otros motores se usa CONCAT)',
      "nombre || ' ' || apellido une los dos con un espacio",
      "SELECT nombre || ' ' || apellido AS nombre_completo FROM estudiantes ORDER BY nombre LIMIT 10",
    ],
  }),
  new Ejercicio({
    id: 'pg-n5-t1-02',
    titulo: 'Formato formal de profesores',
    enunciado: 'Muestra los profesores en formato "Apellido, Nombre" usando ||. Llama a la columna: nombre_formal. Ordena por apellido.',
    nivelId: 'pg-nivel5', temaId: 'pg-n5-t1', baseDatosId: 'universidad',
    consultaEsperada: "SELECT apellido || ', ' || nombre AS nombre_formal FROM profesores ORDER BY apellido",
    pistas: [
      "Concatena: apellido || ', ' || nombre",
      '|| puede unir cualquier cantidad de textos',
      "SELECT apellido || ', ' || nombre AS nombre_formal FROM profesores ORDER BY apellido",
    ],
  }),
  new Ejercicio({
    id: 'pg-n5-t1-03',
    titulo: 'Equipo con ciudad',
    enunciado: 'Muestra cada equipo en formato "Nombre (Ciudad)" usando ||. Llama a la columna: equipo_ciudad. Ordena por nombre.',
    nivelId: 'pg-nivel5', temaId: 'pg-n5-t1', baseDatosId: 'deportes',
    consultaEsperada: "SELECT nombre || ' (' || ciudad || ')' AS equipo_ciudad FROM equipos ORDER BY nombre",
    pistas: [
      "Combina: nombre || ' (' || ciudad || ')'",
      'Los paréntesis son texto literal dentro de comillas simples',
      "SELECT nombre || ' (' || ciudad || ')' AS equipo_ciudad FROM equipos ORDER BY nombre",
    ],
  }),

  // ── PG · NIVEL 5 · TEMA 2 — AGE(), EXTRACT(), INTERVAL ─────────────────
  new Ejercicio({
    id: 'pg-n5-t2-01',
    titulo: 'Año de contratación',
    enunciado: 'Obtén nombre, apellido y el año de contratación de cada profesor usando EXTRACT. Las fechas están como TEXT, conviértelas a DATE. Llama a la columna: anio_contrato. Ordena por año.',
    nivelId: 'pg-nivel5', temaId: 'pg-n5-t2', baseDatosId: 'universidad',
    consultaEsperada: 'SELECT nombre, apellido, EXTRACT(YEAR FROM fecha_contrato::DATE) AS anio_contrato FROM profesores ORDER BY anio_contrato',
    pistas: [
      'EXTRACT(YEAR FROM fecha) extrae el año de una fecha',
      'Como fecha_contrato es TEXT, primero conviértela con ::DATE',
      'SELECT nombre, apellido, EXTRACT(YEAR FROM fecha_contrato::DATE) AS anio_contrato FROM profesores ORDER BY anio_contrato',
    ],
  }),
  new Ejercicio({
    id: 'pg-n5-t2-02',
    titulo: 'Mes y día de consultas',
    enunciado: 'Obtén el motivo, el mes y el día de cada consulta usando EXTRACT. Llama a las columnas: mes y dia. Ordena por fecha. Muestra las primeras 10.',
    nivelId: 'pg-nivel5', temaId: 'pg-n5-t2', baseDatosId: 'hospital',
    consultaEsperada: 'SELECT motivo, EXTRACT(MONTH FROM fecha::DATE) AS mes, EXTRACT(DAY FROM fecha::DATE) AS dia FROM consultas ORDER BY fecha::DATE LIMIT 10',
    pistas: [
      'EXTRACT puede obtener MONTH, DAY, YEAR, HOUR, etc.',
      'Convierte fecha con ::DATE antes de extraer',
      'SELECT motivo, EXTRACT(MONTH FROM fecha::DATE) AS mes, EXTRACT(DAY FROM fecha::DATE) AS dia FROM consultas ORDER BY fecha::DATE LIMIT 10',
    ],
  }),
  new Ejercicio({
    id: 'pg-n5-t2-03',
    titulo: 'Cinco años después',
    enunciado: 'Obtén nombre, apellido, fecha de contrato como DATE y la fecha 5 años después. Usa INTERVAL. Llama a las columnas: fecha_inicio y aniversario_5. Muestra los 5 más antiguos.',
    nivelId: 'pg-nivel5', temaId: 'pg-n5-t2', baseDatosId: 'universidad',
    consultaEsperada: "SELECT nombre, apellido, fecha_contrato::DATE AS fecha_inicio, (fecha_contrato::DATE + INTERVAL '5 years')::DATE AS aniversario_5 FROM profesores ORDER BY fecha_contrato::DATE LIMIT 5",
    pistas: [
      "INTERVAL '5 years' representa un período de 5 años",
      'Suma una fecha + un intervalo para obtener una nueva fecha',
      "SELECT nombre, apellido, fecha_contrato::DATE AS fecha_inicio, (fecha_contrato::DATE + INTERVAL '5 years')::DATE AS aniversario_5 FROM profesores ORDER BY fecha_contrato::DATE LIMIT 5",
    ],
  }),

  // ── PG · NIVEL 5 · TEMA 3 — TO_CHAR(), TO_DATE() ───────────────────────
  new Ejercicio({
    id: 'pg-n5-t3-01',
    titulo: 'Fecha en formato DD/MM/YYYY',
    enunciado: 'Muestra el motivo y la fecha de las consultas en formato DD/MM/YYYY usando TO_CHAR. Llama a la columna: fecha_formato. Ordena por fecha. Muestra las primeras 10.',
    nivelId: 'pg-nivel5', temaId: 'pg-n5-t3', baseDatosId: 'hospital',
    consultaEsperada: "SELECT motivo, TO_CHAR(fecha::DATE, 'DD/MM/YYYY') AS fecha_formato FROM consultas ORDER BY fecha::DATE LIMIT 10",
    pistas: [
      'TO_CHAR convierte un valor a texto con un formato específico',
      "'DD/MM/YYYY' es el patrón: Día/Mes/Año",
      "SELECT motivo, TO_CHAR(fecha::DATE, 'DD/MM/YYYY') AS fecha_formato FROM consultas ORDER BY fecha::DATE LIMIT 10",
    ],
  }),
  new Ejercicio({
    id: 'pg-n5-t3-02',
    titulo: 'Salario con formato moneda',
    enunciado: 'Muestra nombre, apellido y salario de profesores formateado con signo $ y separador de miles usando TO_CHAR. Llama a la columna: salario_formato. Ordena por salario descendente.',
    nivelId: 'pg-nivel5', temaId: 'pg-n5-t3', baseDatosId: 'universidad',
    consultaEsperada: "SELECT nombre, apellido, TO_CHAR(salario, 'FM$999,999,999') AS salario_formato FROM profesores ORDER BY salario DESC",
    pistas: [
      'TO_CHAR también formatea números, no solo fechas',
      "FM elimina espacios en blanco; 9 representa un dígito; , es separador de miles",
      "SELECT nombre, apellido, TO_CHAR(salario, 'FM$999,999,999') AS salario_formato FROM profesores ORDER BY salario DESC",
    ],
  }),
  new Ejercicio({
    id: 'pg-n5-t3-03',
    titulo: 'Día de la semana',
    enunciado: 'Muestra el motivo y el nombre del día de la semana de cada consulta usando TO_CHAR. Llama a la columna: dia_semana. Ordena por fecha. Muestra las primeras 10.',
    nivelId: 'pg-nivel5', temaId: 'pg-n5-t3', baseDatosId: 'hospital',
    consultaEsperada: "SELECT motivo, TO_CHAR(fecha::DATE, 'Day') AS dia_semana FROM consultas ORDER BY fecha::DATE LIMIT 10",
    pistas: [
      "'Day' en TO_CHAR devuelve el nombre completo del día",
      "Otros patrones: 'Month', 'Day', 'HH24:MI', 'YYYY'",
      "SELECT motivo, TO_CHAR(fecha::DATE, 'Day') AS dia_semana FROM consultas ORDER BY fecha::DATE LIMIT 10",
    ],
  }),

  // ── PG · NIVEL 5 · TEMA 4 — GENERATE_SERIES() ──────────────────────────
  new Ejercicio({
    id: 'pg-n5-t4-01',
    titulo: 'Números del 1 al 10',
    enunciado: 'Genera una secuencia de números del 1 al 10 usando generate_series. La columna se debe llamar: numero.',
    nivelId: 'pg-nivel5', temaId: 'pg-n5-t4', baseDatosId: 'universidad',
    consultaEsperada: 'SELECT generate_series(1, 10) AS numero',
    pistas: [
      'generate_series(inicio, fin) genera una secuencia de números',
      'Úsalo directamente en el SELECT',
      'SELECT generate_series(1, 10) AS numero',
    ],
  }),
  new Ejercicio({
    id: 'pg-n5-t4-02',
    titulo: 'Números pares del 2 al 20',
    enunciado: 'Genera los números pares del 2 al 20 usando generate_series con un paso de 2. La columna se debe llamar: numero_par.',
    nivelId: 'pg-nivel5', temaId: 'pg-n5-t4', baseDatosId: 'universidad',
    consultaEsperada: 'SELECT generate_series(2, 20, 2) AS numero_par',
    pistas: [
      'generate_series acepta un tercer parámetro: el paso (step)',
      'generate_series(2, 20, 2) genera 2, 4, 6, ..., 20',
      'SELECT generate_series(2, 20, 2) AS numero_par',
    ],
  }),
  new Ejercicio({
    id: 'pg-n5-t4-03',
    titulo: 'Primer día de cada mes de 2024',
    enunciado: "Genera una lista con el primer día de cada mes del año 2024. Usa generate_series con fechas e intervalo de 1 mes. La columna se debe llamar: primer_dia.",
    nivelId: 'pg-nivel5', temaId: 'pg-n5-t4', baseDatosId: 'universidad',
    consultaEsperada: "SELECT generate_series('2024-01-01'::DATE, '2024-12-01'::DATE, '1 month'::INTERVAL)::DATE AS primer_dia",
    pistas: [
      'generate_series también funciona con fechas',
      "Usa '1 month'::INTERVAL como paso entre cada fecha",
      "SELECT generate_series('2024-01-01'::DATE, '2024-12-01'::DATE, '1 month'::INTERVAL)::DATE AS primer_dia",
    ],
  }),

  // ── PG · NIVEL 6 · TEMA 3 — DISTINCT ON ────────────────────────────────
  new Ejercicio({
    id: 'pg-n6-t3-01',
    titulo: 'Mejor estudiante por carrera',
    enunciado: 'Obtén el estudiante con mejor promedio de cada carrera usando DISTINCT ON. Muestra nombre, apellido, carrera_id y promedio.',
    nivelId: 'pg-nivel6', temaId: 'pg-n6-t3', baseDatosId: 'universidad',
    consultaEsperada: 'SELECT DISTINCT ON (carrera_id) nombre, apellido, carrera_id, promedio FROM estudiantes ORDER BY carrera_id, promedio DESC',
    pistas: [
      'DISTINCT ON (columna) devuelve solo la primera fila de cada grupo',
      'ORDER BY debe empezar con la misma columna que DISTINCT ON',
      'SELECT DISTINCT ON (carrera_id) nombre, apellido, carrera_id, promedio FROM estudiantes ORDER BY carrera_id, promedio DESC',
    ],
  }),
  new Ejercicio({
    id: 'pg-n6-t3-02',
    titulo: 'Jugador más caro por equipo',
    enunciado: 'Obtén el jugador más caro de cada equipo usando DISTINCT ON. Muestra nombre, apellido, equipo_id y valor_mercado.',
    nivelId: 'pg-nivel6', temaId: 'pg-n6-t3', baseDatosId: 'deportes',
    consultaEsperada: 'SELECT DISTINCT ON (equipo_id) nombre, apellido, equipo_id, valor_mercado FROM jugadores ORDER BY equipo_id, valor_mercado DESC',
    pistas: [
      'DISTINCT ON es exclusivo de PostgreSQL — no existe en otros motores',
      'El ORDER BY decide cuál fila gana dentro de cada grupo',
      'SELECT DISTINCT ON (equipo_id) nombre, apellido, equipo_id, valor_mercado FROM jugadores ORDER BY equipo_id, valor_mercado DESC',
    ],
  }),
  new Ejercicio({
    id: 'pg-n6-t3-03',
    titulo: 'Primera consulta por paciente',
    enunciado: 'Obtén la primera consulta de cada paciente (la más antigua) usando DISTINCT ON. Muestra paciente_id, fecha, motivo y diagnóstico.',
    nivelId: 'pg-nivel6', temaId: 'pg-n6-t3', baseDatosId: 'hospital',
    consultaEsperada: 'SELECT DISTINCT ON (paciente_id) paciente_id, fecha, motivo, diagnostico FROM consultas ORDER BY paciente_id, fecha',
    pistas: [
      'Para obtener la primera consulta, ordena las fechas ascendentemente',
      'ORDER BY paciente_id, fecha toma la fecha más antigua de cada paciente',
      'SELECT DISTINCT ON (paciente_id) paciente_id, fecha, motivo, diagnostico FROM consultas ORDER BY paciente_id, fecha',
    ],
  }),

  // ── PG · NIVEL 6 · TEMA 7 — LATERAL JOIN ───────────────────────────────
  new Ejercicio({
    id: 'pg-n6-t7-01',
    titulo: 'Top 2 estudiantes por carrera',
    enunciado: 'Para cada carrera, obtén los 2 estudiantes con mejor promedio usando LATERAL. Muestra nombre de la carrera, nombre del estudiante, apellido y promedio. Ordena por carrera y promedio descendente.',
    nivelId: 'pg-nivel6', temaId: 'pg-n6-t7', baseDatosId: 'universidad',
    consultaEsperada: 'SELECT c.nombre AS carrera, e.nombre, e.apellido, e.promedio FROM carreras c, LATERAL (SELECT nombre, apellido, promedio FROM estudiantes WHERE carrera_id = c.id ORDER BY promedio DESC LIMIT 2) e ORDER BY c.nombre, e.promedio DESC',
    pistas: [
      'LATERAL permite que una subconsulta referencie columnas de tablas anteriores',
      'Es como un "para cada" — para cada carrera, ejecuta la subconsulta',
      'SELECT c.nombre AS carrera, e.nombre, e.apellido, e.promedio FROM carreras c, LATERAL (SELECT nombre, apellido, promedio FROM estudiantes WHERE carrera_id = c.id ORDER BY promedio DESC LIMIT 2) e ORDER BY c.nombre, e.promedio DESC',
    ],
  }),
  new Ejercicio({
    id: 'pg-n6-t7-02',
    titulo: 'Última consulta por médico',
    enunciado: 'Para cada médico, obtén su consulta más reciente usando LATERAL. Muestra nombre y apellido del médico, fecha y motivo. Ordena por nombre del médico.',
    nivelId: 'pg-nivel6', temaId: 'pg-n6-t7', baseDatosId: 'hospital',
    consultaEsperada: 'SELECT m.nombre AS medico, m.apellido, con.fecha, con.motivo FROM medicos m, LATERAL (SELECT fecha, motivo FROM consultas WHERE medico_id = m.id ORDER BY fecha DESC LIMIT 1) con ORDER BY m.nombre',
    pistas: [
      'La subconsulta LATERAL filtra por medico_id = m.id',
      'LIMIT 1 dentro del LATERAL trae solo la más reciente',
      'SELECT m.nombre AS medico, m.apellido, con.fecha, con.motivo FROM medicos m, LATERAL (SELECT fecha, motivo FROM consultas WHERE medico_id = m.id ORDER BY fecha DESC LIMIT 1) con ORDER BY m.nombre',
    ],
  }),
  new Ejercicio({
    id: 'pg-n6-t7-03',
    titulo: 'Top 3 jugadores por equipo',
    enunciado: 'Para cada equipo, obtén los 3 jugadores más valiosos usando LATERAL. Muestra nombre del equipo, nombre y apellido del jugador, y valor_mercado. Ordena por equipo y valor descendente.',
    nivelId: 'pg-nivel6', temaId: 'pg-n6-t7', baseDatosId: 'deportes',
    consultaEsperada: 'SELECT eq.nombre AS equipo, j.nombre, j.apellido, j.valor_mercado FROM equipos eq, LATERAL (SELECT nombre, apellido, valor_mercado FROM jugadores WHERE equipo_id = eq.id ORDER BY valor_mercado DESC LIMIT 3) j ORDER BY eq.nombre, j.valor_mercado DESC',
    pistas: [
      'LATERAL es similar a CROSS APPLY en SQL Server',
      'Equipos sin jugadores no aparecerán (es un CROSS JOIN implícito)',
      'SELECT eq.nombre AS equipo, j.nombre, j.apellido, j.valor_mercado FROM equipos eq, LATERAL (SELECT nombre, apellido, valor_mercado FROM jugadores WHERE equipo_id = eq.id ORDER BY valor_mercado DESC LIMIT 3) j ORDER BY eq.nombre, j.valor_mercado DESC',
    ],
  }),
];
