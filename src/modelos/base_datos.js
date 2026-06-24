export class BaseDatos {
  #id;
  #nombre;
  #descripcion;
  #icono;
  #esquemaSQL;

  constructor({ id, nombre, descripcion, icono, esquemaSQL }) {
    this.#id = id;
    this.#nombre = nombre;
    this.#descripcion = descripcion;
    this.#icono = icono;
    this.#esquemaSQL = esquemaSQL;
  }

  get id() { return this.#id; }
  get nombre() { return this.#nombre; }
  get descripcion() { return this.#descripcion; }
  get icono() { return this.#icono; }
  get esquemaSQL() { return this.#esquemaSQL; }
}
