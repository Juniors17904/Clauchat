const CLAVE = 'sqlab_nombre';

export class PerfilUsuario {
  #nombre;

  constructor() {
    this.#nombre = localStorage.getItem(CLAVE) ?? '';
  }

  get nombre() { return this.#nombre; }

  set nombre(valor) {
    this.#nombre = valor.trim();
    if (this.#nombre) {
      localStorage.setItem(CLAVE, this.#nombre);
    } else {
      localStorage.removeItem(CLAVE);
    }
  }
}
