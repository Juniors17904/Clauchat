import { EntidadCatalogo } from './entidad_catalogo.js';

export class FaseInstalacion extends EntidadCatalogo {
  #orden;

  constructor({ id, nombre, descripcion, orden }) {
    super({ id, nombre, descripcion });
    this.#orden = orden;
  }

  get orden() { return this.#orden; }
}
