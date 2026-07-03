import { EntidadCatalogo } from './entidad_catalogo';

export class Tema extends EntidadCatalogo {
  #nivelId;
  #orden;
  #concepto;
  #motores;

  constructor({ id, nombre, descripcion, nivelId, orden, concepto = null, motores = null }) {
    super({ id, nombre, descripcion });
    this.#nivelId = nivelId;
    this.#orden = orden;
    this.#concepto = concepto;
    this.#motores = motores;
  }

  get nivelId() { return this.#nivelId; }
  get orden() { return this.#orden; }
  get concepto() { return this.#concepto; }
  get motores() { return this.#motores; }
}
