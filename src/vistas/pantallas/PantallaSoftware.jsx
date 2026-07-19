import { useState, useRef, useEffect } from 'react';
import { PROGRAMAS_SOFTWARE } from '../../datos/programas_software';
import { GestorSoftware } from '../../modelos/gestor_software';
import { VisorImagen } from '../../modelos/visor_imagen';

function renderizarDetalle(texto) {
  return texto.split(/(\[\[.*?\]\])/g).map((parte, i) => {
    if (parte.startsWith('[[') && parte.endsWith(']]')) {
      return <span key={i} style={{ color: 'var(--advertencia)', fontWeight: 600, wordBreak: 'break-all' }}>{parte.slice(2, -2)}</span>;
    }
    return parte;
  });
}

export default function PantallaSoftware({ onVolver }) {
  const gestor = useRef(new GestorSoftware());
  const visor = useRef(new VisorImagen());
  const pasosRef = useRef({});
  const [, setVersion] = useState(0);
  const [abierto, setAbierto] = useState(null);
  const [imagenAmpliada, setImagenAmpliada] = useState(null);

  const total = PROGRAMAS_SOFTWARE.length;
  const completados = gestor.current.totalCompletados;
  const porcentaje = total > 0 ? Math.round((completados / total) * 100) : 0;

  useEffect(() => {
    if (!imagenAmpliada) return;
    const estadoActual = window.history.state;
    window.history.pushState({ ...estadoActual, visorFoto: true }, '');
    const cerrar = () => { visor.current.reiniciar(); setImagenAmpliada(null); };
    window.addEventListener('popstate', cerrar);
    return () => {
      window.removeEventListener('popstate', cerrar);
      if (window.history.state?.visorFoto) window.history.back();
    };
  }, [imagenAmpliada]);

  const completarYAvanzar = (programa) => {
    const estaba = gestor.current.estaCompletado(programa.id);
    gestor.current.alternar(programa.id);
    setVersion(v => v + 1);
    if (estaba) return;
    const idx = PROGRAMAS_SOFTWARE.findIndex(p => p.id === programa.id);
    const siguiente = PROGRAMAS_SOFTWARE[idx + 1];
    if (siguiente) {
      setAbierto(siguiente.id);
      setTimeout(() => { pasosRef.current[siguiente.id]?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, 80);
    } else {
      setAbierto(null);
    }
  };

  return (
    <div className="min-h-[100svh] flex flex-col select-none" style={{ backgroundColor: 'var(--fondo-base)', fontFamily: 'var(--fuente-sans)' }}>
      {/* Header */}
      <div className="sticky top-0 z-10 border-b" style={{ backgroundColor: 'var(--fondo-base)', borderColor: 'var(--borde)' }}>
        <div className="w-full max-w-sm mx-auto px-5 pt-4 pb-3">
          <button onClick={onVolver} className="flex items-center gap-2 text-sm mb-3 transition-colors" style={{ color: 'var(--texto-secundario)' }}>
            ← Volver
          </button>
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-lg font-bold" style={{ color: 'var(--texto-primario)' }}>Software y aplicaciones</h1>
            <span className="text-xs font-mono" style={{ color: porcentaje === 100 ? 'var(--acento)' : 'var(--texto-secundario)' }}>
              {completados}/{total}
            </span>
          </div>
          <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--fondo-elevado)' }}>
            <div className="h-full rounded-full transition-all duration-300" style={{ width: `${porcentaje}%`, backgroundColor: 'var(--acento)' }} />
          </div>
        </div>
      </div>

      {/* Contenido */}
      <div className="flex-1 w-full max-w-sm mx-auto px-5 py-4 pb-10">
        {porcentaje === 100 && (
          <div className="border rounded-xl px-4 py-3 mb-4 banner-animado" style={{ backgroundColor: 'var(--exito-fondo)', borderColor: 'var(--acento-btn)' }}>
            <p className="text-sm" style={{ color: 'var(--acento)' }}>✓ Todo el software está instalado</p>
          </div>
        )}

        <div className="border rounded-xl overflow-hidden" style={{ borderColor: 'var(--borde)' }}>
          {PROGRAMAS_SOFTWARE.map((programa, i) => {
            const completado = gestor.current.estaCompletado(programa.id);
            const estaAbierto = abierto === programa.id;
            return (
              <div
                key={programa.id}
                ref={el => { pasosRef.current[programa.id] = el; }}
                style={{
                  borderTop: i > 0 ? '1px solid var(--borde)' : 'none',
                  backgroundColor: estaAbierto ? 'var(--fondo-base)' : 'var(--fondo-panel)',
                  borderLeft: estaAbierto ? '3px solid var(--acento)' : '3px solid transparent',
                  scrollMarginTop: '96px',
                }}
              >
                <div className="flex items-center gap-3 px-3.5 py-3" style={{ backgroundColor: estaAbierto ? 'var(--fondo-elevado)' : 'transparent' }}>
                  <button
                    onClick={() => { gestor.current.alternar(programa.id); setVersion(v => v + 1); }}
                    className="w-6 h-6 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all"
                    style={{ borderColor: completado ? 'var(--acento)' : 'var(--texto-tenue)', backgroundColor: completado ? 'var(--acento)' : 'transparent' }}
                  >
                    {completado && (
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <path d="M2.5 6L5 8.5L9.5 3.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </button>
                  <button onClick={() => setAbierto(estaAbierto ? null : programa.id)} className="flex-1 min-w-0 text-left">
                    <p className="text-base leading-snug" style={{ color: completado ? 'var(--texto-tenue)' : 'var(--texto-primario)', textDecoration: completado ? 'line-through' : 'none' }}>
                      <span className="font-mono text-sm mr-1.5" style={{ color: completado ? 'var(--texto-tenue)' : 'var(--acento)' }}>{programa.numero}.</span>
                      {programa.nombre}
                    </p>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--texto-tenue)' }}>{programa.descripcion}</p>
                  </button>
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    {programa.imagenes.length > 0 && (
                      <span className="text-[10px] font-mono" style={{ color: 'var(--texto-tenue)' }}>📷{programa.imagenes.length}</span>
                    )}
                    <button onClick={() => setAbierto(estaAbierto ? null : programa.id)} className="text-xs" style={{ color: 'var(--texto-tenue)' }}>
                      {estaAbierto ? '▲' : '▼'}
                    </button>
                  </div>
                </div>

                {estaAbierto && (
                  <div className="px-3.5 pb-3.5 pt-1" style={{ backgroundColor: 'var(--fondo-base)' }}>
                    <p className="text-sm leading-relaxed whitespace-pre-line mb-3" style={{ color: 'var(--texto-secundario)' }}>{renderizarDetalle(programa.detalle)}</p>
                    {programa.imagenes.length > 0 && (
                      <div className="space-y-2">
                        {programa.imagenes.map(img => (
                          <img
                            key={img}
                            src={img}
                            alt={programa.nombre}
                            onClick={() => setImagenAmpliada(img)}
                            className="w-full rounded-lg border cursor-zoom-in"
                            style={{ borderColor: 'var(--borde)' }}
                            loading="lazy"
                          />
                        ))}
                      </div>
                    )}
                    <button
                      onClick={() => completarYAvanzar(programa)}
                      className="w-full mt-3 py-3 rounded-lg text-sm font-semibold transition-colors"
                      style={{ backgroundColor: completado ? 'var(--fondo-elevado)' : 'var(--acento-btn)', color: completado ? 'var(--texto-secundario)' : '#fff' }}
                    >
                      {completado ? 'Desmarcar' : '✓ Marcar como listo y continuar'}
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Imagen ampliada con zoom */}
      {imagenAmpliada && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden"
          style={{ backgroundColor: 'rgba(0,0,0,0.9)', touchAction: 'none' }}
          onTouchStart={(e) => { visor.current.manejarInicio(Array.from(e.touches)); }}
          onTouchMove={(e) => { visor.current.manejarMovimiento(Array.from(e.touches)); setVersion(v => v + 1); }}
          onTouchEnd={(e) => { visor.current.manejarFin(Array.from(e.touches)); setVersion(v => v + 1); }}
          onWheel={(e) => { visor.current.manejarRueda(e.deltaY); setVersion(v => v + 1); }}
          onDoubleClick={() => { visor.current.alternarDobleClic(); setVersion(v => v + 1); }}
        >
          <button
            onClick={() => { visor.current.reiniciar(); setImagenAmpliada(null); }}
            className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full flex items-center justify-center text-white text-xl"
            style={{ backgroundColor: 'rgba(255,255,255,0.15)' }}
          >
            ×
          </button>
          <img
            src={imagenAmpliada}
            alt="Ampliada"
            draggable="false"
            className="max-w-full max-h-full rounded-lg select-none"
            style={{ transform: visor.current.estilo, transition: visor.current.ampliada ? 'none' : 'transform 200ms ease' }}
          />
          <p className="absolute bottom-5 left-0 right-0 text-center text-[11px] pointer-events-none" style={{ color: 'rgba(255,255,255,0.4)' }}>
            Pellizca para zoom · arrastra para mover · doble toque para acercar
          </p>
        </div>
      )}
    </div>
  );
}
