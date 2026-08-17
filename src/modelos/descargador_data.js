import { PASOS_INSTALACION } from '../datos/pasos_instalacion';
import { PROGRAMAS_SOFTWARE } from '../datos/programas_software';

// Imágenes de la app que no salen de los datos: portada, iconos de las áreas y de las bases
const IMAGENES_INTERFAZ = [
  '/portada-oscura.png',
  '/portada-clara.png',
  '/icon-192.png',
  '/icon-512.png',
  '/iconos/bases-de-datos.png',
  '/iconos/programacion.png',
  '/iconos/redes.png',
  '/iconos/cohete-ia.png',
  '/iconos/mysql.png',
  '/iconos/oracle.png',
  '/iconos/postgresql.png',
  '/iconos/sql-base.png',
  '/iconos/sql-server.png',
];

// Baja de una vez todas las imágenes de la app y las deja guardadas en el equipo,
// para que después abran al instante y sin señal.
export class DescargadorData {
  #rutas;
  #clave = 'sqlab_data_descargada';
  #nombreAlmacen = 'imagenes-app';

  constructor() {
    const deLaGuia = PASOS_INSTALACION.flatMap(p => p.imagenes);
    const deSoftware = PROGRAMAS_SOFTWARE.flatMap(p => p.imagenes);
    this.#rutas = [...new Set([...IMAGENES_INTERFAZ, ...deLaGuia, ...deSoftware])];
  }

  get total() { return this.#rutas.length; }

  get listo() { return Number(localStorage.getItem(this.#clave) ?? 0) >= this.total; }

  async descargar(alAvanzar) {
    const almacen = await caches.open(this.#nombreAlmacen);
    let guardadas = 0;
    let hechas = 0;
    for (const ruta of this.#rutas) {
      if (await this.#guardar(almacen, ruta)) guardadas++;
      hechas++;
      alAvanzar?.(hechas, this.total);
    }
    localStorage.setItem(this.#clave, String(guardadas));
    return guardadas;
  }

  async #guardar(almacen, ruta) {
    try {
      if (await almacen.match(ruta)) return true; // ya estaba guardada
      const respuesta = await fetch(ruta, { cache: 'reload' });
      if (!respuesta.ok) return false;
      await almacen.put(ruta, respuesta);
      return true;
    } catch {
      return false; // si una falla, se sigue con las demás
    }
  }
}
