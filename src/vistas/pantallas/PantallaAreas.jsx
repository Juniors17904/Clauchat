import { useState, useRef } from 'react';
import { AREAS } from '../../datos/areas';
import DrawerPerfil from './DrawerPerfil';

const UMBRAL_PULL = 65;

export default function PantallaAreas({ onSeleccionar, controladorPerfil, onVerArbol, needRefresh, onActualizar, ultimaPosicion, onContinuar }) {
  const [perfilAbierto, setPerfilAbierto] = useState(false);
  const [distanciaTiro, setDistanciaTiro] = useState(0);
  const [actualizando, setActualizando] = useState(false);
  const inicioRef = useRef(null);

  const manejarTouchStart = (e) => {
    inicioRef.current = e.touches[0].clientY;
  };

  const manejarTouchMove = (e) => {
    if (inicioRef.current === null) return;
    const delta = e.touches[0].clientY - inicioRef.current;
    if (delta > 0) setDistanciaTiro(Math.min(delta, UMBRAL_PULL * 1.5));
  };

  const manejarTouchEnd = () => {
    if (distanciaTiro >= UMBRAL_PULL) {
      setActualizando(true);
      window.location.reload();
    }
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
          <button
            onClick={() => { setActualizando(true); onActualizar(); }}
            className="text-white text-xs bg-[#238636] hover:bg-[#2ea043] px-3 py-1 rounded-md transition-colors"
          >
            Actualizar
          </button>
        </div>
      )}

      {/* Indicador pull-to-refresh */}
      {(tirando || actualizando) && (
        <div
          className="fixed top-3 left-0 right-0 flex justify-center z-40 pointer-events-none transition-opacity duration-150"
          style={{ opacity: actualizando ? 1 : opacidadIndicador }}
        >
          <p className="text-[#484f58] text-xs font-sans">
            {actualizando ? '↻ Actualizando...' : listoParaSoltar ? '↑ Suelta para actualizar' : '↓ Desliza para actualizar'}
          </p>
        </div>
      )}

      {/* Hero con imagen */}
      <div className={`relative overflow-hidden flex-shrink-0 ${needRefresh ? 'h-56' : 'h-64'}`}>
        <img
          src="/hero-bg.png"
          alt=""
          className="w-full h-full object-cover object-center"
          draggable="false"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/20 to-[#0d1117]" />

        {/* Botón perfil */}
        <button
          onClick={() => setPerfilAbierto(true)}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/40 border border-white/20 flex items-center justify-center text-white/70 hover:text-white hover:border-white/50 transition-colors text-base backdrop-blur-sm"
          title="Ver perfil"
        >
          👤
        </button>

        {/* Título sobre la imagen */}
        <div className="absolute bottom-5 left-0 right-0 text-center px-6">
          <h1 className="text-4xl font-bold text-white tracking-tight font-sans drop-shadow-lg">DevLab</h1>
          <p className="text-white/60 mt-1 text-sm font-sans">Elige un área de estudio</p>
        </div>
      </div>

      {/* Botón Continuar */}
      {ultimaPosicion && (
        <div className="w-full max-w-sm mx-auto px-5 pt-5 pb-1">
          <button
            onClick={onContinuar}
            className="w-full flex items-center gap-4 px-5 py-4 rounded-xl border bg-[#0d2117] border-[#238636] hover:bg-[#122117] active:scale-[0.98] transition-all text-left"
          >
            <div className="w-10 h-10 rounded-lg bg-[#238636]/20 flex items-center justify-center flex-shrink-0">
              <span className="text-[#3fb950] text-lg">▶</span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[#3fb950] font-medium text-sm font-sans">Continuar</p>
              <p className="text-[#8b949e] text-xs mt-0.5 font-sans truncate">{ultimaPosicion.tema.nombre}</p>
            </div>
            <span className="text-[#484f58] text-xs font-mono flex-shrink-0">{ultimaPosicion.completados}/{ultimaPosicion.total}</span>
          </button>
        </div>
      )}

      {/* Tarjetas de áreas */}
      <div className="w-full max-w-sm mx-auto px-5 pt-6 pb-8 space-y-3">
        {AREAS.map(area => (
          <button
            key={area.id}
            onClick={() => area.disponible && onSeleccionar(area)}
            disabled={!area.disponible}
            className={`w-full flex items-center gap-4 px-5 py-4 rounded-xl border text-left transition-all
              ${area.disponible
                ? 'bg-[#161b22] border-[#30363d] hover:border-[#388bfd] hover:bg-[#1c2128] active:scale-[0.98]'
                : 'bg-[#0d1117] border-[#21262d] opacity-40 cursor-not-allowed'
              }`}
          >
            <div className="w-10 h-10 rounded-lg bg-[#21262d] flex items-center justify-center text-xl flex-shrink-0">
              {area.icono}
            </div>
            <div className="min-w-0">
              <p className="text-white font-medium text-sm font-sans">{area.nombre}</p>
              <p className="text-[#8b949e] text-xs mt-0.5 font-sans">{area.descripcion}</p>
            </div>
          </button>
        ))}
      </div>

      <DrawerPerfil
        controlador={controladorPerfil}
        abierto={perfilAbierto}
        onCerrar={() => setPerfilAbierto(false)}
        onVerArbol={onVerArbol}
      />
    </div>
  );
}
