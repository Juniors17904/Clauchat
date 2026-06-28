import { ControladorBase } from './controlador_base';
import { GestorProgreso } from '../modelos/gestor_progreso';
import { PerfilUsuario } from '../modelos/perfil_usuario';

export class ControladorPerfil extends ControladorBase {
  #progreso;
  #usuario;

  constructor() {
    super();
    this.#progreso = new GestorProgreso();
    this.#usuario = new PerfilUsuario();
  }

  get nombre() { return this.#usuario.nombre; }
  set nombre(valor) { this.#usuario.nombre = valor; }

  marcarCompletado(ejercicioId) {
    this.#progreso.marcarCompletado(ejercicioId);
  }

  estaCompletado(ejercicioId) {
    return this.#progreso.estaCompletado(ejercicioId);
  }

  resumenPorNivel(niveles, ejercicios) {
    return niveles.map(nivel => ({
      nombre: nivel.nombre,
      orden: nivel.orden,
      completados: this.#progreso.completadosDelNivel(nivel.id, ejercicios),
      total: ejercicios.filter(e => e.nivelId === nivel.id).length,
    }));
  }

  borrarAvance() {
    this.#progreso.borrarTodo();
  }
}
