export class Ejercicio {
  #id;
  #titulo;
  #enunciado;
  #nivelId;
  #esquemaSQL;
  #consultaEsperada;
  #pistas;

  constructor({ id, titulo, enunciado, nivelId, esquemaSQL, consultaEsperada, pistas = [] }) {
    this.#id = id;
    this.#titulo = titulo;
    this.#enunciado = enunciado;
    this.#nivelId = nivelId;
    this.#esquemaSQL = esquemaSQL;
    this.#consultaEsperada = consultaEsperada;
    this.#pistas = pistas;
  }

  get id() { return this.#id; }
  get titulo() { return this.#titulo; }
  get enunciado() { return this.#enunciado; }
  get nivelId() { return this.#nivelId; }
  get esquemaSQL() { return this.#esquemaSQL; }
  get consultaEsperada() { return this.#consultaEsperada; }
  get pistas() { return [...this.#pistas]; }
}
