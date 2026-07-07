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

const formatearTiempo = (seg) => {
  const m = Math.floor(seg / 60);
  const s = seg % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
};

const MENSAJES_CARGA = [
  'Iniciando motor de base de datos...',
  'Ejecutando esquema SQL...',
  'Cargando datos de ejemplo...',
  'Leyendo estructura de columnas...',
  'Verificando relaciones...',
  'Casi listo...',
];

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
  const [mensajeCarga, setMensajeCarga] = useState(MENSAJES_CARGA[0]);
  const [opacidadMensaje, setOpacidadMensaje] = useState(1);
  const [segundos, setSegundos] = useState(0);
  const [resultadosAbiertos, setResultadosAbiertos] = useState(true);

  const baseDatos = ejercicio?.baseDatosId ? obtenerBaseDatos(ejercicio.baseDatosId) : null;
  const tema = TEMAS.find(t => t.id === ejercicio?.temaId) ?? null;
  const esCorrecto = estado === 'feliz' || estado === 'celebrando';
  const estadoCarita = segundos > 120 && !esCorrecto && estado !== 'neutral' ? 'estresado' : estado;

  const controlador = useRef(new ControladorEditor());
  const textareaRef = useRef(null);
  const ultimaConsulta = useRef('');
  const lineNumsRef = useRef(null);
  const formateador = useRef(new FormateadorSQL());

  useEffect(() => {
    const ctrl = controlador.current;
    return () => ctrl.destruir();
  }, []);

  useEffect(() => {
    const ctrl = controlador.current;
    const baseDatos = ejercicio?.baseDatosId ? obtenerBaseDatos(ejercicio.baseDatosId) : null;
    const cambiaBD = ctrl.baseDatosIdActual !== (ejercicio?.baseDatosId ?? null);

    setConsulta('');
    setResultado(null);
    setEstado('neutral');
    setSugerencias([]);
    setMostrarPista(false);
    setIndicePista(0);

    if (cambiaBD) setCargando(true);

    ctrl.iniciar(ejercicio, baseDatos).then(async () => {
      if (cambiaBD) {
        setTablas(await ctrl.obtenerEsquema());
        setCargando(false);
      }
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
    if (!drawerAbierto && !diagramaAbierto) return;
    const estadoActual = window.history.state;
    window.history.pushState({ ...estadoActual, panelEditor: true }, '');
    const manejarRetroceso = (e) => {
      if (drawerAbierto) setDrawerAbierto(false);
      if (diagramaAbierto) setDiagramaAbierto(false);
    };
    window.addEventListener('popstate', manejarRetroceso);
    return () => {
      window.removeEventListener('popstate', manejarRetroceso);
      if (window.history.state?.panelEditor) window.history.back();
    };
  }, [drawerAbierto, diagramaAbierto]);

  useEffect(() => {
    if (!cargando) return;
    let indice = 0;
    setMensajeCarga(MENSAJES_CARGA[0]);
    setOpacidadMensaje(1);
    const intervalo = setInterval(() => {
      setOpacidadMensaje(0);
      setTimeout(() => {
        indice = (indice + 1) % MENSAJES_CARGA.length;
        setMensajeCarga(MENSAJES_CARGA[indice]);
        setOpacidadMensaje(1);
      }, 200);
    }, 750);
    return () => clearInterval(intervalo);
  }, [cargando]);

  useEffect(() => {
    setSegundos(0);
    const intervalo = setInterval(() => setSegundos(s => s + 1), 1000);
    return () => clearInterval(intervalo);
  }, [ejercicio]);

  const reiniciar = () => {
    setConsulta('');
    setResultado(null);
    setEstado('neutral');
    setSugerencias([]);
    setMostrarPista(false);
    setIndicePista(0);
    setSegundos(0);
    textareaRef.current?.focus();
  };

  const handleCambio = async (e) => {
    const valor = e.target.value;
    ultimaConsulta.current = valor;
    setConsulta(valor);
    setResultado(null);
    setSugerencias(controlador.current.sugerirAutocompletado(valor, tablas));
    const nuevoEstado = await controlador.current.evaluarEstado(valor);
    if (ultimaConsulta.current === valor) setEstado(nuevoEstado);
  };

  const handleAutocompletar = (palabra) => {
    const palabras = consulta.split(/(\s+)/);
    palabras[palabras.length - 1] = palabra + ' ';
    const nueva = palabras.join('');
    setConsulta(nueva);
    setSugerencias([]);
    controlador.current.evaluarEstado(nueva).then(nuevoEstado => setEstado(nuevoEstado));
    textareaRef.current?.focus();
  };

  const ejecutar = async () => {
    const res = await controlador.current.ejecutarConsulta(consulta);
    setResultado(res);
    if (res.error) {
      setEstado('triste');
      return;
    }
    if (ejercicio) {
      const correcto = await controlador.current.verificarCorreccion(res);
      if (correcto) {
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
  };

  const formatearConsulta = () => {
    if (!consulta.trim()) return;
    const formateada = formateador.current.formatear(consulta);
    setConsulta(formateada);
    textareaRef.current?.focus();
  };

  if (errorCarga) {
    const esCacheVieja = errorCarga.includes('fetch') || errorCarga.includes('import');
    return (
      <div className="bg-[#0d1117] flex flex-col" style={{ height: alturaPantalla }}>
        <div className="fixed top-4 left-4 right-4 bg-[#2d1111] border border-[#f85149] rounded-lg px-4 py-3 z-50 font-sans">
          <p className="text-[#f85149] text-sm font-bold">Error al cargar</p>
          <p className="text-[#8b949e] text-xs mt-1">
            {esCacheVieja ? 'La app tiene una versión desactualizada. Recarga para continuar.' : errorCarga}
          </p>
          <div className="flex gap-3 mt-2">
            {esCacheVieja && (
              <button
                onClick={() => window.location.reload()}
                className="text-white text-xs bg-[#238636] px-3 py-1 rounded-md"
              >
                Recargar app
              </button>
            )}
            <button onClick={onVolver} className="text-[#388bfd] text-xs underline self-center">
              Volver
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#0d1117] flex flex-col font-sans overflow-hidden select-none" style={{ height: alturaPantalla }}>

      {/* ===== HEADER ===== */}
      <div className={`flex-shrink-0 transition-colors duration-300 ${esCorrecto && resultado !== null ? 'bg-[#0d2117] border-b border-[#238636]' : 'bg-[#0d1117] border-b border-[#30363d]'}`}>
        {esCorrecto && resultado !== null ? (
          <div className="flex items-center gap-3 px-4 py-3">
            <button onClick={onVolver} className="text-[#8b949e] hover:text-white text-base transition-colors flex-shrink-0">←</button>
            <p className="text-[#3fb950] text-sm flex-1">¡Correcto! 😊</p>
            <button
              onClick={onSiguiente ?? onTerminar ?? onVolver}
              className="px-4 py-1.5 bg-[#238636] hover:bg-[#2ea043] text-white text-xs rounded-lg transition-colors flex-shrink-0"
            >
              {onSiguiente ? 'Siguiente →' : 'Terminar'}
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2.5 px-3 py-2.5">
            <button onClick={onVolver} className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#21262d] border border-[#30363d] text-[#e6edf3] flex-shrink-0">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/></svg>
            </button>
            <div className="min-w-0 flex-1">
              <p className="text-[#e6edf3] text-[14px] font-semibold leading-tight truncate">
                {tema ? tema.nombre : 'Práctica libre'}
              </p>
              <p className="text-[#8b949e] text-[11px] mt-0.5 truncate">
                {baseDatos ? `BD: ${baseDatos.nombre}` : ''}{tema ? ` · Nivel ${tema.nivelId.replace('nivel', '')}` : ''}
              </p>
            </div>
            <span className="text-[#8b949e] text-xs font-mono tabular-nums flex items-center gap-1 flex-shrink-0">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              {formatearTiempo(segundos)}
            </span>
            <CaritaEstado estado={estadoCarita} />
          </div>
        )}
      </div>

      {/* ===== BARRA DE PROGRESO ===== */}
      {progreso && (
        <div className="flex items-center gap-2.5 px-3.5 py-2 bg-[#0d1117] flex-shrink-0">
          <span className="text-[#8b949e] text-[11px] whitespace-nowrap flex-shrink-0">Ejercicio {progreso.actual} de {progreso.total}</span>
          <div className="flex-1 h-1.5 bg-[#21262d] rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700 ease-out"
              style={{ width: `${(progreso.actual / progreso.total) * 100}%`, backgroundColor: '#3fb950' }}
            />
          </div>
          <span className="text-[#3fb950] text-[11px] font-semibold flex-shrink-0 min-w-[28px] text-right font-mono tabular-nums">
            {Math.round((progreso.actual / progreso.total) * 100)}%
          </span>
        </div>
      )}

      {/* ===== CONTENIDO SCROLLEABLE ===== */}
      <div className="flex-1 overflow-auto min-h-0">
        <div className="px-3 py-2 flex flex-col gap-2.5">

          {/* Tarjeta del ejercicio */}
          {ejercicio && (
            <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-3.5 relative overflow-hidden">
              <div className="flex items-center gap-1.5 mb-2">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3fb950" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="8" y1="8" x2="16" y2="8"/><line x1="8" y1="12" x2="14" y2="12"/><line x1="8" y1="16" x2="12" y2="16"/></svg>
                <span className="text-[#3fb950] text-xs font-semibold">Ejercicio</span>
                {progreso && (
                  <span className="w-5 h-5 rounded-full text-[#3fb950] text-[11px] font-bold flex items-center justify-center" style={{ backgroundColor: 'rgba(63,185,80,0.1)' }}>
                    {progreso.actual}
                  </span>
                )}
              </div>
              <p className="text-[#e6edf3] text-sm leading-relaxed pr-20">{ejercicio.enunciado}</p>
              <div className="absolute right-2.5 top-9 w-[72px] h-[72px] opacity-[0.08]">
                <svg viewBox="0 0 80 80" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-[#8b949e]">
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
              {/* Botón Pista dentro de la tarjeta */}
              {ejercicio?.pistas?.length > 0 && (
                <button
                  onClick={siguientePista}
                  className="mt-3 flex items-center gap-1.5 text-[#d29922] text-xs hover:text-[#e3b341] transition-colors"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18h6"/><path d="M10 22h4"/><path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14"/></svg>
                  {mostrarPista ? 'Ocultar pista' : 'Ver pista'}
                </button>
              )}
              {/* Contenido de la pista expandida */}
              {mostrarPista && ejercicio?.pistas && (
                <div className="mt-2 pt-2 border-t border-[#30363d]">
                  <p className="text-[#8b949e] text-xs leading-relaxed">{ejercicio.pistas[indicePista]}</p>
                  {indicePista < ejercicio.pistas.length - 1 && (
                    <button onClick={siguientePista} className="text-[#d29922] text-[11px] mt-1 opacity-70 hover:opacity-100 transition-opacity">
                      Otra pista →
                    </button>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Editor SQL */}
          <div className="bg-[#161b22] border border-[#30363d] rounded-xl overflow-hidden">
            <div className="flex items-center justify-between px-3.5 py-2.5 border-b border-[#30363d]">
              <div className="flex items-center gap-1.5">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#3fb950" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
                <span className="text-[#3fb950] text-xs font-semibold">Escribe tu consulta SQL</span>
              </div>
              <button
                onClick={formatearConsulta}
                disabled={!consulta.trim()}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#238636] text-white text-[11px] font-semibold hover:bg-[#2ea043] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3l1.912 5.813a2 2 0 0 0 1.272 1.278L21 12l-5.816 1.91a2 2 0 0 0-1.275 1.278L12 21l-1.91-5.812a2 2 0 0 0-1.277-1.278L3 12l5.813-1.91a2 2 0 0 0 1.278-1.277L12 3z"/></svg>
                Formatear
              </button>
            </div>
            <div className="flex" style={{ height: 160 }}>
              <div
                ref={lineNumsRef}
                className="overflow-hidden py-3 w-8 text-center border-r border-[#30363d] flex-shrink-0 select-none"
                style={{ backgroundColor: 'rgba(13,17,23,0.5)' }}
              >
                {(consulta || ' ').split('\n').map((_, i) => (
                  <div key={i} className="text-[#484f58] text-[11px] font-mono leading-6 h-6">{i + 1}</div>
                ))}
              </div>
              <div className="flex-1">
                {cargando ? (
                  <div className="w-full h-full flex items-center justify-center">
                    <p className="text-[#484f58] text-sm transition-opacity duration-200" style={{ opacity: opacidadMensaje }}>
                      {mensajeCarga}
                    </p>
                  </div>
                ) : (
                  <textarea
                    ref={textareaRef}
                    value={consulta}
                    onChange={handleCambio}
                    onKeyDown={handleKeyDown}
                    onScroll={handleEditorScroll}
                    placeholder="Escribe tu consulta aquí..."
                    className="w-full h-full bg-transparent text-[#e6edf3] text-xs font-mono resize-none focus:outline-none px-3 py-3 leading-6 placeholder-[#484f58] select-text"
                    spellCheck={false}
                  />
                )}
              </div>
            </div>
            <AutocompletadorSQL sugerencias={sugerencias} onSeleccionar={handleAutocompletar} />
            {/* Mini-toolbar: Tablas, Diagrama ER, Reiniciar */}
            <div className="flex items-center border-t border-[#30363d]">
              <button onClick={() => setDrawerAbierto(true)} className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-[#8b949e] text-[11px] hover:text-[#e6edf3] hover:bg-[#21262d] transition-colors">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
                Tablas
              </button>
              <div className="w-px h-5 bg-[#30363d]" />
              <button onClick={() => setDiagramaAbierto(true)} className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-[#8b949e] text-[11px] hover:text-[#e6edf3] hover:bg-[#21262d] transition-colors">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
                Diagrama ER
              </button>
              <div className="w-px h-5 bg-[#30363d]" />
              <button onClick={reiniciar} className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-[#8b949e] text-[11px] hover:text-[#e6edf3] hover:bg-[#21262d] transition-colors">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 4v6h6"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/></svg>
                Reiniciar
              </button>
            </div>
          </div>

          {/* Botón ejecutar */}
          <button
            onClick={ejecutar}
            disabled={!consulta.trim()}
            className="w-full py-3.5 bg-[#238636] hover:bg-[#2ea043] disabled:opacity-40 disabled:cursor-not-allowed text-white text-[15px] font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
            Ejecutar consulta
          </button>

          {/* Resultados */}
          <div className="bg-[#161b22] border border-[#30363d] rounded-xl overflow-hidden mb-2">
            <button
              onClick={() => setResultadosAbiertos(r => !r)}
              className="w-full flex items-center justify-between px-3.5 py-3"
            >
              <div className="flex items-center gap-2">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#8b949e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="3" y1="15" x2="21" y2="15"/><line x1="9" y1="3" x2="9" y2="21"/><line x1="15" y1="3" x2="15" y2="21"/></svg>
                <span className="text-[#e6edf3] text-[13px] font-medium">Resultados</span>
              </div>
              <svg
                width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8b949e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                className={`transition-transform ${resultadosAbiertos ? '' : '-rotate-90'}`}
              >
                <polyline points="6 9 12 15 18 9"/>
              </svg>
            </button>
            {resultadosAbiertos && (
              <div className="border-t border-[#30363d] select-text">
                <PanelResultados resultado={resultado} />
              </div>
            )}
          </div>

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
