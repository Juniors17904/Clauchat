import { GestorInstalacion } from './gestor_instalacion';
import { GestorSoftware } from './gestor_software';

const CLAVE = 'sqlab_cantidad_cajas';
const MINIMO = 2;
const MAXIMO = 6;

// Cuántas cajas tiene la tienda en la que se está trabajando. Casi siempre son dos,
// pero hay tiendas con tres o más.
export class RegistroCajas {
  get cantidad() {
    const guardada = Number(localStorage.getItem(CLAVE));
    if (!Number.isInteger(guardada)) return MINIMO;
    return Math.min(Math.max(guardada, MINIMO), MAXIMO);
  }

  get lista() {
    return Array.from({ length: this.cantidad }, (_, i) => i + 1);
  }

  get puedeAgregar() { return this.cantidad < MAXIMO; }

  get puedeQuitar() { return this.cantidad > MINIMO; }

  agregar() {
    if (!this.puedeAgregar) return this.cantidad;
    const nueva = this.cantidad + 1;
    localStorage.setItem(CLAVE, String(nueva));
    return nueva;
  }

  // Quita la última caja y borra su avance, que ya no se puede ver desde ningún lado
  quitarUltima() {
    if (!this.puedeQuitar) return this.cantidad;
    const ultima = this.cantidad;
    new GestorInstalacion(ultima).reiniciar();
    new GestorSoftware(ultima).reiniciar();
    const queda = ultima - 1;
    localStorage.setItem(CLAVE, String(queda));
    return queda;
  }
}
