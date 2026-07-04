const CLAVE = 'sqlab_recordatorio';

export class ConfiguracionRecordatorio {
  #frecuencia;
  #hora;
  #activo;

  constructor() {
    const guardado = JSON.parse(localStorage.getItem(CLAVE) ?? 'null');
    this.#frecuencia = guardado?.frecuencia ?? 'diario';
    this.#hora = guardado?.hora ?? '20:00';
    this.#activo = guardado?.activo ?? false;
  }

  get frecuencia() { return this.#frecuencia; }
  set frecuencia(valor) {
    this.#frecuencia = valor;
    this.#guardar();
  }

  get hora() { return this.#hora; }
  set hora(valor) {
    this.#hora = valor;
    this.#guardar();
  }

  get activo() { return this.#activo; }
  set activo(valor) {
    this.#activo = valor;
    this.#guardar();
  }

  #guardar() {
    localStorage.setItem(CLAVE, JSON.stringify({
      frecuencia: this.#frecuencia,
      hora: this.#hora,
      activo: this.#activo,
    }));
  }
}
