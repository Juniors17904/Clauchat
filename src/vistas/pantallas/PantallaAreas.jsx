import { useState, useRef, useEffect } from 'react';
import { AREAS } from '../../datos/areas';
import { NIVELES } from '../../datos/niveles';
import { EJERCICIOS } from '../../datos/ejercicios';

const UMBRAL_PULL = 65;

const COLORES_NIVEL = {
  1: { barra: '#3fb950', texto: 'text-[#3fb950]' },
  2: { barra: '#39c5cf', texto: 'text-[#39c5cf]' },
  3: { barra: '#388bfd', texto: 'text-[#388bfd]' },
  4: { barra: '#8250df', texto: 'text-[#8250df]' },
  5: { barra: '#d29922', texto: 'text-[#d29922]' },
  6: { barra: '#e3b341', texto: 'text-[#e3b341]' },
  7: { barra: '#f78166', texto: 'text-[#f78166]' },
  8: { barra: '#f85149', texto: 'text-[#f85149]' },
};

const AREA_ESTILOS = {
  'bases-de-datos': {
    color: '#3fb950',
    Icono: () => <img src="/iconos/bases-de-datos.png" alt="database" className="w-32 h-32 object-contain" />,
  },
  'programacion': {
    color: '#8250df',
    Icono: () => <img src="/iconos/programacion.png" alt="laptop" className="w-14 h-14 object-contain" />,
  },
  'redes': {
    color: '#388bfd',
    Icono: () => <img src="/iconos/redes.png" alt="globo" className="w-14 h-14 object-contain" />,
  },
  'inteligencia-artificial': {
    color: '#d29922',
    Icono: () => <img src="/iconos/cohete-ia.png" alt="cohete" className="w-14 h-14 object-contain" />,
  },
};

function TabInicio({ onSeleccionar, ultimaPosicion, onContinuar }) {
  return (
    <div className="w-full max-w-sm mx-auto px-5 pt-5 pb-4 space-y-3">

      {/* Tarjetas de áreas */}
      {AREAS.map(area => {
        const estilos = AREA_ESTILOS[area.id] ?? AREA_ESTILOS['bases-de-datos'];
        const { color, Icono } = estilos;
        const esIA = area.id === 'inteligencia-artificial';
        const tieneContinuar = ultimaPosicion && area.id === 'bases-de-datos';

        return (
          <div
            key={area.id}
            className="rounded-2xl border bg-[#161b22] overflow-hidden"
            style={{ borderColor: `${color}40` }}
          >
            {/* Fila principal */}
            <button
              onClick={() => area.disponible && onSeleccionar(area)}
              disabled={!area.disponible}
              className={`w-full flex items-center gap-4 px-5 py-5 text-left transition-all
                ${area.disponible ? 'active:scale-[0.98] cursor-pointer' : 'cursor-not-allowed'}`}
            >
              <div className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#21262d', color }}>
                <Icono />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-white font-semibold text-base font-sans">{area.nombre}</p>
                <p className={`text-xs mt-1 font-sans leading-relaxed ${esIA ? '' : 'text-[#8b949e]'}`} style={esIA ? { color } : {}}>
                  {area.descripcion}
                </p>
              </div>
              {area.disponible ? (
                <svg width="8" height="14" viewBox="0 0 8 14" fill="none" className="flex-shrink-0" style={{ color }}>
                  <path d="M1 1l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              ) : esIA ? (
                <svg width="16" height="16" viewBox="0 0 16 16" fill={color} className="flex-shrink-0 opacity-70">
                  <path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2zm3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z" />
                </svg>
              ) : (
                <svg width="8" height="14" viewBox="0 0 8 14" fill="none" className="flex-shrink-0 opacity-30" style={{ color }}>
                  <path d="M1 1l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </button>

            {/* Continuar — solo dentro de Bases de Datos si hay progreso */}
            {tieneContinuar && (
              <button
                onClick={onContinuar}
                className="w-full flex items-center gap-3 px-5 py-3 border-t text-left transition-colors hover:bg-[#3fb950]/5 active:bg-[#3fb950]/10"
                style={{ borderColor: `${color}25` }}
              >
                <span className="text-[#3fb950] text-sm">▶</span>
                <span className="text-[#3fb950] text-xs font-sans font-medium">Continuar</span>
                <span className="text-[#484f58] text-xs font-sans">· {ultimaPosicion.tema.nombre}</span>
                <span className="ml-auto text-[#484f58] text-xs font-mono">{ultimaPosicion.completados}/{ultimaPosicion.total}</span>
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}

function TabProgreso({ controladorPerfil }) {
  const resumen = controladorPerfil.resumenPorNivel(NIVELES, EJERCICIOS).filter(n => n.total > 0);
  const totalCompletados = resumen.reduce((a, n) => a + n.completados, 0);
  const totalEjercicios = resumen.reduce((a, n) => a + n.total, 0);

  return (
    <div className="w-full max-w-sm mx-auto px-5 pt-6 pb-4">
      <h2 className="text-[#e6edf3] text-lg font-semibold font-sans mb-1">Mi Progreso</h2>
      <p className="text-[#8b949e] text-xs font-sans mb-6">{totalCompletados} de {totalEjercicios} ejercicios completados</p>

      {resumen.filter(n => n.completados > 0).length === 0 ? (
        <p className="text-[#484f58] text-sm font-sans text-center mt-12">Aún no has completado ningún ejercicio.</p>
      ) : (
        <div className="space-y-5">
          {resumen.filter(n => n.completados > 0).map(({ nombre, orden, completados, total }) => {
            const color = COLORES_NIVEL[orden] ?? COLORES_NIVEL[1];
            const porcentaje = (completados / total) * 100;
            return (
              <div key={nombre}>
                <div className="flex justify-between items-center mb-2">
                  <p className="text-[#e6edf3] text-sm font-sans">{nombre}</p>
                  <p className="text-xs font-mono">
                    <span className={color.texto}>{completados}</span>
                    <span className="text-[#484f58]">/{total}</span>
                  </p>
                </div>
                <div className="h-2 bg-[#21262d] rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-500" style={{ width: `${porcentaje}%`, backgroundColor: color.barra }} />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function TabFavoritos() {
  return (
    <div className="flex flex-col items-center justify-center flex-1 px-8 text-center pt-20">
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#30363d" strokeWidth="1.5" className="mb-4">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
      <p className="text-[#484f58] text-sm font-sans">Favoritos próximamente</p>
      <p className="text-[#30363d] text-xs font-sans mt-2">Podrás guardar tus ejercicios y temas favoritos aquí</p>
    </div>
  );
}

function TabAjustes({ controladorPerfil, onVerArbol }) {
  const [nombre, setNombre] = useState(controladorPerfil.nombre);
  const [editando, setEditando] = useState(false);
  const [confirmando, setConfirmando] = useState(false);

  const handleNombre = (e) => {
    setNombre(e.target.value);
    controladorPerfil.nombre = e.target.value;
  };

  return (
    <div className="w-full max-w-sm mx-auto px-5 pt-6 pb-4 space-y-6">
      <h2 className="text-[#e6edf3] text-lg font-semibold font-sans">Ajustes</h2>

      <div>
        <p className="text-[#8b949e] text-xs mb-2 font-sans">Tu nombre</p>
        {editando ? (
          <input
            autoFocus
            value={nombre}
            onChange={handleNombre}
            onBlur={() => setEditando(false)}
            onKeyDown={e => e.key === 'Enter' && setEditando(false)}
            placeholder="Escribe tu nombre..."
            className="w-full bg-[#0d1117] border border-[#388bfd] rounded-xl px-4 py-3 text-[#e6edf3] text-sm font-sans focus:outline-none"
          />
        ) : (
          <button
            onClick={() => setEditando(true)}
            className="w-full flex items-center justify-between px-4 py-3 bg-[#161b22] border border-[#30363d] rounded-xl hover:border-[#8b949e] transition-colors"
          >
            <span className={`text-sm font-sans ${nombre ? 'text-[#e6edf3]' : 'text-[#484f58]'}`}>
              {nombre || 'Escribe tu nombre...'}
            </span>
            <span className="text-[#484f58] text-xs">✎</span>
          </button>
        )}
      </div>

      {onVerArbol && (
        <button
          onClick={onVerArbol}
          className="w-full py-3 border border-[#30363d] rounded-xl text-[#8b949e] hover:text-white hover:border-[#8b949e] text-sm font-sans transition-colors"
        >
          📋 Ver currículo completo
        </button>
      )}

      <div className="pt-2">
        {confirmando ? (
          <div className="space-y-3">
            <p className="text-[#f85149] text-xs font-sans">¿Borrar todo el avance? No se puede deshacer.</p>
            <div className="flex gap-2">
              <button
                onClick={() => { controladorPerfil.borrarAvance(); setConfirmando(false); }}
                className="flex-1 py-2.5 bg-[#f85149] hover:bg-[#da3633] text-white text-sm rounded-xl font-sans transition-colors"
              >
                Confirmar
              </button>
              <button
                onClick={() => setConfirmando(false)}
                className="flex-1 py-2.5 border border-[#30363d] text-[#8b949e] hover:text-white text-sm rounded-xl font-sans transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setConfirmando(true)}
            className="w-full py-3 border border-[#f85149]/40 text-[#f85149] hover:bg-[#f85149]/10 text-sm rounded-xl font-sans transition-colors"
          >
            🗑️ Borrar todo el avance
          </button>
        )}
      </div>
    </div>
  );
}

const TABS_NAV = [
  {
    id: 'inicio', label: 'Inicio',
    Icono: ({ activo }) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill={activo ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
  },
  {
    id: 'progreso', label: 'Progreso',
    Icono: ({ activo }) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill={activo ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="20" x2="18" y2="10" />
        <line x1="12" y1="20" x2="12" y2="4" />
        <line x1="6" y1="20" x2="6" y2="14" />
      </svg>
    ),
  },
  {
    id: 'favoritos', label: 'Favoritos',
    Icono: ({ activo }) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill={activo ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    ),
  },
  {
    id: 'ajustes', label: 'Ajustes',
    Icono: ({ activo }) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill={activo ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
      </svg>
    ),
  },
];

export default function PantallaAreas({ onSeleccionar, controladorPerfil, onVerArbol, needRefresh, onActualizar, ultimaPosicion, onContinuar }) {
  const [tabActual, setTabActual] = useState('inicio');
  const [distanciaTiro, setDistanciaTiro] = useState(0);
  const [actualizando, setActualizando] = useState(false);
  const [promptInstalar, setPromptInstalar] = useState(null);
  const inicioRef = useRef(null);

  useEffect(() => {
    const manejar = (e) => { e.preventDefault(); setPromptInstalar(e); };
    window.addEventListener('beforeinstallprompt', manejar);
    return () => window.removeEventListener('beforeinstallprompt', manejar);
  }, []);

  const instalarApp = async () => {
    if (!promptInstalar) return;
    promptInstalar.prompt();
    const { outcome } = await promptInstalar.userChoice;
    if (outcome === 'accepted') setPromptInstalar(null);
  };

  const manejarTouchStart = (e) => { inicioRef.current = e.touches[0].clientY; };
  const manejarTouchMove = (e) => {
    if (inicioRef.current === null) return;
    const delta = e.touches[0].clientY - inicioRef.current;
    if (delta > 0) setDistanciaTiro(Math.min(delta, UMBRAL_PULL * 1.5));
  };
  const manejarTouchEnd = () => {
    if (distanciaTiro >= UMBRAL_PULL) { setActualizando(true); window.location.reload(); }
    setDistanciaTiro(0);
    inicioRef.current = null;
  };

  const tirando = distanciaTiro > 8;
  const listoParaSoltar = distanciaTiro >= UMBRAL_PULL;
  const opacidadIndicador = Math.min(distanciaTiro / UMBRAL_PULL, 1);

  return (
    <div
      className="min-h-[100svh] bg-[#0d1117] flex flex-col select-none relative"
      onTouchStart={manejarTouchStart}
      onTouchMove={manejarTouchMove}
      onTouchEnd={manejarTouchEnd}
    >
      {/* Banner nueva versión */}
      {needRefresh && !actualizando && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-[#1c2128] border-b border-[#388bfd] px-4 py-2 flex items-center justify-between font-sans">
          <p className="text-[#388bfd] text-xs">Nueva versión disponible</p>
          <button onClick={() => { setActualizando(true); onActualizar(); }} className="text-white text-xs bg-[#238636] px-3 py-1 rounded-md transition-colors">
            Actualizar
          </button>
        </div>
      )}

      {/* Indicador pull-to-refresh */}
      {(tirando || actualizando) && (
        <div className="fixed top-3 left-0 right-0 flex justify-center z-40 pointer-events-none" style={{ opacity: actualizando ? 1 : opacidadIndicador }}>
          <p className="text-[#484f58] text-xs font-sans">
            {actualizando ? '↻ Actualizando...' : listoParaSoltar ? '↑ Suelta para actualizar' : '↓ Desliza para actualizar'}
          </p>
        </div>
      )}

      {/* Hero con imagen */}
      <div className={`relative overflow-hidden flex-shrink-0 ${needRefresh ? 'h-52' : 'h-60'}`}>
        <img src="/hero-bg.png" alt="" className="w-full h-full object-cover object-center" draggable="false" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/20 to-[#0d1117]" />
        <button
          onClick={() => setTabActual('ajustes')}
          className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/40 border border-white/20 flex items-center justify-center text-white/70 hover:text-white hover:border-white/50 transition-colors backdrop-blur-sm"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
          </svg>
        </button>

        {/* Botón instalar app — solo en navegador, desaparece si ya está instalada */}
        {promptInstalar && (
          <button
            onClick={instalarApp}
            className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/40 border border-white/20 text-white/70 hover:text-white hover:border-white/50 transition-colors text-xs font-sans backdrop-blur-sm"
          >
            <svg width="13" height="13" viewBox="0 0 16 16" fill="currentColor">
              <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"/>
              <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z"/>
            </svg>
            Instalar app
          </button>
        )}
        <div className="absolute bottom-5 left-0 right-0 text-center px-6">
          <h1 className="text-4xl font-bold text-white tracking-tight font-sans drop-shadow-lg">DevLab</h1>
          <p className="text-white/60 mt-1 text-sm font-sans">Elige un área de estudio</p>
        </div>
      </div>

      {/* Contenido de la tab activa */}
      <div className="flex-1 pb-20">
        {tabActual === 'inicio' && (
          <TabInicio
            onSeleccionar={onSeleccionar}
            ultimaPosicion={ultimaPosicion}
            onContinuar={onContinuar}
          />
        )}
        {tabActual === 'progreso' && <TabProgreso controladorPerfil={controladorPerfil} />}
        {tabActual === 'favoritos' && <TabFavoritos />}
        {tabActual === 'ajustes' && <TabAjustes controladorPerfil={controladorPerfil} onVerArbol={() => { onVerArbol?.(); }} />}
      </div>

      {/* Barra de navegación inferior */}
      <nav className="fixed bottom-0 left-0 right-0 bg-[#161b22] border-t border-[#30363d] flex items-center justify-around z-30" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
        {TABS_NAV.map(({ id, label, Icono }) => {
          const activo = tabActual === id;
          return (
            <button
              key={id}
              onClick={() => setTabActual(id)}
              className={`flex flex-col items-center gap-1 py-3 px-5 transition-colors ${activo ? 'text-[#3fb950]' : 'text-[#484f58]'}`}
            >
              <Icono activo={activo} />
              <span className="text-[10px] font-sans">{label}</span>
              {activo && <div className="absolute bottom-0 w-8 h-0.5 bg-[#3fb950] rounded-full" />}
            </button>
          );
        })}
      </nav>
    </div>
  );
}
