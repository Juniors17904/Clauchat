import { ClaveCaja } from './clave_caja.js';

export class GestorSoftware {
  #completados;
  #clave;
  #claveUltimo;

  constructor(caja = 1) {
    const clave = new ClaveCaja(caja);
    this.#clave = clave.para('sqlab_software');
    this.#claveUltimo = clave.para('sqlab_software_ultimo');
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

  // Recuerda el último programa que se estuvo viendo, para retomar al reingresar
  guardarUltimoVisto(id) {
    localStorage.setItem(this.#claveUltimo, id);
  }

  get ultimoVisto() {
    return localStorage.getItem(this.#claveUltimo);
  }

  reiniciar() {
    this.#completados.clear();
    localStorage.removeItem(this.#claveUltimo);
    this.#persistir();
  }

  #persistir() {
    localStorage.setItem(this.#clave, JSON.stringify([...this.#completados]));
  }
}
