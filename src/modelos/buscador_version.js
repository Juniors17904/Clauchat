// Busca si hay una versión nueva de la app publicada. Se consulta al abrir y cada vez
// que se vuelve a ella, así los cambios se ven sin tener que cerrarla ni deslizar.
export class BuscadorVersion {
  #registro = null;

  guardarRegistro(registro) {
    this.#registro = registro ?? null;
    this.buscar();
  }

  async buscar() {
    if (!this.#registro || !navigator.onLine) return false;
    try {
      await this.#registro.update();
      return true;
    } catch {
      return false;
    }
  }

  // Cada vez que la app vuelve a estar a la vista, revisa de nuevo
  vigilarRegreso() {
    const alVolver = () => { if (document.visibilityState === 'visible') this.buscar(); };
    document.addEventListener('visibilitychange', alVolver);
    return () => document.removeEventListener('visibilitychange', alVolver);
  }
}
