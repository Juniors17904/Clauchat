export class ProgramaSoftware {
  #numero;
  #id;
  #nombre;
  #descripcion;
  #detalle;
  #imagenes;

  #notas;
  #avisoCaja;

  constructor({ numero, id, nombre, descripcion, detalle = '', imagenes = [], notas = {}, avisoCaja = null }) {
    this.#numero = numero;
    this.#id = id;
    this.#nombre = nombre;
    this.#descripcion = descripcion;
    this.#detalle = detalle;
    this.#imagenes = imagenes;
    this.#notas = notas;
    this.#avisoCaja = avisoCaja;
  }

  get numero() { return this.#numero; }
  get id() { return this.#id; }
  get nombre() { return this.#nombre; }
  get descripcion() { return this.#descripcion; }
  get detalle() { return this.#detalle; }
  get imagenes() { return [...this.#imagenes]; }
  // Aviso de en qué caja va, para no instalarlo dos veces
  get avisoCaja() { return this.#avisoCaja; }
  notaDe(src) { return this.#notas[src] ?? null; }
}
