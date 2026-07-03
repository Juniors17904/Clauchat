import { TEMAS } from '../../datos/temas';
import { EJERCICIOS } from '../../datos/ejercicios';

const MOTORES_INFO = [
  { id: 'pg', icono: '/iconos/postgresql.png', nombre: 'PostgreSQL' },
  { id: 'ss', icono: '/iconos/sql-server.png', nombre: 'SQL Server' },
  { id: 'my', icono: '/iconos/mysql.png', nombre: 'MySQL' },
  { id: 'or', icono: '/iconos/oracle.png', nombre: 'Oracle' },
];

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

export default function PantallaTemas({ nivel, onSeleccionar, onVolver, controladorPerfil }) {
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

        <div className="border border-[#30363d] rounded-xl overflow-hidden">
          {temas.map((tema, i) => {
            const ejerciciosDelTema = EJERCICIOS.filter(e => e.temaId === tema.id);
            const cantidad = ejerciciosDelTema.length;
            const disponible = cantidad > 0;
            const completados = controladorPerfil
              ? ejerciciosDelTema.filter(e => controladorPerfil.estaCompletado(e.id)).length
              : 0;
            const todoCompleto = disponible && completados === cantidad;
            const enProgreso = completados > 0 && !todoCompleto;

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
                {disponible ? (
                  todoCompleto ? (
                    <div className="w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center bg-[#3fb950]">
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <path d="M2.5 6L5 8.5L9.5 3.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  ) : enProgreso ? (
                    <div className="w-5 h-5 rounded-full flex-shrink-0 border-2 flex items-center justify-center" style={{ borderColor: color }}>
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
                    </div>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 20 20" className="flex-shrink-0" style={{ transform: 'rotate(-90deg)' }}>
                      <circle cx="10" cy="10" r="7.5" fill="none" stroke="#21262d" strokeWidth="2.5" />
                      <circle cx="10" cy="10" r="7.5" fill="none" stroke="#30363d" strokeWidth="2.5" strokeDasharray="47.12" strokeDashoffset="42" strokeLinecap="round" />
                    </svg>
                  )
                ) : (
                  <span className="text-[#484f58] text-xs flex-shrink-0">🔒</span>
                )}

                <div className="flex-1 min-w-0">
                  <p className={`font-medium text-sm ${disponible ? 'text-white' : 'text-[#484f58]'}`}>
                    {tema.nombre}
                  </p>
                  <p className="text-[#8b949e] text-xs mt-0.5 truncate">{tema.descripcion}</p>
                  <div className="flex gap-1 mt-1.5">
                    {(tema.motores ? MOTORES_INFO.filter(m => tema.motores.includes(m.id)) : MOTORES_INFO).map(m => (
                      <img key={m.id} src={m.icono} alt={m.nombre} title={m.nombre} className="w-4 h-4 rounded-full object-contain opacity-50" />
                    ))}
                  </div>
                </div>

                {disponible ? (
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <div className="text-right">
                      <span className="text-[#484f58] text-xs font-mono">{cantidad} ej.</span>
                      {enProgreso && (
                        <p className="text-xs font-mono mt-0.5" style={{ color }}>{completados}/{cantidad}</p>
                      )}
                    </div>
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
