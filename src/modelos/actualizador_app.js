export class ActualizadorApp {
  #registro;
  #enCurso;

  constructor() {
    this.#registro = null;
    this.#enCurso = false;
  }

  get enCurso() { return this.#enCurso; }

  guardarRegistro(registro) {
    this.#registro = registro;
  }

  // Solo corre cuando el usuario lo pide. Nunca en automático:
  // el chequeo periódico era lo que reiniciaba la app sola.
  async actualizar(aplicarVersionNueva) {
    if (this.#enCurso) return;
    this.#enCurso = true;

    try {
      await this.#registro?.update?.();
    } catch (e) {
      // Sin conexión o sw.js no disponible: se recarga igual
    }

    // Si hay una versión esperando, ella misma recarga al activarse
    if (this.#registro?.waiting) {
      await aplicarVersionNueva(true);
      return;
    }

    window.location.reload();
  }
}
