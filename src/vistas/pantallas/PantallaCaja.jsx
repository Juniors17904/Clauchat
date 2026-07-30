import { useRef, useEffect, useState } from 'react';
import PantallaInstalacion from './PantallaInstalacion';
import PantallaSoftware from './PantallaSoftware';

// Pantalla única por caja: Instalación Xstore + Software en una sola lista continua.
// Cada parte tiene su título y un leve cambio de fondo para diferenciarlas.
export default function PantallaCaja({ caja = 1, seccionInicial = 'xstore', onVolver, onCambiarCaja }) {
  const refSoftware = useRef(null);
  const color = caja === 1 ? 'var(--acento)' : '#39c5cf';
  // Solo una sección resalta su último punto a la vez (la última donde se trabajó)
  const [seccionActiva, setSeccionActiva] = useState(seccionInicial);

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
        <PantallaInstalacion caja={caja} embebido activarRetomar={seccionInicial === 'xstore'} resaltarUltimo={seccionActiva === 'xstore'} onTrabajo={() => setSeccionActiva('xstore')} onIrASoftware={irASoftware} />
      </div>

      {/* Sección Software (leve cambio de fondo + separador) */}
      <div ref={refSoftware} className="border-t" style={{ backgroundColor: 'color-mix(in srgb, var(--acento) 5%, var(--fondo-base))', borderColor: 'var(--borde)', scrollMarginTop: 64 }}>
        <Titulo texto="Software y aplicaciones" />
        <PantallaSoftware caja={caja} embebido activarRetomar={seccionInicial === 'software'} resaltarUltimo={seccionActiva === 'software'} onTrabajo={() => setSeccionActiva('software')} />
      </div>
    </div>
  );
}
