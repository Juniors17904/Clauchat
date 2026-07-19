export class GestorInstalacion {
  #completados;
  #datos;
  #clave;
  #claveDatos;

  constructor(caja = 1) {
    // Caja 1 usa las claves originales; caja 2 las suyas propias
    const sufijo = caja === 2 ? '_caja2' : '';
    this.#clave = `sqlab_instalacion${sufijo}`;
    this.#claveDatos = `sqlab_instalacion_datos${sufijo}`;
    try {
      this.#completados = new Set(JSON.parse(localStorage.getItem(this.#clave) ?? '[]'));
    } catch {
      this.#completados = new Set();
    }
    try {
      this.#datos = JSON.parse(localStorage.getItem(this.#claveDatos) ?? '{}');
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

  guardarFoto(numero, campo, dataUrl) {
    this.#datos[numero] = this.#datos[numero] ?? {};
    this.#datos[numero].fotos = this.#datos[numero].fotos ?? {};
    this.#datos[numero].fotos[campo] = dataUrl;
    this.#persistirDatos();
  }

  obtenerFoto(numero, campo) {
    return this.#datos[numero]?.fotos?.[campo] ?? null;
  }

  eliminarFoto(numero, campo) {
    if (this.#datos[numero]?.fotos) {
      delete this.#datos[numero].fotos[campo];
      this.#persistirDatos();
    }
  }

  #persistirDatos() {
    try {
      localStorage.setItem(this.#claveDatos, JSON.stringify(this.#datos));
    } catch {
      // localStorage lleno: guardar sin fotos para no perder los campos
      const sinFotos = {};
      for (const [num, d] of Object.entries(this.#datos)) {
        sinFotos[num] = { campos: d.campos };
      }
      localStorage.setItem(this.#claveDatos, JSON.stringify(sinFotos));
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
    localStorage.setItem(this.#clave, JSON.stringify([...this.#completados]));
  }
}
