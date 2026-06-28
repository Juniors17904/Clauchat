import { useState } from 'react';
import { AREAS } from '../../datos/areas';
import DrawerPerfil from './DrawerPerfil';

export default function PantallaAreas({ onSeleccionar, controladorPerfil, onVerArbol }) {
  const [perfilAbierto, setPerfilAbierto] = useState(false);

  return (
    <div className="min-h-screen bg-[#0d1117] flex flex-col items-center justify-center px-4">
      <div className="mb-10 text-center relative">
        <button
          onClick={() => setPerfilAbierto(true)}
          className="absolute -right-16 top-0 text-[#8b949e] hover:text-white transition-colors text-xl"
          title="Ver perfil"
        >
          👤
        </button>
        <h1 className="text-3xl font-bold text-white tracking-tight">Maestro Dev</h1>
        <p className="text-[#8b949e] mt-2 text-sm">Elige un área de estudio</p>
      </div>

      <DrawerPerfil
        controlador={controladorPerfil}
        abierto={perfilAbierto}
        onCerrar={() => setPerfilAbierto(false)}
        onVerArbol={onVerArbol}
      />

      <div className="w-full max-w-sm space-y-3">
        {AREAS.map(area => (
          <button
            key={area.id}
            onClick={() => area.disponible && onSeleccionar(area)}
            disabled={!area.disponible}
            className={`w-full flex items-center gap-4 px-5 py-4 rounded-xl border text-left transition-all
              ${area.disponible
                ? 'bg-[#161b22] border-[#30363d] hover:border-[#388bfd] hover:bg-[#1c2128] cursor-pointer'
                : 'bg-[#0d1117] border-[#21262d] opacity-40 cursor-not-allowed'
              }`}
          >
            <span className="text-2xl">{area.icono}</span>
            <div>
              <p className="text-white font-medium text-sm">{area.nombre}</p>
              <p className="text-[#8b949e] text-xs mt-0.5">{area.descripcion}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
