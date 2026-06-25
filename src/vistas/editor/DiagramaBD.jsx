import { useState, useRef, useEffect, useLayoutEffect, useMemo } from 'react';

const TABLA_ANCHO = 172;
const CABECERA_ALTO = 30;
const FILA_ALTO = 40;
const SEP_X = 100;
const SEP_Y = 64;
const MARGEN = 28;
const ESCALA_MIN = 0.1;
const ESCALA_MAX = 3;

const CROW_FORK = 14;
const CROW_TICK = 7;
const CROW_SPREAD = 7;
const ONE_INNER = 6;
const ONE_OUTER = 14;

const CATEGORIAS = [
  { fondo: '#0d2e6a', borde: '#1f6feb', etiqueta: 'Base' },
  { fondo: '#0e3a1a', borde: '#1a7f37', etiqueta: 'Principal' },
  { fondo: '#3d2a00', borde: '#9a6700', etiqueta: 'Operacional' },
  { fondo: '#2a1a4a', borde: '#8250df', etiqueta: 'Transaccional' },
];

function alturaTabla(tabla) {
  return CABECERA_ALTO + tabla.columnas.length * FILA_ALTO;
}

function calcularNiveles(tablas) {
  const nombres = new Set(tablas.map(t => t.nombre));
  const niveles = {};
  const deps = {};

  tablas.forEach(t => {
    niveles[t.nombre] = 0;
    deps[t.nombre] = new Set();
  });

  tablas.forEach(t => {
    t.columnas.forEach(col => {
      if (col.esForanea && col.referenciaTabla && col.referenciaTabla !== t.nombre && nombres.has(col.referenciaTabla)) {
        deps[t.nombre].add(col.referenciaTabla);
      }
    });
  });

  let changed = true;
  let iter = 0;
  while (changed && iter++ < 50) {
    changed = false;
    tablas.forEach(t => {
      if (deps[t.nombre].size > 0) {
        const maxDep = Math.max(...[...deps[t.nombre]].map(d => niveles[d] ?? 0));
        if (maxDep + 1 > niveles[t.nombre]) {
          niveles[t.nombre] = maxDep + 1;
          changed = true;
        }
      }
    });
  }

  return niveles;
}

function baricentro(tabla, posTemp) {
  const ys = tabla.columnas
    .filter(col => col.esForanea && col.referenciaTabla && posTemp[col.referenciaTabla] !== undefined)
    .map(col => posTemp[col.referenciaTabla].y);
  if (ys.length === 0) return posTemp[tabla.nombre]?.y ?? 0;
  return ys.reduce((s, y) => s + y, 0) / ys.length;
}

function computarPosiciones(tablas) {
  const niveles = calcularNiveles(tablas);
  const grupos = {};

  tablas.forEach(t => {
    const n = niveles[t.nombre];
    if (!grupos[n]) grupos[n] = [];
    grupos[n].push(t);
  });

  const nivelesOrdenados = Object.keys(grupos).map(Number).sort((a, b) => a - b);
  const posTemp = {};

  const asignarY = () => {
    nivelesOrdenados.forEach(nivel => {
      let y = MARGEN;
      grupos[nivel].forEach(t => {
        posTemp[t.nombre] = { y };
        y += alturaTabla(t) + SEP_Y;
      });
    });
  };

  asignarY();

  for (let iter = 0; iter < 4; iter++) {
    nivelesOrdenados.forEach((nivel, li) => {
      if (li === 0) return;
      grupos[nivel] = [...grupos[nivel]].sort((a, b) => baricentro(a, posTemp) - baricentro(b, posTemp));
    });
    asignarY();
  }

  const pos = {};
  nivelesOrdenados.forEach(nivel => {
    const x = MARGEN + nivel * (TABLA_ANCHO + SEP_X);
    let y = MARGEN;
    grupos[nivel].forEach(t => {
      const alto = alturaTabla(t);
      pos[t.nombre] = { x, y, alto, nivel };
      y += alto + SEP_Y;
    });
  });

  return pos;
}

function calcularDimCanvas(posiciones) {
  let maxX = 0, maxY = 0;
  Object.values(posiciones).forEach(p => {
    maxX = Math.max(maxX, p.x + TABLA_ANCHO + MARGEN);
    maxY = Math.max(maxY, p.y + p.alto + MARGEN);
  });
  return { w: Math.max(maxX, 200), h: Math.max(maxY, 200) };
}

function simboloCrowFoot(x, y, dx, dy) {
  const px = -dy, py = dx;
  const forkX = x + dx * CROW_FORK, forkY = y + dy * CROW_FORK;
  const tickX = x + dx * CROW_TICK, tickY = y + dy * CROW_TICK;
  return [
    `M ${forkX} ${forkY} L ${x} ${y}`,
    `M ${forkX} ${forkY} L ${x + px * CROW_SPREAD} ${y + py * CROW_SPREAD}`,
    `M ${forkX} ${forkY} L ${x - px * CROW_SPREAD} ${y - py * CROW_SPREAD}`,
    `M ${tickX - px * 7} ${tickY - py * 7} L ${tickX + px * 7} ${tickY + py * 7}`,
  ].join(' ');
}

function simboloOne(x, y, dx, dy) {
  const px = -dy, py = dx;
  const t1x = x + dx * ONE_INNER, t1y = y + dy * ONE_INNER;
  const t2x = x + dx * ONE_OUTER, t2y = y + dy * ONE_OUTER;
  return [
    `M ${t1x - px * 7} ${t1y - py * 7} L ${t1x + px * 7} ${t1y + py * 7}`,
    `M ${t2x - px * 7} ${t2y - py * 7} L ${t2x + px * 7} ${t2y + py * 7}`,
  ].join(' ');
}

function generarRelaciones(tablas, posiciones) {
  const rels = [];

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

      let x1, y1, x2, y2, d1x, d1y, d2x, d2y;
      let esHorizontal;

      if (Math.abs(cxO - cxD) > 20) {
        esHorizontal = true;
        if (cxO < cxD) {
          x1 = origen.x + TABLA_ANCHO; y1 = yFk;
          x2 = destino.x; y2 = yDst;
          d1x = 1; d1y = 0; d2x = -1; d2y = 0;
        } else {
          x1 = origen.x; y1 = yFk;
          x2 = destino.x + TABLA_ANCHO; y2 = yDst;
          d1x = -1; d1y = 0; d2x = 1; d2y = 0;
        }
      } else {
        esHorizontal = false;
        if (origen.y < destino.y) {
          x1 = origen.x + TABLA_ANCHO * 0.5; y1 = origen.y + origen.alto;
          x2 = destino.x + TABLA_ANCHO * 0.5; y2 = destino.y;
          d1x = 0; d1y = 1; d2x = 0; d2y = -1;
        } else {
          x1 = origen.x + TABLA_ANCHO * 0.5; y1 = origen.y;
          x2 = destino.x + TABLA_ANCHO * 0.5; y2 = destino.y + destino.alto;
          d1x = 0; d1y = -1; d2x = 0; d2y = 1;
        }
      }

      // El bezier corre ENTRE los símbolos: empieza en el fork del crow's foot
      // y termina en el tick externo del símbolo "uno", sin pisar los adornos
      const bx1 = x1 + d1x * CROW_FORK, by1 = y1 + d1y * CROW_FORK;
      const bx2 = x2 + d2x * ONE_OUTER, by2 = y2 + d2y * ONE_OUTER;

      let bcp1x, bcp1y, bcp2x, bcp2y;
      if (esHorizontal) {
        const t = Math.min(80, Math.abs(bx2 - bx1) * 0.4);
        bcp1x = bx1 + d1x * t; bcp1y = by1;
        bcp2x = bx2 + d2x * t; bcp2y = by2;
      } else {
        const t = Math.abs(by2 - by1) * 0.4;
        bcp1x = bx1; bcp1y = by1 + d1y * t;
        bcp2x = bx2; bcp2y = by2 + d2y * t;
      }

      const mx = 0.125 * bx1 + 0.375 * bcp1x + 0.375 * bcp2x + 0.125 * bx2;
      const my = 0.125 * by1 + 0.375 * bcp1y + 0.375 * bcp2y + 0.125 * by2;

      rels.push({
        bezier: `M ${bx1} ${by1} C ${bcp1x} ${bcp1y}, ${bcp2x} ${bcp2y}, ${bx2} ${by2}`,
        footOrigen: simboloCrowFoot(x1, y1, d1x, d1y),
        footDestino: simboloOne(x2, y2, d2x, d2y),
        mx, my,
      });
    });
  });

  return rels;
}

export default function DiagramaBD({ tablas, abierto, onCerrar, nombreBD = '' }) {
  const [traslado, setTraslado] = useState({ x: 20, y: 20 });
  const [escala, setEscala] = useState(1);

  const contenedorRef = useRef(null);
  const r = useRef({
    arrastrando: false, pinchActivo: false,
    inicioX: 0, inicioY: 0,
    distanciaInicial: 0, escalaInicial: 1,
    pinchCentroX: 0, pinchCentroY: 0,
    trasladoInicialX: 0, trasladoInicialY: 0,
    escalaActual: 1, trasladoActual: { x: 40, y: 40 },
  });

  const posiciones = useMemo(() => computarPosiciones(tablas), [tablas]);
  const dim = useMemo(() => calcularDimCanvas(posiciones), [posiciones]);
  const relaciones = useMemo(() => generarRelaciones(tablas, posiciones), [tablas, posiciones]);

  useLayoutEffect(() => {
    if (!abierto || !contenedorRef.current) return;
    const { clientWidth, clientHeight } = contenedorRef.current;
    const eFit = Math.min((clientWidth - 80) / dim.w, (clientHeight - 80) / dim.h, 1);
    setEscala(Math.max(ESCALA_MIN, eFit));
    setTraslado({ x: 40, y: 40 });
  }, [abierto, dim.w, dim.h]);

  useEffect(() => {
    if (!abierto) return;
    const el = contenedorRef.current;
    if (!el) return;

    const onTouchMove = (e) => {
      e.preventDefault();
      const estado = r.current;
      if (e.touches.length === 1 && estado.arrastrando) {
        setTraslado({ x: e.touches[0].clientX - estado.inicioX, y: e.touches[0].clientY - estado.inicioY });
      } else if (e.touches.length === 2 && estado.pinchActivo) {
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const nuevaEscala = Math.min(ESCALA_MAX, Math.max(ESCALA_MIN, estado.escalaInicial * (dist / estado.distanciaInicial)));
        // Zoom hacia el centro del pellizco: el punto bajo los dedos queda fijo
        const canvasX = (estado.pinchCentroX - estado.trasladoInicialX) / estado.escalaInicial;
        const canvasY = (estado.pinchCentroY - estado.trasladoInicialY) / estado.escalaInicial;
        setEscala(nuevaEscala);
        setTraslado({ x: estado.pinchCentroX - canvasX * nuevaEscala, y: estado.pinchCentroY - canvasY * nuevaEscala });
      }
    };

    const onWheel = (e) => {
      e.preventDefault();
      const { escalaActual, trasladoActual } = r.current;
      const factor = e.deltaY < 0 ? 1.1 : 0.9;
      const nuevaEscala = Math.min(ESCALA_MAX, Math.max(ESCALA_MIN, escalaActual * factor));
      // Zoom hacia el cursor del ratón
      const canvasX = (e.clientX - trasladoActual.x) / escalaActual;
      const canvasY = (e.clientY - trasladoActual.y) / escalaActual;
      setEscala(nuevaEscala);
      setTraslado({ x: e.clientX - canvasX * nuevaEscala, y: e.clientY - canvasY * nuevaEscala });
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
    const estado = r.current;
    if (e.touches.length === 1) {
      estado.arrastrando = true; estado.pinchActivo = false;
      estado.inicioX = e.touches[0].clientX - traslado.x;
      estado.inicioY = e.touches[0].clientY - traslado.y;
    } else if (e.touches.length === 2) {
      estado.arrastrando = false; estado.pinchActivo = true;
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      estado.distanciaInicial = Math.sqrt(dx * dx + dy * dy);
      estado.escalaInicial = escala;
      estado.trasladoInicialX = traslado.x;
      estado.trasladoInicialY = traslado.y;
      estado.pinchCentroX = (e.touches[0].clientX + e.touches[1].clientX) / 2;
      estado.pinchCentroY = (e.touches[0].clientY + e.touches[1].clientY) / 2;
    }
  };
  const onTouchEnd = () => { r.current.arrastrando = false; r.current.pinchActivo = false; };

  // Sincronizar al ref para que los handlers nativos (wheel) lean valores siempre frescos
  r.current.escalaActual = escala;
  r.current.trasladoActual = traslado;

  const fecha = new Date().toLocaleDateString('es', { day: 'numeric', month: 'short', year: 'numeric' });

  return (
    <div className="fixed inset-0 z-40 bg-[#0d1117] flex flex-col">

      <div className="flex items-center justify-between px-4 py-2.5 border-b border-[#30363d] flex-shrink-0 bg-[#161b22]">
        <div>
          <p className="text-white font-semibold text-sm font-sans">
            📊 {nombreBD || 'Diagrama ER'}
          </p>
          <p className="text-[#484f58] text-[10px] font-sans mt-0.5">
            SQLab · v1.0 · {fecha}
          </p>
        </div>
        <button onClick={onCerrar} className="text-[#8b949e] hover:text-white text-xl leading-none transition-colors">×</button>
      </div>

      <div
        ref={contenedorRef}
        className="flex-1 overflow-hidden select-none cursor-grab active:cursor-grabbing"
        style={{ position: 'relative' }}
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
            {relaciones.map((rel, i) => (
              <g key={i}>
                <path d={rel.bezier} fill="none" stroke="#388bfd" strokeWidth="1.5" strokeOpacity="0.4" />
                <path d={rel.footOrigen} fill="none" stroke="#58a6ff" strokeWidth="1.5" strokeOpacity="0.85" strokeLinecap="round" />
                <path d={rel.footDestino} fill="none" stroke="#58a6ff" strokeWidth="1.5" strokeOpacity="0.85" strokeLinecap="round" />
                <rect x={rel.mx - 16} y={rel.my - 10} width={32} height={18} rx={4} fill="#0d1117" fillOpacity="0.88" />
                <text x={rel.mx} y={rel.my + 5} textAnchor="middle" fill="#58a6ff" fontSize="12" fontFamily="monospace" fontWeight="700">1:N</text>
              </g>
            ))}
          </svg>

          {tablas.map((tabla) => {
            const p = posiciones[tabla.nombre];
            if (!p) return null;
            const cat = CATEGORIAS[Math.min(p.nivel, CATEGORIAS.length - 1)];
            return (
              <div
                key={tabla.nombre}
                style={{
                  position: 'absolute',
                  left: p.x,
                  top: p.y,
                  width: TABLA_ANCHO,
                  border: `1px solid ${cat.borde}`,
                  borderRadius: 8,
                  overflow: 'hidden',
                  background: '#0d1117',
                }}
              >
                <div style={{ background: cat.fondo, borderBottom: `1px solid ${cat.borde}66`, padding: '5px 10px' }}>
                  <p style={{ color: 'white', fontWeight: 700, fontSize: 11, fontFamily: 'sans-serif', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', letterSpacing: '0.03em' }}>
                    {tabla.nombre}
                  </p>
                </div>
                {tabla.columnas.map(col => (
                  <div
                    key={col.nombre}
                    style={{ height: FILA_ALTO, borderTop: '1px solid #21262d', padding: '0 8px', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 1 }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      {col.esPrimaria && col.esForanea && (
                        <span style={{ color: '#8250df', fontSize: 8, fontWeight: 700, flexShrink: 0, fontFamily: 'sans-serif' }}>PF</span>
                      )}
                      {col.esPrimaria && !col.esForanea && (
                        <span style={{ color: '#d29922', fontSize: 8, fontWeight: 700, flexShrink: 0, fontFamily: 'sans-serif' }}>PK</span>
                      )}
                      {col.esForanea && !col.esPrimaria && (
                        <span style={{ color: '#388bfd', fontSize: 8, fontWeight: 700, flexShrink: 0, fontFamily: 'sans-serif' }}>FK</span>
                      )}
                      {!col.esPrimaria && !col.esForanea && (
                        <span style={{ color: 'transparent', fontSize: 8, flexShrink: 0, userSelect: 'none' }}>··</span>
                      )}
                      <span style={{ color: '#e6edf3', fontSize: 10, fontFamily: 'monospace', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>
                        {col.nombre}
                      </span>
                    </div>
                    <div style={{ paddingLeft: 18 }}>
                      <span style={{ color: '#6e7681', fontSize: 9, fontFamily: 'monospace', background: '#161b22', padding: '0px 3px', borderRadius: 2 }}>
                        {col.tipo || 'TEXT'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            );
          })}
        </div>

        <div
          style={{
            position: 'absolute',
            bottom: 12,
            right: 12,
            background: '#161b22',
            border: '1px solid #30363d',
            borderRadius: 8,
            padding: '10px 12px',
            pointerEvents: 'none',
            zIndex: 10,
            minWidth: 140,
          }}
        >
          <p style={{ color: '#8b949e', fontWeight: 700, fontSize: 9, fontFamily: 'sans-serif', letterSpacing: '0.08em', marginBottom: 7 }}>LEYENDA</p>

          <div style={{ display: 'flex', gap: 10, marginBottom: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <span style={{ color: '#d29922', fontSize: 8, fontWeight: 700, fontFamily: 'sans-serif' }}>PK</span>
              <span style={{ color: '#6e7681', fontSize: 9, fontFamily: 'sans-serif' }}>Primaria</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <span style={{ color: '#388bfd', fontSize: 8, fontWeight: 700, fontFamily: 'sans-serif' }}>FK</span>
              <span style={{ color: '#6e7681', fontSize: 9, fontFamily: 'sans-serif' }}>Foránea</span>
            </div>
          </div>

          <div style={{ marginBottom: 8 }}>
            <svg width="130" height="22">
              {/* Fork at x=14, three feet to table at x=0, tick at x=7 (between fork and table) */}
              <path d="M 14 11 L 0 11 M 14 11 L 0 5 M 14 11 L 0 17 M 7 4 L 7 18" stroke="#58a6ff" strokeWidth="1.5" fill="none" strokeLinecap="round" />
              <text x="20" y="15" fontSize="9" fill="#6e7681" fontFamily="sans-serif">muchos (N)</text>
            </svg>
            <svg width="130" height="20" style={{ marginTop: 2 }}>
              {/* Inner tick at x=6, outer tick at x=14 (bezier ends here) */}
              <path d="M 6 3 L 6 17 M 14 3 L 14 17" stroke="#58a6ff" strokeWidth="1.5" fill="none" strokeLinecap="round" />
              <text x="20" y="14" fontSize="9" fill="#6e7681" fontFamily="sans-serif">uno (1)</text>
            </svg>
          </div>

          <div style={{ borderTop: '1px solid #21262d', paddingTop: 7 }}>
            {CATEGORIAS.map((cat, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: i < CATEGORIAS.length - 1 ? 4 : 0 }}>
                <div style={{ width: 8, height: 8, borderRadius: 2, background: cat.borde, flexShrink: 0 }} />
                <span style={{ color: '#6e7681', fontSize: 9, fontFamily: 'sans-serif' }}>{cat.etiqueta}</span>
              </div>
            ))}
          </div>
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
