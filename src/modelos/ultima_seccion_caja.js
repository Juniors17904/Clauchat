// Recuerda en cuál de las dos partes de la caja se trabajó por última vez: la instalación
// de Xstore o la de software y aplicaciones. Así, al volver a esa caja, se retoma ahí mismo.
import { ClaveCaja } from './clave_caja.js';

export class UltimaSeccionCaja {
  #clave;

  constructor(caja = 1) {
    this.#clave = new ClaveCaja(caja).para('sqlab_caja_seccion');
  }

  get seccion() {
    const guardada = localStorage.getItem(this.#clave);
    return guardada === 'software' ? 'software' : 'xstore';
  }

  guardar(seccion) {
    if (seccion !== 'xstore' && seccion !== 'software') return;
    localStorage.setItem(this.#clave, seccion);
  }
}
