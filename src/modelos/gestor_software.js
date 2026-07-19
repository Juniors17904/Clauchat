const CLAVE = 'sqlab_software';

export class GestorSoftware {
  #completados;

  constructor() {
    try {
      this.#completados = new Set(JSON.parse(localStorage.getItem(CLAVE) ?? '[]'));
    } catch {
      this.#completados = new Set();
    }
  }

  estaCompletado(id) {
    return this.#completados.has(id);
  }

  alternar(id) {
    if (this.#completados.has(id)) {
      this.#completados.delete(id);
    } else {
      this.#completados.add(id);
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
