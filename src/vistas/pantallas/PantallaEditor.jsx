import { useState, useEffect, useRef } from 'react';
import { ControladorEditor } from '../../controladores/controlador_editor';
import { obtenerBaseDatos } from '../../datos/bases_datos';
import { TEMAS } from '../../datos/temas';
import CaritaEstado from '../editor/CaritaEstado';
import AutocompletadorSQL from '../editor/AutocompletadorSQL';
import PanelResultados from '../editor/PanelResultados';
import DrawerExplorador from '../editor/DrawerExplorador';
import DiagramaBD from '../editor/DiagramaBD';
import { FormateadorSQL } from '../../modelos/formateador_sql';
import { ResaltadorSintaxis } from '../../modelos/resaltador_sintaxis';
import { GestorTemas } from '../../modelos/gestor_temas';
import { SesionEjercicio } from '../../modelos/sesion_ejercicio';

const formatearTiempo = (seg) => {
  const m = Math.floor(seg / 60);
  const s = seg % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
};

const SIGNOS_RAPIDOS = [',', '*', '=', "'", '(', ')', '>', '<', '!=', ';', '%', '_'];
const SIGNOS_CON_ESPACIO = new Set([',', '=', '>', '<', '!=']);

export default function PantallaEditor({ ejercicio, progreso, onVolver, onSiguiente, onTerminar, onCompletado }) {
  const [consulta, setConsulta] = useState('');
  const [resultado, setResultado] = useState(null);
  const [estado, setEstado] = useState('neutral');
  const [sugerencias, setSugerencias] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [mostrarPista, setMostrarPista] = useState(false);
  const [indicePista, setIndicePista] = useState(0);
  const [drawerAbierto, setDrawerAbierto] = useState(false);
  const [diagramaAbierto, setDiagramaAbierto] = useState(false);
  const [tablas, setTablas] = useState([]);
  const [errorCarga, setErrorCarga] = useState(null);
  const [alturaPantalla, setAlturaPantalla] = useState(
    () => window.visualViewport?.height ?? window.innerHeight
  );
  const [segundos, setSegundos] = useState(0);
  const [resultadosAbiertos, setResultadosAbiertos] = useState(true);
  const [panelAjustesAbierto, setPanelAjustesAbierto] = useState(false);
  const [nivelZoom, setNivelZoom] = useState(12);
  const [editorEnfocado, setEditorEnfocado] = useState(false);
  const [mostrarSignos, setMostrarSignos] = useState(true);
  const [resaltadoActivo, setResaltadoActivo] = useState(false);
  const [temaId, setTemaId] = useState('verde');
  const [temaGlobal, setTemaGlobal] = useState(false);

  const baseDatos = ejercicio?.baseDatosId ? obtenerBaseDatos(ejercicio.baseDatosId) : null;
  const tema = TEMAS.find(t => t.id === ejercicio?.temaId) ?? null;
  const esCorrecto = estado === 'feliz' || estado === 'celebrando';
  const estadoCarita = segundos > 120 && !esCorrecto && estado !== 'neutral' ? 'estresado' : estado;

  const controlador = useRef(new ControladorEditor());
  const textareaRef = useRef(null);
  const ultimaConsulta = useRef('');
  const lineNumsRef = useRef(null);
  const formateador = useRef(new FormateadorSQL());
  const resaltador = useRef(new ResaltadorSintaxis());
  const capaResaltadoRef = useRef(null);
  const gestorTemas = useRef(new GestorTemas());
  const sesion = useRef(null);

  useEffect(() => {
    setTemaId(gestorTemas.current.temaActual.id);
    setTemaGlobal(gestorTemas.current.esGlobal);
  }, []);

  useEffect(() => {
    const ctrl = controlador.current;
    return () => ctrl.destruir();
  }, []);

  useEffect(() => {
    const ctrl = controlador.current;
    const baseDatos = ejercicio?.baseDatosId ? obtenerBaseDatos(ejercicio.baseDatosId) : null;
    const cambiaBD = ctrl.baseDatosIdActual !== (ejercicio?.baseDatosId ?? null);

    sesion.current = ejercicio ? new SesionEjercicio(ejercicio.id) : null;
    const consultaGuardada = sesion.current?.consulta ?? '';
    setConsulta(consultaGuardada);
    setResultado(null);
    setEstado('neutral');
    setSugerencias([]);
    setMostrarPista(false);
    setIndicePista(0);

    if (cambiaBD) setCargando(true);

    ctrl.iniciar(ejercicio, baseDatos).then(async () => {
      if (cambiaBD) {
        setTablas(await ctrl.obtenerEsquema());
      }
      setCargando(false);
    }).catch(err => {
      setCargando(false);
      setErrorCarga(err?.message ?? 'Error al cargar la base de datos');
    });
  }, [ejercicio]);

  useEffect(() => {
    const vv = window.visualViewport;
    if (!vv) return;
    const actualizar = () => setAlturaPantalla(vv.height);
    vv.addEventListener('resize', actualizar);
    vv.addEventListener('scroll', actualizar);
    return () => {
      vv.removeEventListener('resize', actualizar);
      vv.removeEventListener('scroll', actualizar);
    };
  }, []);

  useEffect(() => {
    if (!drawerAbierto && !diagramaAbierto && !panelAjustesAbierto) return;
    const estadoActual = window.history.state;
    window.history.pushState({ ...estadoActual, panelEditor: true }, '');
    const manejarRetroceso = () => {
      if (drawerAbierto) setDrawerAbierto(false);
      if (diagramaAbierto) setDiagramaAbierto(false);
      if (panelAjustesAbierto) setPanelAjustesAbierto(false);
    };
    window.addEventListener('popstate', manejarRetroceso);
    return () => {
      window.removeEventListener('popstate', manejarRetroceso);
      if (window.history.state?.panelEditor) window.history.back();
    };
  }, [drawerAbierto, diagramaAbierto, panelAjustesAbierto]);


  useEffect(() => {
    const seg = sesion.current?.segundos ?? 0;
    setSegundos(seg);
    const intervalo = setInterval(() => {
      setSegundos(s => {
        const nuevo = s + 1;
        sesion.current?.guardarSegundos(nuevo);
        return nuevo;
      });
    }, 1000);
    return () => clearInterval(intervalo);
  }, [ejercicio]);

  const reiniciar = () => {
    sesion.current?.limpiar();
    setConsulta('');
    setResultado(null);
    setEstado('neutral');
    setSugerencias([]);
    setMostrarPista(false);
    setIndicePista(0);
    setSegundos(0);
    textareaRef.current?.focus();
  };

  const actualizarVisibilidadSignos = (texto, posicion) => {
    if (!texto || posicion === 0) { setMostrarSignos(true); return; }
    const charAntes = texto[posicion - 1];
    setMostrarSignos(!charAntes || /[\s,;()=<>!%*'+\-\n]/.test(charAntes));
  };

  const insertarSigno = (signo) => {
    const ta = textareaRef.current;
    if (!ta) return;
    const inicio = ta.selectionStart;
    const fin = ta.selectionEnd;
    const textoInsertar = SIGNOS_CON_ESPACIO.has(signo) ? signo + ' ' : signo;
    const nueva = consulta.slice(0, inicio) + textoInsertar + consulta.slice(fin);
    setConsulta(nueva);
    sesion.current?.guardarConsulta(nueva);
    setResaltadoActivo(false);
    setSugerencias(controlador.current.sugerirAutocompletado(nueva, tablas));
    controlador.current.evaluarEstado(nueva).then(nuevoEstado => {
      if (ultimaConsulta.current === nueva || ultimaConsulta.current === consulta) setEstado(nuevoEstado);
    });
    ultimaConsulta.current = nueva;
    requestAnimationFrame(() => {
      ta.focus();
      const pos = inicio + textoInsertar.length;
      ta.setSelectionRange(pos, pos);
      actualizarVisibilidadSignos(nueva, pos);
    });
  };

  const handleCambio = async (e) => {
    const valor = e.target.value;
    ultimaConsulta.current = valor;
    setConsulta(valor);
    sesion.current?.guardarConsulta(valor);
    setResultado(null);
    setResaltadoActivo(false);
    setSugerencias(controlador.current.sugerirAutocompletado(valor, tablas));
    actualizarVisibilidadSignos(valor, e.target.selectionStart);
    const nuevoEstado = await controlador.current.evaluarEstado(valor);
    if (ultimaConsulta.current === valor) setEstado(nuevoEstado);
  };

  const handleAutocompletar = (palabra) => {
    const palabras = consulta.split(/(\s+)/);
    palabras[palabras.length - 1] = palabra + ' ';
    const nueva = palabras.join('');
    setConsulta(nueva);
    sesion.current?.guardarConsulta(nueva);
    setSugerencias([]);
    controlador.current.evaluarEstado(nueva).then(nuevoEstado => setEstado(nuevoEstado));
    textareaRef.current?.focus();
  };

  const ejecutar = async () => {
    if (consulta.trim()) {
      const formateada = formateador.current.formatear(consulta);
      setConsulta(formateada);
      sesion.current?.guardarConsulta(formateada);
      setResaltadoActivo(true);
    }
    const res = await controlador.current.ejecutarConsulta(consulta);
    setResultado(res);
    if (res.error) {
      setEstado('triste');
      return;
    }
    if (ejercicio) {
      const correcto = await controlador.current.verificarCorreccion(res);
      if (correcto) {
        sesion.current?.limpiar();
        onCompletado?.(ejercicio.id);
        setEstado(onSiguiente ? 'feliz' : 'celebrando');
      } else {
        setEstado((res.filas?.length ?? 0) === 0 ? 'sorprendido' : 'confundido');
      }
    } else {
      setEstado((res.filas?.length ?? 0) === 0 ? 'sorprendido' : 'pensando');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      e.preventDefault();
      ejecutar();
    }
  };

  const siguientePista = () => {
    if (!ejercicio?.pistas?.length) return;
    if (mostrarPista && indicePista >= ejercicio.pistas.length - 1) {
      setMostrarPista(false);
      setIndicePista(0);
      return;
    }
    setMostrarPista(true);
    setIndicePista(i => Math.min(i + 1, ejercicio.pistas.length - 1));
  };

  const handleEditorScroll = (e) => {
    if (lineNumsRef.current) {
      lineNumsRef.current.scrollTop = e.target.scrollTop;
    }
    if (capaResaltadoRef.current) {
      capaResaltadoRef.current.scrollTop = e.target.scrollTop;
      capaResaltadoRef.current.scrollLeft = e.target.scrollLeft;
    }
  };

  const handleSeleccion = () => {
    const ta = textareaRef.current;
    if (ta) actualizarVisibilidadSignos(consulta, ta.selectionStart);
  };

  const formatearConsulta = () => {
    if (!consulta.trim()) return;
    const formateada = formateador.current.formatear(consulta);
    setConsulta(formateada);
    setResaltadoActivo(true);
    textareaRef.current?.focus();
  };

  const cambiarTemaVisual = (id) => {
    gestorTemas.current.cambiar(id);
    setTemaId(id);
  };

  if (errorCarga) {
    const esCacheVieja = errorCarga.includes('fetch') || errorCarga.includes('import');
    return (
      <div className="flex flex-col" style={{ height: alturaPantalla, backgroundColor: 'var(--fondo-base)' }}>
        <div className="fixed top-4 left-4 right-4 rounded-lg px-4 py-3 z-50" style={{ backgroundColor: 'var(--error-fondo)', borderColor: 'var(--error)', borderWidth: 1, fontFamily: 'var(--fuente-sans)' }}>
          <p className="text-sm font-bold" style={{ color: 'var(--error)' }}>Error al cargar</p>
          <p className="text-xs mt-1" style={{ color: 'var(--texto-secundario)' }}>
            {esCacheVieja ? 'La app tiene una versión desactualizada. Recarga para continuar.' : errorCarga}
          </p>
          <div className="flex gap-3 mt-2">
            {esCacheVieja && (
              <button
                onClick={() => window.location.reload()}
                className="text-white text-xs px-3 py-1 rounded-md"
                style={{ backgroundColor: 'var(--acento-btn)' }}
              >
                Recargar app
              </button>
            )}
            <button onClick={onVolver} className="text-xs underline self-center" style={{ color: 'var(--acento)' }}>
              Volver
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col overflow-hidden select-none" style={{ height: alturaPantalla, backgroundColor: 'var(--fondo-base)', fontFamily: 'var(--fuente-sans)' }}>

      {/* ===== HEADER ===== */}
      <div className="flex-shrink-0 transition-colors duration-300 border-b" style={{ backgroundColor: esCorrecto && resultado !== null ? 'var(--exito-fondo)' : 'var(--fondo-base)', borderColor: esCorrecto && resultado !== null ? 'var(--acento-btn)' : 'var(--borde)' }}>
        {esCorrecto && resultado !== null ? (
          <div className="flex items-center gap-3 px-4 py-3">
            <button onClick={onVolver} className="text-base transition-colors flex-shrink-0" style={{ color: 'var(--texto-secundario)' }}>←</button>
            <p className="text-sm flex-1" style={{ color: 'var(--acento)' }}>¡Correcto! 😊</p>
            <button
              onClick={onSiguiente ?? onTerminar ?? onVolver}
              className="px-4 py-1.5 text-white text-xs rounded-lg transition-colors flex-shrink-0 hover:brightness-110"
              style={{ backgroundColor: 'var(--acento-btn)' }}
            >
              {onSiguiente ? 'Siguiente →' : 'Terminar'}
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2.5 px-3 py-2.5">
            <div className="min-w-0 flex-1">
              <p className="text-[14px] font-semibold leading-tight truncate" style={{ color: 'var(--texto-primario)' }}>
                {tema ? tema.nombre : 'Práctica libre'}
              </p>
              <p className="text-[11px] mt-0.5 truncate" style={{ color: 'var(--texto-secundario)' }}>
                {baseDatos ? `BD: ${baseDatos.nombre}` : ''}{tema ? ` · Nivel ${tema.nivelId.replace('nivel', '')}` : ''}
              </p>
            </div>
            <span className="text-xs font-mono tabular-nums flex items-center gap-1 flex-shrink-0" style={{ color: 'var(--texto-secundario)' }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              {formatearTiempo(segundos)}
            </span>
            <CaritaEstado estado={estadoCarita} />
            <button onClick={() => setPanelAjustesAbierto(true)} className="w-8 h-8 flex items-center justify-center rounded-lg border transition-colors flex-shrink-0" style={{ backgroundColor: 'var(--fondo-elevado)', borderColor: 'var(--borde)', color: 'var(--texto-secundario)' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
            </button>
          </div>
        )}
      </div>

      {/* ===== BARRA DE PROGRESO ===== */}
      {progreso && (() => {
        const completados = esCorrecto ? progreso.actual : progreso.actual - 1;
        const porcentaje = Math.round((completados / progreso.total) * 100);
        return (
          <div className="flex items-center gap-2.5 px-3.5 py-2 flex-shrink-0" style={{ backgroundColor: 'var(--fondo-base)' }}>
            <span className="text-[11px] whitespace-nowrap flex-shrink-0" style={{ color: 'var(--texto-secundario)' }}>Ejercicio {progreso.actual} de {progreso.total}</span>
            <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--fondo-elevado)' }}>
              <div
                className="h-full rounded-full transition-all duration-700 ease-out"
                style={{ width: `${porcentaje}%`, backgroundColor: 'var(--acento)' }}
              />
            </div>
            <span className="text-[11px] font-semibold flex-shrink-0 min-w-[28px] text-right font-mono tabular-nums" style={{ color: 'var(--acento)' }}>
              {porcentaje}%
            </span>
          </div>
        );
      })()}

      {/* ===== CONTENIDO SCROLLEABLE ===== */}
      <div className="flex-1 overflow-auto min-h-0">
        <div className="px-3 py-2 flex flex-col gap-2.5">

          {/* Tarjeta del ejercicio */}
          {ejercicio && (
            <div className="border rounded-xl p-3.5 relative overflow-hidden tarjeta-animada" style={{ backgroundColor: 'var(--fondo-panel)', borderColor: 'var(--borde)' }}>
              <div className="flex items-center gap-1.5 mb-2">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--acento)' }}><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="8" y1="8" x2="16" y2="8"/><line x1="8" y1="12" x2="14" y2="12"/><line x1="8" y1="16" x2="12" y2="16"/></svg>
                <span className="text-xs font-semibold" style={{ color: 'var(--acento)' }}>Ejercicio</span>
                {progreso && (
                  <span className="w-5 h-5 rounded-full text-[11px] font-bold flex items-center justify-center" style={{ color: 'var(--acento)', backgroundColor: 'var(--acento-suave)' }}>
                    {progreso.actual}
                  </span>
                )}
              </div>
              <p className="text-sm leading-relaxed pr-20" style={{ color: 'var(--texto-primario)' }}>{ejercicio.enunciado}</p>
              <div className="absolute right-2.5 top-9 w-[72px] h-[72px] opacity-[0.15]">
                <svg viewBox="0 0 80 80" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ color: 'var(--texto-secundario)' }}>
                  <rect x="20" y="20" width="40" height="55" rx="2"/>
                  <rect x="28" y="28" width="8" height="8" rx="1"/>
                  <rect x="44" y="28" width="8" height="8" rx="1"/>
                  <rect x="28" y="42" width="8" height="8" rx="1"/>
                  <rect x="44" y="42" width="8" height="8" rx="1"/>
                  <rect x="34" y="60" width="12" height="15" rx="1"/>
                  <line x1="15" y1="75" x2="65" y2="75"/>
                  <path d="M30 20 L40 10 L50 20"/>
                  <line x1="40" y1="10" x2="40" y2="4"/>
                  <line x1="37" y1="7" x2="43" y2="7"/>
                </svg>
              </div>
              {ejercicio?.pistas?.length > 0 && (
                <button
                  onClick={siguientePista}
                  className="mt-3 flex items-center gap-1.5 text-xs transition-colors"
                  style={{ color: 'var(--advertencia)' }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18h6"/><path d="M10 22h4"/><path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14"/></svg>
                  {mostrarPista ? 'Ocultar pista' : 'Ver pista'}
                </button>
              )}
              {mostrarPista && ejercicio?.pistas && (
                <div className="mt-2 pt-2 border-t" style={{ borderColor: 'var(--borde)' }}>
                  <p className="text-xs leading-relaxed" style={{ color: 'var(--texto-secundario)' }}>{ejercicio.pistas[indicePista]}</p>
                  {indicePista < ejercicio.pistas.length - 1 && (
                    <button onClick={siguientePista} className="text-[11px] mt-1 opacity-70 hover:opacity-100 transition-opacity" style={{ color: 'var(--advertencia)' }}>
                      Otra pista →
                    </button>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Editor SQL */}
          <div className="border rounded-xl overflow-hidden tarjeta-animada" style={{ backgroundColor: 'var(--fondo-panel)', borderColor: 'var(--borde)', animationDelay: '60ms' }}>
            <div className="flex items-center justify-between px-3.5 py-2.5 border-b" style={{ borderColor: 'var(--borde)' }}>
              <div className="flex items-center gap-1.5">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--acento)' }}><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
                <span className="text-xs font-semibold" style={{ color: 'var(--acento)' }}>Escribe tu consulta SQL</span>
              </div>
              <button
                onClick={formatearConsulta}
                disabled={!consulta.trim()}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-white text-[11px] font-semibold transition-colors disabled:opacity-30 disabled:cursor-not-allowed hover:brightness-110"
                style={{ backgroundColor: 'var(--acento-btn)' }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3l1.912 5.813a2 2 0 0 0 1.272 1.278L21 12l-5.816 1.91a2 2 0 0 0-1.275 1.278L12 21l-1.91-5.812a2 2 0 0 0-1.277-1.278L3 12l5.813-1.91a2 2 0 0 0 1.278-1.277L12 3z"/></svg>
                Formatear
              </button>
            </div>
            <div className="flex" style={{ height: 160 }}>
              <div
                ref={lineNumsRef}
                className="overflow-hidden py-3 w-8 text-center border-r flex-shrink-0 select-none"
                style={{ backgroundColor: 'color-mix(in srgb, var(--fondo-base) 50%, transparent)', borderColor: 'var(--borde)' }}
              >
                {(consulta || ' ').split('\n').map((_, i) => (
                  <div key={i} style={{ color: 'var(--texto-tenue)', fontFamily: 'var(--fuente-mono)', fontSize: Math.max(9, nivelZoom - 2), lineHeight: '1.8em', height: `${nivelZoom * 1.8}px` }}>{i + 1}</div>
                ))}
              </div>
              <div className="flex-1 relative">
                {resaltadoActivo && !cargando && (
                  <pre
                    ref={capaResaltadoRef}
                    aria-hidden="true"
                    className="absolute inset-0 px-3 py-3 overflow-hidden pointer-events-none whitespace-pre-wrap break-words m-0"
                    style={{ fontFamily: 'var(--fuente-mono)', fontSize: nivelZoom, lineHeight: '1.8em' }}
                    dangerouslySetInnerHTML={{ __html: resaltador.current.resaltar(consulta) + '\n' }}
                  />
                )}
                <textarea
                  ref={textareaRef}
                  value={consulta}
                  onChange={handleCambio}
                  onKeyDown={handleKeyDown}
                  onScroll={handleEditorScroll}
                  onFocus={() => { setEditorEnfocado(true); setMostrarSignos(true); }}
                  onBlur={() => setTimeout(() => setEditorEnfocado(false), 150)}
                  onSelect={handleSeleccion}
                  placeholder="Escribe tu consulta aquí..."
                  className="relative w-full h-full bg-transparent resize-none focus:outline-none px-3 py-3 select-text"
                  style={{ fontFamily: 'var(--fuente-mono)', fontSize: nivelZoom, lineHeight: '1.8em', color: (resaltadoActivo && !cargando) ? 'transparent' : 'var(--texto-primario)', caretColor: 'var(--texto-primario)', '--tw-placeholder-opacity': 1 }}
                  spellCheck={false}
                />
              </div>
            </div>
            <AutocompletadorSQL sugerencias={sugerencias} onSeleccionar={handleAutocompletar} />
            {/* Barra de signos rápidos */}
            {editorEnfocado && mostrarSignos && (
              <div className="flex items-center gap-1 px-2 py-1.5 border-t overflow-x-auto" style={{ borderColor: 'var(--borde)' }}>
                {SIGNOS_RAPIDOS.map(s => (
                  <button
                    key={s}
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => insertarSigno(s)}
                    className="min-w-[30px] h-7 px-1.5 rounded border text-xs transition-colors flex-shrink-0 flex items-center justify-center hover:brightness-125"
                    style={{ backgroundColor: 'var(--fondo-elevado)', borderColor: 'var(--borde)', color: 'var(--texto-primario)', fontFamily: 'var(--fuente-mono)' }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
            {/* Mini-toolbar: Tablas, Diagrama ER, Reiniciar */}
            <div className="flex items-center border-t" style={{ borderColor: 'var(--borde)' }}>
              <button onClick={() => setDrawerAbierto(true)} className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-[11px] transition-colors hover:brightness-125" style={{ color: 'var(--texto-secundario)' }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
                Tablas
              </button>
              <div className="w-px h-5" style={{ backgroundColor: 'var(--borde)' }} />
              <button onClick={() => setDiagramaAbierto(true)} className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-[11px] transition-colors hover:brightness-125" style={{ color: 'var(--texto-secundario)' }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
                Diagrama ER
              </button>
              <div className="w-px h-5" style={{ backgroundColor: 'var(--borde)' }} />
              <button onClick={reiniciar} className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-[11px] transition-colors hover:brightness-125" style={{ color: 'var(--texto-secundario)' }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 4v6h6"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/></svg>
                Reiniciar
              </button>
            </div>
          </div>

          {/* Botón ejecutar */}
          <button
            onClick={ejecutar}
            disabled={cargando || !consulta.trim()}
            className="w-full py-3.5 disabled:opacity-40 disabled:cursor-not-allowed text-white text-[15px] font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 hover:brightness-110 tarjeta-animada"
            style={{ backgroundColor: 'var(--acento-btn)', animationDelay: '120ms' }}
          >
            {cargando ? (
              <span style={{ color: 'rgba(255,255,255,0.85)' }}>Preparando...</span>
            ) : (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                Ejecutar consulta
              </>
            )}
          </button>

          {/* Resultados */}
          <div className="border rounded-xl overflow-hidden mb-2 tarjeta-animada" style={{ backgroundColor: 'var(--fondo-panel)', borderColor: 'var(--borde)', animationDelay: '180ms' }}>
            <button
              onClick={() => setResultadosAbiertos(r => !r)}
              className="w-full flex items-center justify-between px-3.5 py-3"
            >
              <div className="flex items-center gap-2">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--texto-secundario)' }}><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="3" y1="15" x2="21" y2="15"/><line x1="9" y1="3" x2="9" y2="21"/><line x1="15" y1="3" x2="15" y2="21"/></svg>
                <span className="text-[13px] font-medium" style={{ color: 'var(--texto-primario)' }}>Resultados</span>
              </div>
              <svg
                width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                className={`transition-transform ${resultadosAbiertos ? '' : '-rotate-90'}`}
                style={{ color: 'var(--texto-secundario)' }}
              >
                <polyline points="6 9 12 15 18 9"/>
              </svg>
            </button>
            {resultadosAbiertos && (
              <div className="border-t select-text" style={{ borderColor: 'var(--borde)' }}>
                <PanelResultados resultado={resultado} />
              </div>
            )}
          </div>

        </div>
      </div>

      {/* Panel de ajustes */}
      {panelAjustesAbierto && (
        <div className="fixed inset-0 z-20" onClick={() => setPanelAjustesAbierto(false)} />
      )}
      <div className={`fixed top-0 right-0 h-full w-72 border-l z-30 flex flex-col transition-transform duration-300 ease-in-out ${panelAjustesAbierto ? 'translate-x-0' : 'translate-x-full'}`} style={{ backgroundColor: 'var(--fondo-panel)', borderColor: 'var(--borde)' }}>
        <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: 'var(--borde)' }}>
          <div className="flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--texto-secundario)' }}><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
            <span className="text-sm font-semibold" style={{ color: 'var(--texto-primario)' }}>Ajustes</span>
          </div>
          <button onClick={() => setPanelAjustesAbierto(false)} className="text-lg leading-none transition-colors" style={{ color: 'var(--texto-secundario)' }}>×</button>
        </div>
        <div className="px-4 py-4 space-y-5 overflow-y-auto flex-1">
          {/* Selector de tema visual */}
          <div>
            <p className="text-xs font-semibold mb-2.5" style={{ color: 'var(--texto-secundario)' }}>Tema visual</p>
            <div className="grid grid-cols-2 gap-2">
              {gestorTemas.current.temas.map(t => {
                const c = t.colores;
                const activo = temaId === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => cambiarTemaVisual(t.id)}
                    className="p-2 rounded-lg border-2 transition-all text-left"
                    style={{
                      backgroundColor: c['fondo-base'],
                      borderColor: activo ? c['acento'] : c['borde'],
                    }}
                  >
                    <div className="flex gap-1 mb-1.5">
                      <div className="w-3.5 h-3.5 rounded-sm" style={{ backgroundColor: c['acento'] }} />
                      <div className="w-3.5 h-3.5 rounded-sm" style={{ backgroundColor: c['sintaxis-clave'] }} />
                      <div className="w-3.5 h-3.5 rounded-sm" style={{ backgroundColor: c['sintaxis-cadena'] }} />
                      <div className="w-3.5 h-3.5 rounded-sm" style={{ backgroundColor: c['sintaxis-funcion'] }} />
                    </div>
                    <span className="text-[11px] font-medium" style={{ color: c['texto-primario'] }}>{t.nombre}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Toggle tema global */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold" style={{ color: 'var(--texto-secundario)' }}>Aplicar a toda la app</p>
              <p className="text-[10px] mt-0.5" style={{ color: 'var(--texto-tenue)' }}>Cambia colores en todas las pantallas</p>
            </div>
            <button
              onClick={() => { gestorTemas.current.alternarGlobal(); setTemaGlobal(gestorTemas.current.esGlobal); }}
              className="relative w-10 h-[22px] rounded-full transition-colors duration-200 flex-shrink-0"
              style={{ backgroundColor: temaGlobal ? 'var(--acento)' : 'var(--fondo-elevado)' }}
            >
              <div
                className="absolute top-[3px] w-4 h-4 rounded-full transition-all duration-200"
                style={{ left: temaGlobal ? 21 : 3, backgroundColor: temaGlobal ? '#fff' : 'var(--texto-tenue)' }}
              />
            </button>
          </div>

          {/* Zoom del editor */}
          <div>
            <p className="text-xs font-semibold mb-2.5" style={{ color: 'var(--texto-secundario)' }}>Zoom del editor</p>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setNivelZoom(z => Math.max(8, z - 2))}
                className="w-9 h-9 flex items-center justify-center rounded-lg border text-lg font-bold transition-colors hover:brightness-125"
                style={{ backgroundColor: 'var(--fondo-elevado)', borderColor: 'var(--borde)', color: 'var(--texto-primario)' }}
              >
                −
              </button>
              <div className="flex-1 text-center">
                <span className="text-sm" style={{ color: 'var(--texto-primario)', fontFamily: 'var(--fuente-mono)' }}>{nivelZoom}px</span>
              </div>
              <button
                onClick={() => setNivelZoom(z => Math.min(22, z + 2))}
                className="w-9 h-9 flex items-center justify-center rounded-lg border text-lg font-bold transition-colors hover:brightness-125"
                style={{ backgroundColor: 'var(--fondo-elevado)', borderColor: 'var(--borde)', color: 'var(--texto-primario)' }}
              >
                +
              </button>
            </div>
            <div className="flex justify-between mt-2">
              <span className="text-[10px]" style={{ color: 'var(--texto-tenue)' }}>Pequeño</span>
              <span className="text-[10px]" style={{ color: 'var(--texto-tenue)' }}>Grande</span>
            </div>
          </div>

          {/* Volver a temas */}
          <button
            onClick={() => { setPanelAjustesAbierto(false); onVolver(); }}
            className="w-full py-2.5 border rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2 hover:brightness-125"
            style={{ backgroundColor: 'var(--fondo-elevado)', borderColor: 'var(--borde)', color: 'var(--texto-primario)' }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/></svg>
            Volver a ejercicios
          </button>
        </div>
      </div>

      {/* Diagrama de tablas */}
      <DiagramaBD
        tablas={tablas}
        abierto={diagramaAbierto}
        onCerrar={() => setDiagramaAbierto(false)}
        nombreBD={ejercicio?.baseDatosId ? (obtenerBaseDatos(ejercicio.baseDatosId)?.nombre ?? '') : ''}
        descripcionBD={ejercicio?.baseDatosId ? (obtenerBaseDatos(ejercicio.baseDatosId)?.descripcion ?? '') : ''}
      />

      {/* Drawer explorador */}
      <DrawerExplorador
        tablas={tablas}
        onObtenerDatos={(nombre) => controlador.current.obtenerDatosTabla(nombre)}
        abierto={drawerAbierto}
        onCerrar={() => setDrawerAbierto(false)}
        baseDatos={ejercicio?.baseDatosId ? obtenerBaseDatos(ejercicio.baseDatosId) : null}
      />
    </div>
  );
}
