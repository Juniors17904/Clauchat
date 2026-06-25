import { useState, useRef, useEffect, useMemo } from 'react';

const TABLA_ANCHO = 158;
const CABECERA_ALTO = 30;
const FILA_ALTO = 38;
const SEP_X = 72;
const SEP_Y = 44;
const COLS_GRILLA = 3;
const MARGEN = 20;
const ESCALA_MIN = 0.15;
const ESCALA_MAX = 3;

const PALETA = [
  '#1f6feb', '#8250df', '#1a7f37', '#9a6700', '#cf222e',
  '#0550ae', '#6639ba', '#116329', '#953800',
];

function alturaTabla(tabla) {
  return CABECERA_ALTO + tabla.columnas.length * FILA_ALTO;
}

function computarPosiciones(tablas) {
  const pos = {};
  const numCols = Math.min(COLS_GRILLA, tablas.length);
  const yPorColumna = Array(numCols).fill(MARGEN);
  tablas.forEach((tabla, i) => {
    const col = i % numCols;
    const x = MARGEN + col * (TABLA_ANCHO + SEP_X);
    const y = yPorColumna[col];
    const alto = alturaTabla(tabla);
    pos[tabla.nombre] = { x, y, alto };
    yPorColumna[col] += alto + SEP_Y;
  });
  return pos;
}

function calcularDimCanvas(posiciones) {
  let maxX = 0, maxY = 0;
  Object.values(posiciones).forEach(p => {
    maxX = Math.max(maxX, p.x + TABLA_ANCHO + MARGEN);
    maxY = Math.max(maxY, p.y + p.alto + MARGEN);
  });
  return { w: maxX, h: maxY };
}

function generarLineas(tablas, posiciones) {
  const lineas = [];
  tablas.forEach(tabla => {
    const origen = posiciones[tabla.nombre];
    if (!origen) return;
    tabla.columnas.forEach((col, ci) => {
      if (!col.esForanea || !col.referenciaTabla) return;
      const destino = posiciones[col.referenciaTabla];
      if (!destino) return;

      const yFk = origen.y + CABECERA_ALTO + ci * FILA_ALTO + FILA_ALTO / 2;
      const yDst = destino.y + CABECERA_ALTO / 2;
      const cxO = origen.x + TABLA_ANCHO / 2;
      const cxD = destino.x + TABLA_ANCHO / 2;

      let x1, y1, x2, y2, cp1x, cp1y, cp2x, cp2y;

      if (Math.abs(cxO - cxD) > 20) {
        if (cxO < cxD) {
          x1 = origen.x + TABLA_ANCHO; y1 = yFk;
          x2 = destino.x; y2 = yDst;
        } else {
          x1 = origen.x; y1 = yFk;
          x2 = destino.x + TABLA_ANCHO; y2 = yDst;
        }
        const t = Math.min(60, Math.abs(x2 - x1) * 0.45);
        cp1x = x1 + (x2 > x1 ? t : -t); cp1y = y1;
        cp2x = x2 + (x2 > x1 ? -t : t); cp2y = y2;
      } else {
        if (origen.y < destino.y) {
          x1 = origen.x + TABLA_ANCHO * 0.5; y1 = origen.y + origen.alto;
          x2 = destino.x + TABLA_ANCHO * 0.5; y2 = destino.y;
        } else {
          x1 = origen.x + TABLA_ANCHO * 0.5; y1 = origen.y;
          x2 = destino.x + TABLA_ANCHO * 0.5; y2 = destino.y + destino.alto;
        }
        const t = Math.abs(y2 - y1) * 0.45;
        cp1x = x1; cp1y = y1 + (y2 > y1 ? t : -t);
        cp2x = x2; cp2y = y2 + (y2 > y1 ? -t : t);
      }

      lineas.push({ x1, y1, cp1x, cp1y, cp2x, cp2y, x2, y2 });
    });
  });
  return lineas;
}

export default function DiagramaBD({ tablas, abierto, onCerrar }) {
  const [traslado, setTraslado] = useState({ x: 20, y: 20 });
  const [escala, setEscala] = useState(1);

  const contenedorRef = useRef(null);
  const r = useRef({
    arrastrando: false, pinchActivo: false,
    inicioX: 0, inicioY: 0,
    distanciaInicial: 0, escalaInicial: 1,
  });

  const posiciones = useMemo(() => computarPosiciones(tablas), [tablas]);
  const dim = useMemo(() => calcularDimCanvas(posiciones), [posiciones]);
  const lineas = useMemo(() => generarLineas(tablas, posiciones), [tablas, posiciones]);

  useEffect(() => {
    if (!abierto || !contenedorRef.current) return;
    const { clientWidth, clientHeight } = contenedorRef.current;
    const eFit = Math.min((clientWidth - 40) / dim.w, (clientHeight - 40) / dim.h, 1);
    setEscala(Math.max(ESCALA_MIN, eFit));
    setTraslado({ x: 20, y: 20 });
  }, [abierto, dim.w, dim.h]);

  useEffect(() => {
    if (!abierto) return;
    const el = contenedorRef.current;
    if (!el) return;

    const onTouchMove = (e) => {
      e.preventDefault();
      const s = r.current;
      if (e.touches.length === 1 && s.arrastrando) {
        setTraslado({ x: e.touches[0].clientX - s.inicioX, y: e.touches[0].clientY - s.inicioY });
      } else if (e.touches.length === 2 && s.pinchActivo) {
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        setEscala(Math.min(ESCALA_MAX, Math.max(ESCALA_MIN, s.escalaInicial * (dist / s.distanciaInicial))));
      }
    };

    const onWheel = (e) => {
      e.preventDefault();
      setEscala(s => Math.min(ESCALA_MAX, Math.max(ESCALA_MIN, s * (e.deltaY < 0 ? 1.1 : 0.9))));
    };

    el.addEventListener('touchmove', onTouchMove, { passive: false });
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => {
      el.removeEventListener('touchmove', onTouchMove);
      el.removeEventListener('wheel', onWheel);
    };
  }, [abierto]);

  if (!abierto) return null;

  const onMouseDown = (e) => {
    r.current.arrastrando = true;
    r.current.inicioX = e.clientX - traslado.x;
    r.current.inicioY = e.clientY - traslado.y;
  };
  const onMouseMove = (e) => {
    if (!r.current.arrastrando) return;
    setTraslado({ x: e.clientX - r.current.inicioX, y: e.clientY - r.current.inicioY });
  };
  const onMouseUp = () => { r.current.arrastrando = false; };

  const onTouchStart = (e) => {
    const s = r.current;
    if (e.touches.length === 1) {
      s.arrastrando = true; s.pinchActivo = false;
      s.inicioX = e.touches[0].clientX - traslado.x;
      s.inicioY = e.touches[0].clientY - traslado.y;
    } else if (e.touches.length === 2) {
      s.arrastrando = false; s.pinchActivo = true;
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      s.distanciaInicial = Math.sqrt(dx * dx + dy * dy);
      s.escalaInicial = escala;
    }
  };
  const onTouchEnd = () => { r.current.arrastrando = false; r.current.pinchActivo = false; };

  return (
    <div className="fixed inset-0 z-40 bg-[#0d1117] flex flex-col">

      <div className="flex items-center justify-between px-4 py-3 border-b border-[#30363d] flex-shrink-0 bg-[#161b22]">
        <p className="text-white font-medium text-sm font-sans">📊 Diagrama de tablas</p>
        <button onClick={onCerrar} className="text-[#8b949e] hover:text-white text-xl leading-none transition-colors">×</button>
      </div>

      <div
        ref={contenedorRef}
        className="flex-1 overflow-hidden select-none cursor-grab active:cursor-grabbing"
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <div
          style={{
            transform: `translate(${traslado.x}px, ${traslado.y}px) scale(${escala})`,
            transformOrigin: '0 0',
            position: 'relative',
            width: dim.w,
            height: dim.h,
            willChange: 'transform',
          }}
        >
          <svg
            width={dim.w}
            height={dim.h}
            style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none', overflow: 'visible' }}
          >
            <defs>
              <marker id="punta" markerWidth="7" markerHeight="7" refX="5" refY="3.5" orient="auto">
                <polygon points="0 0, 7 3.5, 0 7" fill="#388bfd" fillOpacity="0.7" />
              </marker>
            </defs>
            {lineas.map((l, i) => (
              <path
                key={i}
                d={`M ${l.x1} ${l.y1} C ${l.cp1x} ${l.cp1y}, ${l.cp2x} ${l.cp2y}, ${l.x2} ${l.y2}`}
                fill="none"
                stroke="#388bfd"
                strokeWidth="1.5"
                strokeOpacity="0.55"
                markerEnd="url(#punta)"
              />
            ))}
          </svg>

          {tablas.map((tabla, i) => {
            const p = posiciones[tabla.nombre];
            const color = PALETA[i % PALETA.length];
            if (!p) return null;
            return (
              <div
                key={tabla.nombre}
                style={{
                  position: 'absolute', left: p.x, top: p.y,
                  width: TABLA_ANCHO,
                  border: `1px solid ${color}`,
                  borderRadius: 8,
                  overflow: 'hidden',
                  background: '#161b22',
                }}
              >
                <div style={{ background: color, padding: '6px 12px' }}>
                  <p style={{ color: 'white', fontWeight: 700, fontSize: 11, letterSpacing: '0.05em', fontFamily: 'sans-serif' }}>
                    {tabla.nombre}
                  </p>
                </div>
                {tabla.columnas.map(col => (
                  <div
                    key={col.nombre}
                    style={{ height: FILA_ALTO, borderTop: '1px solid #21262d', padding: '0 8px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                      {col.esPrimaria && (
                        <span style={{ color: '#d29922', fontSize: 9, fontWeight: 700, flexShrink: 0 }}>PK</span>
                      )}
                      {col.esForanea && (
                        <span style={{ color: '#388bfd', fontSize: 9, fontWeight: 700, flexShrink: 0 }}>FK</span>
                      )}
                      {!col.esPrimaria && !col.esForanea && (
                        <span style={{ color: 'transparent', fontSize: 9, flexShrink: 0 }}>··</span>
                      )}
                      <span style={{ color: '#e6edf3', fontSize: 11, fontFamily: 'monospace', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {col.nombre}
                      </span>
                    </div>
                    <div style={{ paddingLeft: 20 }}>
                      <span style={{ color: '#484f58', fontSize: 10, fontFamily: 'monospace' }}>{col.tipo}</span>
                    </div>
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex-shrink-0 px-4 py-1.5 bg-[#161b22] border-t border-[#30363d]">
        <p className="text-[#484f58] text-xs font-sans text-center">
          Arrastra para mover · Pellizca o rueda para zoom
        </p>
      </div>
    </div>
  );
}
