export class ConceptoTema {
  #queEs;
  #sintaxis;
  #ejemplo;

  constructor({ queEs, sintaxis, ejemplo }) {
    this.#queEs = queEs;
    this.#sintaxis = sintaxis;
    this.#ejemplo = ejemplo;
  }

  get queEs() { return this.#queEs; }
  get sintaxis() { return this.#sintaxis; }
  get ejemplo() { return this.#ejemplo; }
}
