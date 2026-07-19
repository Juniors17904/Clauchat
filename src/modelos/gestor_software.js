export class GestorSoftware {
  #completados;
  #clave;

  constructor(caja = 1) {
    const sufijo = caja === 2 ? '_caja2' : '';
    this.#clave = `sqlab_software${sufijo}`;
    try {
      this.#completados = new Set(JSON.parse(localStorage.getItem(this.#clave) ?? '[]'));
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
    localStorage.setItem(this.#clave, JSON.stringify([...this.#completados]));
  }
}
