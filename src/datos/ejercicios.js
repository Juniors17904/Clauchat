import { Ejercicio } from '../modelos/ejercicio';

export const EJERCICIOS = [
  // ── BÁSICO — Universidad ──────────────────────────────────────────────
  new Ejercicio({
    id: 'univ-b01',
    titulo: 'Todos los estudiantes',
    enunciado: 'Obtén el nombre, apellido y promedio de todos los estudiantes.',
    nivelId: 'basico',
    baseDatosId: 'universidad',
    consultaEsperada: 'SELECT nombre, apellido, promedio FROM estudiantes',
    pistas: [
      'Usa SELECT para elegir columnas específicas',
      'Separa las columnas con comas',
      'FROM indica la tabla: estudiantes',
    ],
  }),
  new Ejercicio({
    id: 'univ-b02',
    titulo: 'Estudiantes con buen promedio',
    enunciado: 'Obtén todos los estudiantes cuyo promedio sea mayor o igual a 6.5.',
    nivelId: 'basico',
    baseDatosId: 'universidad',
    consultaEsperada: 'SELECT * FROM estudiantes WHERE promedio >= 6.5',
    pistas: [
      'Usa WHERE para filtrar filas',
      '>= significa "mayor o igual que"',
      'Ejemplo: WHERE columna >= valor',
    ],
  }),
  new Ejercicio({
    id: 'univ-b03',
    titulo: 'Ordenar por promedio',
    enunciado: 'Obtén nombre, apellido y promedio de los estudiantes, ordenados de mayor a menor promedio.',
    nivelId: 'basico',
    baseDatosId: 'universidad',
    consultaEsperada: 'SELECT nombre, apellido, promedio FROM estudiantes ORDER BY promedio DESC',
    pistas: [
      'Usa ORDER BY para ordenar',
      'DESC = descendente (mayor a menor)',
      'ASC = ascendente (menor a mayor)',
    ],
  }),
  // ── BÁSICO — Deportes ─────────────────────────────────────────────────
  new Ejercicio({
    id: 'dep-b01',
    titulo: 'Jugadores de Chile',
    enunciado: 'Obtén el nombre, apellido y posición de todos los jugadores de nacionalidad chilena.',
    nivelId: 'basico',
    baseDatosId: 'deportes',
    consultaEsperada: "SELECT nombre, apellido, posicion FROM jugadores WHERE nacionalidad = 'Chile'",
    pistas: [
      'Usa WHERE para filtrar por nacionalidad',
      "Los textos van entre comillas simples: 'Chile'",
      'La tabla se llama jugadores',
    ],
  }),
  new Ejercicio({
    id: 'dep-b02',
    titulo: 'Equipos fundados antes de 1910',
    enunciado: 'Obtén el nombre y año de fundación de los equipos fundados antes de 1910, ordenados por fundación.',
    nivelId: 'basico',
    baseDatosId: 'deportes',
    consultaEsperada: 'SELECT nombre, fundacion FROM equipos WHERE fundacion < 1910 ORDER BY fundacion ASC',
    pistas: [
      'La columna de año se llama fundacion',
      'Usa < para "menor que"',
      'ORDER BY fundacion ASC para ordenar de más antiguo a más nuevo',
    ],
  }),
  // ── BÁSICO — Hospital ─────────────────────────────────────────────────
  new Ejercicio({
    id: 'hosp-b01',
    titulo: 'Médicos del turno mañana',
    enunciado: 'Obtén el nombre, apellido y especialidad_id de todos los médicos que trabajan en el turno de Mañana.',
    nivelId: 'basico',
    baseDatosId: 'hospital',
    consultaEsperada: "SELECT nombre, apellido, especialidad_id FROM medicos WHERE turno = 'Mañana'",
    pistas: [
      'La tabla se llama medicos',
      "El turno es un texto: 'Mañana'",
      'Usa WHERE turno = ...',
    ],
  }),
  new Ejercicio({
    id: 'hosp-b02',
    titulo: 'Medicamentos económicos',
    enunciado: 'Obtén el nombre y precio de los medicamentos con precio menor a 6000, ordenados por precio ascendente.',
    nivelId: 'basico',
    baseDatosId: 'hospital',
    consultaEsperada: 'SELECT nombre, precio FROM medicamentos WHERE precio < 6000 ORDER BY precio ASC',
    pistas: [
      'La tabla se llama medicamentos',
      'Usa WHERE precio < 6000',
      'Luego ORDER BY precio ASC',
    ],
  }),
  // ── INTERMEDIO — Universidad ──────────────────────────────────────────
  new Ejercicio({
    id: 'univ-i01',
    titulo: 'Estudiantes con su carrera',
    enunciado: 'Obtén el nombre y apellido del estudiante junto con el nombre de su carrera.',
    nivelId: 'intermedio',
    baseDatosId: 'universidad',
    consultaEsperada: 'SELECT e.nombre, e.apellido, c.nombre AS carrera FROM estudiantes e JOIN carreras c ON e.carrera_id = c.id',
    pistas: [
      'Necesitas JOIN para unir dos tablas',
      'estudiantes.carrera_id apunta a carreras.id',
      'Usa alias: estudiantes e, carreras c',
    ],
  }),
  new Ejercicio({
    id: 'univ-i02',
    titulo: 'Promedio por carrera',
    enunciado: 'Obtén el nombre de cada carrera y el promedio de notas de sus estudiantes. Muestra solo las carreras con promedio mayor a 6.0.',
    nivelId: 'intermedio',
    baseDatosId: 'universidad',
    consultaEsperada: 'SELECT c.nombre, AVG(e.promedio) AS promedio_carrera FROM carreras c JOIN estudiantes e ON c.id = e.carrera_id GROUP BY c.id HAVING AVG(e.promedio) > 6.0',
    pistas: [
      'Usa JOIN para unir carreras y estudiantes',
      'GROUP BY c.id para agrupar por carrera',
      'HAVING filtra después de agrupar (no WHERE)',
    ],
  }),
  // ── INTERMEDIO — Deportes ─────────────────────────────────────────────
  new Ejercicio({
    id: 'dep-i01',
    titulo: 'Jugadores con su equipo',
    enunciado: 'Obtén el nombre del jugador, su posición y el nombre de su equipo.',
    nivelId: 'intermedio',
    baseDatosId: 'deportes',
    consultaEsperada: 'SELECT j.nombre, j.apellido, j.posicion, e.nombre AS equipo FROM jugadores j JOIN equipos e ON j.equipo_id = e.id',
    pistas: [
      'jugadores.equipo_id apunta a equipos.id',
      'Usa JOIN ... ON para relacionar las tablas',
      'Usa AS para renombrar la columna del equipo',
    ],
  }),
  new Ejercicio({
    id: 'dep-i02',
    titulo: 'Goles por jugador',
    enunciado: 'Obtén el nombre, apellido y total de goles de cada jugador que haya marcado al menos 2 goles. Ordena de más goles a menos.',
    nivelId: 'intermedio',
    baseDatosId: 'deportes',
    consultaEsperada: 'SELECT j.nombre, j.apellido, COUNT(g.id) AS total_goles FROM jugadores j JOIN goles g ON j.id = g.jugador_id GROUP BY j.id HAVING COUNT(g.id) >= 2 ORDER BY total_goles DESC',
    pistas: [
      'Usa COUNT(g.id) para contar goles',
      'GROUP BY j.id para agrupar por jugador',
      'HAVING COUNT(g.id) >= 2 para filtrar',
    ],
  }),
  // ── INTERMEDIO — Hospital ─────────────────────────────────────────────
  new Ejercicio({
    id: 'hosp-i01',
    titulo: 'Consultas con médico y paciente',
    enunciado: 'Obtén la fecha, el nombre del paciente y el nombre del médico de cada consulta.',
    nivelId: 'intermedio',
    baseDatosId: 'hospital',
    consultaEsperada: 'SELECT c.fecha, p.nombre AS paciente, m.nombre AS medico FROM consultas c JOIN pacientes p ON c.paciente_id = p.id JOIN medicos m ON c.medico_id = m.id',
    pistas: [
      'Necesitas dos JOIN: uno para pacientes y otro para médicos',
      'consultas.paciente_id → pacientes.id',
      'consultas.medico_id → medicos.id',
    ],
  }),
  new Ejercicio({
    id: 'hosp-i02',
    titulo: 'Médicos con más consultas',
    enunciado: 'Obtén el nombre del médico y su número de consultas. Muestra solo los que tienen más de 2 consultas, ordenados de mayor a menor.',
    nivelId: 'intermedio',
    baseDatosId: 'hospital',
    consultaEsperada: 'SELECT m.nombre, m.apellido, COUNT(c.id) AS total_consultas FROM medicos m JOIN consultas c ON m.id = c.medico_id GROUP BY m.id HAVING COUNT(c.id) > 2 ORDER BY total_consultas DESC',
    pistas: [
      'COUNT(c.id) cuenta las consultas de cada médico',
      'GROUP BY m.id agrupa por médico',
      'HAVING COUNT(c.id) > 2 filtra los que tienen más de 2',
    ],
  }),
];
