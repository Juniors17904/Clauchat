export class ProgramaSoftware {
  #id;
  #nombre;
  #descripcion;
  #detalle;
  #imagenes;

  constructor({ id, nombre, descripcion, detalle = '', imagenes = [] }) {
    this.#id = id;
    this.#nombre = nombre;
    this.#descripcion = descripcion;
    this.#detalle = detalle;
    this.#imagenes = imagenes;
  }

  get id() { return this.#id; }
  get nombre() { return this.#nombre; }
  get descripcion() { return this.#descripcion; }
  get detalle() { return this.#detalle; }
  get imagenes() { return [...this.#imagenes]; }
}
