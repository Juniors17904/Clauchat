export class ResaltadorSintaxis {
  #palabrasClave;
  #funciones;
  #patronTokens;

  constructor() {
    this.#palabrasClave = new Set([
      'SELECT', 'FROM', 'WHERE', 'AND', 'OR', 'NOT',
      'INSERT', 'INTO', 'VALUES', 'UPDATE', 'SET', 'DELETE',
      'CREATE', 'TABLE', 'ALTER', 'DROP',
      'JOIN', 'LEFT', 'RIGHT', 'INNER', 'OUTER', 'FULL', 'CROSS', 'ON',
      'GROUP', 'BY', 'ORDER', 'ASC', 'DESC', 'HAVING',
      'LIMIT', 'OFFSET', 'UNION', 'ALL',
      'AS', 'IN', 'BETWEEN', 'LIKE', 'ILIKE', 'IS', 'NULL', 'EXISTS',
      'CASE', 'WHEN', 'THEN', 'ELSE', 'END',
      'DISTINCT', 'TRUE', 'FALSE',
    ]);

    this.#funciones = new Set([
      'COUNT', 'SUM', 'AVG', 'MIN', 'MAX',
      'UPPER', 'LOWER', 'LENGTH', 'TRIM', 'SUBSTRING',
      'COALESCE', 'NULLIF', 'CAST', 'CONCAT',
      'NOW', 'DATE', 'EXTRACT', 'TO_CHAR',
      'ROUND', 'FLOOR', 'CEIL', 'ABS',
    ]);

    this.#patronTokens = /('(?:[^'\\]|\\.)*')|(-?\d+(?:\.\d+)?)|(\b[a-zA-Z_]\w*\b)|(!=|<>|>=|<=|[=<>])|(\*)|([(),;.])|(\n)/g;
  }

  resaltar(consulta) {
    if (!consulta) return '';

    let resultado = '';
    let ultimo = 0;

    for (const match of consulta.matchAll(this.#patronTokens)) {
      if (match.index > ultimo) {
        resultado += this.#escapar(consulta.slice(ultimo, match.index));
      }

      const [token, cadena, numero, palabra, operador, asterisco, puntuacion, salto] = match;

      if (salto) {
        resultado += '\n';
      } else if (cadena) {
        resultado += `<span style="color:#a5d6ff">${this.#escapar(cadena)}</span>`;
      } else if (numero) {
        resultado += `<span style="color:#79c0ff">${this.#escapar(numero)}</span>`;
      } else if (palabra) {
        const upper = palabra.toUpperCase();
        if (this.#palabrasClave.has(upper)) {
          resultado += `<span style="color:#ff7b72">${this.#escapar(palabra)}</span>`;
        } else if (this.#funciones.has(upper)) {
          resultado += `<span style="color:#d2a8ff">${this.#escapar(palabra)}</span>`;
        } else {
          resultado += `<span style="color:#e6edf3">${this.#escapar(palabra)}</span>`;
        }
      } else if (operador) {
        resultado += `<span style="color:#79c0ff">${this.#escapar(operador)}</span>`;
      } else if (asterisco) {
        resultado += `<span style="color:#79c0ff">${asterisco}</span>`;
      } else if (puntuacion) {
        resultado += `<span style="color:#8b949e">${this.#escapar(puntuacion)}</span>`;
      } else {
        resultado += this.#escapar(token);
      }

      ultimo = match.index + token.length;
    }

    if (ultimo < consulta.length) {
      resultado += this.#escapar(consulta.slice(ultimo));
    }

    return resultado;
  }

  #escapar(texto) {
    return texto
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }
}
