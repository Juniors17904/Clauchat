import { useState, useRef } from 'react';
import { AREAS } from '../../datos/areas';
import DrawerPerfil from './DrawerPerfil';

const UMBRAL_PULL = 65;

export default function PantallaAreas({ onSeleccionar, controladorPerfil, onVerArbol, needRefresh, onActualizar }) {
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

      {/* Botón perfil — esquina superior derecha */}
      <div className={`flex justify-end px-5 ${needRefresh ? 'pt-12' : 'pt-10'}`}>
        <button
          onClick={() => setPerfilAbierto(true)}
          className="w-9 h-9 rounded-full bg-[#161b22] border border-[#30363d] flex items-center justify-center text-[#8b949e] hover:text-white hover:border-[#388bfd] transition-colors text-base"
          title="Ver perfil"
        >
          👤
        </button>
      </div>

      {/* Branding */}
      <div className="flex flex-col items-center justify-center flex-1 px-6 gap-10">
        <div className="text-center">
          <div className="text-5xl mb-4">🛢️</div>
          <h1 className="text-3xl font-bold text-white tracking-tight font-sans">SQLab</h1>
          <p className="text-[#8b949e] mt-1.5 text-sm font-sans">Elige un área de estudio</p>
        </div>

        {/* Tarjetas de áreas */}
        <div className="w-full max-w-sm space-y-3">
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
