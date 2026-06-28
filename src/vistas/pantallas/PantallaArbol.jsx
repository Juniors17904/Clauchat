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
  const [copiado, setCopiado] = useState(false);

  const sqlNiveles = NIVELES.filter(n => n.areaId === 'bases-de-datos');
  const totalEjercicios = EJERCICIOS.length;
  const totalTemas = TEMAS.length;
  const temasConEjercicios = TEMAS.filter(t => EJERCICIOS.some(e => e.temaId === t.id)).length;

  const copiarTodo = () => {
    const lineas = [];
    lineas.push('CURRÍCULO SQL');
    lineas.push(`${totalEjercicios} ejercicios · ${temasConEjercicios}/${totalTemas} temas · ${sqlNiveles.length} niveles`);

    sqlNiveles.forEach(nivel => {
      const temasDejNivel = TEMAS.filter(t => t.nivelId === nivel.id);
      const ejerciciosDeNivel = EJERCICIOS.filter(e => e.nivelId === nivel.id);
      lineas.push('');
      lineas.push('─'.repeat(44));
      lineas.push(`${nivel.nombre}  (${ejerciciosDeNivel.length} ej. · ${temasDejNivel.length} temas)`);

      temasDejNivel.forEach(tema => {
        const ejerciciosDeTema = EJERCICIOS.filter(e => e.temaId === tema.id);
        lineas.push('');
        lineas.push(`  ▸ ${tema.nombre}  (${ejerciciosDeTema.length} ej.)`);
        ejerciciosDeTema.forEach((ej, i) => {
          lineas.push(`    ${String(i + 1).padStart(2, '0')}. ${ej.titulo}`);
          if (ej.consultaEsperada) lineas.push(`        ${ej.consultaEsperada}`);
        });
      });
    });

    navigator.clipboard.writeText(lineas.join('\n'));
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  };

  return (
    <div className="min-h-[100svh] bg-[#0d1117] flex flex-col select-none">
      <div className="sticky top-0 bg-[#0d1117] border-b border-[#30363d] px-4 py-3 z-10 flex items-center justify-between">
        <button onClick={onVolver} className="text-[#8b949e] hover:text-white text-sm transition-colors">
          ← Volver
        </button>
        <button
          onClick={copiarTodo}
          className={`text-xs font-mono transition-colors flex items-center gap-1.5 ${copiado ? 'text-[#3fb950]' : 'text-[#8b949e] hover:text-white'}`}
        >
          {copiado ? '✓ Copiado' : '⎘ Copiar todo'}
        </button>
      </div>
      <div className="w-full max-w-sm mx-auto px-4 py-6">
        <h2 className="text-xl font-bold text-white mb-1">Currículo SQL</h2>
        <p className="text-[#8b949e] text-xs mb-3">Estado del contenido por nivel y tema</p>

        <div className="flex gap-2 mb-6">
          <div className="flex-1 bg-[#161b22] border border-[#30363d] rounded-lg px-3 py-2 text-center">
            <p className="text-[#3fb950] text-lg font-bold font-mono">{totalEjercicios}</p>
            <p className="text-[#8b949e] text-xs">ejercicios</p>
          </div>
          <div className="flex-1 bg-[#161b22] border border-[#30363d] rounded-lg px-3 py-2 text-center">
            <p className="text-[#388bfd] text-lg font-bold font-mono">{temasConEjercicios}<span className="text-[#484f58] text-sm">/{totalTemas}</span></p>
            <p className="text-[#8b949e] text-xs">temas activos</p>
          </div>
          <div className="flex-1 bg-[#161b22] border border-[#30363d] rounded-lg px-3 py-2 text-center">
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
                    <span className={`text-sm ${color}`}>{abierto ? '▾' : '▸'}</span>
                    <span className="text-white text-sm font-medium">{nivel.nombre}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[#484f58] text-xs font-mono">
                    <span className={ejerciciosDeNivel.length > 0 ? color : ''}>{ejerciciosDeNivel.length} ej.</span>
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
                              <span className="text-[#8b949e] text-sm">{temaExpandido ? '▾' : '▸'}</span>
                              <span className="text-[#e6edf3] text-xs">{tema.nombre}</span>
                            </div>
                            <span className="text-[#484f58] text-xs font-mono shrink-0">
                              {ejerciciosDeTema.length} ej.
                            </span>
                          </button>

                          {temaExpandido && (
                            <div className="pl-11 pr-4 pb-2 pt-1 space-y-1 bg-[#0d1117]">
                              {ejerciciosDeTema.length === 0 ? (
                                <p className="text-[#484f58] text-xs py-1">Sin ejercicios aún</p>
                              ) : (
                                ejerciciosDeTema.map((ej, i) => (
                                  <div key={ej.id} className="py-1.5 border-b border-[#21262d] last:border-b-0">
                                    <div className="flex items-center gap-2">
                                      <span className="text-[#484f58] text-xs font-mono shrink-0">{String(i + 1).padStart(2, '0')}</span>
                                      <span className="text-[#c9d1d9] text-xs">{ej.titulo}</span>
                                    </div>
                                    {ej.consultaEsperada && (
                                      <code className="block mt-1 ml-6 text-[#79c0ff] text-xs font-mono truncate">
                                        {ej.consultaEsperada}
                                      </code>
                                    )}
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
