import { TemaVisual } from './tema_visual.js';

export class GestorTemas {
  #temas;
  #temaActual;

  constructor() {
    this.#temas = this.#crearTemas();
    const idGuardado = localStorage.getItem('tema-visual') || 'verde';
    this.#temaActual = this.#temas.find(t => t.id === idGuardado) || this.#temas[0];
    this.#aplicar(this.#temaActual);
  }

  get temas() { return [...this.#temas]; }
  get temaActual() { return this.#temaActual; }

  cambiar(id) {
    const tema = this.#temas.find(t => t.id === id);
    if (!tema) return;
    this.#temaActual = tema;
    localStorage.setItem('tema-visual', id);
    this.#aplicar(tema);
  }

  #aplicar(tema) {
    const root = document.documentElement;
    for (const [clave, valor] of Object.entries(tema.colores)) {
      root.style.setProperty(`--${clave}`, valor);
    }
    for (const [clave, valor] of Object.entries(tema.fuentes)) {
      root.style.setProperty(`--${clave}`, valor);
    }
  }

  #crearTemas() {
    return [
      new TemaVisual('verde', 'Verde', {
        'fondo-base': '#0d1117',
        'fondo-panel': '#161b22',
        'fondo-elevado': '#21262d',
        'borde': '#30363d',
        'texto-primario': '#e6edf3',
        'texto-secundario': '#8b949e',
        'texto-tenue': '#484f58',
        'acento': '#3fb950',
        'acento-hover': '#2ea043',
        'acento-btn': '#238636',
        'acento-suave': 'rgba(63,185,80,0.1)',
        'exito-fondo': '#0d2117',
        'error': '#f85149',
        'error-fondo': '#2d1111',
        'advertencia': '#d29922',
        'sintaxis-clave': '#ff7b72',
        'sintaxis-cadena': '#a5d6ff',
        'sintaxis-numero': '#79c0ff',
        'sintaxis-funcion': '#d2a8ff',
        'sintaxis-operador': '#79c0ff',
        'sintaxis-puntuacion': '#8b949e',
      }, {
        'fuente-mono': "'Cascadia Code','JetBrains Mono','Fira Code',Consolas,monospace",
        'fuente-sans': "system-ui,-apple-system,'Segoe UI',sans-serif",
      }),

      new TemaVisual('clasico', 'Clásico', {
        'fondo-base': '#ffffff',
        'fondo-panel': '#f6f8fa',
        'fondo-elevado': '#eaeef2',
        'borde': '#d0d7de',
        'texto-primario': '#1f2328',
        'texto-secundario': '#656d76',
        'texto-tenue': '#b0b8c1',
        'acento': '#0969da',
        'acento-hover': '#0550ae',
        'acento-btn': '#0969da',
        'acento-suave': 'rgba(9,105,218,0.1)',
        'exito-fondo': '#dafbe1',
        'error': '#d1242f',
        'error-fondo': '#ffebe9',
        'advertencia': '#9a6700',
        'sintaxis-clave': '#0550ae',
        'sintaxis-cadena': '#a40e26',
        'sintaxis-numero': '#0953a8',
        'sintaxis-funcion': '#6639ba',
        'sintaxis-operador': '#1f2328',
        'sintaxis-puntuacion': '#656d76',
      }, {
        'fuente-mono': "Consolas,'Cascadia Code','Source Code Pro','DejaVu Sans Mono',monospace",
        'fuente-sans': "system-ui,-apple-system,'Segoe UI',sans-serif",
      }),

      new TemaVisual('mocha', 'Mocha', {
        'fondo-base': '#1e1e2e',
        'fondo-panel': '#313244',
        'fondo-elevado': '#45475a',
        'borde': '#585b70',
        'texto-primario': '#cdd6f4',
        'texto-secundario': '#a6adc8',
        'texto-tenue': '#6c7086',
        'acento': '#89b4fa',
        'acento-hover': '#74c7ec',
        'acento-btn': '#89b4fa',
        'acento-suave': 'rgba(137,180,250,0.12)',
        'exito-fondo': '#1e2e2a',
        'error': '#f38ba8',
        'error-fondo': '#2e1e28',
        'advertencia': '#f9e2af',
        'sintaxis-clave': '#cba6f7',
        'sintaxis-cadena': '#a6e3a1',
        'sintaxis-numero': '#fab387',
        'sintaxis-funcion': '#89b4fa',
        'sintaxis-operador': '#89dceb',
        'sintaxis-puntuacion': '#6c7086',
      }, {
        'fuente-mono': "'JetBrains Mono','Cascadia Code','Fira Code',Consolas,monospace",
        'fuente-sans': "system-ui,-apple-system,'Segoe UI',sans-serif",
      }),

      new TemaVisual('medianoche', 'Medianoche', {
        'fondo-base': '#2e3440',
        'fondo-panel': '#3b4252',
        'fondo-elevado': '#434c5e',
        'borde': '#4c566a',
        'texto-primario': '#eceff4',
        'texto-secundario': '#d8dee9',
        'texto-tenue': '#4c566a',
        'acento': '#88c0d0',
        'acento-hover': '#81a1c1',
        'acento-btn': '#5e81ac',
        'acento-suave': 'rgba(136,192,208,0.1)',
        'exito-fondo': '#2e3d35',
        'error': '#bf616a',
        'error-fondo': '#3d2e32',
        'advertencia': '#ebcb8b',
        'sintaxis-clave': '#81a1c1',
        'sintaxis-cadena': '#a3be8c',
        'sintaxis-numero': '#b48ead',
        'sintaxis-funcion': '#88c0d0',
        'sintaxis-operador': '#81a1c1',
        'sintaxis-puntuacion': '#4c566a',
      }, {
        'fuente-mono': "'Source Code Pro','Fira Code','Cascadia Code',Consolas,monospace",
        'fuente-sans': "system-ui,-apple-system,'Segoe UI',sans-serif",
      }),
    ];
  }
}
