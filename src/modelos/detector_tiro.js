const UMBRAL = 65;

// Detecta el gesto de tirar hacia abajo para actualizar. Solo cuenta si la pantalla
// ya está arriba de todo, así no se dispara mientras se está desplazando la lista.
export class DetectorTiro {
  #umbral;
  #inicio = null;
  #distancia = 0;

  constructor(umbral = UMBRAL) {
    this.#umbral = umbral;
  }

  get distancia() { return this.#distancia; }

  get tirando() { return this.#distancia > 8; }

  get listo() { return this.#distancia >= this.#umbral; }

  get opacidad() { return Math.min(this.#distancia / this.#umbral, 1); }

  comenzar(y) {
    this.#inicio = window.scrollY <= 0 ? y : null;
    this.#distancia = 0;
  }

  mover(y) {
    if (this.#inicio === null) return 0;
    const avance = y - this.#inicio;
    this.#distancia = avance > 0 ? Math.min(avance, this.#umbral * 1.5) : 0;
    return this.#distancia;
  }

  // Devuelve si hay que actualizar y deja el detector listo para el próximo gesto
  soltar() {
    const debeActualizar = this.listo;
    this.#inicio = null;
    this.#distancia = 0;
    return debeActualizar;
  }
}
