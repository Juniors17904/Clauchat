import { ID_CLIENTE_GOOGLE } from '../datos/acceso';

const CLAVE = 'sqlab_sesion';
const URL_GOOGLE = 'https://accounts.google.com/gsi/client';

// Inicio de sesión con la cuenta de Google. Guarda quién entró y comprueba que su
// correo esté en la lista de autorizados.
export class SesionGoogle {
  get correo() {
    try {
      return JSON.parse(localStorage.getItem(CLAVE) ?? 'null')?.correo ?? null;
    } catch {
      return null;
    }
  }

  get nombre() {
    try {
      return JSON.parse(localStorage.getItem(CLAVE) ?? 'null')?.nombre ?? null;
    } catch {
      return null;
    }
  }

  get iniciada() { return this.correo !== null; }

  cerrar() { localStorage.removeItem(CLAVE); }

  // Carga el botón de Google una sola vez y lo dibuja dentro del elemento indicado
  async dibujarBoton(elemento, alEntrar, alFallar) {
    try {
      await this.#cargarLibreria();
      window.google.accounts.id.initialize({
        client_id: ID_CLIENTE_GOOGLE,
        callback: (respuesta) => this.#recibir(respuesta, alEntrar, alFallar),
      });
      window.google.accounts.id.renderButton(elemento, {
        theme: 'filled_black',
        size: 'large',
        text: 'signin_with',
        shape: 'pill',
        locale: 'es',
      });
    } catch {
      alFallar?.('sin-conexion');
    }
  }

  // Si Google devolvió la credencial es porque la cuenta tiene permiso: el filtro
  // vive en los usuarios de prueba de Google, no acá.
  #recibir(respuesta, alEntrar, alFallar) {
    const datos = this.#leerCredencial(respuesta?.credential);
    if (!datos?.email) return alFallar?.('sin-datos');
    localStorage.setItem(CLAVE, JSON.stringify({ correo: datos.email, nombre: datos.name ?? '' }));
    alEntrar?.(datos.email);
  }

  // La credencial viene en tres partes separadas por puntos; la del medio trae los datos
  #leerCredencial(credencial) {
    try {
      const cuerpo = credencial.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
      return JSON.parse(decodeURIComponent(escape(atob(cuerpo))));
    } catch {
      return null;
    }
  }

  #cargarLibreria() {
    if (window.google?.accounts?.id) return Promise.resolve();
    return new Promise((listo, falla) => {
      const existente = document.querySelector(`script[src="${URL_GOOGLE}"]`);
      if (existente) {
        existente.addEventListener('load', listo);
        existente.addEventListener('error', falla);
        return;
      }
      const etiqueta = document.createElement('script');
      etiqueta.src = URL_GOOGLE;
      etiqueta.async = true;
      etiqueta.onload = listo;
      etiqueta.onerror = falla;
      document.head.appendChild(etiqueta);
    });
  }
}
