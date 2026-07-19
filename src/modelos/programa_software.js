export class ProgramaSoftware {
  #numero;
  #id;
  #nombre;
  #descripcion;
  #detalle;
  #imagenes;

  constructor({ numero, id, nombre, descripcion, detalle = '', imagenes = [] }) {
    this.#numero = numero;
    this.#id = id;
    this.#nombre = nombre;
    this.#descripcion = descripcion;
    this.#detalle = detalle;
    this.#imagenes = imagenes;
  }

  get numero() { return this.#numero; }
  get id() { return this.#id; }
  get nombre() { return this.#nombre; }
  get descripcion() { return this.#descripcion; }
  get detalle() { return this.#detalle; }
  get imagenes() { return [...this.#imagenes]; }
}
