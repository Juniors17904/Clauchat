const CLAVE = 'sqlab_instalacion';

export class GestorInstalacion {
  #completados;

  constructor() {
    try {
      this.#completados = new Set(JSON.parse(localStorage.getItem(CLAVE) ?? '[]'));
    } catch {
      this.#completados = new Set();
    }
  }

  estaCompletado(numero) {
    return this.#completados.has(numero);
  }

  alternar(numero) {
    if (this.#completados.has(numero)) {
      this.#completados.delete(numero);
    } else {
      this.#completados.add(numero);
    }
    this.#persistir();
  }

  get totalCompletados() {
    return this.#completados.size;
  }

  reiniciar() {
    this.#completados.clear();
    this.#persistir();
  }

  #persistir() {
    localStorage.setItem(CLAVE, JSON.stringify([...this.#completados]));
  }
}
