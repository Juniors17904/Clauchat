import { useRef, useEffect, useState } from 'react';
import PantallaInstalacion from './PantallaInstalacion';
import PantallaSoftware from './PantallaSoftware';
import { GestorInstalacion } from '../../modelos/gestor_instalacion';
import { GestorSoftware } from '../../modelos/gestor_software';

// Pantalla única por caja: Instalación Xstore + Software en una sola lista continua.
// Cada parte tiene su título y un leve cambio de fondo para diferenciarlas.
export default function PantallaCaja({ caja = 1, seccionInicial = 'xstore', onVolver, onCambiarCaja }) {
  const refSoftware = useRef(null);
  const color = caja === 1 ? 'var(--acento)' : '#39c5cf';
  // Solo una sección resalta su último punto a la vez (la última donde se trabajó)
  const [seccionActiva, setSeccionActiva] = useState(seccionInicial);
  const [confirmandoReinicio, setConfirmandoReinicio] = useState(false);
  // Cambia al reiniciar para volver a armar las dos secciones ya vacías
  const [versionCaja, setVersionCaja] = useState(0);

  // Un solo reinicio por caja: borra los pasos de Xstore (con sus datos y fotos) y los programas
  const reiniciarCaja = () => {
    new GestorInstalacion(caja).reiniciar();
    new GestorSoftware(caja).reiniciar();
    setConfirmandoReinicio(false);
    setVersionCaja(v => v + 1);
    window.scrollTo(0, 0);
  };

  const irASoftware = () => refSoftware.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });

  // Al entrar, si se tocó "Software", bajar directo a esa sección; si no, arrancar desde arriba
  useEffect(() => {
    if (seccionInicial === 'software') {
      setTimeout(() => refSoftware.current?.scrollIntoView({ behavior: 'auto', block: 'start' }), 220);
    } else {
      window.scrollTo(0, 0);
    }
  }, [seccionInicial]);

  const Titulo = ({ texto }) => (
    <div className="w-full max-w-sm mx-auto px-5 pt-4 pb-1 flex items-center gap-2">
      <span className="w-1.5 h-5 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
      <h2 className="text-base font-extrabold uppercase tracking-wide" style={{ color }}>{texto}</h2>
    </div>
  );

  return (
    <div className="min-h-[100svh] select-none" style={{ backgroundColor: 'var(--fondo-base)', fontFamily: 'var(--fuente-sans)' }}>
      {/* Header */}
      <div className="sticky top-0 z-10 border-b" style={{ backgroundColor: 'var(--fondo-base)', borderColor: 'var(--borde)' }}>
        <div className="w-full max-w-sm mx-auto px-5 pt-4 pb-3">
          <button onClick={onVolver} className="flex items-center gap-2 text-sm mb-2 transition-colors" style={{ color: 'var(--texto-secundario)' }}>
            ← Volver
          </button>
          <div className="flex items-center justify-between">
            <h1 className="text-lg font-bold" style={{ color }}>Caja {caja}</h1>
            {onCambiarCaja && (
              <div className="flex gap-1.5">
                {[1, 2].map(n => (
                  <button
                    key={n}
                    onClick={() => n !== caja && onCambiarCaja(n, seccionActiva)}
                    className="px-2.5 py-1 rounded-full text-xs font-medium transition-colors"
                    style={{
                      backgroundColor: n === caja ? 'var(--acento)' : 'var(--fondo-panel)',
                      color: n === caja ? '#fff' : 'var(--texto-secundario)',
                      border: `1px solid ${n === caja ? 'var(--acento)' : 'var(--borde)'}`
                    }}
                  >
                    Caja {n}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Sección Instalación Xstore */}
      <div style={{ backgroundColor: 'var(--fondo-base)' }}>
        <Titulo texto="Instalación Xstore" />
        <PantallaInstalacion key={`instalacion-${versionCaja}`} caja={caja} embebido activarRetomar={seccionInicial === 'xstore'} resaltarUltimo={seccionActiva === 'xstore'} onTrabajo={() => setSeccionActiva('xstore')} onIrASoftware={irASoftware} />
      </div>

      {/* Sección Software (leve cambio de fondo + separador) */}
      <div ref={refSoftware} className="border-t" style={{ backgroundColor: 'color-mix(in srgb, var(--acento) 5%, var(--fondo-base))', borderColor: 'var(--borde)', scrollMarginTop: 64 }}>
        <Titulo texto="Software y aplicaciones" />
        <PantallaSoftware key={`software-${versionCaja}`} caja={caja} embebido activarRetomar={seccionInicial === 'software'} resaltarUltimo={seccionActiva === 'software'} onTrabajo={() => setSeccionActiva('software')} />
      </div>

      {/* Un solo reinicio para toda la caja */}
      <div className="w-full max-w-sm mx-auto px-5 pt-2 pb-8">
        {confirmandoReinicio ? (
          <div className="space-y-3 rounded-xl border p-4" style={{ borderColor: 'var(--error)', backgroundColor: 'color-mix(in srgb, var(--error) 8%, transparent)' }}>
            <p className="text-sm font-semibold" style={{ color: 'var(--error)' }}>¿Reiniciar la caja {caja}?</p>
            <p className="text-xs" style={{ color: 'var(--texto-secundario)' }}>Se desmarcarán los pasos de Xstore y los programas de esta caja, y se borrarán sus datos y fotos. La otra caja no se toca.</p>
            <div className="flex gap-2">
              <button
                onClick={reiniciarCaja}
                className="flex-1 py-2.5 text-sm font-semibold rounded-xl transition-colors"
                style={{ backgroundColor: 'var(--error)', color: '#fff' }}
              >
                Sí, reiniciar
              </button>
              <button
                onClick={() => setConfirmandoReinicio(false)}
                className="flex-1 py-2.5 border text-sm rounded-xl transition-colors"
                style={{ borderColor: 'var(--borde)', color: 'var(--texto-secundario)' }}
              >
                Cancelar
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setConfirmandoReinicio(true)}
            className="w-full py-3 border text-sm rounded-xl transition-colors"
            style={{ borderColor: 'color-mix(in srgb, var(--error) 40%, transparent)', color: 'var(--error)' }}
          >
            Reiniciar caja {caja}
          </button>
        )}
      </div>
    </div>
  );
}
