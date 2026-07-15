const CLAVE = 'sqlab_meta_diaria';
const OBJETIVO_PREDETERMINADO = 5;

export class MetaDiaria {
  #objetivo;

  constructor() {
    const guardado = parseInt(localStorage.getItem(CLAVE), 10);
    this.#objetivo = Number.isInteger(guardado) && guardado > 0 ? guardado : OBJETIVO_PREDETERMINADO;
  }

  get objetivo() { return this.#objetivo; }

  cambiar(objetivo) {
    if (!Number.isInteger(objetivo) || objetivo <= 0) return;
    this.#objetivo = objetivo;
    localStorage.setItem(CLAVE, String(objetivo));
  }

  cumplida(ejerciciosHoy) {
    return ejerciciosHoy >= this.#objetivo;
  }
}
