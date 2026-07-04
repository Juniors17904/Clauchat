import { useState, useEffect, useRef } from 'react';
import { ControladorEditor } from '../../controladores/controlador_editor';
import { obtenerBaseDatos } from '../../datos/bases_datos';
import { TEMAS } from '../../datos/temas';
import CaritaEstado from '../editor/CaritaEstado';
import AutocompletadorSQL from '../editor/AutocompletadorSQL';
import PanelResultados from '../editor/PanelResultados';
import DrawerExplorador from '../editor/DrawerExplorador';
import DiagramaBD from '../editor/DiagramaBD';

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

  const baseDatos = ejercicio?.baseDatosId ? obtenerBaseDatos(ejercicio.baseDatosId) : null;
  const tema = TEMAS.find(t => t.id === ejercicio?.temaId) ?? null;
  const esCorrecto = estado === 'feliz' || estado === 'celebrando';
  const estadoCarita = segundos > 120 && !esCorrecto && estado !== 'neutral' ? 'estresado' : estado;

  const controlador = useRef(new ControladorEditor());
  const textareaRef = useRef(null);
  const ultimaConsulta = useRef('');

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

  const porcentaje = progreso ? Math.round((progreso.actual / progreso.total) * 100) : 0;
  const lineas = Math.max(6, consulta.split('\n').length);

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
    <div className="bg-[#0d1117] flex flex-col overflow-hidden select-none" style={{ height: alturaPantalla }}>

      {/* Header */}
      <div className={`flex-shrink-0 border-b transition-colors duration-300 ${esCorrecto && resultado !== null ? 'bg-[#0d2117] border-[#238636]' : 'bg-[#161b22] border-[#30363d]'}`}>
        {esCorrecto && resultado !== null ? (
          <div className="flex items-center gap-3 px-4 py-3">
            <button onClick={onVolver} className="text-[#8b949e] hover:text-white text-lg transition-colors flex-shrink-0">←</button>
            <p className="text-[#3fb950] text-sm font-sans flex-1">¡Correcto! 😊</p>
            <button
              onClick={onSiguiente ?? onTerminar ?? onVolver}
              className="px-4 py-1.5 bg-[#238636] hover:bg-[#2ea043] text-white text-xs rounded-lg transition-colors font-sans flex-shrink-0"
            >
              {onSiguiente ? 'Siguiente →' : 'Terminar'}
            </button>
          </div>
        ) : (
          <div className="flex items-start justify-between px-4 py-3">
            <div className="flex items-start gap-3 min-w-0 flex-1">
              <button onClick={onVolver} className="text-[#8b949e] hover:text-white text-lg transition-colors flex-shrink-0 mt-0.5">←</button>
              <div className="min-w-0">
                <h1 className="text-[#e6edf3] text-base font-semibold font-sans truncate">
                  {tema ? tema.nombre : 'Práctica libre'}
                </h1>
                <p className="text-[#484f58] text-xs font-sans mt-0.5">
                  {baseDatos ? `BD: ${baseDatos.nombre}` : ''}{tema ? ` · Nivel ${tema.nivelId.replace('nivel', '')}` : ''}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4 flex-shrink-0 ml-3">
              <button onClick={reiniciar} className="flex flex-col items-center gap-1 text-[#8b949e] hover:text-white transition-colors">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="23 4 23 10 17 10" />
                  <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
                </svg>
                <span className="text-[9px] font-sans">Reiniciar</span>
              </button>
              <button onClick={siguientePista} className={`flex flex-col items-center gap-1 transition-colors ${mostrarPista ? 'text-[#d29922]' : 'text-[#8b949e] hover:text-[#d29922]'}`}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 18h6" />
                  <path d="M10 22h4" />
                  <path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14" />
                </svg>
                <span className="text-[9px] font-sans">Pista</span>
              </button>
              <button onClick={() => setDrawerAbierto(true)} className="flex flex-col items-center gap-1 text-[#8b949e] hover:text-[#388bfd] transition-colors">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="7" height="7" />
                  <rect x="14" y="3" width="7" height="7" />
                  <rect x="3" y="14" width="7" height="7" />
                  <rect x="14" y="14" width="7" height="7" />
                </svg>
                <span className="text-[9px] font-sans">Tablas</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Contenido scrolleable */}
      <div className="flex-1 overflow-auto">

        {/* Barra de progreso */}
        {progreso && (
          <div className="flex items-center gap-3 px-4 py-2.5">
            <span className="text-[#8b949e] text-xs font-sans whitespace-nowrap">Ejercicio {progreso.actual} de {progreso.total}</span>
            <div className="flex-1 h-2 bg-[#21262d] rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700 ease-out"
                style={{
                  width: `${porcentaje}%`,
                  backgroundColor: esCorrecto && resultado !== null ? '#3fb950' : '#3fb950',
                }}
              />
            </div>
            <span className="text-[#3fb950] text-xs font-mono font-semibold">{porcentaje}%</span>
            <span className="text-[#484f58] text-[10px] font-mono tabular-nums">{formatearTiempo(segundos)}</span>
          </div>
        )}

        {/* Tarjeta del ejercicio */}
        {ejercicio && (
          <div className="mx-4 mb-3 border border-[#30363d] rounded-xl bg-[#161b22] p-4">
            <div className="flex items-center gap-2 mb-2">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#3fb950" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
              </svg>
              <span className="text-[#3fb950] text-sm font-sans font-semibold">Ejercicio</span>
              {progreso && (
                <span className="text-[10px] font-mono bg-[#21262d] text-[#8b949e] w-5 h-5 rounded-full flex items-center justify-center">{progreso.actual}</span>
              )}
            </div>
            <p className="text-[#e6edf3] text-sm font-sans leading-relaxed">{ejercicio.enunciado}</p>
            {mostrarPista && ejercicio.pistas?.length > 0 && (
              <div className="flex items-start gap-2.5 mt-3 pt-3 border-t border-[#21262d]">
                <div className="w-7 h-7 rounded-full bg-[#d29922]/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm">💡</span>
                </div>
                <div>
                  <span className="text-[#d29922] text-xs font-sans font-semibold">Pista</span>
                  <p className="text-[#8b949e] text-xs font-sans mt-0.5">{ejercicio.pistas[indicePista]}</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tarjeta del editor */}
        <div className="mx-4 mb-3 border border-[#30363d] rounded-xl bg-[#161b22] overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-[#30363d]">
            <div className="flex items-center gap-2">
              <span className="text-[#388bfd] text-sm font-mono font-bold">&lt;/&gt;</span>
              <span className="text-[#388bfd] text-xs font-sans font-semibold">Escribe tu consulta SQL</span>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={() => setDiagramaAbierto(true)} title="Ver diagrama" className="text-[#484f58] hover:text-[#388bfd] transition-colors">
                <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M4 11H2v3h2v-3zm5-4H7v7h2V7zm5-5h-2v12h2V2zm-2-1a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1h-2zM6 7a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7zm-5 4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1v-3z"/>
                </svg>
              </button>
              <CaritaEstado estado={estadoCarita} />
            </div>
          </div>

          {cargando ? (
            <div className="flex items-center justify-center py-12">
              <p
                className="text-[#484f58] text-sm font-sans transition-opacity duration-200"
                style={{ opacity: opacidadMensaje }}
              >
                {mensajeCarga}
              </p>
            </div>
          ) : (
            <div className="flex">
              <div className="flex flex-col items-end pl-3 pr-2 pt-3 pb-3 text-[#484f58] text-xs font-mono select-none border-r border-[#21262d]" style={{ lineHeight: '1.5rem' }}>
                {Array.from({ length: lineas }, (_, i) => (
                  <span key={i}>{i + 1}</span>
                ))}
              </div>
              <textarea
                ref={textareaRef}
                value={consulta}
                onChange={handleCambio}
                onKeyDown={handleKeyDown}
                placeholder="Escribe tu consulta aquí..."
                className="flex-1 bg-transparent text-[#e6edf3] text-xs font-mono resize-none focus:outline-none pl-3 pr-4 py-3 placeholder-[#484f58] select-text"
                style={{ lineHeight: '1.5rem', minHeight: '9rem' }}
                spellCheck={false}
              />
            </div>
          )}

          <AutocompletadorSQL sugerencias={sugerencias} onSeleccionar={handleAutocompletar} />
        </div>

        {/* Botón ejecutar */}
        <div className="px-4 pb-3">
          <button
            onClick={ejecutar}
            disabled={!consulta.trim()}
            className="w-full py-3.5 bg-[#238636] hover:bg-[#2ea043] disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm rounded-xl transition-colors font-sans flex items-center justify-center gap-2"
          >
            <span>▶</span> Ejecutar consulta
          </button>
        </div>

        {/* Panel de resultados */}
        <div className="mx-4 mb-4 border border-[#30363d] rounded-xl bg-[#161b22] overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2.5">
            <div className="flex items-center gap-2">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#8b949e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <line x1="3" y1="9" x2="21" y2="9" />
                <line x1="3" y1="15" x2="21" y2="15" />
                <line x1="9" y1="3" x2="9" y2="21" />
              </svg>
              <span className="text-[#8b949e] text-xs font-sans font-medium">Resultados</span>
            </div>
            {!resultado && (
              <span className="text-[#484f58] text-[10px] font-sans">Ejecuta una consulta para ver los resultados</span>
            )}
          </div>
          {resultado && (
            <div className="border-t border-[#30363d] max-h-64 overflow-auto">
              <PanelResultados resultado={resultado} />
            </div>
          )}
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
