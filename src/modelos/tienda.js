import { EntidadCatalogo } from './entidad_catalogo.js';

// Una cadena de tiendas: Tambo o Aruma. Cada una lleva su propio grupo de cajas y su
// propio avance, porque se instala una tienda por día y no se mezclan.
export class Tienda extends EntidadCatalogo {
  #color;
  #prefijosHostname;
  #codigoSistema;

  constructor({ id, nombre, descripcion, color, prefijosHostname = [], codigoSistema = null }) {
    super({ id, nombre, descripcion });
    this.#color = color;
    this.#prefijosHostname = prefijosHostname;
    this.#codigoSistema = codigoSistema;
  }

  get color() { return this.#color; }
  // Cómo empieza el hostname de esta cadena (TL/TP en Tambo, AL/AP en Aruma)
  get prefijosHostname() { return [...this.#prefijosHostname]; }
  // locate.XstoreSystemCode: 1 en Tambo, 2 en Aruma
  get codigoSistema() { return this.#codigoSistema; }
}
