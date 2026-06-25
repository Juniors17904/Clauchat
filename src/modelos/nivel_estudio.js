import { EntidadCatalogo } from './entidad_catalogo';

export class NivelEstudio extends EntidadCatalogo {
  #orden;
  #areaId;

  constructor({ id, nombre, descripcion, orden, areaId }) {
    super({ id, nombre, descripcion });
    this.#orden = orden;
    this.#areaId = areaId;
  }

  get orden() { return this.#orden; }
  get areaId() { return this.#areaId; }
}
