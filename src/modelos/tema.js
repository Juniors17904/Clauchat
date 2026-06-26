import { EntidadCatalogo } from './entidad_catalogo';

export class Tema extends EntidadCatalogo {
  #nivelId;
  #orden;
  #concepto;

  constructor({ id, nombre, descripcion, nivelId, orden, concepto = null }) {
    super({ id, nombre, descripcion });
    this.#nivelId = nivelId;
    this.#orden = orden;
    this.#concepto = concepto;
  }

  get nivelId() { return this.#nivelId; }
  get orden() { return this.#orden; }
  get concepto() { return this.#concepto; }
}
