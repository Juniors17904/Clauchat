const CLAVE = 'sqlab_instalacion';
const CLAVE_DATOS = 'sqlab_instalacion_datos';

export class GestorInstalacion {
  #completados;
  #datos;

  constructor() {
    try {
      this.#completados = new Set(JSON.parse(localStorage.getItem(CLAVE) ?? '[]'));
    } catch {
      this.#completados = new Set();
    }
    try {
      this.#datos = JSON.parse(localStorage.getItem(CLAVE_DATOS) ?? '{}');
    } catch {
      this.#datos = {};
    }
  }

  guardarCampo(numero, campo, valor) {
    this.#datos[numero] = this.#datos[numero] ?? {};
    this.#datos[numero].campos = this.#datos[numero].campos ?? {};
    this.#datos[numero].campos[campo] = valor;
    this.#persistirDatos();
  }

  obtenerCampo(numero, campo) {
    return this.#datos[numero]?.campos?.[campo] ?? '';
  }

  guardarFoto(numero, dataUrl) {
    this.#datos[numero] = this.#datos[numero] ?? {};
    this.#datos[numero].foto = dataUrl;
    this.#persistirDatos();
  }

  obtenerFoto(numero) {
    return this.#datos[numero]?.foto ?? null;
  }

  eliminarFoto(numero) {
    if (this.#datos[numero]) {
      delete this.#datos[numero].foto;
      this.#persistirDatos();
    }
  }

  #persistirDatos() {
    try {
      localStorage.setItem(CLAVE_DATOS, JSON.stringify(this.#datos));
    } catch {
      // localStorage lleno: guardar sin fotos para no perder los campos
      const sinFotos = {};
      for (const [num, d] of Object.entries(this.#datos)) {
        sinFotos[num] = { campos: d.campos };
      }
      localStorage.setItem(CLAVE_DATOS, JSON.stringify(sinFotos));
    }
  }

  estaCompletado(numero) {
    return this.#completados.has(numero);
  }

  alternar(numero) {
    if (this.#completados.has(numero)) {
      this.#completados.delete(numero);
    } else {
      this.#completados.add(numero);
    }
    this.#persistir();
  }

  get totalCompletados() {
    return this.#completados.size;
  }

  reiniciar() {
    this.#completados.clear();
    this.#datos = {};
    this.#persistir();
    this.#persistirDatos();
  }

  #persistir() {
    localStorage.setItem(CLAVE, JSON.stringify([...this.#completados]));
  }
}
