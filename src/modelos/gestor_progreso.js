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

  obtenerUltimaPosicion(ejercicios, temas) {
    let hayAlgoCompletado = false;
    for (const tema of temas) {
      const deTema = ejercicios.filter(e => e.temaId === tema.id);
      if (deTema.length === 0) continue;
      const completadosDeTema = deTema.filter(e => this.#completados.has(e.id));
      if (completadosDeTema.length === 0) {
        if (hayAlgoCompletado) {
          return { ejercicio: deTema[0], tema, completados: 0, total: deTema.length };
        }
        continue;
      }
      if (completadosDeTema.length === deTema.length) {
        hayAlgoCompletado = true;
        continue;
      }
      const primerIncompleto = deTema.find(e => !this.#completados.has(e.id));
      return { ejercicio: primerIncompleto, tema, completados: completadosDeTema.length, total: deTema.length };
    }
    return null;
  }

  borrarTodo() {
    this.#completados.clear();
    localStorage.removeItem(CLAVE);
  }
}
