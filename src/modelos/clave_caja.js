// Arma el nombre con el que se guarda cada dato, según la tienda y la caja.
// Tambo caja 1 usa los nombres originales, así no se pierde nada de lo ya guardado;
// las demás combinaciones agregan su parte: _aruma, _caja3, _aruma_caja3.
export class ClaveCaja {
  #numero;
  #tiendaId;

  constructor(caja = 1, tiendaId = 'tambo') {
    const n = Number(caja);
    this.#numero = Number.isInteger(n) && n >= 1 ? n : 1;
    this.#tiendaId = tiendaId || 'tambo';
  }

  get numero() { return this.#numero; }

  get tiendaId() { return this.#tiendaId; }

  get sufijo() {
    const tienda = this.#tiendaId === 'tambo' ? '' : `_${this.#tiendaId}`;
    const caja = this.#numero === 1 ? '' : `_caja${this.#numero}`;
    return `${tienda}${caja}`;
  }

  para(base) { return `${base}${this.sufijo}`; }
}
