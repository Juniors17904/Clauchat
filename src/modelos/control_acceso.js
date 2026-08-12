import { SesionGoogle } from './sesion_google';
import { USOS_LIBRES } from '../datos/acceso';

const CLAVE_USOS = 'sqlab_usos';

// Decide si hay que pedir la sesión. Las primeras veces la app se usa sin nada;
// después pide entrar con la cuenta de Google.
export class ControlAcceso {
  #sesion;

  constructor(sesion = new SesionGoogle()) {
    this.#sesion = sesion;
  }

  get sesion() { return this.#sesion; }

  get usos() { return Number(localStorage.getItem(CLAVE_USOS) ?? 0); }

  registrarUso() {
    localStorage.setItem(CLAVE_USOS, String(this.usos + 1));
  }

  get pideSesion() {
    if (this.#sesion.iniciada) return false;
    return this.usos > USOS_LIBRES;
  }
}
