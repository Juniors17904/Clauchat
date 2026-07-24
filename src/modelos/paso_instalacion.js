export class PasoInstalacion {
  #numero;
  #titulo;
  #detalle;
  #faseId;
  #imagenes;
  #advertencia;
  #campos;
  #fotoUnica;
  #notas;
  #referencias;
  #ubicaciones;
  #archivos;
  #comandos;
  #datoNecesario;

  constructor({ numero, titulo, detalle, faseId, imagenes = [], advertencia = null, campos = [], fotoUnica = false, notas = {}, referencias = [], ubicaciones = [], archivos = [], comandos = [], datoNecesario = null }) {
    this.#numero = numero;
    this.#titulo = titulo;
    this.#detalle = detalle;
    this.#faseId = faseId;
    this.#imagenes = imagenes;
    this.#advertencia = advertencia;
    this.#campos = campos;
    this.#fotoUnica = fotoUnica;
    this.#notas = notas;
    this.#referencias = referencias;
    this.#ubicaciones = ubicaciones;
    this.#archivos = archivos;
    this.#comandos = comandos;
    this.#datoNecesario = datoNecesario;
  }

  get numero() { return this.#numero; }
  get titulo() { return this.#titulo; }
  get detalle() { return this.#detalle; }
  get faseId() { return this.#faseId; }
  get imagenes() { return [...this.#imagenes]; }
  get advertencia() { return this.#advertencia; }
  get campos() { return [...this.#campos]; }
  get fotoUnica() { return this.#fotoUnica; }
  get referencias() { return [...this.#referencias]; }
  get ubicaciones() { return [...this.#ubicaciones]; }
  get archivos() { return [...this.#archivos]; }
  get comandos() { return [...this.#comandos]; }
  get datoNecesario() { return this.#datoNecesario; }
  notaDe(src) { return this.#notas[src] ?? null; }
}
