export class ProgramaSoftware {
  #numero;
  #id;
  #nombre;
  #descripcion;
  #detalle;
  #imagenes;

  #notas;

  constructor({ numero, id, nombre, descripcion, detalle = '', imagenes = [], notas = {} }) {
    this.#numero = numero;
    this.#id = id;
    this.#nombre = nombre;
    this.#descripcion = descripcion;
    this.#detalle = detalle;
    this.#imagenes = imagenes;
    this.#notas = notas;
  }

  get numero() { return this.#numero; }
  get id() { return this.#id; }
  get nombre() { return this.#nombre; }
  get descripcion() { return this.#descripcion; }
  get detalle() { return this.#detalle; }
  get imagenes() { return [...this.#imagenes]; }
  notaDe(src) { return this.#notas[src] ?? null; }
}
