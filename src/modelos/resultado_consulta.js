export class ResultadoConsulta {
  #columnas;
  #filas;
  #error;
  #exitoso;

  constructor({ columnas = [], filas = [], error = null }) {
    this.#columnas = columnas;
    this.#filas = filas;
    this.#error = error;
    this.#exitoso = error === null;
  }

  get columnas() { return [...this.#columnas]; }
  get filas() { return [...this.#filas]; }
  get error() { return this.#error; }
  get exitoso() { return this.#exitoso; }
  get totalFilas() { return this.#filas.length; }
}
