import { useEffect, useRef, useState } from 'react';
import { CamaraEquipo } from '../modelos/camara_equipo';

const MINIMO = 60;

// Cámara con un encuadre movible: se toma solo lo que quedó adentro, para que el
// lector reciba nada más que el dato y no toda la pantalla.
export default function CapturaEncuadrada({ titulo, forma = 'linea', onTomar, onCerrar }) {
  const videoRef = useRef(null);
  const cajaRef = useRef(null);
  const camara = useRef(new CamaraEquipo());
  const gesto = useRef(null);
  const [marco, setMarco] = useState(null);
  const [error, setError] = useState(null);
  const [tomando, setTomando] = useState(false);

  useEffect(() => {
    let cancelado = false;
    const encender = async () => {
      try {
        await camara.current.encender(videoRef.current);
        if (cancelado) return camara.current.apagar(videoRef.current);
        const caja = cajaRef.current?.getBoundingClientRect();
        if (caja) {
          // Un bloque de varios datos necesita casi toda la pantalla; un dato suelto, una franja
          const ancho = caja.width * (forma === 'bloque' ? 0.94 : 0.9);
          const alto = forma === 'bloque'
            ? caja.height * 0.62
            : Math.min(caja.height * 0.22, 220);
          setMarco({ x: (caja.width - ancho) / 2, y: (caja.height - alto) / 2, ancho, alto });
        }
      } catch {
        if (!cancelado) setError('No se pudo abrir la cámara');
      }
    };
    encender();
    const video = videoRef.current;
    return () => { cancelado = true; camara.current.apagar(video); };
  }, [forma]);

  const limitarMarco = (m) => {
    const caja = cajaRef.current.getBoundingClientRect();
    const ancho = Math.max(MINIMO, Math.min(m.ancho, caja.width));
    const alto = Math.max(MINIMO, Math.min(m.alto, caja.height));
    return {
      ancho,
      alto,
      x: Math.max(0, Math.min(m.x, caja.width - ancho)),
      y: Math.max(0, Math.min(m.y, caja.height - alto)),
    };
  };

  const iniciarGesto = (tipo) => (e) => {
    e.stopPropagation();
    const t = e.touches[0];
    gesto.current = { tipo, x: t.clientX, y: t.clientY, inicial: marco };
  };

  const moverGesto = (e) => {
    if (!gesto.current || !marco) return;
    const t = e.touches[0];
    const dx = t.clientX - gesto.current.x;
    const dy = t.clientY - gesto.current.y;
    const i = gesto.current.inicial;
    const propuesto = gesto.current.tipo === 'mover'
      ? { ...i, x: i.x + dx, y: i.y + dy }
      : { ...i, ancho: i.ancho + dx, alto: i.alto + dy };
    setMarco(limitarMarco(propuesto));
  };

  const terminarGesto = () => { gesto.current = null; };

  const tomar = async () => {
    if (!marco || tomando) return;
    setTomando(true);
    try {
      const caja = cajaRef.current.getBoundingClientRect();
      const archivo = await camara.current.recortar(videoRef.current, marco, { ancho: caja.width, alto: caja.height });
      onTomar(archivo);
    } catch {
      setError('No se pudo tomar la foto');
      setTomando(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex flex-col" style={{ backgroundColor: '#000' }}>
      <div className="flex items-center justify-between px-4 py-3 flex-shrink-0" style={{ backgroundColor: 'rgba(0,0,0,0.85)' }}>
        <button onClick={onCerrar} className="text-sm" style={{ color: '#e6edf3' }}>← Cancelar</button>
        <span className="text-xs" style={{ color: '#8b949e' }}>{titulo}</span>
      </div>

      <div
        ref={cajaRef}
        className="relative flex-1 overflow-hidden"
        onTouchMove={moverGesto}
        onTouchEnd={terminarGesto}
      >
        <video ref={videoRef} playsInline muted className="absolute inset-0 w-full h-full object-cover" />

        {marco && (
          <>
            {/* Lo de afuera del encuadre se oscurece, para que se vea qué entra en la foto */}
            {[
              { left: 0, top: 0, width: '100%', height: marco.y },
              { left: 0, top: marco.y + marco.alto, width: '100%', bottom: 0 },
              { left: 0, top: marco.y, width: marco.x, height: marco.alto },
              { left: marco.x + marco.ancho, top: marco.y, right: 0, height: marco.alto },
            ].map((lado, i) => (
              <div key={i} className="absolute pointer-events-none" style={{ ...lado, backgroundColor: 'rgba(0,0,0,0.55)' }} />
            ))}

            <div
              className="absolute border-2 rounded"
              style={{ left: marco.x, top: marco.y, width: marco.ancho, height: marco.alto, borderColor: '#3fb950' }}
              onTouchStart={iniciarGesto('mover')}
            >
              <div
                className="absolute -right-4 -bottom-4 w-10 h-10 rounded-full flex items-center justify-center"
                style={{ backgroundColor: '#3fb950' }}
                onTouchStart={iniciarGesto('tamano')}
              >
                <svg width="14" height="14" viewBox="0 0 16 16" fill="#fff">
                  <path d="M15 15H9v-2h4V9h2v6zM3 3h4V1H1v6h2V3z" />
                </svg>
              </div>
            </div>
          </>
        )}

        {error && (
          <div className="absolute inset-x-4 top-4 rounded-xl px-4 py-3" style={{ backgroundColor: '#161b22', border: '1px solid #f85149' }}>
            <p className="text-sm" style={{ color: '#f85149' }}>{error}</p>
          </div>
        )}
      </div>

      <div className="flex-shrink-0 px-6 py-5 flex items-center justify-center" style={{ backgroundColor: 'rgba(0,0,0,0.85)' }}>
        <button
          onClick={tomar}
          disabled={!marco || tomando}
          className="w-16 h-16 rounded-full border-4 disabled:opacity-40"
          style={{ borderColor: '#fff', backgroundColor: '#3fb950' }}
        />
      </div>

    </div>
  );
}
