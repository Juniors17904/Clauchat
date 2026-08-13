import { SesionGoogle } from './sesion_google';

// Decide si hace falta iniciar sesión. La pantalla de inicio se ve siempre; el pedido
// aparece recién cuando se quiere entrar a algún contenido.
export class ControlAcceso {
  #sesion;

  constructor(sesion = new SesionGoogle()) {
    this.#sesion = sesion;
  }

  get sesion() { return this.#sesion; }

  get iniciada() { return this.#sesion.iniciada; }

  get correo() { return this.#sesion.correo; }
}
