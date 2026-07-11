const CLAVE = 'sqlab_sesion_ejercicio';

export class SesionEjercicio {
  #ejercicioId;
  #consulta;
  #segundos;

  constructor(ejercicioId) {
    this.#ejercicioId = ejercicioId;
    const guardado = SesionEjercicio.#leerTodas()[ejercicioId];
    this.#consulta = guardado?.consulta ?? '';
    this.#segundos = guardado?.segundos ?? 0;
  }

  get consulta() { return this.#consulta; }
  get segundos() { return this.#segundos; }

  guardarConsulta(texto) {
    this.#consulta = texto;
    this.#persistir();
  }

  guardarSegundos(seg) {
    this.#segundos = seg;
    this.#persistir();
  }

  limpiar() {
    const todas = SesionEjercicio.#leerTodas();
    delete todas[this.#ejercicioId];
    localStorage.setItem(CLAVE, JSON.stringify(todas));
  }

  #persistir() {
    const todas = SesionEjercicio.#leerTodas();
    todas[this.#ejercicioId] = {
      consulta: this.#consulta,
      segundos: this.#segundos,
    };
    localStorage.setItem(CLAVE, JSON.stringify(todas));
  }

  static #leerTodas() {
    try {
      return JSON.parse(localStorage.getItem(CLAVE) ?? '{}');
    } catch {
      return {};
    }
  }
}
