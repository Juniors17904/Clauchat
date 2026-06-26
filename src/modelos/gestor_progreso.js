const CLAVE = 'sqlab_progreso';

export class GestorProgreso {
  #completados;

  constructor() {
    this.#completados = new Set(JSON.parse(localStorage.getItem(CLAVE) ?? '[]'));
  }

  marcarCompletado(ejercicioId) {
    this.#completados.add(ejercicioId);
    localStorage.setItem(CLAVE, JSON.stringify([...this.#completados]));
  }

  estaCompletado(ejercicioId) {
    return this.#completados.has(ejercicioId);
  }

  completadosDelNivel(nivelId, ejercicios) {
    return ejercicios.filter(e => e.nivelId === nivelId && this.#completados.has(e.id)).length;
  }

  borrarTodo() {
    this.#completados.clear();
    localStorage.removeItem(CLAVE);
  }
}
