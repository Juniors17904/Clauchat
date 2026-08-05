import { TIENDAS } from '../../datos/tiendas';
import { GestorInstalacion } from '../../modelos/gestor_instalacion';
import { GestorSoftware } from '../../modelos/gestor_software';
import { RegistroCajas } from '../../modelos/registro_cajas';
import { PASOS_INSTALACION } from '../../datos/pasos_instalacion';
import { PROGRAMAS_SOFTWARE } from '../../datos/programas_software';

// Primera parada: en qué cadena se está trabajando. Cada una lleva sus propias cajas
// y su propio avance, porque se instala una tienda por día.
export default function PantallaTiendas({ onElegir, onVolver }) {
  const avanceDe = (tiendaId) => {
    const cajas = new RegistroCajas(tiendaId).lista;
    const total = cajas.length * (PASOS_INSTALACION.length + PROGRAMAS_SOFTWARE.length);
    const hechos = cajas.reduce((suma, caja) =>
      suma + new GestorInstalacion(caja, tiendaId).totalCompletados + new GestorSoftware(caja, tiendaId).totalCompletados, 0);
    return { cajas: cajas.length, hechos, total, porcentaje: total > 0 ? Math.round((hechos / total) * 100) : 0 };
  };

  return (
    <div className="min-h-[100svh] flex flex-col select-none" style={{ backgroundColor: 'var(--fondo-base)', fontFamily: 'var(--fuente-sans)' }}>
      <div className="w-full max-w-sm mx-auto px-5 pt-5 pb-4">
        <button onClick={onVolver} className="flex items-center gap-2 text-sm mb-5 transition-colors" style={{ color: 'var(--texto-secundario)' }}>
          ← Volver
        </button>

        <h1 className="text-2xl font-bold mb-1" style={{ color: 'var(--texto-primario)' }}>Herramientas técnicas</h1>
        <p className="text-sm mb-6" style={{ color: 'var(--texto-secundario)' }}>Elegí en qué tienda estás trabajando</p>

        <div className="space-y-3">
          {TIENDAS.map((tienda, indice) => {
            const avance = avanceDe(tienda.id);
            return (
              <button
                key={tienda.id}
                onClick={() => onElegir(tienda)}
                className="w-full rounded-2xl border p-5 text-left active:scale-[0.98] transition-all tarjeta-animada"
                style={{ backgroundColor: 'var(--fondo-panel)', borderColor: tienda.color, animationDelay: `${indice * 60}ms` }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-1.5 h-6 rounded-full flex-shrink-0" style={{ backgroundColor: tienda.color }} />
                  <h2 className="text-xl font-extrabold uppercase tracking-wide" style={{ color: tienda.color }}>{tienda.nombre}</h2>
                  <span className="ml-auto text-xs font-mono" style={{ color: 'var(--texto-tenue)' }}>{avance.cajas} cajas</span>
                </div>
                <p className="text-[11px] leading-snug mb-3" style={{ color: 'var(--texto-tenue)' }}>{tienda.descripcion}</p>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--fondo-elevado)' }}>
                    <div className="h-full rounded-full transition-all" style={{ width: `${avance.porcentaje}%`, backgroundColor: tienda.color }} />
                  </div>
                  <span className="text-xs font-mono" style={{ color: avance.porcentaje === 100 ? tienda.color : 'var(--texto-tenue)' }}>
                    {avance.hechos}/{avance.total}
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
