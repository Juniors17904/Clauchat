import { GestorInstalacion } from '../../modelos/gestor_instalacion';
import { GestorSoftware } from '../../modelos/gestor_software';
import { PASOS_INSTALACION } from '../../datos/pasos_instalacion';
import { PROGRAMAS_SOFTWARE } from '../../datos/programas_software';

export default function PantallaHerramientas({ onVolver, onXstore, onSoftware }) {
  const totalXstore = PASOS_INSTALACION.length;
  const hechosCaja1 = new GestorInstalacion(1).totalCompletados;
  const hechosCaja2 = new GestorInstalacion(2).totalCompletados;
  const totalSoftware = PROGRAMAS_SOFTWARE.length;
  const hechosSoftware = new GestorSoftware().totalCompletados;

  const opciones = [
    {
      id: 'xstore-1',
      numero: '1',
      titulo: 'Instalación Xstore · Caja 1',
      descripcion: 'Checklist completo para la caja 1 (incluye los pasos exclusivos de caja 1).',
      icono: '🖥️',
      color: 'var(--acento)',
      hechos: hechosCaja1,
      total: totalXstore,
      onClick: () => onXstore(1),
    },
    {
      id: 'xstore-2',
      numero: '2',
      titulo: 'Instalación Xstore · Caja 2',
      descripcion: 'Checklist para la caja 2, con su propio avance independiente.',
      icono: '🖥️',
      color: '#39c5cf',
      hechos: hechosCaja2,
      total: totalXstore,
      onClick: () => onXstore(2),
    },
    {
      id: 'software',
      numero: '3',
      titulo: 'Instalación de software y aplicaciones',
      descripcion: 'Programas y aplicaciones que se instalan después de configurar Xstore.',
      icono: '📦',
      color: '#8250df',
      hechos: hechosSoftware,
      total: totalSoftware,
      onClick: onSoftware,
    },
  ];

  return (
    <div className="min-h-[100svh] flex flex-col select-none" style={{ backgroundColor: 'var(--fondo-base)', fontFamily: 'var(--fuente-sans)' }}>
      <div className="w-full max-w-sm mx-auto px-5 pt-5 pb-4">
        <button onClick={onVolver} className="flex items-center gap-2 text-sm mb-5 transition-colors" style={{ color: 'var(--texto-secundario)' }}>
          ← Volver
        </button>

        <h1 className="text-2xl font-bold mb-1" style={{ color: 'var(--texto-primario)' }}>Herramientas técnicas</h1>
        <p className="text-sm mb-6" style={{ color: 'var(--texto-secundario)' }}>Elegí qué querés instalar</p>

        <div className="space-y-4">
          {opciones.map((op, i) => {
            const porcentaje = op.total > 0 ? Math.round((op.hechos / op.total) * 100) : 0;
            return (
              <button
                key={op.id}
                onClick={op.onClick}
                className="w-full text-left rounded-2xl border p-5 active:scale-[0.98] transition-all tarjeta-animada"
                style={{ backgroundColor: 'var(--fondo-panel)', borderColor: 'var(--borde)', animationDelay: `${i * 70}ms` }}
              >
                <div className="flex items-start gap-4 mb-3">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0" style={{ backgroundColor: 'var(--fondo-elevado)' }}>
                    {op.icono}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-mono" style={{ color: op.color }}>{op.numero}.</span>
                      <h2 className="text-base font-bold" style={{ color: 'var(--texto-primario)' }}>{op.titulo}</h2>
                    </div>
                    <p className="text-xs leading-relaxed" style={{ color: 'var(--texto-secundario)' }}>{op.descripcion}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--fondo-elevado)' }}>
                    <div className="h-full rounded-full transition-all" style={{ width: `${porcentaje}%`, backgroundColor: op.color }} />
                  </div>
                  <span className="text-xs font-mono flex-shrink-0" style={{ color: porcentaje === 100 ? 'var(--acento)' : 'var(--texto-tenue)' }}>
                    {op.hechos}/{op.total}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
