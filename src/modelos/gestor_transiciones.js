export class GestorTransiciones {
  #soportado;

  constructor() {
    this.#soportado = typeof document.startViewTransition === 'function';
  }

  get soportado() { return this.#soportado; }

  ejecutar(direccion, actualizar) {
    document.documentElement.dataset.transicion = direccion;
    if (!this.#soportado) {
      actualizar();
      return;
    }
    document.startViewTransition(actualizar);
  }
}
