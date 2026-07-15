import { ActividadEjercicio } from './actividad_ejercicio.js';

const CLAVE = 'sqlab_actividad';
const DIAS_SEMANA = ['D', 'L', 'M', 'X', 'J', 'V', 'S'];

export class GestorEstadisticas {
  #actividades;

  constructor() {
    this.#actividades = this.#leer();
  }

  registrar(ejercicioId, segundos) {
    const actividad = new ActividadEjercicio(ejercicioId, this.#fechaLocal(new Date()), segundos);
    this.#actividades.push(actividad);
    this.#persistir();
  }

  get racha() {
    const dias = new Set(this.#actividades.map(a => a.fecha));
    if (dias.size === 0) return 0;

    const hoy = new Date();
    let cursor = new Date(hoy);
    if (!dias.has(this.#fechaLocal(cursor))) {
      cursor.setDate(cursor.getDate() - 1);
      if (!dias.has(this.#fechaLocal(cursor))) return 0;
    }

    let racha = 0;
    while (dias.has(this.#fechaLocal(cursor))) {
      racha++;
      cursor.setDate(cursor.getDate() - 1);
    }
    return racha;
  }

  get tiempoTotalSegundos() {
    return this.#actividades.reduce((total, a) => total + a.segundos, 0);
  }

  get ejerciciosHoy() {
    const hoy = this.#fechaLocal(new Date());
    return this.#actividades.filter(a => a.fecha === hoy).length;
  }

  get ejerciciosEstaSemana() {
    const fechas = this.#ultimasFechas(7);
    return this.#actividades.filter(a => fechas.includes(a.fecha)).length;
  }

  actividadSemanal() {
    const hoy = new Date();
    return this.#ultimasFechas(7).map((fecha, i) => {
      const delDia = this.#actividades.filter(a => a.fecha === fecha);
      const dia = new Date(hoy);
      dia.setDate(dia.getDate() - 6 + i);
      return {
        etiqueta: DIAS_SEMANA[dia.getDay()],
        minutos: Math.round(delDia.reduce((t, a) => t + a.segundos, 0) / 60),
        ejercicios: delDia.length,
        esHoy: i === 6,
      };
    });
  }

  ultimas(cantidad) {
    return this.#actividades.slice(-cantidad).reverse();
  }

  #ultimasFechas(cantidad) {
    const hoy = new Date();
    const fechas = [];
    for (let i = cantidad - 1; i >= 0; i--) {
      const dia = new Date(hoy);
      dia.setDate(dia.getDate() - i);
      fechas.push(this.#fechaLocal(dia));
    }
    return fechas;
  }

  #fechaLocal(fecha) {
    const anio = fecha.getFullYear();
    const mes = String(fecha.getMonth() + 1).padStart(2, '0');
    const dia = String(fecha.getDate()).padStart(2, '0');
    return `${anio}-${mes}-${dia}`;
  }

  #persistir() {
    localStorage.setItem(CLAVE, JSON.stringify(this.#actividades.map(a => a.aJSON())));
  }

  #leer() {
    try {
      const crudo = JSON.parse(localStorage.getItem(CLAVE) ?? '[]');
      return crudo.map(d => new ActividadEjercicio(d.ejercicioId, d.fecha, d.segundos));
    } catch {
      return [];
    }
  }
}
