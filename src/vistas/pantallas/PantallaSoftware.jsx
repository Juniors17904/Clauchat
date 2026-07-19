import { useState, useRef } from 'react';
import { PROGRAMAS_SOFTWARE } from '../../datos/programas_software';
import { GestorSoftware } from '../../modelos/gestor_software';

export default function PantallaSoftware({ onVolver }) {
  const gestor = useRef(new GestorSoftware());
  const [, setVersion] = useState(0);
  const [abierto, setAbierto] = useState(null);

  const total = PROGRAMAS_SOFTWARE.length;
  const completados = gestor.current.totalCompletados;
  const porcentaje = total > 0 ? Math.round((completados / total) * 100) : 0;

  const alternar = (id) => {
    gestor.current.alternar(id);
    setVersion(v => v + 1);
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
        <div className="border rounded-xl overflow-hidden" style={{ borderColor: 'var(--borde)' }}>
          {PROGRAMAS_SOFTWARE.map((programa, i) => {
            const completado = gestor.current.estaCompletado(programa.id);
            const estaAbierto = abierto === programa.id;
            return (
              <div key={programa.id} style={{ borderTop: i > 0 ? '1px solid var(--borde)' : 'none', backgroundColor: estaAbierto ? 'var(--fondo-base)' : 'var(--fondo-panel)', borderLeft: estaAbierto ? '3px solid var(--acento)' : '3px solid transparent' }}>
                <div className="flex items-center gap-3 px-3.5 py-3" style={{ backgroundColor: estaAbierto ? 'var(--fondo-elevado)' : 'transparent' }}>
                  <button
                    onClick={() => alternar(programa.id)}
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
                      {programa.nombre}
                    </p>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--texto-tenue)' }}>{programa.descripcion}</p>
                  </button>
                  {programa.detalle && (
                    <button onClick={() => setAbierto(estaAbierto ? null : programa.id)} className="text-xs" style={{ color: 'var(--texto-tenue)' }}>
                      {estaAbierto ? '▲' : '▼'}
                    </button>
                  )}
                </div>
                {estaAbierto && programa.detalle && (
                  <div className="px-3.5 pb-3.5 pt-1" style={{ backgroundColor: 'var(--fondo-base)' }}>
                    <p className="text-sm leading-relaxed whitespace-pre-line" style={{ color: 'var(--texto-secundario)' }}>{programa.detalle}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <p className="text-xs text-center mt-6" style={{ color: 'var(--texto-tenue)' }}>
          Más programas se agregarán con el manual de software.
        </p>
      </div>
    </div>
  );
}
