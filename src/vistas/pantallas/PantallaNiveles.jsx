import { NIVELES } from '../../datos/niveles';

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

export default function PantallaNiveles({ area, onSeleccionar, onVolver }) {
  const niveles = NIVELES.filter(n => n.areaId === area.id);

  return (
    <div className="min-h-[100svh] bg-[#0d1117] flex flex-col select-none">
      <div className="sticky top-0 bg-[#0d1117] border-b border-[#30363d] px-4 py-3 z-10">
        <button onClick={onVolver} className="text-[#8b949e] hover:text-white text-sm transition-colors">
          ← Volver
        </button>
      </div>

      <div className="w-full max-w-sm mx-auto px-4 py-6">
        <div className="mb-8">
          <p className="text-[#8b949e] text-xs mb-1 font-mono uppercase tracking-widest">Área</p>
          <h2 className="text-2xl font-bold text-white">{area.icono} {area.nombre}</h2>
        </div>

        <div className="space-y-2">
          {niveles.map(nivel => {
            const color = COLORES[nivel.orden];
            return (
              <button
                key={nivel.id}
                onClick={() => onSeleccionar(nivel)}
                className="w-full flex items-center gap-4 pr-4 pl-0 py-0 rounded-xl bg-[#161b22] border border-[#30363d] hover:border-[#30363d] hover:bg-[#1c2128] transition-all text-left overflow-hidden group"
              >
                {/* Borde izquierdo de color */}
                <div className="w-1 self-stretch flex-shrink-0 rounded-l-xl" style={{ backgroundColor: color }} />

                {/* Número grande */}
                <span
                  className="text-2xl font-bold font-mono w-8 flex-shrink-0 leading-none"
                  style={{ color }}
                >
                  {String(nivel.orden).padStart(2, '0')}
                </span>

                {/* Texto */}
                <div className="flex-1 min-w-0 py-4">
                  <p className="text-white font-medium text-sm">{nivel.nombre}</p>
                  <p className="text-[#8b949e] text-xs mt-0.5 truncate">{nivel.descripcion}</p>
                </div>

                {/* Flecha */}
                <span className="text-[#484f58] group-hover:text-[#8b949e] transition-colors text-base">›</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
