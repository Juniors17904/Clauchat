import { EntidadCatalogo } from './entidad_catalogo';

export class AreaEstudio extends EntidadCatalogo {
  #icono;
  #disponible;

  constructor({ id, nombre, descripcion, icono, disponible = true }) {
    super({ id, nombre, descripcion });
    this.#icono = icono;
    this.#disponible = disponible;
  }

  get icono() { return this.#icono; }
  get disponible() { return this.#disponible; }
}
