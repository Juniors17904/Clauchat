import { TEMAS } from '../../datos/temas';
import { EJERCICIOS } from '../../datos/ejercicios';

const COLORES = {
  1: '#3fb950',
  2: '#39c5cf',
  3: '#388bfd',
  4: '#8250df',
  5: '#d29922',
  6: '#e3b341',
  7: '#f78166',
  8: '#f85149',
};

export default function PantallaTemas({ nivel, onSeleccionar, onVolver }) {
  const temas = TEMAS.filter(t => t.nivelId === nivel.id).sort((a, b) => a.orden - b.orden);
  const color = COLORES[nivel.orden];

  return (
    <div className="min-h-[100svh] bg-[#0d1117] flex flex-col select-none">
      <div className="sticky top-0 bg-[#0d1117] border-b border-[#30363d] px-4 py-3 z-10">
        <button onClick={onVolver} className="text-[#8b949e] hover:text-white text-sm transition-colors">
          ← Volver
        </button>
      </div>

      <div className="w-full max-w-sm mx-auto px-4 py-6">
        <div className="mb-8">
          <p className="text-xs font-mono uppercase tracking-widest mb-1" style={{ color }}>
            Nivel {nivel.orden}
          </p>
          <h2 className="text-2xl font-bold text-white">{nivel.nombre}</h2>
        </div>

        {/* Lista de temas */}
        <div className="border border-[#30363d] rounded-xl overflow-hidden">
          {temas.map((tema, i) => {
            const cantidad = EJERCICIOS.filter(e => e.temaId === tema.id).length;
            const disponible = cantidad > 0;

            return (
              <button
                key={tema.id}
                onClick={() => disponible && onSeleccionar(tema)}
                disabled={!disponible}
                className={`w-full flex items-center gap-4 px-4 py-3.5 text-left transition-all
                  ${i > 0 ? 'border-t border-[#21262d]' : ''}
                  ${disponible
                    ? 'bg-[#161b22] hover:bg-[#1c2128] group cursor-pointer'
                    : 'bg-[#0d1117] cursor-not-allowed'
                  }`}
              >
                {/* Punto de color o candado */}
                {disponible ? (
                  <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
                ) : (
                  <span className="text-[#484f58] text-xs flex-shrink-0">🔒</span>
                )}

                {/* Nombre y descripción */}
                <div className="flex-1 min-w-0">
                  <p className={`font-medium text-sm ${disponible ? 'text-white' : 'text-[#484f58]'}`}>
                    {tema.nombre}
                  </p>
                  <p className="text-[#8b949e] text-xs mt-0.5 truncate">{tema.descripcion}</p>
                </div>

                {/* Contador o indicador */}
                {disponible ? (
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-[#484f58] text-xs font-mono">{cantidad} ej.</span>
                    <span className="text-[#484f58] group-hover:text-[#8b949e] transition-colors">›</span>
                  </div>
                ) : (
                  <span className="text-[#484f58] text-xs font-mono">Próximo</span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
