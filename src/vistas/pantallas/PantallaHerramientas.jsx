import { useRef, useState } from 'react';
import { GestorInstalacion } from '../../modelos/gestor_instalacion';
import { GestorSoftware } from '../../modelos/gestor_software';
import { RegistroCajas } from '../../modelos/registro_cajas';
import { PASOS_INSTALACION } from '../../datos/pasos_instalacion';
import { PROGRAMAS_SOFTWARE } from '../../datos/programas_software';

export default function PantallaHerramientas({ tienda, onVolver, onXstore, onSoftware }) {
  const totalXstore = PASOS_INSTALACION.length;
  const totalSoftware = PROGRAMAS_SOFTWARE.length;
  const [confirmandoBorrado, setConfirmandoBorrado] = useState(false);
  const [, setVersion] = useState(0);
  const registro = useRef(new RegistroCajas(tienda.id));
  const [cajas, setCajas] = useState(registro.current.lista);
  const [confirmandoQuitar, setConfirmandoQuitar] = useState(false);

  const agregarCaja = () => {
    registro.current.agregar();
    setCajas(registro.current.lista);
  };

  const quitarUltimaCaja = () => {
    registro.current.quitarUltima();
    setCajas(registro.current.lista);
    setConfirmandoQuitar(false);
  };

  // Borra TODO el avance: Xstore y Software, de todas las cajas, con sus datos y fotos
  const borrarTodo = () => {
    for (const caja of registro.current.lista) {
      new GestorInstalacion(caja, tienda.id).reiniciar();
      new GestorSoftware(caja, tienda.id).reiniciar();
    }
    setConfirmandoBorrado(false);
    setVersion(v => v + 1);
  };

  const herramientas = [
    {
      id: 'xstore',
      titulo: 'Instalación de Xstore',
      descripcion: 'Guía paso a paso para instalar la imagen y configurar Xstore.',
      icono: '🖥️',
      total: totalXstore,
      hechos: (caja) => new GestorInstalacion(caja, tienda.id).totalCompletados,
      abrir: onXstore,
    },
    {
      id: 'software',
      titulo: 'Software y aplicaciones',
      descripcion: 'Programas que se instalan después de configurar Xstore.',
      icono: '📦',
      total: totalSoftware,
      hechos: (caja) => new GestorSoftware(caja, tienda.id).totalCompletados,
      abrir: onSoftware,
    },
  ];

  const COLORES_CAJA = ['var(--acento)', '#39c5cf', '#d29922', '#8250df', '#f78166', '#3fb950'];
  const colorCaja = (caja) => COLORES_CAJA[(caja - 1) % COLORES_CAJA.length];

  return (
    <div className="min-h-[100svh] flex flex-col select-none" style={{ backgroundColor: 'var(--fondo-base)', fontFamily: 'var(--fuente-sans)' }}>
      <div className="w-full max-w-sm mx-auto px-5 pt-5 pb-4">
        <button onClick={onVolver} className="flex items-center gap-2 text-sm mb-5 transition-colors" style={{ color: 'var(--texto-secundario)' }}>
          ← Volver
        </button>

        <h1 className="text-2xl font-bold mb-1" style={{ color: tienda.color }}>{tienda.nombre}</h1>
        <p className="text-sm mb-6" style={{ color: 'var(--texto-secundario)' }}>Elegí la caja y después qué instalar</p>

        {/* Una tarjeta por caja. Dentro, las dos herramientas */}
        <div className="grid grid-cols-2 gap-3">
          {[...cajas].reverse().map(caja => {
            const color = colorCaja(caja);
            return (
              <div key={caja} className="rounded-2xl border p-4 flex flex-col" style={{ backgroundColor: 'var(--fondo-panel)', borderColor: color }}>
                <div className="flex items-center gap-2 mb-4">
                  <span className="w-1.5 h-5 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
                  <h2 className="text-lg font-extrabold uppercase tracking-wide" style={{ color }}>Caja {caja}</h2>
                </div>

                <div className="flex flex-col gap-4">
                  {herramientas.map(t => {
                    const hechos = t.hechos(caja);
                    const porcentaje = t.total > 0 ? Math.round((hechos / t.total) * 100) : 0;
                    return (
                      <button
                        key={t.id}
                        onClick={() => t.abrir(caja)}
                        className="w-full text-center rounded-xl p-4 flex flex-col items-center active:scale-[0.98] transition-all"
                        style={{ backgroundColor: 'var(--fondo-base)', minHeight: 210 }}
                      >
                        <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mb-3" style={{ backgroundColor: 'var(--fondo-elevado)' }}>
                          {t.icono}
                        </div>
                        <h3 className="text-sm font-bold leading-snug mb-1.5" style={{ color: 'var(--texto-primario)' }}>{t.titulo}</h3>
                        <p className="text-[11px] leading-snug mb-3" style={{ color: 'var(--texto-tenue)' }}>{t.descripcion}</p>
                        <div className="w-full mt-auto">
                          <span className="block text-xs font-mono mb-1.5" style={{ color: porcentaje === 100 ? 'var(--acento)' : 'var(--texto-tenue)' }}>{hechos}/{t.total}</span>
                          <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--fondo-elevado)' }}>
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

        {/* Agregar o quitar cajas: hay tiendas con tres o más */}
        <div className="flex gap-2 mt-3">
          {registro.current.puedeAgregar && (
            <button
              onClick={agregarCaja}
              className="flex-1 py-3 border border-dashed rounded-xl text-sm font-medium transition-colors"
              style={{ borderColor: 'var(--borde)', color: 'var(--texto-secundario)' }}
            >
              + Agregar caja
            </button>
          )}
          {registro.current.puedeQuitar && (
            <button
              onClick={() => setConfirmandoQuitar(true)}
              className="px-4 py-3 border rounded-xl text-sm transition-colors"
              style={{ borderColor: 'var(--borde)', color: 'var(--texto-tenue)' }}
            >
              Quitar caja {cajas.length}
            </button>
          )}
        </div>

        {confirmandoQuitar && (
          <div className="space-y-3 mt-2 rounded-xl border p-4" style={{ borderColor: 'var(--error)', backgroundColor: 'color-mix(in srgb, var(--error) 8%, transparent)' }}>
            <p className="text-sm font-semibold" style={{ color: 'var(--error)' }}>¿Quitar la caja {cajas.length}?</p>
            <p className="text-xs" style={{ color: 'var(--texto-secundario)' }}>Se borra su avance con sus datos y fotos. Las demás cajas no se tocan.</p>
            <div className="flex gap-2">
              <button onClick={quitarUltimaCaja} className="flex-1 py-2.5 text-sm font-semibold rounded-xl transition-colors" style={{ backgroundColor: 'var(--error)', color: '#fff' }}>
                Sí, quitar
              </button>
              <button onClick={() => setConfirmandoQuitar(false)} className="flex-1 py-2.5 border text-sm rounded-xl transition-colors" style={{ borderColor: 'var(--borde)', color: 'var(--texto-secundario)' }}>
                Cancelar
              </button>
            </div>
          </div>
        )}

        {/* Borrar todo el avance */}
        {confirmandoBorrado ? (
          <div className="space-y-3 mt-2 rounded-xl border p-4" style={{ borderColor: 'var(--error)', backgroundColor: 'color-mix(in srgb, var(--error) 8%, transparent)' }}>
            <p className="text-sm font-semibold" style={{ color: 'var(--error)' }}>¿Borrar TODO el avance?</p>
            <p className="text-xs" style={{ color: 'var(--texto-secundario)' }}>Se desmarcarán todos los pasos y programas de todas las cajas, y se borrarán los datos y fotos guardados. No se puede deshacer.</p>
            <div className="flex gap-2">
              <button onClick={borrarTodo} className="flex-1 py-2.5 text-sm font-semibold rounded-xl transition-colors" style={{ backgroundColor: 'var(--error)', color: '#fff' }}>
                Sí, borrar todo
              </button>
              <button onClick={() => setConfirmandoBorrado(false)} className="flex-1 py-2.5 border text-sm rounded-xl transition-colors" style={{ borderColor: 'var(--borde)', color: 'var(--texto-secundario)' }}>
                Cancelar
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setConfirmandoBorrado(true)}
            className="w-full mt-2 py-3 border text-sm font-medium rounded-xl transition-colors"
            style={{ borderColor: 'color-mix(in srgb, var(--error) 40%, transparent)', color: 'var(--error)' }}
          >
            🗑 Borrar todo el avance
          </button>
        )}
      </div>
    </div>
  );
}
