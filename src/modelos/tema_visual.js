export class TemaVisual {
  #id;
  #nombre;
  #colores;
  #fuentes;

  constructor(id, nombre, colores, fuentes) {
    this.#id = id;
    this.#nombre = nombre;
    this.#colores = colores;
    this.#fuentes = fuentes;
  }

  get id() { return this.#id; }
  get nombre() { return this.#nombre; }
  get colores() { return { ...this.#colores }; }
  get fuentes() { return { ...this.#fuentes }; }
}
