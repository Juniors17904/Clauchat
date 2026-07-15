export class ActividadEjercicio {
  #ejercicioId;
  #fecha;
  #segundos;

  constructor(ejercicioId, fecha, segundos) {
    this.#ejercicioId = ejercicioId;
    this.#fecha = fecha;
    this.#segundos = segundos;
  }

  get ejercicioId() { return this.#ejercicioId; }
  get fecha() { return this.#fecha; }
  get segundos() { return this.#segundos; }

  aJSON() {
    return {
      ejercicioId: this.#ejercicioId,
      fecha: this.#fecha,
      segundos: this.#segundos,
    };
  }
}
