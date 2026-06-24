export class NivelEstudio {
  #id;
  #nombre;
  #descripcion;
  #orden;
  #areaId;

  constructor({ id, nombre, descripcion, orden, areaId }) {
    this.#id = id;
    this.#nombre = nombre;
    this.#descripcion = descripcion;
    this.#orden = orden;
    this.#areaId = areaId;
  }

  get id() { return this.#id; }
  get nombre() { return this.#nombre; }
  get descripcion() { return this.#descripcion; }
  get orden() { return this.#orden; }
  get areaId() { return this.#areaId; }
}
