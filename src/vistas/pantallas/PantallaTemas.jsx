import { TEMAS } from '../../datos/temas';
import { EJERCICIOS } from '../../datos/ejercicios';

const COLORES = {
  1: { borde: 'hover:border-[#3fb950]', cuenta: 'bg-[#1a4731] text-[#3fb950]', cuentaVacia: 'bg-[#21262d] text-[#484f58]' },
  2: { borde: 'hover:border-[#39c5cf]', cuenta: 'bg-[#0e3535] text-[#39c5cf]', cuentaVacia: 'bg-[#21262d] text-[#484f58]' },
  3: { borde: 'hover:border-[#388bfd]', cuenta: 'bg-[#0d2a5a] text-[#388bfd]', cuentaVacia: 'bg-[#21262d] text-[#484f58]' },
  4: { borde: 'hover:border-[#8250df]', cuenta: 'bg-[#2a1a4a] text-[#8250df]', cuentaVacia: 'bg-[#21262d] text-[#484f58]' },
  5: { borde: 'hover:border-[#d29922]', cuenta: 'bg-[#3d2b00] text-[#d29922]', cuentaVacia: 'bg-[#21262d] text-[#484f58]' },
  6: { borde: 'hover:border-[#e3b341]', cuenta: 'bg-[#3a2500] text-[#e3b341]', cuentaVacia: 'bg-[#21262d] text-[#484f58]' },
  7: { borde: 'hover:border-[#f78166]', cuenta: 'bg-[#3d1a10] text-[#f78166]', cuentaVacia: 'bg-[#21262d] text-[#484f58]' },
  8: { borde: 'hover:border-[#f85149]', cuenta: 'bg-[#3d0e0e] text-[#f85149]', cuentaVacia: 'bg-[#21262d] text-[#484f58]' },
};

export default function PantallaTemas({ nivel, onSeleccionar, onVolver }) {
  const temas = TEMAS.filter(t => t.nivelId === nivel.id).sort((a, b) => a.orden - b.orden);
  const colores = COLORES[nivel.orden];

  return (
    <div className="min-h-[100svh] bg-[#0d1117] flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <button
          onClick={onVolver}
          className="text-[#8b949e] hover:text-white text-sm mb-8 flex items-center gap-1 transition-colors"
        >
          ← Volver
        </button>

        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white">{nivel.nombre}</h2>
          <p className="text-[#8b949e] text-sm mt-1">Selecciona un tema</p>
        </div>

        <div className="space-y-3">
          {temas.map(tema => {
            const cantidad = EJERCICIOS.filter(e => e.temaId === tema.id).length;
            const disponible = cantidad > 0;

            return (
              <button
                key={tema.id}
                onClick={() => disponible && onSeleccionar(tema)}
                disabled={!disponible}
                className={`w-full flex items-center justify-between px-5 py-4 rounded-xl border text-left transition-all
                  ${disponible
                    ? `bg-[#161b22] border-[#30363d] ${colores.borde} cursor-pointer`
                    : 'bg-[#0d1117] border-[#21262d] opacity-40 cursor-not-allowed'
                  }`}
              >
                <div>
                  <p className="text-white font-medium text-sm">{tema.nombre}</p>
                  <p className="text-[#8b949e] text-xs mt-0.5">{tema.descripcion}</p>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium shrink-0 ml-3 ${disponible ? colores.cuenta : colores.cuentaVacia}`}>
                  {cantidad} ej.
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
