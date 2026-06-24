export class AreaEstudio {
  #id;
  #nombre;
  #descripcion;
  #icono;
  #disponible;

  constructor({ id, nombre, descripcion, icono, disponible = true }) {
    this.#id = id;
    this.#nombre = nombre;
    this.#descripcion = descripcion;
    this.#icono = icono;
    this.#disponible = disponible;
  }

  get id() { return this.#id; }
  get nombre() { return this.#nombre; }
  get descripcion() { return this.#descripcion; }
  get icono() { return this.#icono; }
  get disponible() { return this.#disponible; }
}
