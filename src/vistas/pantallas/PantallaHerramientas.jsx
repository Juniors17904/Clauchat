import { GestorInstalacion } from '../../modelos/gestor_instalacion';
import { GestorSoftware } from '../../modelos/gestor_software';
import { PASOS_INSTALACION } from '../../datos/pasos_instalacion';
import { PROGRAMAS_SOFTWARE } from '../../datos/programas_software';

export default function PantallaHerramientas({ onVolver, onXstore, onSoftware }) {
  const totalXstore = PASOS_INSTALACION.length;
  const totalSoftware = PROGRAMAS_SOFTWARE.length;

  const herramientas = [
    {
      id: 'xstore',
      titulo: 'Instalación de Xstore',
      descripcion: 'Guía paso a paso para instalar la imagen y configurar Xstore.',
      icono: '🖥️',
      total: totalXstore,
      hechos: (caja) => new GestorInstalacion(caja).totalCompletados,
      abrir: onXstore,
    },
    {
      id: 'software',
      titulo: 'Software y aplicaciones',
      descripcion: 'Programas que se instalan después de configurar Xstore.',
      icono: '📦',
      total: totalSoftware,
      hechos: (caja) => new GestorSoftware(caja).totalCompletados,
      abrir: onSoftware,
    },
  ];

  const colorCaja = (caja) => (caja === 1 ? 'var(--acento)' : '#39c5cf');

  return (
    <div className="min-h-[100svh] flex flex-col select-none" style={{ backgroundColor: 'var(--fondo-base)', fontFamily: 'var(--fuente-sans)' }}>
      <div className="w-full max-w-sm mx-auto px-5 pt-5 pb-4">
        <button onClick={onVolver} className="flex items-center gap-2 text-sm mb-5 transition-colors" style={{ color: 'var(--texto-secundario)' }}>
          ← Volver
        </button>

        <h1 className="text-2xl font-bold mb-1" style={{ color: 'var(--texto-primario)' }}>Herramientas técnicas</h1>
        <p className="text-sm mb-6" style={{ color: 'var(--texto-secundario)' }}>Elegí primero la caja y después qué instalar</p>

        {/* Agrupado por caja: Caja 1 y Caja 2, cada una con sus dos herramientas */}
        {[1, 2].map(caja => {
          const color = colorCaja(caja);
          return (
            <div key={caja} className="mb-7">
              <div className="flex items-center gap-2 mb-3">
                <span className="w-1.5 h-5 rounded-full" style={{ backgroundColor: color }} />
                <h2 className="text-lg font-extrabold uppercase tracking-wide" style={{ color }}>Caja {caja}</h2>
              </div>

              <div className="space-y-3">
                {herramientas.map(t => {
                  const hechos = t.hechos(caja);
                  const porcentaje = t.total > 0 ? Math.round((hechos / t.total) * 100) : 0;
                  return (
                    <button
                      key={t.id}
                      onClick={() => t.abrir(caja)}
                      className="w-full rounded-2xl border p-4 text-left active:scale-[0.99] transition-all flex items-center gap-4"
                      style={{ backgroundColor: 'var(--fondo-panel)', borderColor: color }}
                    >
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0" style={{ backgroundColor: 'var(--fondo-elevado)' }}>
                        {t.icono}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <h3 className="text-base font-bold truncate" style={{ color: 'var(--texto-primario)' }}>{t.titulo}</h3>
                          <span className="text-[11px] font-mono flex-shrink-0" style={{ color: porcentaje === 100 ? 'var(--acento)' : 'var(--texto-tenue)' }}>{hechos}/{t.total}</span>
                        </div>
                        <p className="text-[11px] leading-snug mb-2" style={{ color: 'var(--texto-tenue)' }}>{t.descripcion}</p>
                        <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--fondo-elevado)' }}>
                          <div className="h-full rounded-full transition-all" style={{ width: `${porcentaje}%`, backgroundColor: color }} />
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
