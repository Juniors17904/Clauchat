import { GestorInstalacion } from './gestor_instalacion';
import { GestorSoftware } from './gestor_software';
import { ClaveCaja } from './clave_caja';

const BASE = 'sqlab_cantidad_cajas';
const MINIMO = 2;
const MAXIMO = 6;

// Cuántas cajas tiene la tienda en la que se está trabajando. Casi siempre son dos,
// pero hay tiendas con tres o más. Cada cadena lleva su propia cuenta.
export class RegistroCajas {
  #clave;
  #tiendaId;

  constructor(tiendaId = 'tambo') {
    this.#tiendaId = tiendaId;
    this.#clave = new ClaveCaja(1, tiendaId).para(BASE);
  }

  get cantidad() {
    const guardada = Number(localStorage.getItem(this.#clave));
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
    localStorage.setItem(this.#clave, String(nueva));
    return nueva;
  }

  // Quita la última caja y borra su avance, que ya no se puede ver desde ningún lado
  quitarUltima() {
    if (!this.puedeQuitar) return this.cantidad;
    const ultima = this.cantidad;
    new GestorInstalacion(ultima, this.#tiendaId).reiniciar();
    new GestorSoftware(ultima, this.#tiendaId).reiniciar();
    const queda = ultima - 1;
    localStorage.setItem(this.#clave, String(queda));
    return queda;
  }
}
