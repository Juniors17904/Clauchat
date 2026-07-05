export class FormateadorSQL {
  #palabrasClave;
  #clausulas;
  #patronClausulas;

  constructor() {
    this.#palabrasClave = new Set([
      'SELECT', 'FROM', 'WHERE', 'AND', 'OR', 'NOT',
      'INSERT', 'INTO', 'VALUES', 'UPDATE', 'SET', 'DELETE',
      'CREATE', 'TABLE', 'ALTER', 'DROP',
      'JOIN', 'LEFT', 'RIGHT', 'INNER', 'OUTER', 'FULL', 'CROSS', 'ON',
      'GROUP', 'BY', 'ORDER', 'ASC', 'DESC', 'HAVING',
      'LIMIT', 'OFFSET', 'UNION', 'ALL',
      'AS', 'IN', 'BETWEEN', 'LIKE', 'IS', 'NULL', 'EXISTS',
      'CASE', 'WHEN', 'THEN', 'ELSE', 'END',
      'DISTINCT', 'COUNT', 'SUM', 'AVG', 'MIN', 'MAX',
    ]);

    this.#clausulas = [
      'INSERT INTO', 'DELETE FROM', 'UNION ALL',
      'LEFT JOIN', 'RIGHT JOIN', 'INNER JOIN', 'FULL JOIN', 'CROSS JOIN',
      'GROUP BY', 'ORDER BY',
      'SELECT', 'FROM', 'WHERE', 'JOIN', 'HAVING',
      'LIMIT', 'OFFSET', 'UNION',
      'VALUES', 'UPDATE', 'SET',
      'AND', 'OR', 'ON',
    ];

    this.#patronClausulas = new RegExp(
      '\\b(' + this.#clausulas.map(c => c.replace(/\s+/g, '\\s+')).join('|') + ')\\b',
      'gi'
    );
  }

  formatear(consulta) {
    if (!consulta?.trim()) return consulta;

    const literales = [];
    let texto = consulta.replace(/'[^']*'/g, (m) => {
      literales.push(m);
      return `__L${literales.length - 1}__`;
    });

    texto = texto.replace(/\s+/g, ' ').trim();

    texto = texto.replace(/\b([a-zA-Z_]\w*)\b/g, (p) =>
      this.#palabrasClave.has(p.toUpperCase()) ? p.toUpperCase() : p
    );

    texto = texto.replace(/\s*(!=|<>|>=|<=|=|>|<)\s*/g, ' $1 ');
    texto = texto.replace(/\s+/g, ' ').trim();

    texto = texto.replace(this.#patronClausulas, '\n$1');
    texto = texto.replace(/^\n+/, '');

    texto = this.#indentarSelect(texto);
    texto = this.#indentarSubclausulas(texto);

    if (!texto.trimEnd().endsWith(';')) {
      texto = texto.trimEnd() + ';';
    }

    texto = texto.replace(/__L(\d+)__/g, (_, i) => literales[+i]);
    texto = texto.split('\n').map(l => l.trimEnd()).join('\n');

    return texto;
  }

  #indentarSelect(texto) {
    const lineas = texto.split('\n');
    const resultado = [];

    for (const linea of lineas) {
      const match = linea.trim().match(/^(SELECT(?:\s+DISTINCT)?)\s+(.+)$/i);
      if (match) {
        const cols = this.#splitPorComa(match[2]);
        if (cols.length > 1) {
          resultado.push(match[1]);
          cols.forEach((col, j) => {
            resultado.push(`    ${col.trim()}${j < cols.length - 1 ? ',' : ''}`);
          });
        } else {
          resultado.push(`${match[1]} ${match[2].trim()}`);
        }
      } else {
        resultado.push(linea.trim());
      }
    }

    return resultado.join('\n');
  }

  #indentarSubclausulas(texto) {
    return texto.split('\n').map(linea => {
      const t = linea.trim();
      return /^(AND|OR|ON)\b/i.test(t) ? `    ${t}` : t;
    }).join('\n');
  }

  #splitPorComa(str) {
    const partes = [];
    let actual = '';
    let nivel = 0;

    for (const c of str) {
      if (c === '(') nivel++;
      if (c === ')') nivel--;
      if (c === ',' && nivel === 0) {
        partes.push(actual);
        actual = '';
      } else {
        actual += c;
      }
    }
    if (actual.trim()) partes.push(actual);
    return partes;
  }
}
