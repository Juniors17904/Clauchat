import { EntidadCatalogo } from './entidad_catalogo';

export class Tema extends EntidadCatalogo {
  #nivelId;
  #orden;

  constructor({ id, nombre, descripcion, nivelId, orden }) {
    super({ id, nombre, descripcion });
    this.#nivelId = nivelId;
    this.#orden = orden;
  }

  get nivelId() { return this.#nivelId; }
  get orden() { return this.#orden; }
}
