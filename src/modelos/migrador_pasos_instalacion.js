// Cuando se inserta un paso nuevo al inicio de la guía, los pasos siguientes cambian de número.
// El avance guardado (pasos hechos, datos, fotos y último paso visto) está identificado por ese
// número, así que hay que correrlo igual. Se hace una sola vez por caja, marcando la versión.
import { ClaveCaja } from './clave_caja.js';

export class MigradorPasosInstalacion {
  #claveCompletados;
  #claveDatos;
  #claveUltimo;
  #claveVersion;
  #version;
  #desplazamiento;

  constructor(caja = 1, version = 2, desplazamiento = 1) {
    const clave = new ClaveCaja(caja);
    this.#claveCompletados = clave.para('sqlab_instalacion');
    this.#claveDatos = clave.para('sqlab_instalacion_datos');
    this.#claveUltimo = clave.para('sqlab_instalacion_ultimo');
    this.#claveVersion = clave.para('sqlab_instalacion_version');
    this.#version = version;
    this.#desplazamiento = desplazamiento;
  }

  get pendiente() {
    return Number(localStorage.getItem(this.#claveVersion) ?? 1) < this.#version;
  }

  migrar() {
    if (!this.pendiente) return;
    this.#correrCompletados();
    this.#correrDatos();
    this.#correrUltimoVisto();
    localStorage.setItem(this.#claveVersion, String(this.#version));
  }

  #correrCompletados() {
    const lista = this.#leer(this.#claveCompletados, []);
    if (!Array.isArray(lista)) return;
    const corrida = lista.map(n => Number(n) + this.#desplazamiento);
    localStorage.setItem(this.#claveCompletados, JSON.stringify(corrida));
  }

  #correrDatos() {
    const datos = this.#leer(this.#claveDatos, {});
    if (datos == null || typeof datos !== 'object') return;
    const corridos = {};
    for (const [numero, contenido] of Object.entries(datos)) {
      corridos[Number(numero) + this.#desplazamiento] = contenido;
    }
    localStorage.setItem(this.#claveDatos, JSON.stringify(corridos));
  }

  #correrUltimoVisto() {
    const valor = localStorage.getItem(this.#claveUltimo);
    if (valor == null) return;
    localStorage.setItem(this.#claveUltimo, String(Number(valor) + this.#desplazamiento));
  }

  #leer(clave, porDefecto) {
    try {
      return JSON.parse(localStorage.getItem(clave) ?? JSON.stringify(porDefecto));
    } catch {
      return porDefecto;
    }
  }
}
