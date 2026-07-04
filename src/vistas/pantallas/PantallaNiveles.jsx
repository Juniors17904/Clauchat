import { NIVELES } from '../../datos/niveles';
import { TEMAS } from '../../datos/temas';
import { EJERCICIOS } from '../../datos/ejercicios';

const ICONOS_MOTOR = {
  'postgresql': '/iconos/postgresql.png',
  'sql-server': '/iconos/sql-server.png',
  'mysql': '/iconos/mysql.png',
  'oracle': '/iconos/oracle.png',
};

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

export default function PantallaNiveles({ area, onSeleccionar, onVolver, controladorPerfil }) {
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
          <div className="flex items-center gap-3">
            {ICONOS_MOTOR[area.id] ? (
              <img src={ICONOS_MOTOR[area.id]} alt={area.nombre} className="w-10 h-10 object-contain" />
            ) : (
              <svg viewBox="0 0 24 24" fill="none" stroke="#388bfd" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
                <ellipse cx="12" cy="5" rx="9" ry="3" />
                <path d="M3 5v4c0 1.66 4 3 9 3s9-1.34 9-3V5" />
                <path d="M3 9v4c0 1.66 4 3 9 3s9-1.34 9-3V9" />
                <path d="M3 13v4c0 1.66 4 3 9 3s9-1.34 9-3v-4" />
              </svg>
            )}
            <h2 className="text-2xl font-bold text-white">{area.nombre}</h2>
          </div>
        </div>

        <div className="space-y-2">
          {niveles.map(nivel => {
            const color = COLORES[nivel.orden];
            const temasDelNivel = TEMAS.filter(t => t.nivelId === nivel.id);
            const ejerciciosDelNivel = EJERCICIOS.filter(e => e.nivelId === nivel.id);
            const totalEjercicios = ejerciciosDelNivel.length;
            const completados = controladorPerfil
              ? ejerciciosDelNivel.filter(e => controladorPerfil.estaCompletado(e.id)).length
              : 0;
            const porcentaje = totalEjercicios > 0 ? Math.round((completados / totalEjercicios) * 100) : 0;

            return (
              <button
                key={nivel.id}
                onClick={() => onSeleccionar(nivel)}
                className="w-full flex items-center gap-4 pr-4 pl-0 py-0 rounded-xl bg-[#161b22] border border-[#30363d] hover:border-[#30363d] hover:bg-[#1c2128] transition-all text-left overflow-hidden group"
              >
                <div className="w-1 self-stretch flex-shrink-0 rounded-l-xl" style={{ backgroundColor: color }} />

                <span
                  className="text-2xl font-bold font-mono w-8 flex-shrink-0 leading-none"
                  style={{ color }}
                >
                  {String(nivel.orden).padStart(2, '0')}
                </span>

                <div className="flex-1 min-w-0 py-4">
                  <p className="text-white font-medium text-sm">{nivel.nombre}</p>
                  <p className="text-[#8b949e] text-xs mt-0.5 truncate">{nivel.descripcion}</p>
                  <div className="flex items-center gap-3 mt-2 text-xs text-[#484f58] font-mono">
                    <span>{temasDelNivel.length} temas</span>
                    <span>·</span>
                    <span>{totalEjercicios} ejercicios</span>
                    {completados > 0 && (
                      <>
                        <span>·</span>
                        <span style={{ color }}>{completados}/{totalEjercicios}</span>
                      </>
                    )}
                  </div>
                  {completados > 0 && (
                    <div className="w-full h-1 bg-[#21262d] rounded-full mt-2 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{ width: `${porcentaje}%`, backgroundColor: color }}
                      />
                    </div>
                  )}
                </div>

                <span className="text-[#484f58] group-hover:text-[#8b949e] transition-colors text-base">›</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
