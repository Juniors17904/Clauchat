import { useEffect, useState } from 'react';
import { TIENDAS } from '../../datos/tiendas';
import { GestorInstalacion } from '../../modelos/gestor_instalacion';
import { GestorSoftware } from '../../modelos/gestor_software';
import { RegistroCajas } from '../../modelos/registro_cajas';
import { PASOS_INSTALACION } from '../../datos/pasos_instalacion';
import { PROGRAMAS_SOFTWARE } from '../../datos/programas_software';
import PantallaAjustes from './PantallaAjustes';

const TABS = [
  {
    id: 'inicio', etiqueta: 'Inicio',
    Icono: ({ activo }) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill={activo ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
  },
  {
    id: 'ajustes', etiqueta: 'Ajustes',
    Icono: ({ activo }) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill={activo ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
      </svg>
    ),
  },
];

// Pantalla de entrada: en qué cadena se está trabajando. Cada una lleva sus propias
// cajas y su propio avance, porque se instala una tienda por día.
export default function PantallaTiendas({ onElegir, onRecordatorios, onAjustes, bloqueada = false, needRefresh, onActualizar }) {
  const [tabActual, setTabActual] = useState('inicio');
  const [promptInstalar, setPromptInstalar] = useState(null);

  useEffect(() => {
    const manejar = (e) => { e.preventDefault(); setPromptInstalar(e); };
    window.addEventListener('beforeinstallprompt', manejar);
    return () => window.removeEventListener('beforeinstallprompt', manejar);
  }, []);

  const instalarApp = async () => {
    if (!promptInstalar) return;
    promptInstalar.prompt();
    const { outcome } = await promptInstalar.userChoice;
    if (outcome === 'accepted') setPromptInstalar(null);
  };

  const avanceDe = (tiendaId) => {
    const cajas = new RegistroCajas(tiendaId).lista;
    const total = cajas.length * (PASOS_INSTALACION.length + PROGRAMAS_SOFTWARE.length);
    const hechos = cajas.reduce((suma, caja) =>
      suma + new GestorInstalacion(caja, tiendaId).totalCompletados + new GestorSoftware(caja, tiendaId).totalCompletados, 0);
    return { cajas: cajas.length, hechos, total, porcentaje: total > 0 ? Math.round((hechos / total) * 100) : 0 };
  };

  const irATab = (id) => (bloqueada ? onAjustes?.() : setTabActual(id));

  return (
    <div className="min-h-[100svh] flex flex-col select-none" style={{ backgroundColor: 'var(--fondo-base)', fontFamily: 'var(--fuente-sans)' }}>
      {needRefresh && (
        <div className="fixed top-0 left-0 right-0 z-50 px-4 py-2 flex items-center justify-between" style={{ backgroundColor: 'var(--fondo-elevado)', borderBottom: '1px solid var(--acento)' }}>
          <p className="text-xs" style={{ color: 'var(--acento)' }}>Nueva versión disponible</p>
          <button onClick={onActualizar} className="text-xs px-3 py-1 rounded-md" style={{ backgroundColor: 'var(--acento-btn)', color: '#fff' }}>
            Actualizar
          </button>
        </div>
      )}

      {/* Portada */}
      <div className="relative overflow-hidden flex-shrink-0 h-52">
        <img src="/hero-bg.png" alt="" className="w-full h-full object-cover object-center" draggable="false" />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.55), rgba(0,0,0,0.25), var(--fondo-base))' }} />
        <div className="absolute bottom-5 left-0 right-0 text-center px-6">
          <h1 className="text-3xl font-bold tracking-tight drop-shadow-lg" style={{ color: '#fff' }}>Migración Xstore</h1>
          <p className="mt-1 text-sm" style={{ color: 'rgba(255,255,255,0.6)' }}>Elegí en qué tienda estás</p>
        </div>
      </div>

      <div className="flex-1 pb-20">
        {tabActual === 'inicio' && (
          <div className="w-full max-w-sm mx-auto px-5 pt-5 pb-4 space-y-3">
            {TIENDAS.map((tienda, indice) => {
              const avance = avanceDe(tienda.id);
              return (
                <button
                  key={tienda.id}
                  onClick={() => onElegir(tienda)}
                  className="w-full rounded-2xl border p-5 text-left active:scale-[0.98] transition-all tarjeta-animada"
                  style={{ backgroundColor: 'var(--fondo-panel)', borderColor: tienda.color, animationDelay: `${indice * 60}ms` }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-1.5 h-6 rounded-full flex-shrink-0" style={{ backgroundColor: tienda.color }} />
                    <h2 className="text-xl font-extrabold uppercase tracking-wide" style={{ color: tienda.color }}>{tienda.nombre}</h2>
                    <span className="ml-auto text-xs font-mono" style={{ color: 'var(--texto-tenue)' }}>{avance.cajas} cajas</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--fondo-elevado)' }}>
                      <div className="h-full rounded-full transition-all" style={{ width: `${avance.porcentaje}%`, backgroundColor: tienda.color }} />
                    </div>
                    <span className="text-xs font-mono" style={{ color: avance.porcentaje === 100 ? tienda.color : 'var(--texto-tenue)' }}>
                      {avance.hechos}/{avance.total}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {tabActual === 'ajustes' && (
          <PantallaAjustes onRecordatorios={onRecordatorios} promptInstalar={promptInstalar} onInstalar={instalarApp} />
        )}
      </div>

      <nav className="fixed bottom-0 left-0 right-0 flex items-center justify-around z-30" style={{ backgroundColor: 'var(--fondo-panel)', borderTop: '1px solid var(--borde)', paddingBottom: 'env(safe-area-inset-bottom)' }}>
        {TABS.map(({ id, etiqueta, Icono }) => {
          const activo = tabActual === id;
          return (
            <button
              key={id}
              onClick={() => irATab(id)}
              className="flex flex-col items-center gap-1 py-3 px-8 transition-colors"
              style={{ color: activo ? 'var(--acento)' : 'var(--texto-tenue)' }}
            >
              <Icono activo={activo} />
              <span className="text-[10px]">{etiqueta}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
