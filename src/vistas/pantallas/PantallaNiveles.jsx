import { NIVELES } from '../../datos/niveles';

const COLORES = {
  1: { borde: 'hover:border-[#3fb950]', etiqueta: 'bg-[#1a4731] text-[#3fb950]' },
  2: { borde: 'hover:border-[#39c5cf]', etiqueta: 'bg-[#0e3535] text-[#39c5cf]' },
  3: { borde: 'hover:border-[#388bfd]', etiqueta: 'bg-[#0d2a5a] text-[#388bfd]' },
  4: { borde: 'hover:border-[#8250df]', etiqueta: 'bg-[#2a1a4a] text-[#8250df]' },
  5: { borde: 'hover:border-[#d29922]', etiqueta: 'bg-[#3d2b00] text-[#d29922]' },
  6: { borde: 'hover:border-[#e3b341]', etiqueta: 'bg-[#3a2500] text-[#e3b341]' },
  7: { borde: 'hover:border-[#f78166]', etiqueta: 'bg-[#3d1a10] text-[#f78166]' },
  8: { borde: 'hover:border-[#f85149]', etiqueta: 'bg-[#3d0e0e] text-[#f85149]' },
};

export default function PantallaNiveles({ area, onSeleccionar, onVolver }) {
  const niveles = NIVELES.filter(n => n.areaId === area.id);

  return (
    <div className="min-h-[100svh] bg-[#0d1117] flex flex-col">
      <div className="sticky top-0 bg-[#0d1117] border-b border-[#30363d] px-4 py-3 z-10">
        <button onClick={onVolver} className="text-[#8b949e] hover:text-white text-sm transition-colors">
          ← Volver
        </button>
      </div>
      <div className="w-full max-w-sm mx-auto px-4 py-6">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white">{area.icono} {area.nombre}</h2>
          <p className="text-[#8b949e] text-sm mt-1">Selecciona un nivel</p>
        </div>

        <div className="space-y-3">
          {niveles.map(nivel => {
            const colores = COLORES[nivel.orden];
            return (
              <button
                key={nivel.id}
                onClick={() => onSeleccionar(nivel)}
                className={`w-full flex items-center justify-between px-5 py-4 rounded-xl border bg-[#161b22] border-[#30363d] ${colores.borde} transition-all text-left`}
              >
                <div>
                  <p className="text-white font-medium text-sm">{nivel.nombre}</p>
                  <p className="text-[#8b949e] text-xs mt-0.5">{nivel.descripcion}</p>
                </div>
                <span className={`w-10 h-10 rounded-full font-bold text-sm flex items-center justify-center flex-shrink-0 ${colores.etiqueta}`}>
                  {nivel.orden}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
