export class Ejercicio {
  #id;
  #titulo;
  #enunciado;
  #nivelId;
  #baseDatosId;
  #consultaEsperada;
  #pistas;

  constructor({ id, titulo, enunciado, nivelId, baseDatosId, consultaEsperada, pistas = [] }) {
    this.#id = id;
    this.#titulo = titulo;
    this.#enunciado = enunciado;
    this.#nivelId = nivelId;
    this.#baseDatosId = baseDatosId;
    this.#consultaEsperada = consultaEsperada;
    this.#pistas = pistas;
  }

  get id() { return this.#id; }
  get titulo() { return this.#titulo; }
  get enunciado() { return this.#enunciado; }
  get nivelId() { return this.#nivelId; }
  get baseDatosId() { return this.#baseDatosId; }
  get consultaEsperada() { return this.#consultaEsperada; }
  get pistas() { return [...this.#pistas]; }
}
