export class Ejercicio {
  #id;
  #titulo;
  #enunciado;
  #nivelId;
  #temaId;
  #baseDatosId;
  #consultaEsperada;
  #pistas;

  constructor({ id, titulo, enunciado, nivelId, temaId = null, baseDatosId, consultaEsperada, pistas = [] }) {
    this.#id = id;
    this.#titulo = titulo;
    this.#enunciado = enunciado;
    this.#nivelId = nivelId;
    this.#temaId = temaId;
    this.#baseDatosId = baseDatosId;
    this.#consultaEsperada = consultaEsperada;
    this.#pistas = pistas;
  }

  get id() { return this.#id; }
  get titulo() { return this.#titulo; }
  get enunciado() { return this.#enunciado; }
  get nivelId() { return this.#nivelId; }
  get temaId() { return this.#temaId; }
  get baseDatosId() { return this.#baseDatosId; }
  get consultaEsperada() { return this.#consultaEsperada; }
  get pistas() { return [...this.#pistas]; }
}
