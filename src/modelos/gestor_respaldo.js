import { TIENDAS } from '../datos/tiendas';
import { ClaveCaja } from './clave_caja';

const MAXIMO_CAJAS = 6;

// Preferencias que no dependen de la caja
const CLAVES_FIJAS = [
  'sqlab_recordatorio',
  'tema-visual',
  'tema-global',
];

// Todo lo que guarda una caja: pasos hechos, datos y fotos, último punto visto y demás
const BASES_POR_CAJA = [
  'sqlab_instalacion',
  'sqlab_instalacion_datos',
  'sqlab_instalacion_ultimo',
  'sqlab_instalacion_version',
  'sqlab_software',
  'sqlab_software_ultimo',
  'sqlab_caja_seccion',
  'sqlab_cantidad_cajas',
];

// Guarda y restaura el avance completo: el de todas las cajas de todas las tiendas,
// con sus datos y fotos, para poder pasarlo a otro equipo.
export class GestorRespaldo {
  get claves() {
    const lista = [...CLAVES_FIJAS];
    for (const tienda of TIENDAS) {
      for (let caja = 1; caja <= MAXIMO_CAJAS; caja++) {
        const clave = new ClaveCaja(caja, tienda.id);
        for (const base of BASES_POR_CAJA) lista.push(clave.para(base));
      }
    }
    return [...new Set(lista)];
  }

  exportar() {
    const datos = {};
    for (const clave of this.claves) {
      const valor = localStorage.getItem(clave);
      if (valor !== null) datos[clave] = valor;
    }
    return JSON.stringify({ app: 'migracion-xstore', version: 2, datos }, null, 2);
  }

  descargar() {
    const contenido = this.exportar();
    const blob = new Blob([contenido], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const enlace = document.createElement('a');
    enlace.href = url;
    enlace.download = `migracion-xstore-${new Date().toISOString().slice(0, 10)}.json`;
    enlace.click();
    URL.revokeObjectURL(url);
  }

  importar(texto) {
    try {
      const respaldo = JSON.parse(texto);
      const conocida = respaldo?.app === 'migracion-xstore' || respaldo?.app === 'devlab';
      if (!conocida || typeof respaldo?.datos !== 'object') return false;
      for (const clave of this.claves) {
        if (typeof respaldo.datos[clave] === 'string') {
          localStorage.setItem(clave, respaldo.datos[clave]);
        }
      }
      return true;
    } catch {
      return false;
    }
  }
}
