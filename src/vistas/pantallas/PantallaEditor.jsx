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

export default function PantallaEditor({ ejercicio, progreso, onVolver, onSiguiente, onCompletado }) {
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
      setEstado('pensando');
      return;
    }
    if (ejercicio) {
      const correcto = await controlador.current.verificarCorreccion(res);
      if (correcto) {
        onCompletado?.(ejercicio.id);
        setEstado('feliz');
      } else {
        setEstado('pensando');
      }
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

  if (errorCarga) {
    return (
      <div className="bg-[#0d1117] flex flex-col" style={{ height: alturaPantalla }}>
        <div className="fixed top-4 left-4 right-4 bg-[#2d1111] border border-[#f85149] rounded-lg px-4 py-3 z-50 font-sans">
          <p className="text-[#f85149] text-sm font-bold">Error al cargar</p>
          <p className="text-[#8b949e] text-xs mt-1">{errorCarga}</p>
          <button
            onClick={onVolver}
            className="text-[#388bfd] text-xs mt-2 underline"
          >
            Volver
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#0d1117] flex flex-col font-mono overflow-hidden select-none" style={{ height: alturaPantalla }}>

      {/* Header */}
      <div className={`flex items-center justify-between px-4 py-2.5 border-b flex-shrink-0 transition-colors duration-300 ${estado === 'feliz' && resultado !== null ? 'bg-[#0d2117] border-[#238636]' : 'bg-[#161b22] border-[#30363d]'}`}>
        <button onClick={onVolver} className="text-[#8b949e] hover:text-white text-sm transition-colors flex-shrink-0">
          ←
        </button>

        {estado === 'feliz' && resultado !== null ? (
          <>
            <p className="text-[#3fb950] text-sm font-sans flex-1 mx-4">¡Correcto! 😊</p>
            {progreso && (
              <span className="text-[#3fb950] text-xs font-mono mr-3 flex-shrink-0">
                {progreso.actual}/{progreso.total}
              </span>
            )}
            <button
              onClick={onSiguiente ?? onVolver}
              className="px-4 py-1.5 bg-[#238636] hover:bg-[#2ea043] text-white text-xs rounded-md transition-colors font-sans flex-shrink-0"
            >
              {onSiguiente ? 'Siguiente →' : 'Terminar'}
            </button>
          </>
        ) : (
          <>
            <div className="flex-1 mx-2 min-w-0 flex flex-col justify-center">
              {ejercicio ? (
                <>
                  <p className="text-[#8b949e] text-xs font-sans truncate leading-tight">
                    {baseDatos ? `${baseDatos.icono} ${baseDatos.nombre}` : ''}
                  </p>
                  {tema && (
                    <p className="text-[#484f58] text-xs font-mono truncate leading-tight">{tema.nombre}</p>
                  )}
                </>
              ) : (
                <p className="text-[#8b949e] text-xs font-sans">Práctica libre</p>
              )}
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <span className="text-[#484f58] text-xs font-mono">{formatearTiempo(segundos)}</span>
              <button onClick={reiniciar} className="text-[#484f58] hover:text-white text-sm transition-colors" title="Reiniciar">↺</button>
              {progreso && (
                <span className="text-[#484f58] text-xs font-mono">{progreso.actual}/{progreso.total}</span>
              )}
              <CaritaEstado estado={estado} />
              <button onClick={() => setDiagramaAbierto(true)} className="text-[#8b949e] hover:text-[#388bfd] transition-colors text-sm" title="Ver diagrama">📊</button>
              <button onClick={() => setDrawerAbierto(true)} className="text-[#8b949e] hover:text-[#388bfd] transition-colors text-sm" title="Explorar tablas">🗄️</button>
            </div>
          </>
        )}
      </div>

      {/* Enunciado */}
      {ejercicio && (
        <div className="px-4 py-3 bg-[#161b22] border-b border-[#30363d] flex-shrink-0">
          <p className="text-[#e6edf3] text-sm font-sans">{ejercicio.enunciado}</p>
          {mostrarPista && (
            <p className="text-[#d29922] text-xs mt-2 font-sans">
              💡 {ejercicio.pistas[indicePista]}
            </p>
          )}
          {ejercicio.pistas?.length > 0 && (
            <button onClick={siguientePista} className="text-[#8b949e] hover:text-[#d29922] text-xs mt-2 transition-colors font-sans">
              {mostrarPista && indicePista < ejercicio.pistas.length - 1 ? 'Otra pista' : mostrarPista ? 'Ocultar pista' : '💡 Pista'}
            </button>
          )}
        </div>
      )}

      {/* Editor SQL */}
      <div className="flex-[40] flex flex-col min-h-0">
        <div className="flex-1 relative min-h-0">
          {cargando ? (
            <div className="w-full h-full flex items-center justify-center">
              <p
                className="text-[#484f58] text-sm font-sans transition-opacity duration-200"
                style={{ opacity: opacidadMensaje }}
              >
                {mensajeCarga}
              </p>
            </div>
          ) : (
            <textarea
              ref={textareaRef}
              value={consulta}
              onChange={handleCambio}
              onKeyDown={handleKeyDown}
              placeholder="Escribe tu consulta SQL aquí..."
              className="w-full h-full bg-[#0d1117] text-[#e6edf3] text-sm resize-none focus:outline-none px-4 py-4 leading-6 placeholder-[#484f58] select-text"
              spellCheck={false}
            />
          )}
        </div>

        {/* Autocompletado */}
        <AutocompletadorSQL sugerencias={sugerencias} onSeleccionar={handleAutocompletar} />

        {/* Barra inferior */}
        <div className="flex items-center justify-between px-4 py-2 border-t border-[#30363d] bg-[#161b22] flex-shrink-0">
          <p className="text-[#484f58] text-xs font-sans hidden sm:block">Ctrl+Enter para ejecutar</p>
          <button
            onClick={ejecutar}
            disabled={!consulta.trim()}
            className="px-4 py-1.5 bg-[#238636] hover:bg-[#2ea043] disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs rounded-md transition-colors font-sans"
          >
            ▶ Ejecutar
          </button>
        </div>
      </div>

      {/* Panel de resultados */}
      <div className={`${resultado ? 'flex-[60]' : 'flex-none'} border-t border-[#30363d] bg-[#161b22] min-h-0 flex flex-col`}>
        <div className="px-4 py-1.5 border-b border-[#30363d] flex-shrink-0">
          <p className="text-[#8b949e] text-xs font-sans">Resultados</p>
        </div>
        <div className="flex-1 overflow-auto select-text">
          <PanelResultados resultado={resultado} />
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
