const CLAVES = [
  'sqlab_progreso',
  'sqlab_actividad',
  'sqlab_sesion_ejercicio',
  'sqlab_nombre',
  'sqlab_recordatorio',
  'sqlab_meta_diaria',
  'sqlab_preferencias_editor',
  'tema-visual',
  'tema-global',
];

export class GestorRespaldo {
  exportar() {
    const datos = {};
    for (const clave of CLAVES) {
      const valor = localStorage.getItem(clave);
      if (valor !== null) datos[clave] = valor;
    }
    return JSON.stringify({ app: 'devlab', version: 1, datos }, null, 2);
  }

  descargar() {
    const contenido = this.exportar();
    const blob = new Blob([contenido], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const enlace = document.createElement('a');
    enlace.href = url;
    enlace.download = `devlab-respaldo-${new Date().toISOString().slice(0, 10)}.json`;
    enlace.click();
    URL.revokeObjectURL(url);
  }

  importar(texto) {
    try {
      const respaldo = JSON.parse(texto);
      if (respaldo?.app !== 'devlab' || typeof respaldo?.datos !== 'object') return false;
      for (const clave of CLAVES) {
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
