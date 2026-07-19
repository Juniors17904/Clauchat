import { GestorInstalacion } from '../../modelos/gestor_instalacion';
import { GestorSoftware } from '../../modelos/gestor_software';
import { PASOS_INSTALACION } from '../../datos/pasos_instalacion';
import { PROGRAMAS_SOFTWARE } from '../../datos/programas_software';

export default function PantallaHerramientas({ onVolver, onXstore, onSoftware }) {
  const totalXstore = PASOS_INSTALACION.length;
  const totalSoftware = PROGRAMAS_SOFTWARE.length;

  const tarjetas = [
    {
      id: 'xstore',
      titulo: 'Instalación de Xstore',
      descripcion: 'Guía paso a paso para instalar la imagen y configurar Xstore en la caja.',
      icono: '🖥️',
      total: totalXstore,
      hechos: (caja) => new GestorInstalacion(caja).totalCompletados,
      abrir: onXstore,
    },
    {
      id: 'software',
      titulo: 'Software y aplicaciones',
      descripcion: 'Programas y aplicaciones que se instalan después de configurar Xstore.',
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
        <p className="text-sm mb-6" style={{ color: 'var(--texto-secundario)' }}>Elegí qué instalar y en qué caja</p>

        <div className="space-y-4">
          {tarjetas.map((t, i) => (
            <div
              key={t.id}
              className="rounded-2xl border p-5 tarjeta-animada"
              style={{ backgroundColor: 'var(--fondo-panel)', borderColor: 'var(--borde)', animationDelay: `${i * 70}ms` }}
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0" style={{ backgroundColor: 'var(--fondo-elevado)' }}>
                  {t.icono}
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-base font-bold mb-1" style={{ color: 'var(--texto-primario)' }}>{t.titulo}</h2>
                  <p className="text-xs leading-relaxed" style={{ color: 'var(--texto-secundario)' }}>{t.descripcion}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {[1, 2].map(caja => {
                  const hechos = t.hechos(caja);
                  const porcentaje = t.total > 0 ? Math.round((hechos / t.total) * 100) : 0;
                  const color = colorCaja(caja);
                  return (
                    <button
                      key={caja}
                      onClick={() => t.abrir(caja)}
                      className="rounded-xl border p-3 text-left active:scale-[0.97] transition-all"
                      style={{ borderColor: color, backgroundColor: 'var(--fondo-base)' }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-semibold" style={{ color }}>Caja {caja}</span>
                        <span className="text-[11px] font-mono" style={{ color: porcentaje === 100 ? 'var(--acento)' : 'var(--texto-tenue)' }}>{hechos}/{t.total}</span>
                      </div>
                      <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--fondo-elevado)' }}>
                        <div className="h-full rounded-full transition-all" style={{ width: `${porcentaje}%`, backgroundColor: color }} />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
