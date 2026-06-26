import { useState } from 'react';
import { NIVELES } from '../../datos/niveles';
import { EJERCICIOS } from '../../datos/ejercicios';

export default function DrawerPerfil({ controlador, abierto, onCerrar }) {
  const [nombre, setNombre] = useState(controlador.nombre);
  const [confirmando, setConfirmando] = useState(false);
  const [version, setVersion] = useState(0);

  const resumen = controlador.resumenPorNivel(NIVELES, EJERCICIOS);

  const handleNombre = (e) => {
    setNombre(e.target.value);
    controlador.nombre = e.target.value;
  };

  const handleBorrar = () => {
    controlador.borrarAvance();
    setConfirmando(false);
    setVersion(v => v + 1);
  };

  return (
    <>
      {abierto && (
        <div className="fixed inset-0 bg-black/50 z-20" onClick={onCerrar} />
      )}

      <div className={`fixed top-0 right-0 h-full w-72 bg-[#161b22] border-l border-[#30363d] z-30 flex flex-col transition-transform duration-300 ease-in-out ${abierto ? 'translate-x-0' : 'translate-x-full'}`}>

        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#30363d] flex-shrink-0">
          <p className="text-[#e6edf3] text-sm font-medium font-sans">👤 Perfil</p>
          <button onClick={onCerrar} className="text-[#8b949e] hover:text-white transition-colors text-lg leading-none">×</button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-5 space-y-6">

          {/* Nombre */}
          <div>
            <p className="text-[#8b949e] text-xs mb-2 font-sans">Tu nombre</p>
            <input
              value={nombre}
              onChange={handleNombre}
              placeholder="Escribe tu nombre..."
              className="w-full bg-[#0d1117] border border-[#30363d] rounded px-3 py-2 text-[#e6edf3] text-sm font-sans focus:outline-none focus:border-[#388bfd]"
            />
          </div>

          {/* Progreso por nivel */}
          <div key={version}>
            <p className="text-[#8b949e] text-xs mb-3 font-sans">Mi avance</p>
            <div className="space-y-4">
              {resumen.map(({ nombre: nivel, completados, total }) => (
                <div key={nivel}>
                  <div className="flex justify-between items-center mb-1.5">
                    <p className="text-[#e6edf3] text-xs font-sans">{nivel}</p>
                    <p className="text-[#8b949e] text-xs font-sans">{completados}/{total}</p>
                  </div>
                  <div className="h-1.5 bg-[#21262d] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#238636] rounded-full transition-all duration-500"
                      style={{ width: total > 0 ? `${(completados / total) * 100}%` : '0%' }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Borrar avance */}
        <div className="px-4 py-4 border-t border-[#30363d] flex-shrink-0">
          {confirmando ? (
            <div className="space-y-2">
              <p className="text-[#f85149] text-xs font-sans">¿Borrar todo el avance? No se puede deshacer.</p>
              <div className="flex gap-2">
                <button
                  onClick={handleBorrar}
                  className="flex-1 py-1.5 bg-[#f85149] hover:bg-[#da3633] text-white text-xs rounded font-sans transition-colors"
                >
                  Confirmar
                </button>
                <button
                  onClick={() => setConfirmando(false)}
                  className="flex-1 py-1.5 border border-[#30363d] text-[#8b949e] hover:text-white text-xs rounded font-sans transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setConfirmando(true)}
              className="w-full py-2 border border-[#f85149]/40 text-[#f85149] hover:bg-[#f85149]/10 text-xs rounded font-sans transition-colors"
            >
              🗑️ Borrar todo el avance
            </button>
          )}
        </div>
      </div>
    </>
  );
}
