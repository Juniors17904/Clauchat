export class DetectorTiro {
  #umbral;
  #inicioY;
  #distancia;

  constructor(umbral) {
    this.#umbral = umbral;
    this.#inicioY = null;
    this.#distancia = 0;
  }

  get umbral() { return this.#umbral; }
  get distancia() { return this.#distancia; }
  get listo() { return this.#distancia >= this.#umbral; }

  // El gesto solo arranca si la pantalla ya está arriba de todo.
  // Sin esto, scrollear la lista hacia abajo recargaba la app entera.
  comenzar(y) {
    this.#inicioY = this.#estaArriba() ? y : null;
    this.#distancia = 0;
  }

  mover(y) {
    if (this.#inicioY === null || !this.#estaArriba()) {
      this.cancelar();
      return 0;
    }
    const delta = y - this.#inicioY;
    this.#distancia = delta > 0 ? Math.min(delta, this.#umbral * 1.5) : 0;
    return this.#distancia;
  }

  // Devuelve si el tiro alcanzó el umbral y deja el detector limpio
  terminar() {
    const alcanzado = this.listo;
    this.cancelar();
    return alcanzado;
  }

  cancelar() {
    this.#inicioY = null;
    this.#distancia = 0;
  }

  #estaArriba() {
    return (window.scrollY || document.documentElement.scrollTop || 0) <= 0;
  }
}
