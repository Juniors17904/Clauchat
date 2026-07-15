const CLAVE = 'sqlab_preferencias_editor';
const ZOOM_PREDETERMINADO = 12;
const ZOOM_MINIMO = 8;
const ZOOM_MAXIMO = 22;

export class PreferenciasEditor {
  #zoom;

  constructor() {
    const guardado = this.#leer();
    this.#zoom = Number.isInteger(guardado.zoom) ? guardado.zoom : ZOOM_PREDETERMINADO;
  }

  get zoom() { return this.#zoom; }
  get zoomMinimo() { return ZOOM_MINIMO; }
  get zoomMaximo() { return ZOOM_MAXIMO; }

  cambiarZoom(zoom) {
    if (!Number.isInteger(zoom) || zoom < ZOOM_MINIMO || zoom > ZOOM_MAXIMO) return;
    this.#zoom = zoom;
    this.#persistir();
  }

  #persistir() {
    localStorage.setItem(CLAVE, JSON.stringify({ zoom: this.#zoom }));
  }

  #leer() {
    try {
      return JSON.parse(localStorage.getItem(CLAVE) ?? '{}');
    } catch {
      return {};
    }
  }
}
