export class InfoTabla {
  #nombre;
  #columnas;

  constructor({ nombre, columnas }) {
    this.#nombre = nombre;
    this.#columnas = columnas;
  }

  get nombre() { return this.#nombre; }
  get columnas() { return [...this.#columnas]; }
}
