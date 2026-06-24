import { ResultadoConsulta } from '../modelos/resultado_consulta';

const PALABRAS_SQL = [
  'SELECT', 'FROM', 'WHERE', 'ORDER BY', 'GROUP BY', 'HAVING',
  'INSERT INTO', 'VALUES', 'UPDATE', 'SET', 'DELETE FROM',
  'CREATE TABLE', 'DROP TABLE', 'ALTER TABLE',
  'JOIN', 'INNER JOIN', 'LEFT JOIN', 'RIGHT JOIN', 'ON',
  'AND', 'OR', 'NOT', 'IN', 'LIKE', 'BETWEEN', 'IS NULL', 'IS NOT NULL',
  'COUNT', 'SUM', 'AVG', 'MAX', 'MIN', 'DISTINCT', 'AS', 'LIMIT',
  'PRIMARY KEY', 'FOREIGN KEY', 'REFERENCES', 'ASC', 'DESC',
];

export class ControladorEditor {
  #db;
  #ejercicio;

  constructor() {
    this.#db = null;
    this.#ejercicio = null;
  }

  async iniciar(ejercicio, SqlJs) {
    this.#ejercicio = ejercicio;
    const SQL = await SqlJs({ locateFile: () => '/sql-wasm.wasm' });
    this.#db = new SQL.Database();
    if (ejercicio?.esquemaSQL) {
      this.#db.run(ejercicio.esquemaSQL);
    }
  }

  ejecutarConsulta(sql) {
    if (!this.#db) {
      return new ResultadoConsulta({ error: 'Base de datos no inicializada' });
    }
    try {
      const resultados = this.#db.exec(sql.trim());
      if (!resultados.length) {
        return new ResultadoConsulta({ columnas: [], filas: [] });
      }
      const { columns, values } = resultados[0];
      return new ResultadoConsulta({ columnas: columns, filas: values });
    } catch (e) {
      return new ResultadoConsulta({ error: e.message });
    }
  }

  evaluarEstado(consulta) {
    const texto = consulta.trim();
    if (!texto) return 'neutral';

    const palabrasSQL = ['SELECT', 'FROM', 'WHERE', 'INSERT', 'UPDATE', 'DELETE', 'CREATE'];
    const tieneEstructura = palabrasSQL.some(p => texto.toUpperCase().includes(p));

    if (!tieneEstructura) return 'pensando';

    if (this.#ejercicio) {
      const esperada = this.#ejercicio.consultaEsperada.trim().toUpperCase();
      const actual = texto.toUpperCase();
      if (actual === esperada) return 'feliz';
      if (esperada.startsWith(actual.slice(0, 6))) return 'pensando';
      return 'triste';
    }

    return 'pensando';
  }

  sugerirAutocompletado(texto) {
    if (!texto) return [];
    const ultima = texto.split(/\s+/).pop().toUpperCase();
    if (ultima.length < 1) return [];
    return PALABRAS_SQL.filter(p => p.startsWith(ultima) && p !== ultima).slice(0, 4);
  }

  destruir() {
    if (this.#db) {
      this.#db.close();
      this.#db = null;
    }
  }
}
