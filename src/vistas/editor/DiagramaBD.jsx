import { useState, useRef, useEffect } from 'react';

const ESCALA_MIN = 0.2;
const ESCALA_MAX = 3;

const PALETA = [
  { cabecera: 'bg-[#1f6feb]', borde: 'border-[#1f6feb]' },
  { cabecera: 'bg-[#8250df]', borde: 'border-[#8250df]' },
  { cabecera: 'bg-[#1a7f37]', borde: 'border-[#1a7f37]' },
  { cabecera: 'bg-[#9a6700]', borde: 'border-[#9a6700]' },
  { cabecera: 'bg-[#cf222e]', borde: 'border-[#cf222e]' },
  { cabecera: 'bg-[#0550ae]', borde: 'border-[#0550ae]' },
  { cabecera: 'bg-[#6639ba]', borde: 'border-[#6639ba]' },
  { cabecera: 'bg-[#116329]', borde: 'border-[#116329]' },
  { cabecera: 'bg-[#953800]', borde: 'border-[#953800]' },
];

export default function DiagramaBD({ tablas, abierto, onCerrar }) {
  const [traslado, setTraslado] = useState({ x: 16, y: 16 });
  const [escala, setEscala] = useState(1);

  const contenedorRef = useRef(null);
  const estadoRef = useRef({
    arrastrando: false,
    pinchActivo: false,
    inicioX: 0,
    inicioY: 0,
    distanciaInicial: 0,
    escalaInicial: 1,
  });

  useEffect(() => {
    if (!abierto) return;
    const el = contenedorRef.current;
    if (!el) return;

    const onTouchMove = (e) => {
      e.preventDefault();
      const est = estadoRef.current;
      if (e.touches.length === 1 && est.arrastrando) {
        setTraslado({
          x: e.touches[0].clientX - est.inicioX,
          y: e.touches[0].clientY - est.inicioY,
        });
      } else if (e.touches.length === 2 && est.pinchActivo) {
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const nueva = est.escalaInicial * (dist / est.distanciaInicial);
        setEscala(Math.min(ESCALA_MAX, Math.max(ESCALA_MIN, nueva)));
      }
    };

    el.addEventListener('touchmove', onTouchMove, { passive: false });
    return () => el.removeEventListener('touchmove', onTouchMove);
  }, [abierto]);

  if (!abierto) return null;

  const onMouseDown = (e) => {
    const est = estadoRef.current;
    est.arrastrando = true;
    est.inicioX = e.clientX - traslado.x;
    est.inicioY = e.clientY - traslado.y;
  };

  const onMouseMove = (e) => {
    const est = estadoRef.current;
    if (!est.arrastrando) return;
    setTraslado({
      x: e.clientX - est.inicioX,
      y: e.clientY - est.inicioY,
    });
  };

  const onMouseUp = () => { estadoRef.current.arrastrando = false; };

  const onWheel = (e) => {
    e.preventDefault();
    const factor = e.deltaY < 0 ? 1.1 : 0.9;
    setEscala(s => Math.min(ESCALA_MAX, Math.max(ESCALA_MIN, s * factor)));
  };

  const onTouchStart = (e) => {
    const est = estadoRef.current;
    if (e.touches.length === 1) {
      est.arrastrando = true;
      est.pinchActivo = false;
      est.inicioX = e.touches[0].clientX - traslado.x;
      est.inicioY = e.touches[0].clientY - traslado.y;
    } else if (e.touches.length === 2) {
      est.arrastrando = false;
      est.pinchActivo = true;
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      est.distanciaInicial = Math.sqrt(dx * dx + dy * dy);
      est.escalaInicial = escala;
    }
  };

  const onTouchEnd = () => {
    estadoRef.current.arrastrando = false;
    estadoRef.current.pinchActivo = false;
  };

  return (
    <div className="fixed inset-0 z-40 bg-[#0d1117] flex flex-col">

      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#30363d] flex-shrink-0 bg-[#161b22]">
        <p className="text-white font-medium text-sm font-sans">📊 Diagrama de tablas</p>
        <button
          onClick={onCerrar}
          className="text-[#8b949e] hover:text-white text-xl leading-none transition-colors"
        >
          ×
        </button>
      </div>

      {/* Canvas interactivo */}
      <div
        ref={contenedorRef}
        className="flex-1 overflow-hidden select-none cursor-grab active:cursor-grabbing"
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
        onWheel={onWheel}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <div
          style={{
            transform: `translate(${traslado.x}px, ${traslado.y}px) scale(${escala})`,
            transformOrigin: '0 0',
            display: 'inline-flex',
            flexWrap: 'wrap',
            gap: '12px',
            padding: '8px',
            willChange: 'transform',
            maxWidth: '900px',
          }}
        >
          {tablas.map((tabla, i) => {
            const color = PALETA[i % PALETA.length];
            return (
              <div
                key={tabla.nombre}
                className={`rounded-lg border ${color.borde} overflow-hidden bg-[#161b22] flex flex-col flex-shrink-0`}
                style={{ width: 158 }}
              >
                <div className={`${color.cabecera} px-3 py-2`}>
                  <p className="text-white font-bold text-xs font-sans tracking-wide">{tabla.nombre}</p>
                </div>
                <div className="flex-1 divide-y divide-[#21262d]">
                  {tabla.columnas.map(col => (
                    <div key={col.nombre} className="px-2 py-1.5">
                      <div className="flex items-center gap-1.5">
                        {col.esPrimaria && (
                          <span className="text-[#d29922] text-xs font-bold font-sans flex-shrink-0">PK</span>
                        )}
                        {col.esForanea && (
                          <span className="text-[#388bfd] text-xs font-bold font-sans flex-shrink-0">FK</span>
                        )}
                        {!col.esPrimaria && !col.esForanea && (
                          <span className="text-transparent text-xs font-sans flex-shrink-0 select-none">··</span>
                        )}
                        <span className="text-[#e6edf3] text-xs font-mono truncate">{col.nombre}</span>
                      </div>
                      <div className="flex items-center justify-between mt-0.5 pl-6">
                        <span className="text-[#484f58] text-xs font-mono">{col.tipo}</span>
                        {col.referenciaTabla && (
                          <span className="text-[#388bfd] text-xs font-sans">→ {col.referenciaTabla}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}

          {tablas.length === 0 && (
            <p className="text-[#484f58] text-sm font-sans p-8">Sin tablas disponibles</p>
          )}
        </div>
      </div>

      {/* Hint */}
      <div className="flex-shrink-0 px-4 py-1.5 bg-[#161b22] border-t border-[#30363d]">
        <p className="text-[#484f58] text-xs font-sans text-center">
          Arrastra para mover · Pellizca o usa la rueda del mouse para zoom
        </p>
      </div>
    </div>
  );
}
