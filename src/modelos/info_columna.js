export class InfoColumna {
  #nombre;
  #tipo;
  #esPrimaria;
  #esForanea;
  #referenciaTabla;

  constructor({ nombre, tipo, esPrimaria = false, esForanea = false, referenciaTabla = null }) {
    this.#nombre = nombre;
    this.#tipo = tipo;
    this.#esPrimaria = esPrimaria;
    this.#esForanea = esForanea;
    this.#referenciaTabla = referenciaTabla;
  }

  get nombre() { return this.#nombre; }
  get tipo() { return this.#tipo; }
  get esPrimaria() { return this.#esPrimaria; }
  get esForanea() { return this.#esForanea; }
  get referenciaTabla() { return this.#referenciaTabla; }
}
