import { BaseDatos } from '../modelos/base_datos';

export class BaseDatosUniversidad extends BaseDatos {
  constructor() {
    super({
      id: 'universidad',
      nombre: 'Universidad',
      descripcion: 'Estudiantes, carreras, profesores, cursos y matrículas',
      icono: '🏫',
    });
  }

  get esquemaSQL() {
    return `
CREATE TABLE facultades (
  id INTEGER PRIMARY KEY,
  nombre TEXT NOT NULL,
  decano TEXT,
  edificio TEXT
);
CREATE TABLE carreras (
  id INTEGER PRIMARY KEY,
  nombre TEXT NOT NULL,
  facultad_id INTEGER,
  duracion_anios INTEGER,
  creditos_totales INTEGER,
  FOREIGN KEY (facultad_id) REFERENCES facultades(id)
);
CREATE TABLE departamentos (
  id INTEGER PRIMARY KEY,
  nombre TEXT NOT NULL,
  facultad_id INTEGER,
  FOREIGN KEY (facultad_id) REFERENCES facultades(id)
);
CREATE TABLE profesores (
  id INTEGER PRIMARY KEY,
  nombre TEXT NOT NULL,
  apellido TEXT NOT NULL,
  email TEXT,
  departamento_id INTEGER,
  salario REAL,
  fecha_contrato TEXT,
  FOREIGN KEY (departamento_id) REFERENCES departamentos(id)
);
CREATE TABLE estudiantes (
  id INTEGER PRIMARY KEY,
  nombre TEXT NOT NULL,
  apellido TEXT NOT NULL,
  edad INTEGER,
  email TEXT,
  carrera_id INTEGER,
  fecha_ingreso TEXT,
  promedio REAL,
  FOREIGN KEY (carrera_id) REFERENCES carreras(id)
);
CREATE TABLE cursos (
  id INTEGER PRIMARY KEY,
  nombre TEXT NOT NULL,
  codigo TEXT,
  creditos INTEGER,
  departamento_id INTEGER,
  FOREIGN KEY (departamento_id) REFERENCES departamentos(id)
);
CREATE TABLE horarios (
  id INTEGER PRIMARY KEY,
  curso_id INTEGER,
  profesor_id INTEGER,
  dia TEXT,
  hora_inicio TEXT,
  aula TEXT,
  FOREIGN KEY (curso_id) REFERENCES cursos(id),
  FOREIGN KEY (profesor_id) REFERENCES profesores(id)
);
CREATE TABLE matriculas (
  id INTEGER PRIMARY KEY,
  estudiante_id INTEGER,
  curso_id INTEGER,
  semestre INTEGER,
  anio INTEGER,
  nota REAL,
  FOREIGN KEY (estudiante_id) REFERENCES estudiantes(id),
  FOREIGN KEY (curso_id) REFERENCES cursos(id)
);
CREATE TABLE pagos (
  id INTEGER PRIMARY KEY,
  estudiante_id INTEGER,
  monto REAL,
  fecha TEXT,
  concepto TEXT,
  FOREIGN KEY (estudiante_id) REFERENCES estudiantes(id)
);

INSERT INTO facultades VALUES
(1,'Ingeniería','Dr. Roberto Vargas','Edificio A'),
(2,'Ciencias','Dra. María López','Edificio B'),
(3,'Humanidades','Dr. Carlos Mendoza','Edificio C'),
(4,'Medicina','Dra. Ana Gutiérrez','Edificio D'),
(5,'Administración','Dr. Luis Torres','Edificio E'),
(6,'Derecho','Dra. Patricia Soto','Edificio F');

INSERT INTO carreras VALUES
(1,'Ingeniería de Sistemas',1,5,200),
(2,'Ingeniería Civil',1,5,210),
(3,'Ingeniería Eléctrica',1,5,195),
(4,'Matemáticas',2,4,160),
(5,'Física',2,4,165),
(6,'Química',2,4,155),
(7,'Literatura',3,4,140),
(8,'Historia',3,4,145),
(9,'Psicología',3,5,180),
(10,'Administración de Empresas',5,4,160),
(11,'Contabilidad',5,4,155),
(12,'Derecho',6,5,185);

INSERT INTO departamentos VALUES
(1,'Sistemas e Informática',1),
(2,'Ingeniería Civil y Ambiental',1),
(3,'Electrónica y Automatización',1),
(4,'Matemáticas Puras',2),
(5,'Física Aplicada',2),
(6,'Química General',2),
(7,'Literatura y Lingüística',3),
(8,'Historia y Geografía',3),
(9,'Psicología Clínica',3),
(10,'Administración y Finanzas',5);

INSERT INTO profesores VALUES
(1,'Andrés','Castillo','acastillo@uni.edu',1,4500000,'2015-03-01'),
(2,'Carmen','Herrera','cherrera@uni.edu',1,4800000,'2012-08-15'),
(3,'Diego','Morales','dmorales@uni.edu',2,4300000,'2017-01-10'),
(4,'Elena','Pizarro','epizarro@uni.edu',2,4600000,'2014-06-20'),
(5,'Felipe','Rojas','frojas@uni.edu',3,4200000,'2018-02-28'),
(6,'Gloria','Núñez','gnunez@uni.edu',3,4400000,'2016-09-05'),
(7,'Héctor','Valdés','hvaldes@uni.edu',4,4100000,'2019-03-15'),
(8,'Isabel','Cortés','icortes@uni.edu',4,4700000,'2011-11-01'),
(9,'Jorge','Sepúlveda','jsepulveda@uni.edu',5,4350000,'2016-07-12'),
(10,'Karen','Muñoz','kmunoz@uni.edu',5,4550000,'2013-04-22'),
(11,'Leonardo','Vega','lvega@uni.edu',6,4250000,'2018-08-30'),
(12,'Marcela','Ríos','mrios@uni.edu',6,4650000,'2010-02-14'),
(13,'Nicolás','Fuentes','nfuentes@uni.edu',7,4150000,'2020-01-07'),
(14,'Olivia','Sánchez','osanchez@uni.edu',7,4450000,'2015-10-19'),
(15,'Pablo','Araya','paraya@uni.edu',8,4300000,'2017-05-03'),
(16,'Raquel','Ibáñez','ribanez@uni.edu',8,4500000,'2012-12-11'),
(17,'Sebastián','Flores','sflores@uni.edu',9,4400000,'2016-03-28'),
(18,'Teresa','Romero','tromero@uni.edu',9,4600000,'2014-09-16'),
(19,'Ulises','Guerrero','uguerrero@uni.edu',10,4200000,'2019-06-04'),
(20,'Valeria','Campos','vcampos@uni.edu',10,4800000,'2011-07-25');

INSERT INTO estudiantes VALUES
(1,'Ana','López',20,'alopez@est.uni.edu',1,'2023-03-01',5.8),
(2,'Carlos','Ruiz',22,'cruiz@est.uni.edu',1,'2021-03-01',6.2),
(3,'María','García',19,'mgarcia@est.uni.edu',2,'2024-03-01',5.5),
(4,'Pedro','Martín',21,'pmartin@est.uni.edu',2,'2022-03-01',6.7),
(5,'Sofía','Jiménez',20,'sjimenez@est.uni.edu',3,'2023-03-01',5.9),
(6,'Luis','González',23,'lgonzalez@est.uni.edu',1,'2020-03-01',7.0),
(7,'Valentina','Torres',19,'vtorres@est.uni.edu',4,'2024-03-01',6.4),
(8,'Mateo','Díaz',22,'mdiaz@est.uni.edu',5,'2021-03-01',5.7),
(9,'Camila','Vargas',20,'cvargas@est.uni.edu',6,'2023-03-01',6.1),
(10,'Sebastián','Reyes',21,'sreyes@est.uni.edu',7,'2022-03-01',6.8),
(11,'Isabella','Moreno',19,'imoreno@est.uni.edu',8,'2024-03-01',5.6),
(12,'Alejandro','Muñoz',23,'amunoz@est.uni.edu',9,'2020-03-01',7.2),
(13,'Martina','Álvarez',20,'malvarez@est.uni.edu',10,'2023-03-01',6.0),
(14,'Daniel','Romero',22,'dromero@est.uni.edu',11,'2021-03-01',5.8),
(15,'Luciana','Flores',21,'lflores@est.uni.edu',12,'2022-03-01',6.5),
(16,'Tomás','Herrera',20,'therrera@est.uni.edu',1,'2023-03-01',5.4),
(17,'Emilia','Castro',19,'ecastro@est.uni.edu',2,'2024-03-01',6.9),
(18,'Nicolás','Ortiz',22,'nortiz@est.uni.edu',3,'2021-03-01',5.3),
(19,'Renata','Mendoza',21,'rmendoza@est.uni.edu',4,'2022-03-01',7.1),
(20,'Joaquín','Guzmán',23,'jguzman@est.uni.edu',5,'2020-03-01',6.3),
(21,'Antonia','Ramos',20,'aramos@est.uni.edu',6,'2023-03-01',5.9),
(22,'Benjamín','Cruz',22,'bcruz@est.uni.edu',7,'2021-03-01',6.6),
(23,'Catalina','Lara',19,'clara@est.uni.edu',8,'2024-03-01',5.5),
(24,'Diego','Pinto',21,'dpinto@est.uni.edu',9,'2022-03-01',7.0),
(25,'Fernanda','Soto',20,'fsoto@est.uni.edu',10,'2023-03-01',6.2),
(26,'Gabriel','Vega',22,'gvega@est.uni.edu',11,'2021-03-01',5.7),
(27,'Helena','Ríos',19,'hrios@est.uni.edu',12,'2024-03-01',6.8),
(28,'Iván','Núñez',23,'inunez@est.uni.edu',1,'2020-03-01',5.6),
(29,'Julia','Peña',20,'jpena@est.uni.edu',2,'2023-03-01',7.3),
(30,'Kevin','Aguilar',21,'kaguilar@est.uni.edu',3,'2022-03-01',6.1),
(31,'Laura','Molina',22,'lmolina@est.uni.edu',4,'2021-03-01',5.8),
(32,'Miguel','Espinoza',20,'mespinoza@est.uni.edu',5,'2023-03-01',6.4),
(33,'Natalia','Fuentes',19,'nfuentes2@est.uni.edu',6,'2024-03-01',5.2),
(34,'Oscar','Ibáñez',22,'oibanez@est.uni.edu',7,'2021-03-01',6.7),
(35,'Patricia','Arce',21,'parce@est.uni.edu',8,'2022-03-01',6.0),
(36,'Rodrigo','Campos',23,'rcampos@est.uni.edu',9,'2020-03-01',7.4),
(37,'Sandra','Pacheco',20,'spacheco@est.uni.edu',10,'2023-03-01',5.9),
(38,'Tiago','Salinas',22,'tsalinas@est.uni.edu',11,'2021-03-01',6.3),
(39,'Úrsula','Contreras',19,'ucontreras@est.uni.edu',12,'2024-03-01',5.7),
(40,'Vicente','Acosta',21,'vacosta@est.uni.edu',1,'2022-03-01',6.8),
(41,'Ximena','Bravo',20,'xbravo@est.uni.edu',2,'2023-03-01',5.5),
(42,'Yael','Cárdenas',22,'ycardenas@est.uni.edu',3,'2021-03-01',7.0),
(43,'Zoe','Delgado',19,'zdelgado@est.uni.edu',4,'2024-03-01',6.2),
(44,'Álvaro','Estrada',23,'aestrada@est.uni.edu',5,'2020-03-01',5.8),
(45,'Bárbara','Figueroa',21,'bfigueroa@est.uni.edu',6,'2022-03-01',6.5),
(46,'César','Gallardo',20,'cgallardo@est.uni.edu',7,'2023-03-01',5.4),
(47,'Diana','Henríquez',22,'dhenriquez@est.uni.edu',8,'2021-03-01',6.9),
(48,'Eduardo','Iturra',21,'eiturra@est.uni.edu',9,'2022-03-01',7.1),
(49,'Francisca','Jara',19,'fjara@est.uni.edu',10,'2024-03-01',5.6),
(50,'Gregorio','Klenner',23,'gklenner@est.uni.edu',11,'2020-03-01',6.3);

INSERT INTO cursos VALUES
(1,'Programación I','INF101',4,1),
(2,'Programación II','INF102',4,1),
(3,'Base de Datos','INF201',4,1),
(4,'Redes de Computadores','INF301',3,1),
(5,'Estructuras de Datos','INF202',4,1),
(6,'Cálculo I','MAT101',4,4),
(7,'Cálculo II','MAT102',4,4),
(8,'Álgebra Lineal','MAT201',3,4),
(9,'Física I','FIS101',4,5),
(10,'Física II','FIS102',4,5),
(11,'Química General','QUI101',4,6),
(12,'Mecánica de Suelos','CIV201',4,2),
(13,'Circuitos Eléctricos','ELC101',4,3),
(14,'Administración General','ADM101',3,10),
(15,'Contabilidad Básica','CON101',3,10);

INSERT INTO horarios VALUES
(1,1,1,'Lunes','08:00','Sala 101'),
(2,1,1,'Miércoles','08:00','Sala 101'),
(3,2,2,'Martes','10:00','Sala 102'),
(4,2,2,'Jueves','10:00','Sala 102'),
(5,3,1,'Viernes','08:00','Lab 201'),
(6,3,2,'Lunes','14:00','Lab 201'),
(7,4,5,'Martes','08:00','Sala 103'),
(8,5,2,'Miércoles','10:00','Lab 202'),
(9,6,7,'Lunes','10:00','Sala 201'),
(10,6,8,'Jueves','08:00','Sala 201'),
(11,7,7,'Martes','14:00','Sala 202'),
(12,8,8,'Miércoles','08:00','Sala 203'),
(13,9,9,'Lunes','08:00','Lab 301'),
(14,9,10,'Jueves','14:00','Lab 301'),
(15,10,9,'Martes','10:00','Lab 302'),
(16,11,11,'Viernes','10:00','Lab 401'),
(17,12,3,'Lunes','08:00','Sala 104'),
(18,12,4,'Miércoles','14:00','Sala 104'),
(19,13,5,'Martes','08:00','Lab 501'),
(20,13,6,'Jueves','10:00','Lab 501'),
(21,14,19,'Lunes','10:00','Sala 301'),
(22,14,20,'Viernes','14:00','Sala 301'),
(23,15,19,'Martes','14:00','Sala 302'),
(24,15,20,'Miércoles','10:00','Sala 302'),
(25,1,2,'Viernes','14:00','Sala 105'),
(26,2,1,'Lunes','14:00','Sala 106'),
(27,4,6,'Jueves','08:00','Sala 107'),
(28,5,1,'Martes','08:00','Lab 203'),
(29,6,8,'Viernes','10:00','Sala 204'),
(30,7,8,'Lunes','08:00','Sala 205');

INSERT INTO matriculas VALUES
(1,1,1,1,2024,6.5),(2,1,2,1,2024,5.8),(3,1,6,1,2024,6.0),
(4,2,1,1,2023,7.0),(5,2,3,2,2024,6.8),(6,2,5,2,2024,5.5),
(7,3,12,1,2024,5.9),(8,3,6,1,2024,6.2),(9,3,7,2,2024,5.7),
(10,4,12,1,2022,6.8),(11,4,9,2,2023,7.1),(12,4,6,1,2022,6.5),
(13,5,13,1,2024,5.6),(14,5,9,1,2024,6.0),(15,5,6,1,2024,5.4),
(16,6,1,1,2020,7.5),(17,6,2,2,2021,7.2),(18,6,3,3,2022,7.0),
(19,7,6,1,2024,6.4),(20,7,8,1,2024,7.1),(21,7,11,1,2024,5.9),
(22,8,9,1,2024,5.7),(23,8,10,1,2024,6.3),(24,8,6,1,2024,5.5),
(25,9,11,1,2024,6.1),(26,9,6,1,2024,5.8),(27,9,7,2,2024,6.4),
(28,10,1,1,2022,6.8),(29,10,2,2,2023,7.0),(30,10,7,1,2022,6.5),
(31,11,8,1,2024,5.6),(32,11,6,1,2024,5.9),(33,11,11,1,2024,5.3),
(34,12,1,1,2020,7.2),(35,12,2,2,2021,7.4),(36,12,3,3,2022,7.1),
(37,13,14,1,2024,6.0),(38,13,15,1,2024,5.8),(39,13,6,1,2024,6.2),
(40,14,15,1,2022,5.8),(41,14,14,2,2023,6.0),(42,14,6,1,2022,5.5),
(43,15,1,1,2022,6.5),(44,15,2,2,2023,6.8),(45,15,12,1,2022,6.3),
(46,16,1,1,2024,5.4),(47,16,6,1,2024,5.6),(48,16,9,1,2024,5.2),
(49,17,12,1,2024,6.9),(50,17,6,1,2024,7.0);

INSERT INTO pagos VALUES
(1,1,850000,'2024-03-05','Matrícula semestre 1'),
(2,1,250000,'2024-03-05','Derecho a examen'),
(3,2,850000,'2024-03-05','Matrícula semestre 1'),
(4,3,850000,'2024-03-05','Matrícula semestre 1'),
(5,4,850000,'2023-03-04','Matrícula semestre 1'),
(6,5,850000,'2024-03-05','Matrícula semestre 1'),
(7,6,850000,'2020-03-06','Matrícula semestre 1'),
(8,6,850000,'2021-03-05','Matrícula semestre 1'),
(9,6,850000,'2022-03-04','Matrícula semestre 1'),
(10,6,850000,'2023-03-03','Matrícula semestre 1'),
(11,7,850000,'2024-03-05','Matrícula semestre 1'),
(12,8,850000,'2024-03-05','Matrícula semestre 1'),
(13,9,850000,'2024-03-05','Matrícula semestre 1'),
(14,10,850000,'2022-03-04','Matrícula semestre 1'),
(15,11,850000,'2024-03-05','Matrícula semestre 1'),
(16,12,850000,'2020-03-06','Matrícula semestre 1'),
(17,12,850000,'2021-03-05','Matrícula semestre 1'),
(18,13,850000,'2024-03-05','Matrícula semestre 1'),
(19,14,850000,'2022-03-04','Matrícula semestre 1'),
(20,15,850000,'2022-03-04','Matrícula semestre 1'),
(21,2,150000,'2024-08-10','Certificado de notas'),
(22,6,150000,'2023-08-12','Certificado de notas'),
(23,12,150000,'2022-08-11','Certificado de notas'),
(24,1,50000,'2024-05-20','Carné universitario'),
(25,3,50000,'2024-04-15','Carné universitario'),
(26,7,50000,'2024-04-18','Carné universitario'),
(27,16,850000,'2024-03-05','Matrícula semestre 1'),
(28,17,850000,'2024-03-05','Matrícula semestre 1'),
(29,18,850000,'2022-03-04','Matrícula semestre 1'),
(30,19,850000,'2022-03-04','Matrícula semestre 1'),
(31,20,850000,'2020-03-06','Matrícula semestre 1'),
(32,21,850000,'2024-03-05','Matrícula semestre 1'),
(33,22,850000,'2022-03-04','Matrícula semestre 1'),
(34,23,850000,'2024-03-05','Matrícula semestre 1'),
(35,24,850000,'2022-03-04','Matrícula semestre 1'),
(36,25,850000,'2024-03-05','Matrícula semestre 1'),
(37,4,250000,'2023-08-10','Derecho a examen'),
(38,8,150000,'2024-09-01','Certificado de notas'),
(39,10,250000,'2023-08-08','Derecho a examen'),
(40,14,150000,'2022-09-03','Certificado de notas');
`;
  }
}
