import { useState, useRef, useEffect } from 'react';
import { VisorImagen } from '../modelos/visor_imagen';

// imagenes: [{ src, grupo, etiqueta, color }]  ·  indiceInicial  ·  onCerrar
export default function VisorGaleria({ imagenes, indiceInicial, onCerrar }) {
  const visor = useRef(new VisorImagen());
  const inicioX = useRef(null);
  const inicioY = useRef(null);
  const [indice, setIndice] = useState(indiceInicial);
  const [, setVersion] = useState(0);
  const [portada, setPortada] = useState(null);
  const [entrada, setEntrada] = useState('');

  const actual = imagenes[indice];
  const delGrupo = imagenes.filter(i => i.grupo === actual.grupo);
  const posEnGrupo = delGrupo.findIndex(i => i.src === actual.src) + 1;

  const irA = (nuevo, direccion) => {
    if (nuevo < 0 || nuevo >= imagenes.length) return;
    const grupoAntes = imagenes[indice].grupo;
    const grupoNuevo = imagenes[nuevo].grupo;
    visor.current.reiniciar();
    setEntrada(direccion === 'siguiente' ? 'desde-derecha' : 'desde-izquierda');
    setIndice(nuevo);
    if (grupoNuevo !== grupoAntes) {
      setPortada(imagenes[nuevo]);
    }
  };

  const siguiente = () => irA(indice + 1, 'siguiente');
  const anterior = () => irA(indice - 1, 'anterior');

  // La portada del nuevo punto se desvanece sola
  useEffect(() => {
    if (!portada) return;
    const t = setTimeout(() => setPortada(null), 900);
    return () => clearTimeout(t);
  }, [portada]);

  // Navegación por teclado (escritorio)
  useEffect(() => {
    const alTecla = (e) => {
      if (e.key === 'ArrowRight') siguiente();
      else if (e.key === 'ArrowLeft') anterior();
      else if (e.key === 'Escape') onCerrar();
    };
    window.addEventListener('keydown', alTecla);
    return () => window.removeEventListener('keydown', alTecla);
  }, [indice]);

  const hayAnterior = indice > 0;
  const haySiguiente = indice < imagenes.length - 1;

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col overflow-hidden"
      style={{ backgroundColor: 'rgba(0,0,0,0.94)', touchAction: 'none' }}
    >
      {/* Encabezado: punto actual + contador */}
      <div className="flex items-center gap-3 px-4 pt-4 pb-3 z-10">
        <div className="flex-1 min-w-0">
          <div key={actual.grupo} className="flex items-center gap-2 carita-pop" style={{ display: 'inline-flex' }}>
            <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0" style={{ backgroundColor: actual.color ?? '#3fb950', color: '#fff' }}>
              {actual.grupo}
            </span>
            <p className="text-sm font-semibold text-white truncate">{actual.etiqueta}</p>
          </div>
          <p className="text-[11px] mt-0.5" style={{ color: 'rgba(255,255,255,0.5)' }}>Foto {posEnGrupo} de {delGrupo.length}</p>
        </div>
        <button
          onClick={() => { visor.current.reiniciar(); onCerrar(); }}
          className="w-10 h-10 rounded-full flex items-center justify-center text-white text-xl flex-shrink-0"
          style={{ backgroundColor: 'rgba(255,255,255,0.15)' }}
        >
          ×
        </button>
      </div>

      {/* Imagen con zoom y swipe */}
      <div
        className="flex-1 relative flex items-center justify-center overflow-hidden"
        onTouchStart={(e) => {
          visor.current.manejarInicio(Array.from(e.touches));
          if (e.touches.length === 1) { inicioX.current = e.touches[0].clientX; inicioY.current = e.touches[0].clientY; }
        }}
        onTouchMove={(e) => { visor.current.manejarMovimiento(Array.from(e.touches)); setVersion(v => v + 1); }}
        onTouchEnd={(e) => {
          visor.current.manejarFin(Array.from(e.touches));
          if (!visor.current.ampliada && inicioX.current != null && e.changedTouches.length) {
            const dx = e.changedTouches[0].clientX - inicioX.current;
            const dy = e.changedTouches[0].clientY - (inicioY.current ?? 0);
            if (Math.abs(dx) > 55 && Math.abs(dx) > Math.abs(dy)) {
              dx < 0 ? siguiente() : anterior();
            }
          }
          inicioX.current = null;
          setVersion(v => v + 1);
        }}
        onWheel={(e) => { visor.current.manejarRueda(e.deltaY); setVersion(v => v + 1); }}
        onDoubleClick={() => { visor.current.alternarDobleClic(); setVersion(v => v + 1); }}
      >
        <img
          key={indice}
          src={actual.src}
          alt={actual.etiqueta}
          draggable="false"
          className={`max-w-full max-h-full rounded-lg select-none ${entrada}`}
          style={{ transform: visor.current.estilo, transition: visor.current.ampliada ? 'none' : 'transform 200ms ease' }}
        />

        {/* Flechas laterales */}
        {hayAnterior && (
          <button
            onClick={anterior}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center text-white text-lg"
            style={{ backgroundColor: 'rgba(255,255,255,0.12)' }}
          >
            ‹
          </button>
        )}
        {haySiguiente && (
          <button
            onClick={siguiente}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center text-white text-lg"
            style={{ backgroundColor: 'rgba(255,255,255,0.12)' }}
          >
            ›
          </button>
        )}

        {/* Portada al cambiar de punto */}
        {portada && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none portada-punto">
            <div className="flex flex-col items-center gap-3">
              <span className="w-20 h-20 rounded-2xl flex items-center justify-center text-4xl font-bold" style={{ backgroundColor: portada.color ?? '#3fb950', color: '#fff' }}>
                {portada.grupo}
              </span>
              <p className="text-base font-semibold text-white text-center px-8">{portada.etiqueta}</p>
            </div>
          </div>
        )}
      </div>

      {/* Barra de progreso del punto actual, dividida en tramos (uno por imagen) */}
      <div key={actual.grupo} className="flex items-center gap-1 px-6 pb-6 pt-2 carita-pop">
        {delGrupo.map((_, i) => (
          <div
            key={i}
            className="flex-1 rounded-full transition-all duration-200"
            style={{
              height: 4,
              backgroundColor: i < posEnGrupo ? (actual.color ?? '#3fb950') : 'rgba(255,255,255,0.2)',
            }}
          />
        ))}
      </div>
    </div>
  );
}
