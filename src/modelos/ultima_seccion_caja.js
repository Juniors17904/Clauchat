// Recuerda en cuál de las dos partes de la caja se trabajó por última vez: la instalación
// de Xstore o la de software y aplicaciones. Así, al volver a esa caja, se retoma ahí mismo.
export class UltimaSeccionCaja {
  #clave;

  constructor(caja = 1) {
    const sufijo = caja === 2 ? '_caja2' : '';
    this.#clave = `sqlab_caja_seccion${sufijo}`;
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
