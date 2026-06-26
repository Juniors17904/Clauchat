import { ControladorBase } from './controlador_base';
import { ResultadoConsulta } from '../modelos/resultado_consulta';
import { InfoTabla } from '../modelos/info_tabla';
import { InfoColumna } from '../modelos/info_columna';

const PALABRAS_SQL = [
  'SELECT', 'FROM', 'WHERE', 'ORDER BY', 'GROUP BY', 'HAVING',
  'INSERT INTO', 'VALUES', 'UPDATE', 'SET', 'DELETE FROM',
  'CREATE TABLE', 'DROP TABLE', 'ALTER TABLE',
  'JOIN', 'INNER JOIN', 'LEFT JOIN', 'RIGHT JOIN', 'ON',
  'AND', 'OR', 'NOT', 'IN', 'LIKE', 'BETWEEN', 'IS NULL', 'IS NOT NULL',
  'COUNT', 'SUM', 'AVG', 'MAX', 'MIN', 'DISTINCT', 'AS', 'LIMIT',
  'PRIMARY KEY', 'FOREIGN KEY', 'REFERENCES', 'ASC', 'DESC',
];

export class ControladorEditor extends ControladorBase {
  #db;
  #ejercicio;

  constructor() {
    super();
    this.#db = null;
    this.#ejercicio = null;
  }

  async iniciar(ejercicio, baseDatos) {
    const { PGlite } = await import('@electric-sql/pglite');
    this.#ejercicio = ejercicio;
    this.#db = new PGlite();
    if (baseDatos?.esquemaSQL) {
      await this.#db.exec(baseDatos.esquemaSQL);
    }
  }

  async ejecutarConsulta(sql) {
    if (!this.#db) {
      return new ResultadoConsulta({ error: 'Base de datos no inicializada' });
    }
    try {
      const result = await this.#db.query(sql.trim());
      const columnas = result.fields.map(f => f.name);
      const filas = result.rows.map(row => columnas.map(col => row[col]));
      return new ResultadoConsulta({ columnas, filas });
    } catch (e) {
      return new ResultadoConsulta({ error: e.message });
    }
  }

  async evaluarEstado(consulta) {
    const texto = consulta.trim();
    if (!texto || !this.#db) return 'neutral';
    const res = await this.ejecutarConsulta(texto);
    if (res.error) return 'pensando';
    if (this.#ejercicio) {
      return (await this.verificarCorreccion(res)) ? 'feliz' : 'pensando';
    }
    return 'pensando';
  }

  async verificarCorreccion(resultado) {
    if (!this.#ejercicio?.consultaEsperada || !this.#db) return false;
    if (resultado.error) return false;
    try {
      const esperadoResult = await this.#db.query(this.#ejercicio.consultaEsperada.trim());
      const colsEsp = esperadoResult.fields.map(f => f.name);
      const filasEsp = esperadoResult.rows.map(row => colsEsp.map(col => row[col]));
      const colsAct = resultado.columnas ?? [];
      const filasAct = resultado.filas ?? [];
      if (colsEsp.length !== colsAct.length) return false;
      if (filasEsp.length !== filasAct.length) return false;
      const mismasCols = colsEsp.every((c, i) => c.toLowerCase() === colsAct[i]?.toLowerCase());
      if (!mismasCols) return false;
      return filasEsp.every((fila, i) =>
        fila.every((val, j) => String(val ?? '') === String(filasAct[i]?.[j] ?? ''))
      );
    } catch {
      return false;
    }
  }

  sugerirAutocompletado(texto) {
    if (!texto) return [];
    const ultima = texto.split(/\s+/).pop().toUpperCase();
    if (ultima.length < 1) return [];
    return PALABRAS_SQL.filter(p => p.startsWith(ultima) && p !== ultima).slice(0, 4);
  }

  async obtenerEsquema() {
    if (!this.#db) return [];
    try {
      const tablasRes = await this.#db.query(
        "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_type = 'BASE TABLE' ORDER BY table_name"
      );
      const resultado = [];
      for (const fila of tablasRes.rows) {
        const nombre = fila.table_name;
        const colsRes = await this.#db.query(
          `SELECT column_name, data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = '${nombre}' ORDER BY ordinal_position`
        );
        const pkRes = await this.#db.query(
          `SELECT kcu.column_name FROM information_schema.key_column_usage kcu JOIN information_schema.table_constraints tc ON tc.constraint_name = kcu.constraint_name WHERE tc.constraint_type = 'PRIMARY KEY' AND tc.table_name = '${nombre}' AND tc.table_schema = 'public'`
        );
        const pkCols = new Set(pkRes.rows.map(r => r.column_name));
        const fkRes = await this.#db.query(
          `SELECT kcu.column_name, ccu.table_name AS ref_table FROM information_schema.referential_constraints rc JOIN information_schema.key_column_usage kcu ON kcu.constraint_name = rc.constraint_name JOIN information_schema.constraint_column_usage ccu ON ccu.constraint_name = rc.unique_constraint_name WHERE kcu.table_name = '${nombre}' AND kcu.table_schema = 'public'`
        );
        const fkMap = {};
        fkRes.rows.forEach(r => { fkMap[r.column_name] = r.ref_table; });
        const columnas = colsRes.rows.map(r => new InfoColumna({
          nombre: r.column_name,
          tipo: r.data_type,
          esPrimaria: pkCols.has(r.column_name),
          esForanea: !!fkMap[r.column_name],
          referenciaTabla: fkMap[r.column_name] || null,
        }));
        resultado.push(new InfoTabla({ nombre, columnas }));
      }
      return resultado;
    } catch {
      return [];
    }
  }

  async obtenerDatosTabla(nombre) {
    return this.ejecutarConsulta(`SELECT * FROM "${nombre}" LIMIT 50`);
  }

  destruir() {
    if (this.#db) {
      this.#db.close();
      this.#db = null;
    }
  }
}
