const ESCALA_MINIMA = 1;
const ESCALA_MAXIMA = 5;
const ESCALA_DOBLE_TAP = 2.5;
const UMBRAL_MOVIMIENTO = 12;
const DURACION_TAP = 250;
const VENTANA_DOBLE_TAP = 300;

export class VisorImagen {
  #escala = 1;
  #x = 0;
  #y = 0;
  #escalaInicial = 1;
  #distanciaInicial = 0;
  #centroInicial = null;
  #ultimoPunto = null;
  #ultimoTap = 0;
  #tapInicio = null;
  #tapValido = false;
  #ultimoDobleTapTactil = 0;

  get estilo() {
    return `translate(${this.#x}px, ${this.#y}px) scale(${this.#escala})`;
  }

  get ampliada() {
    return this.#escala > 1.02;
  }

  reiniciar() {
    this.#escala = 1;
    this.#x = 0;
    this.#y = 0;
    this.#ultimoPunto = null;
    this.#centroInicial = null;
  }

  manejarInicio(toques) {
    if (toques.length === 2) {
      this.#distanciaInicial = this.#distancia(toques);
      this.#escalaInicial = this.#escala;
      this.#centroInicial = this.#centro(toques);
      this.#tapValido = false; // gesto de dos dedos: no es tap
    } else if (toques.length === 1) {
      this.#ultimoPunto = { x: toques[0].clientX, y: toques[0].clientY };
      this.#tapInicio = { t: Date.now(), x: toques[0].clientX, y: toques[0].clientY };
      this.#tapValido = true;
    }
  }

  manejarMovimiento(toques) {
    if (toques.length === 2 && this.#distanciaInicial > 0) {
      this.#tapValido = false;
      const nuevaEscala = this.#escalaInicial * (this.#distancia(toques) / this.#distanciaInicial);
      this.#escala = Math.min(ESCALA_MAXIMA, Math.max(ESCALA_MINIMA, nuevaEscala));
      const centro = this.#centro(toques);
      if (this.#centroInicial) {
        this.#x += centro.x - this.#centroInicial.x;
        this.#y += centro.y - this.#centroInicial.y;
        this.#centroInicial = centro;
      }
    } else if (toques.length === 1 && this.#ultimoPunto) {
      if (this.#tapInicio) {
        const dx = toques[0].clientX - this.#tapInicio.x;
        const dy = toques[0].clientY - this.#tapInicio.y;
        if (Math.hypot(dx, dy) > UMBRAL_MOVIMIENTO) this.#tapValido = false;
      }
      if (this.ampliada) {
        this.#x += toques[0].clientX - this.#ultimoPunto.x;
        this.#y += toques[0].clientY - this.#ultimoPunto.y;
        this.#ultimoPunto = { x: toques[0].clientX, y: toques[0].clientY };
      }
    }
  }

  // Devuelve true si detectó un doble tap y cambió el zoom.
  manejarFin(toquesRestantes) {
    if (toquesRestantes.length > 0) {
      this.#ultimoPunto = { x: toquesRestantes[0].clientX, y: toquesRestantes[0].clientY };
      this.#distanciaInicial = 0;
      this.#centroInicial = null;
      this.#tapValido = false; // venía de multitouch
      return false;
    }

    this.#distanciaInicial = 0;
    this.#centroInicial = null;
    this.#ultimoPunto = null;

    let huboDobleTap = false;
    const duracion = this.#tapInicio ? Date.now() - this.#tapInicio.t : Infinity;

    if (this.#tapValido && duracion < DURACION_TAP) {
      const ahora = Date.now();
      if (ahora - this.#ultimoTap < VENTANA_DOBLE_TAP) {
        huboDobleTap = true;
        this.#ultimoDobleTapTactil = ahora;
        if (this.ampliada) this.reiniciar();
        else this.#escala = ESCALA_DOBLE_TAP;
        this.#ultimoTap = 0;
      } else {
        this.#ultimoTap = ahora;
      }
    }

    this.#tapInicio = null;
    this.#tapValido = false;
    if (this.#escala <= 1.05 && !huboDobleTap) this.reiniciar();
    return huboDobleTap;
  }

  alternarDobleClic() {
    // Ignorar el dblclick sintético que el móvil dispara tras un doble tap táctil
    if (Date.now() - this.#ultimoDobleTapTactil < 700) return;
    if (this.ampliada) this.reiniciar();
    else this.#escala = ESCALA_DOBLE_TAP;
  }

  manejarRueda(deltaY) {
    const factor = deltaY < 0 ? 1.2 : 1 / 1.2;
    this.#escala = Math.min(ESCALA_MAXIMA, Math.max(ESCALA_MINIMA, this.#escala * factor));
    if (this.#escala <= 1.05) this.reiniciar();
  }

  #distancia(toques) {
    const dx = toques[0].clientX - toques[1].clientX;
    const dy = toques[0].clientY - toques[1].clientY;
    return Math.hypot(dx, dy);
  }

  #centro(toques) {
    return {
      x: (toques[0].clientX + toques[1].clientX) / 2,
      y: (toques[0].clientY + toques[1].clientY) / 2,
    };
  }
}
