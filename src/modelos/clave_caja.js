// Arma el nombre con el que se guarda cada dato según la caja. La caja 1 usa el nombre
// original (así no se pierde lo ya guardado) y las demás le agregan su número.
export class ClaveCaja {
  #numero;

  constructor(caja = 1) {
    const n = Number(caja);
    this.#numero = Number.isInteger(n) && n >= 1 ? n : 1;
  }

  get numero() { return this.#numero; }

  get sufijo() { return this.#numero === 1 ? '' : `_caja${this.#numero}`; }

  para(base) { return `${base}${this.sufijo}`; }
}
