export class EntidadCatalogo {
  #id;
  #nombre;
  #descripcion;

  constructor({ id, nombre, descripcion }) {
    this.#id = id;
    this.#nombre = nombre;
    this.#descripcion = descripcion;
  }

  get id() { return this.#id; }
  get nombre() { return this.#nombre; }
  get descripcion() { return this.#descripcion; }
}
