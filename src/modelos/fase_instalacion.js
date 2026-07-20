import { EntidadCatalogo } from './entidad_catalogo.js';

export class FaseInstalacion extends EntidadCatalogo {
  #orden;
  #color;

  constructor({ id, nombre, descripcion, orden, color }) {
    super({ id, nombre, descripcion });
    this.#orden = orden;
    this.#color = color;
  }

  get orden() { return this.#orden; }
  get color() { return this.#color; }
}
