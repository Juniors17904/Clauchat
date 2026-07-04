import { ControladorBase } from './controlador_base';
import { ConfiguracionRecordatorio } from '../modelos/configuracion_recordatorio';

export class ControladorRecordatorios extends ControladorBase {
  #configuracion;

  constructor() {
    super();
    this.#configuracion = new ConfiguracionRecordatorio();
  }

  get configuracion() { return this.#configuracion; }

  get permisoNotificaciones() {
    if (!('Notification' in window)) return 'no-soportado';
    return Notification.permission;
  }

  async solicitarPermiso() {
    if (!('Notification' in window)) return 'no-soportado';
    return await Notification.requestPermission();
  }

  activar(frecuencia, hora) {
    this.#configuracion.frecuencia = frecuencia;
    this.#configuracion.hora = hora;
    this.#configuracion.activo = true;
  }

  desactivar() {
    this.#configuracion.activo = false;
  }

  enviarPrueba(titulo, cuerpo) {
    if (this.permisoNotificaciones !== 'granted') return;
    new Notification(titulo, {
      body: cuerpo,
      icon: '/icon-192.png',
    });
  }
}
