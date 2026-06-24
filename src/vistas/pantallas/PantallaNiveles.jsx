import { NIVELES } from '../../datos/niveles';

const COLORES = {
  1: { borde: 'hover:border-[#3fb950]', etiqueta: 'bg-[#1a4731] text-[#3fb950]' },
  2: { borde: 'hover:border-[#d29922]', etiqueta: 'bg-[#3d2b00] text-[#d29922]' },
  3: { borde: 'hover:border-[#f85149]', etiqueta: 'bg-[#3d0e0e] text-[#f85149]' },
};

export default function PantallaNiveles({ area, onSeleccionar, onVolver }) {
  const niveles = NIVELES.filter(n => n.areaId === area.id);

  return (
    <div className="min-h-screen bg-[#0d1117] flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <button onClick={onVolver} className="text-[#8b949e] hover:text-white text-sm mb-8 flex items-center gap-1 transition-colors">
          ← Volver
        </button>

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
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${colores.etiqueta}`}>
                  {nivel.orden === 1 ? 'Nivel 1' : nivel.orden === 2 ? 'Nivel 2' : 'Nivel 3'}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
