import { Ejercicio } from '../modelos/ejercicio';

export const EJERCICIOS = [
  new Ejercicio({
    id: 'ej-01',
    titulo: 'Tu primer SELECT',
    enunciado: 'Obtén todos los registros de la tabla "estudiantes".',
    nivelId: 'basico',
    esquemaSQL: `
      CREATE TABLE estudiantes (
        id INTEGER PRIMARY KEY,
        nombre TEXT,
        edad INTEGER,
        carrera TEXT
      );
      INSERT INTO estudiantes VALUES (1, 'Ana López', 20, 'Informática');
      INSERT INTO estudiantes VALUES (2, 'Carlos Ruiz', 22, 'Sistemas');
      INSERT INTO estudiantes VALUES (3, 'María García', 19, 'Informática');
      INSERT INTO estudiantes VALUES (4, 'Pedro Martín', 21, 'Redes');
    `,
    consultaEsperada: 'SELECT * FROM estudiantes',
    pistas: [
      'Usa SELECT para elegir las columnas',
      'El asterisco (*) selecciona todas las columnas',
      'FROM indica de qué tabla vienen los datos',
    ],
  }),
  new Ejercicio({
    id: 'ej-02',
    titulo: 'Filtrar con WHERE',
    enunciado: 'Obtén solo los estudiantes de la carrera "Informática".',
    nivelId: 'basico',
    esquemaSQL: `
      CREATE TABLE estudiantes (
        id INTEGER PRIMARY KEY,
        nombre TEXT,
        edad INTEGER,
        carrera TEXT
      );
      INSERT INTO estudiantes VALUES (1, 'Ana López', 20, 'Informática');
      INSERT INTO estudiantes VALUES (2, 'Carlos Ruiz', 22, 'Sistemas');
      INSERT INTO estudiantes VALUES (3, 'María García', 19, 'Informática');
      INSERT INTO estudiantes VALUES (4, 'Pedro Martín', 21, 'Redes');
    `,
    consultaEsperada: "SELECT * FROM estudiantes WHERE carrera = 'Informática'",
    pistas: [
      'Usa WHERE para filtrar filas',
      'Los textos van entre comillas simples',
      "Ejemplo: WHERE columna = 'valor'",
    ],
  }),
  new Ejercicio({
    id: 'ej-03',
    titulo: 'Ordenar resultados',
    enunciado: 'Obtén todos los estudiantes ordenados por edad de menor a mayor.',
    nivelId: 'basico',
    esquemaSQL: `
      CREATE TABLE estudiantes (
        id INTEGER PRIMARY KEY,
        nombre TEXT,
        edad INTEGER,
        carrera TEXT
      );
      INSERT INTO estudiantes VALUES (1, 'Ana López', 20, 'Informática');
      INSERT INTO estudiantes VALUES (2, 'Carlos Ruiz', 22, 'Sistemas');
      INSERT INTO estudiantes VALUES (3, 'María García', 19, 'Informática');
      INSERT INTO estudiantes VALUES (4, 'Pedro Martín', 21, 'Redes');
    `,
    consultaEsperada: 'SELECT * FROM estudiantes ORDER BY edad ASC',
    pistas: [
      'Usa ORDER BY para ordenar',
      'ASC = ascendente (menor a mayor)',
      'DESC = descendente (mayor a menor)',
    ],
  }),
];
