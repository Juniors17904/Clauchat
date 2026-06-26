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

  async iniciar(ejercicio, baseDatos, SqlJs) {
    this.#ejercicio = ejercicio;
    const SQL = await SqlJs({ locateFile: () => '/sql-wasm.wasm' });
    this.#db = new SQL.Database();
    if (baseDatos?.esquemaSQL) {
      this.#db.run(baseDatos.esquemaSQL);
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
    return tieneEstructura ? 'pensando' : 'neutral';
  }

  verificarCorreccion(resultado) {
    if (!this.#ejercicio?.consultaEsperada || !this.#db) return false;
    if (resultado.error) return false;
    try {
      const esperados = this.#db.exec(this.#ejercicio.consultaEsperada.trim());
      const colsEsp = esperados.length ? esperados[0].columns : [];
      const filasEsp = esperados.length ? esperados[0].values : [];
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

  obtenerEsquema() {
    if (!this.#db) return [];
    try {
      const res = this.#db.exec("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'");
      if (!res.length) return [];
      return res[0].values.map(([nombre]) => {
        const info = this.#db.exec(`PRAGMA table_info("${nombre}")`);
        const fkRes = this.#db.exec(`PRAGMA foreign_key_list("${nombre}")`);
        const fkMap = {};
        if (fkRes.length) {
          fkRes[0].values.forEach(fk => { fkMap[fk[3]] = fk[2]; });
        }
        const columnas = info.length
          ? info[0].values.map(fila => new InfoColumna({
              nombre: fila[1],
              tipo: fila[2],
              esPrimaria: fila[5] === 1,
              esForanea: !!fkMap[fila[1]],
              referenciaTabla: fkMap[fila[1]] || null,
            }))
          : [];
        return new InfoTabla({ nombre, columnas });
      });
    } catch {
      return [];
    }
  }

  obtenerDatosTabla(nombre) {
    return this.ejecutarConsulta(`SELECT * FROM "${nombre}" LIMIT 50`);
  }

  destruir() {
    if (this.#db) {
      this.#db.close();
      this.#db = null;
    }
  }
}
