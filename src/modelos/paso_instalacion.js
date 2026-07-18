export class PasoInstalacion {
  #numero;
  #titulo;
  #detalle;
  #faseId;
  #imagenes;
  #advertencia;

  constructor({ numero, titulo, detalle, faseId, imagenes = [], advertencia = null }) {
    this.#numero = numero;
    this.#titulo = titulo;
    this.#detalle = detalle;
    this.#faseId = faseId;
    this.#imagenes = imagenes;
    this.#advertencia = advertencia;
  }

  get numero() { return this.#numero; }
  get titulo() { return this.#titulo; }
  get detalle() { return this.#detalle; }
  get faseId() { return this.#faseId; }
  get imagenes() { return [...this.#imagenes]; }
  get advertencia() { return this.#advertencia; }
}
