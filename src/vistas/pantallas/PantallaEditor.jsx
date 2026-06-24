import { useState, useEffect, useRef } from 'react';
import { ControladorEditor } from '../../controladores/controlador_editor';
import CaritaEstado from '../editor/CaritaEstado';
import AutocompletadorSQL from '../editor/AutocompletadorSQL';
import PanelResultados from '../editor/PanelResultados';
import DrawerExplorador from '../editor/DrawerExplorador';

export default function PantallaEditor({ ejercicio, onVolver }) {
  const [consulta, setConsulta] = useState('');
  const [resultado, setResultado] = useState(null);
  const [estado, setEstado] = useState('neutral');
  const [sugerencias, setSugerencias] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [mostrarPista, setMostrarPista] = useState(false);
  const [indicePista, setIndicePista] = useState(0);
  const [drawerAbierto, setDrawerAbierto] = useState(false);
  const [tablas, setTablas] = useState([]);

  const controlador = useRef(new ControladorEditor());
  const textareaRef = useRef(null);

  useEffect(() => {
    const ctrl = controlador.current;
    setCargando(true);

    import('sql.js').then(mod => {
      const SqlJs = mod.default ?? mod;
      ctrl.iniciar(ejercicio, SqlJs).then(() => {
        setTablas(ctrl.obtenerEsquema());
        setCargando(false);
      });
    });

    return () => ctrl.destruir();
  }, [ejercicio]);

  const handleCambio = (e) => {
    const valor = e.target.value;
    setConsulta(valor);
    setEstado(controlador.current.evaluarEstado(valor));
    setSugerencias(controlador.current.sugerirAutocompletado(valor));
  };

  const handleAutocompletar = (palabra) => {
    const palabras = consulta.split(/(\s+)/);
    palabras[palabras.length - 1] = palabra + ' ';
    const nueva = palabras.join('');
    setConsulta(nueva);
    setSugerencias([]);
    setEstado(controlador.current.evaluarEstado(nueva));
    textareaRef.current?.focus();
  };

  const ejecutar = () => {
    const res = controlador.current.ejecutarConsulta(consulta);
    setResultado(res);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      e.preventDefault();
      ejecutar();
    }
  };

  const siguientePista = () => {
    if (!ejercicio?.pistas?.length) return;
    setMostrarPista(true);
    setIndicePista(i => Math.min(i + 1, ejercicio.pistas.length - 1));
  };

  if (cargando) {
    return (
      <div className="h-screen bg-[#0d1117] flex items-center justify-center">
        <p className="text-[#8b949e] text-sm">Inicializando base de datos...</p>
      </div>
    );
  }

  return (
    <div className="h-screen bg-[#0d1117] flex flex-col font-mono overflow-hidden">

      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-[#30363d] bg-[#161b22] flex-shrink-0">
        <button onClick={onVolver} className="text-[#8b949e] hover:text-white text-sm transition-colors">
          ←
        </button>
        <div className="flex-1 mx-4 min-w-0">
          {ejercicio
            ? <p className="text-[#e6edf3] text-sm truncate font-sans">{ejercicio.titulo}</p>
            : <p className="text-[#8b949e] text-sm font-sans">Práctica libre</p>
          }
        </div>
        <div className="flex items-center gap-3">
          <CaritaEstado estado={estado} />
          <button
            onClick={() => setDrawerAbierto(true)}
            className="text-[#8b949e] hover:text-[#388bfd] transition-colors text-xs font-sans px-2 py-1 rounded border border-[#30363d] hover:border-[#388bfd]"
          >
            🗄️
          </button>
        </div>
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
              {mostrarPista && indicePista < ejercicio.pistas.length - 1 ? 'Otra pista' : mostrarPista ? 'Sin más pistas' : '💡 Pista'}
            </button>
          )}
        </div>
      )}

      {/* Editor SQL */}
      <div className="flex-1 flex flex-col min-h-0">
        <div className="flex-1 relative min-h-0">
          <textarea
            ref={textareaRef}
            value={consulta}
            onChange={handleCambio}
            onKeyDown={handleKeyDown}
            placeholder="Escribe tu consulta SQL aquí..."
            className="w-full h-full bg-[#0d1117] text-[#e6edf3] text-sm resize-none focus:outline-none px-4 py-4 leading-6 placeholder-[#484f58]"
            spellCheck={false}
          />
        </div>

        {/* Autocompletado */}
        <AutocompletadorSQL sugerencias={sugerencias} onSeleccionar={handleAutocompletar} />

        {/* Barra inferior */}
        <div className="flex items-center justify-between px-4 py-2 border-t border-[#30363d] bg-[#161b22] flex-shrink-0">
          <p className="text-[#484f58] text-xs font-sans">Ctrl+Enter para ejecutar</p>
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
      <div className="h-44 border-t border-[#30363d] bg-[#161b22] flex-shrink-0 overflow-hidden">
        <div className="px-4 py-1.5 border-b border-[#30363d]">
          <p className="text-[#8b949e] text-xs font-sans">Resultados</p>
        </div>
        <div className="h-full overflow-auto">
          <PanelResultados resultado={resultado} />
        </div>
      </div>

      {/* Drawer explorador */}
      <DrawerExplorador
        tablas={tablas}
        onObtenerDatos={(nombre) => controlador.current.obtenerDatosTabla(nombre)}
        abierto={drawerAbierto}
        onCerrar={() => setDrawerAbierto(false)}
      />
    </div>
  );
}
