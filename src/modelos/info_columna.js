export class InfoColumna {
  #nombre;
  #tipo;
  #esPrimaria;

  constructor({ nombre, tipo, esPrimaria = false }) {
    this.#nombre = nombre;
    this.#tipo = tipo;
    this.#esPrimaria = esPrimaria;
  }

  get nombre() { return this.#nombre; }
  get tipo() { return this.#tipo; }
  get esPrimaria() { return this.#esPrimaria; }
}
