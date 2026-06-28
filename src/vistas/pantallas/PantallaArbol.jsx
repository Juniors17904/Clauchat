import { useState } from 'react';
import { NIVELES } from '../../datos/niveles';
import { TEMAS } from '../../datos/temas';
import { EJERCICIOS } from '../../datos/ejercicios';

const COLORES_NIVEL = {
  1: 'text-[#3fb950]',
  2: 'text-[#39c5cf]',
  3: 'text-[#388bfd]',
  4: 'text-[#8250df]',
  5: 'text-[#d29922]',
  6: 'text-[#e3b341]',
  7: 'text-[#f78166]',
  8: 'text-[#f85149]',
};

export default function PantallaArbol({ onVolver }) {
  const [nivelAbierto, setNivelAbierto] = useState(null);
  const [temaAbierto, setTemaAbierto] = useState(null);

  const sqlNiveles = NIVELES.filter(n => n.areaId === 'bases-de-datos');
  const totalEjercicios = EJERCICIOS.length;
  const totalTemas = TEMAS.length;
  const temasConEjercicios = TEMAS.filter(t => EJERCICIOS.some(e => e.temaId === t.id)).length;

  return (
    <div className="min-h-[100svh] bg-[#0d1117] px-4 py-6">
      <div className="w-full max-w-sm mx-auto">
        <button
          onClick={onVolver}
          className="text-[#8b949e] hover:text-white text-sm mb-6 flex items-center gap-1 transition-colors"
        >
          ← Volver
        </button>

        <h2 className="text-xl font-bold text-white mb-1">Currículo SQL</h2>
        <p className="text-[#8b949e] text-xs mb-3">Estado del contenido por nivel y tema</p>

        <div className="flex gap-4 mb-6">
          <div className="bg-[#161b22] border border-[#30363d] rounded-lg px-3 py-2 text-center">
            <p className="text-[#3fb950] text-lg font-bold font-mono">{totalEjercicios}</p>
            <p className="text-[#8b949e] text-xs">ejercicios</p>
          </div>
          <div className="bg-[#161b22] border border-[#30363d] rounded-lg px-3 py-2 text-center">
            <p className="text-[#388bfd] text-lg font-bold font-mono">{temasConEjercicios}<span className="text-[#8b949e] text-sm">/{totalTemas}</span></p>
            <p className="text-[#8b949e] text-xs">temas activos</p>
          </div>
          <div className="bg-[#161b22] border border-[#30363d] rounded-lg px-3 py-2 text-center">
            <p className="text-[#8250df] text-lg font-bold font-mono">{sqlNiveles.length}</p>
            <p className="text-[#8b949e] text-xs">niveles</p>
          </div>
        </div>

        <div className="space-y-2">
          {sqlNiveles.map(nivel => {
            const temasDejNivel = TEMAS.filter(t => t.nivelId === nivel.id);
            const ejerciciosDeNivel = EJERCICIOS.filter(e => e.nivelId === nivel.id);
            const color = COLORES_NIVEL[nivel.orden];
            const abierto = nivelAbierto === nivel.id;

            return (
              <div key={nivel.id} className="border border-[#30363d] rounded-xl overflow-hidden">
                <button
                  onClick={() => {
                    setNivelAbierto(abierto ? null : nivel.id);
                    setTemaAbierto(null);
                  }}
                  className="w-full flex items-center justify-between px-4 py-3 bg-[#161b22] hover:bg-[#1c2128] transition-colors text-left"
                >
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-mono ${color}`}>{abierto ? '▼' : '▶'}</span>
                    <span className="text-white text-sm font-medium">{nivel.nombre}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[#8b949e] text-xs font-mono">
                    <span className={ejerciciosDeNivel.length > 0 ? 'text-[#3fb950]' : ''}>{ejerciciosDeNivel.length} ej.</span>
                    <span>·</span>
                    <span>{temasDejNivel.length} temas</span>
                  </div>
                </button>

                {abierto && (
                  <div className="border-t border-[#30363d]">
                    {temasDejNivel.map(tema => {
                      const ejerciciosDeTema = EJERCICIOS.filter(e => e.temaId === tema.id);
                      const temaExpandido = temaAbierto === tema.id;

                      return (
                        <div key={tema.id} className="border-b border-[#21262d] last:border-b-0">
                          <button
                            onClick={() => setTemaAbierto(temaExpandido ? null : tema.id)}
                            className="w-full flex items-center justify-between px-4 py-2.5 pl-7 bg-[#0d1117] hover:bg-[#161b22] transition-colors text-left"
                          >
                            <div className="flex items-center gap-2">
                              <span className="text-[#484f58] text-xs">{temaExpandido ? '▼' : '▶'}</span>
                              <span className="text-[#e6edf3] text-xs">{tema.nombre}</span>
                            </div>
                            <span className={`text-xs px-1.5 py-0.5 rounded font-mono ${
                              ejerciciosDeTema.length >= 5
                                ? 'bg-[#1a4731] text-[#3fb950]'
                                : ejerciciosDeTema.length > 0
                                  ? 'bg-[#3d2b00] text-[#d29922]'
                                  : 'bg-[#21262d] text-[#484f58]'
                            }`}>
                              {ejerciciosDeTema.length}
                            </span>
                          </button>

                          {temaExpandido && (
                            <div className="pl-11 pr-4 pb-2 pt-1 space-y-1 bg-[#0d1117]">
                              {ejerciciosDeTema.length === 0 ? (
                                <p className="text-[#484f58] text-xs py-1">Sin ejercicios aún</p>
                              ) : (
                                ejerciciosDeTema.map((ej, i) => (
                                  <div key={ej.id} className="flex items-start gap-2 py-0.5">
                                    <span className="text-[#484f58] text-xs font-mono mt-0.5 shrink-0">{String(i + 1).padStart(2, '0')}</span>
                                    <span className="text-[#8b949e] text-xs leading-relaxed">{ej.titulo}</span>
                                  </div>
                                ))
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
