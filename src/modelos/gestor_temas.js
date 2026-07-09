import { TemaVisual } from './tema_visual.js';

export class GestorTemas {
  #temas;
  #temaActual;
  #esGlobal;

  constructor() {
    this.#temas = this.#crearTemas();
    const idGuardado = localStorage.getItem('tema-visual') || 'verde';
    this.#temaActual = this.#temas.find(t => t.id === idGuardado) || this.#temas[0];
    this.#esGlobal = localStorage.getItem('tema-global') === 'true';
    this.#aplicar(this.#temaActual);
    if (this.#esGlobal) this.#inyectarCSSGlobal();
  }

  get temas() { return [...this.#temas]; }
  get temaActual() { return this.#temaActual; }
  get esGlobal() { return this.#esGlobal; }

  cambiar(id) {
    const tema = this.#temas.find(t => t.id === id);
    if (!tema) return;
    this.#temaActual = tema;
    localStorage.setItem('tema-visual', id);
    this.#aplicar(tema);
  }

  alternarGlobal() {
    this.#esGlobal = !this.#esGlobal;
    localStorage.setItem('tema-global', String(this.#esGlobal));
    if (this.#esGlobal) {
      this.#inyectarCSSGlobal();
    } else {
      this.#quitarCSSGlobal();
    }
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

  #inyectarCSSGlobal() {
    if (document.getElementById('tema-global-css')) return;
    const estilo = document.createElement('style');
    estilo.id = 'tema-global-css';
    estilo.textContent = this.#cssGlobal();
    document.head.appendChild(estilo);
  }

  #quitarCSSGlobal() {
    document.getElementById('tema-global-css')?.remove();
  }

  #cssGlobal() {
    const reglas = [
      ['bg', '0d1117', 'background-color', '--fondo-base'],
      ['bg', '161b22', 'background-color', '--fondo-panel'],
      ['bg', '1c2128', 'background-color', '--fondo-panel'],
      ['bg', '21262d', 'background-color', '--fondo-elevado'],
      ['bg', '238636', 'background-color', '--acento-btn'],
      ['bg', '3fb950', 'background-color', '--acento'],
      ['bg', '388bfd', 'background-color', '--acento'],
      ['bg', '3d0e0e', 'background-color', '--error-fondo'],
      ['bg', 'f85149', 'background-color', '--error'],
      ['bg', 'd29922', 'background-color', '--advertencia'],
      ['border', '30363d', 'border-color', '--borde'],
      ['border', '21262d', 'border-color', '--borde'],
      ['border', '3fb950', 'border-color', '--acento'],
      ['border', '388bfd', 'border-color', '--acento'],
      ['border', '484f58', 'border-color', '--texto-tenue'],
      ['border', 'f85149', 'border-color', '--error'],
      ['border', 'd29922', 'border-color', '--advertencia'],
      ['text', 'e6edf3', 'color', '--texto-primario'],
      ['text', 'c9d1d9', 'color', '--texto-primario'],
      ['text', '8b949e', 'color', '--texto-secundario'],
      ['text', '484f58', 'color', '--texto-tenue'],
      ['text', '30363d', 'color', '--texto-tenue'],
      ['text', '3fb950', 'color', '--acento'],
      ['text', '388bfd', 'color', '--acento'],
      ['text', 'f85149', 'color', '--error'],
      ['text', 'd29922', 'color', '--advertencia'],
      ['text', 'e3b341', 'color', '--advertencia'],
    ];

    const hover = [
      ['bg', '1c2128', 'background-color', '--fondo-elevado'],
      ['bg', '161b22', 'background-color', '--fondo-panel'],
      ['bg', '2ea043', 'background-color', '--acento-hover'],
      ['bg', '30363d', 'background-color', '--fondo-elevado'],
      ['bg', '3fb950', 'background-color', '--acento'],
      ['bg', 'da3633', 'background-color', '--error'],
      ['bg', 'f85149', 'background-color', '--error'],
      ['border', '30363d', 'border-color', '--borde'],
      ['border', '3fb950', 'border-color', '--acento'],
      ['border', '388bfd', 'border-color', '--acento'],
      ['border', '8b949e', 'border-color', '--texto-secundario'],
      ['text', '8b949e', 'color', '--texto-secundario'],
    ];

    const fondosAcento = ['238636', '3fb950', '388bfd', 'f85149', 'd29922'];

    let css = '';

    for (const [tipo, hex, prop, variable] of reglas) {
      css += `[class~="${tipo}-[#${hex}]"]{${prop}:var(${variable})!important}\n`;
    }

    for (const [tipo, hex, prop, variable] of hover) {
      css += `[class~="hover:${tipo}-[#${hex}]"]:hover{${prop}:var(${variable})!important}\n`;
    }

    css += `.text-white{color:var(--texto-primario)!important}\n`;
    css += `.hover\\:text-white:hover{color:var(--texto-primario)!important}\n`;

    for (const hex of fondosAcento) {
      css += `[class~="bg-[#${hex}]"][class~="text-white"]{color:#fff!important}\n`;
      css += `[class~="bg-[#${hex}]"] .text-white{color:#fff!important}\n`;
    }

    return css;
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
