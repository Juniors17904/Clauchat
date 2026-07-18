import { useState, useRef, useEffect } from 'react';
import { AREAS } from '../../datos/areas';
import { NIVELES } from '../../datos/niveles';
import { EJERCICIOS } from '../../datos/ejercicios';
import { GestorEstadisticas } from '../../modelos/gestor_estadisticas';
import { GestorTemas } from '../../modelos/gestor_temas';
import { MetaDiaria } from '../../modelos/meta_diaria';
import { GestorRespaldo } from '../../modelos/gestor_respaldo';
import { version } from '../../../package.json';

const UMBRAL_PULL = 65;

const COLORES_NIVEL = {
  1: { barra: '#3fb950', texto: '#3fb950' },
  2: { barra: '#39c5cf', texto: '#39c5cf' },
  3: { barra: '#388bfd', texto: '#388bfd' },
  4: { barra: '#8250df', texto: '#8250df' },
  5: { barra: '#d29922', texto: '#d29922' },
  6: { barra: '#e3b341', texto: '#e3b341' },
  7: { barra: '#f78166', texto: '#f78166' },
  8: { barra: '#f85149', texto: '#f85149' },
};

const AREA_ESTILOS = {
  'bases-de-datos': {
    color: '#3fb950',
    Icono: () => <img src="/iconos/bases-de-datos.png" alt="database" className="w-14 h-14 object-contain" style={{ filter: 'var(--filtro-icono)', mixBlendMode: 'var(--blend-icono)' }} />,
  },
  'programacion': {
    color: '#8250df',
    Icono: () => <img src="/iconos/programacion.png" alt="laptop" className="w-14 h-14 object-contain" style={{ filter: 'var(--filtro-icono)', mixBlendMode: 'var(--blend-icono)' }} />,
  },
  'redes': {
    color: '#388bfd',
    Icono: () => <img src="/iconos/redes.png" alt="globo" className="w-14 h-14 object-contain" style={{ filter: 'var(--filtro-icono)', mixBlendMode: 'var(--blend-icono)' }} />,
  },
  'inteligencia-artificial': {
    color: '#d29922',
    Icono: () => <img src="/iconos/cohete-ia.png" alt="cohete" className="w-14 h-14 object-contain" style={{ filter: 'var(--filtro-icono)', mixBlendMode: 'var(--blend-icono)' }} />,
  },
};

function TabInicio({ onSeleccionar, ultimaPosicion, onContinuar }) {
  return (
    <div className="w-full max-w-sm mx-auto px-5 pt-5 pb-4 space-y-3">

      {AREAS.map((area, indice) => {
        const estilos = AREA_ESTILOS[area.id] ?? AREA_ESTILOS['bases-de-datos'];
        const { color, Icono } = estilos;
        const esIA = area.id === 'inteligencia-artificial';
        const tieneContinuar = ultimaPosicion && area.id === 'bases-de-datos';

        return (
          <div
            key={area.id}
            className="rounded-2xl border overflow-hidden tarjeta-animada"
            style={{ backgroundColor: 'var(--fondo-panel)', borderColor: `${color}40`, animationDelay: `${indice * 60}ms` }}
          >
            <button
              onClick={() => area.disponible && onSeleccionar(area)}
              disabled={!area.disponible}
              className={`w-full flex items-center gap-4 px-5 py-5 text-left transition-all
                ${area.disponible ? 'active:scale-[0.98] cursor-pointer' : 'cursor-not-allowed'}`}
            >
              <div className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: 'var(--fondo-elevado)', color }}>
                <Icono />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-base font-sans" style={{ color: 'var(--texto-primario)' }}>{area.nombre}</p>
                <p className="text-xs mt-1 font-sans leading-relaxed" style={{ color: esIA ? color : 'var(--texto-secundario)' }}>
                  {area.descripcion}
                </p>
              </div>
              {area.disponible ? (
                <svg width="8" height="14" viewBox="0 0 8 14" fill="none" className="flex-shrink-0" style={{ color }}>
                  <path d="M1 1l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              ) : esIA ? (
                <svg width="16" height="16" viewBox="0 0 16 16" fill={color} className="flex-shrink-0 opacity-70">
                  <path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2zm3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z" />
                </svg>
              ) : (
                <svg width="8" height="14" viewBox="0 0 8 14" fill="none" className="flex-shrink-0 opacity-30" style={{ color }}>
                  <path d="M1 1l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </button>

            {tieneContinuar && (
              <button
                onClick={onContinuar}
                className="w-full flex items-center gap-3 px-5 py-3 border-t text-left transition-colors"
                style={{ borderColor: `${color}25` }}
              >
                <span className="text-sm" style={{ color: 'var(--acento)' }}>▶</span>
                <span className="text-xs font-sans font-medium" style={{ color: 'var(--acento)' }}>Continuar</span>
                <span className="text-xs font-sans" style={{ color: 'var(--texto-tenue)' }}>· {ultimaPosicion.tema.nombre}</span>
                <span className="ml-auto text-xs font-mono" style={{ color: 'var(--texto-tenue)' }}>{ultimaPosicion.completados}/{ultimaPosicion.total}</span>
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}

function formatearDuracion(segundos) {
  if (segundos < 60) return `${segundos}s`;
  const horas = Math.floor(segundos / 3600);
  const minutos = Math.floor((segundos % 3600) / 60);
  if (horas > 0) return `${horas}h ${minutos}m`;
  return `${minutos}m`;
}

function TabProgreso({ controladorPerfil }) {
  const gestorEstadisticas = useRef(new GestorEstadisticas());
  const resumen = controladorPerfil.resumenPorNivel(NIVELES, EJERCICIOS).filter(n => n.total > 0);
  const totalCompletados = resumen.reduce((a, n) => a + n.completados, 0);
  const totalEjercicios = resumen.reduce((a, n) => a + n.total, 0);

  const racha = gestorEstadisticas.current.racha;
  const tiempoTotal = gestorEstadisticas.current.tiempoTotalSegundos;
  const estaSemana = gestorEstadisticas.current.ejerciciosEstaSemana;
  const semana = gestorEstadisticas.current.actividadSemanal();
  const ultimas = gestorEstadisticas.current.ultimas(5);

  const maxMinutos = Math.max(...semana.map(d => d.minutos), 1);
  const indicePico = semana.reduce((mejor, d, i) => (d.minutos > semana[mejor].minutos ? i : mejor), 0);
  const maxSegundosEj = Math.max(...ultimas.map(a => a.segundos), 1);

  return (
    <div className="w-full max-w-sm mx-auto px-5 pt-6 pb-4">
      <h2 className="text-lg font-semibold font-sans mb-1" style={{ color: 'var(--texto-primario)' }}>Mi Progreso</h2>
      <p className="text-xs font-sans mb-5" style={{ color: 'var(--texto-secundario)' }}>{totalCompletados} de {totalEjercicios} ejercicios completados</p>

      {/* Racha de días */}
      <div className="rounded-xl border p-4 mb-3 flex items-center gap-4 tarjeta-animada" style={{ backgroundColor: 'var(--fondo-panel)', borderColor: 'var(--borde)' }}>
        <span className="text-3xl">🔥</span>
        <div className="flex-1">
          <p className="text-2xl font-bold font-mono leading-none" style={{ color: 'var(--texto-primario)' }}>{racha}</p>
          <p className="text-xs font-sans mt-1" style={{ color: 'var(--texto-secundario)' }}>
            {racha === 0 ? 'Completa un ejercicio hoy para iniciar tu racha' : racha === 1 ? 'día de racha' : 'días seguidos practicando'}
          </p>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-2 gap-3 mb-3">
        <div className="rounded-xl border p-4 tarjeta-animada" style={{ backgroundColor: 'var(--fondo-panel)', borderColor: 'var(--borde)', animationDelay: '50ms' }}>
          <p className="text-xl font-bold font-mono leading-none" style={{ color: 'var(--texto-primario)' }}>{formatearDuracion(tiempoTotal)}</p>
          <p className="text-xs font-sans mt-1.5" style={{ color: 'var(--texto-secundario)' }}>Tiempo total</p>
        </div>
        <div className="rounded-xl border p-4 tarjeta-animada" style={{ backgroundColor: 'var(--fondo-panel)', borderColor: 'var(--borde)', animationDelay: '100ms' }}>
          <p className="text-xl font-bold font-mono leading-none" style={{ color: 'var(--texto-primario)' }}>{estaSemana}</p>
          <p className="text-xs font-sans mt-1.5" style={{ color: 'var(--texto-secundario)' }}>Ejercicios esta semana</p>
        </div>
      </div>

      {/* Actividad semanal */}
      <div className="rounded-xl border p-4 mb-3 tarjeta-animada" style={{ backgroundColor: 'var(--fondo-panel)', borderColor: 'var(--borde)', animationDelay: '150ms' }}>
        <p className="text-xs font-semibold font-sans mb-3" style={{ color: 'var(--texto-secundario)' }}>Actividad semanal · minutos por día</p>
        <div className="flex items-end gap-1.5 h-24">
          {semana.map((dia, i) => (
            <div key={i} className="flex-1 flex flex-col items-center justify-end h-full gap-1">
              {i === indicePico && dia.minutos > 0 && (
                <span className="text-[10px] font-mono leading-none" style={{ color: 'var(--texto-secundario)' }}>{dia.minutos}m</span>
              )}
              <div
                className="w-full rounded-t"
                style={{
                  height: dia.minutos > 0 ? `${Math.max((dia.minutos / maxMinutos) * 100, 8)}%` : '4px',
                  backgroundColor: dia.minutos > 0 ? 'var(--acento)' : 'var(--fondo-elevado)',
                }}
              />
            </div>
          ))}
        </div>
        <div className="flex gap-1.5 mt-1.5">
          {semana.map((dia, i) => (
            <span key={i} className="flex-1 text-center text-[10px] font-sans" style={{ color: dia.esHoy ? 'var(--acento)' : 'var(--texto-tenue)', fontWeight: dia.esHoy ? 700 : 400 }}>
              {dia.etiqueta}
            </span>
          ))}
        </div>
      </div>

      {/* Tiempo por ejercicio */}
      {ultimas.length > 0 && (
        <div className="rounded-xl border p-4 mb-3 tarjeta-animada" style={{ backgroundColor: 'var(--fondo-panel)', borderColor: 'var(--borde)', animationDelay: '200ms' }}>
          <p className="text-xs font-semibold font-sans mb-3" style={{ color: 'var(--texto-secundario)' }}>Últimos ejercicios · tiempo dedicado</p>
          <div className="space-y-3">
            {ultimas.map((actividad, i) => {
              const ejercicio = EJERCICIOS.find(e => e.id === actividad.ejercicioId);
              return (
                <div key={`${actividad.ejercicioId}-${i}`}>
                  <div className="flex justify-between items-center mb-1">
                    <p className="text-xs font-sans truncate flex-1 mr-2" style={{ color: 'var(--texto-primario)' }}>{ejercicio?.titulo ?? actividad.ejercicioId}</p>
                    <span className="text-[10px] font-mono flex-shrink-0" style={{ color: 'var(--texto-secundario)' }}>{formatearDuracion(actividad.segundos)}</span>
                  </div>
                  <div className="h-1 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--fondo-elevado)' }}>
                    <div className="h-full rounded-full" style={{ width: `${Math.max((actividad.segundos / maxSegundosEj) * 100, 4)}%`, backgroundColor: 'var(--acento)' }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Progreso por nivel */}
      {resumen.filter(n => n.completados > 0).length === 0 ? (
        <p className="text-sm font-sans text-center mt-8" style={{ color: 'var(--texto-tenue)' }}>Aún no has completado ningún ejercicio.</p>
      ) : (
        <div className="rounded-xl border p-4 tarjeta-animada" style={{ backgroundColor: 'var(--fondo-panel)', borderColor: 'var(--borde)', animationDelay: '250ms' }}>
          <p className="text-xs font-semibold font-sans mb-4" style={{ color: 'var(--texto-secundario)' }}>Progreso por nivel</p>
          <div className="space-y-5">
            {resumen.filter(n => n.completados > 0).map(({ nombre, orden, completados, total }) => {
              const color = COLORES_NIVEL[orden] ?? COLORES_NIVEL[1];
              const porcentaje = (completados / total) * 100;
              return (
                <div key={nombre}>
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-sm font-sans" style={{ color: 'var(--texto-primario)' }}>{nombre}</p>
                    <p className="text-xs font-mono">
                      <span style={{ color: color.texto }}>{completados}</span>
                      <span style={{ color: 'var(--texto-tenue)' }}>/{total}</span>
                    </p>
                  </div>
                  <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--fondo-elevado)' }}>
                    <div className="h-full rounded-full transition-all duration-500" style={{ width: `${porcentaje}%`, backgroundColor: color.barra }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function TabFavoritos() {
  return (
    <div className="flex flex-col items-center justify-center flex-1 px-8 text-center pt-20">
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" strokeWidth="1.5" className="mb-4" style={{ stroke: 'var(--borde)' }}>
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
      <p className="text-sm font-sans" style={{ color: 'var(--texto-tenue)' }}>Favoritos próximamente</p>
      <p className="text-xs font-sans mt-2" style={{ color: 'var(--borde)' }}>Podrás guardar tus ejercicios y temas favoritos aquí</p>
    </div>
  );
}

function TabAjustes({ controladorPerfil, onVerArbol, onRecordatorios, promptInstalar, onInstalar }) {
  const gestorTemas = useRef(new GestorTemas());
  const metaDiaria = useRef(new MetaDiaria());
  const gestorRespaldo = useRef(new GestorRespaldo());
  const gestorEstadisticas = useRef(new GestorEstadisticas());
  const archivoRef = useRef(null);

  const [nombre, setNombre] = useState(controladorPerfil.nombre);
  const [editando, setEditando] = useState(false);
  const [confirmando, setConfirmando] = useState(false);
  const [temaId, setTemaId] = useState(gestorTemas.current.temaActual.id);
  const [temaGlobal, setTemaGlobal] = useState(gestorTemas.current.esGlobal);
  const [objetivo, setObjetivo] = useState(metaDiaria.current.objetivo);
  const [textoImportar, setTextoImportar] = useState(null);
  const [avisoImportar, setAvisoImportar] = useState(null);

  const ejerciciosHoy = gestorEstadisticas.current.ejerciciosHoy;

  const handleNombre = (e) => {
    setNombre(e.target.value);
    controladorPerfil.nombre = e.target.value;
  };

  const cambiarTema = (id) => {
    gestorTemas.current.cambiar(id);
    setTemaId(id);
  };

  const cambiarObjetivo = (n) => {
    metaDiaria.current.cambiar(n);
    setObjetivo(n);
  };

  const seleccionarArchivo = (e) => {
    const archivo = e.target.files?.[0];
    e.target.value = '';
    if (!archivo) return;
    const lector = new FileReader();
    lector.onload = () => setTextoImportar(lector.result);
    lector.readAsText(archivo);
  };

  const confirmarImportar = () => {
    const ok = gestorRespaldo.current.importar(textoImportar);
    setTextoImportar(null);
    if (ok) {
      window.location.reload();
    } else {
      setAvisoImportar('El archivo no es un respaldo válido de DevLab.');
    }
  };

  return (
    <div className="w-full max-w-sm mx-auto px-5 pt-6 pb-4 space-y-6">
      <h2 className="text-lg font-semibold font-sans" style={{ color: 'var(--texto-primario)' }}>Ajustes</h2>

      <div>
        <p className="text-xs mb-2 font-sans" style={{ color: 'var(--texto-secundario)' }}>Tu nombre</p>
        {editando ? (
          <input
            autoFocus
            value={nombre}
            onChange={handleNombre}
            onBlur={() => setEditando(false)}
            onKeyDown={e => e.key === 'Enter' && setEditando(false)}
            placeholder="Escribe tu nombre..."
            className="w-full border rounded-xl px-4 py-3 text-sm font-sans focus:outline-none"
            style={{ backgroundColor: 'var(--fondo-base)', borderColor: 'var(--acento)', color: 'var(--texto-primario)' }}
          />
        ) : (
          <button
            onClick={() => setEditando(true)}
            className="w-full flex items-center justify-between px-4 py-3 border rounded-xl hover:border-[#8b949e] transition-colors"
            style={{ backgroundColor: 'var(--fondo-panel)', borderColor: 'var(--borde)' }}
          >
            <span className="text-sm font-sans" style={{ color: nombre ? 'var(--texto-primario)' : 'var(--texto-tenue)' }}>
              {nombre || 'Escribe tu nombre...'}
            </span>
            <span className="text-xs" style={{ color: 'var(--texto-tenue)' }}>✎</span>
          </button>
        )}
      </div>

      {/* Tema visual */}
      <div>
        <p className="text-xs mb-2 font-sans" style={{ color: 'var(--texto-secundario)' }}>Tema visual</p>
        <div className="grid grid-cols-2 gap-2">
          {gestorTemas.current.temas.map(t => {
            const c = t.colores;
            const activo = temaId === t.id;
            return (
              <button
                key={t.id}
                onClick={() => cambiarTema(t.id)}
                className="p-2.5 rounded-xl border-2 transition-all text-left"
                style={{ backgroundColor: c['fondo-base'], borderColor: activo ? c['acento'] : c['borde'] }}
              >
                <div className="flex gap-1 mb-1.5">
                  <div className="w-3.5 h-3.5 rounded-sm" style={{ backgroundColor: c['acento'] }} />
                  <div className="w-3.5 h-3.5 rounded-sm" style={{ backgroundColor: c['sintaxis-clave'] }} />
                  <div className="w-3.5 h-3.5 rounded-sm" style={{ backgroundColor: c['sintaxis-cadena'] }} />
                  <div className="w-3.5 h-3.5 rounded-sm" style={{ backgroundColor: c['sintaxis-funcion'] }} />
                </div>
                <span className="text-[11px] font-medium font-sans" style={{ color: c['texto-primario'] }}>{t.nombre}</span>
              </button>
            );
          })}
        </div>
        <div className="flex items-center justify-between mt-3">
          <div>
            <p className="text-xs font-sans" style={{ color: 'var(--texto-secundario)' }}>Aplicar a toda la app</p>
            <p className="text-[10px] mt-0.5 font-sans" style={{ color: 'var(--texto-tenue)' }}>Cambia colores en todas las pantallas</p>
          </div>
          <button
            onClick={() => { gestorTemas.current.alternarGlobal(); setTemaGlobal(gestorTemas.current.esGlobal); }}
            className="relative w-10 h-[22px] rounded-full transition-colors duration-200 flex-shrink-0"
            style={{ backgroundColor: temaGlobal ? 'var(--acento)' : 'var(--fondo-elevado)' }}
          >
            <div
              className="absolute top-[3px] w-4 h-4 rounded-full transition-all duration-200"
              style={{ left: temaGlobal ? 21 : 3, backgroundColor: temaGlobal ? '#fff' : 'var(--texto-tenue)' }}
            />
          </button>
        </div>
      </div>

      {/* Meta diaria */}
      <div>
        <p className="text-xs mb-2 font-sans" style={{ color: 'var(--texto-secundario)' }}>Meta diaria de ejercicios</p>
        <div className="flex gap-2">
          {[3, 5, 10].map(n => (
            <button
              key={n}
              onClick={() => cambiarObjetivo(n)}
              className="flex-1 py-2.5 rounded-xl border text-sm font-mono transition-colors"
              style={{
                backgroundColor: objetivo === n ? 'var(--acento-suave)' : 'var(--fondo-panel)',
                borderColor: objetivo === n ? 'var(--acento)' : 'var(--borde)',
                color: objetivo === n ? 'var(--acento)' : 'var(--texto-secundario)',
              }}
            >
              {n}
            </button>
          ))}
        </div>
        <p className="text-[11px] mt-2 font-sans" style={{ color: metaDiaria.current.cumplida(ejerciciosHoy) ? 'var(--acento)' : 'var(--texto-tenue)' }}>
          {metaDiaria.current.cumplida(ejerciciosHoy)
            ? `✓ Meta cumplida hoy: ${ejerciciosHoy}/${objetivo} ejercicios`
            : `Hoy llevas ${ejerciciosHoy}/${objetivo} ejercicios`}
        </p>
      </div>

      {onRecordatorios && (
        <button
          onClick={onRecordatorios}
          className="w-full py-3 border rounded-xl hover:text-white text-sm font-sans transition-colors flex items-center justify-center gap-2"
          style={{ borderColor: 'var(--borde)', color: 'var(--texto-secundario)' }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
          Recordatorios
        </button>
      )}

      {onVerArbol && (
        <button
          onClick={onVerArbol}
          className="w-full py-3 border rounded-xl hover:text-white text-sm font-sans transition-colors"
          style={{ borderColor: 'var(--borde)', color: 'var(--texto-secundario)' }}
        >
          📋 Ver currículo completo
        </button>
      )}

      {/* Respaldo del progreso */}
      <div>
        <p className="text-xs mb-2 font-sans" style={{ color: 'var(--texto-secundario)' }}>Respaldo de tu avance</p>
        {textoImportar ? (
          <div className="space-y-3">
            <p className="text-xs font-sans" style={{ color: 'var(--advertencia)' }}>Esto reemplazará tu avance actual con el del archivo. ¿Continuar?</p>
            <div className="flex gap-2">
              <button
                onClick={confirmarImportar}
                className="flex-1 py-2.5 text-sm rounded-xl font-sans transition-colors"
                style={{ backgroundColor: 'var(--acento-btn)', color: '#fff' }}
              >
                Importar
              </button>
              <button
                onClick={() => setTextoImportar(null)}
                className="flex-1 py-2.5 border hover:text-white text-sm rounded-xl font-sans transition-colors"
                style={{ borderColor: 'var(--borde)', color: 'var(--texto-secundario)' }}
              >
                Cancelar
              </button>
            </div>
          </div>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={() => gestorRespaldo.current.descargar()}
              className="flex-1 py-3 border rounded-xl hover:text-white text-sm font-sans transition-colors flex items-center justify-center gap-2"
              style={{ borderColor: 'var(--borde)', color: 'var(--texto-secundario)' }}
            >
              <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
                <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"/>
                <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z"/>
              </svg>
              Exportar
            </button>
            <button
              onClick={() => archivoRef.current?.click()}
              className="flex-1 py-3 border rounded-xl hover:text-white text-sm font-sans transition-colors flex items-center justify-center gap-2"
              style={{ borderColor: 'var(--borde)', color: 'var(--texto-secundario)' }}
            >
              <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
                <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"/>
                <path d="M7.646 1.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 2.707V11.5a.5.5 0 0 1-1 0V2.707L5.354 4.854a.5.5 0 1 1-.708-.708l3-3z"/>
              </svg>
              Importar
            </button>
            <input ref={archivoRef} type="file" accept=".json,application/json" onChange={seleccionarArchivo} className="hidden" />
          </div>
        )}
        {avisoImportar && (
          <p className="text-[11px] mt-2 font-sans" style={{ color: 'var(--error)' }}>{avisoImportar}</p>
        )}
        <p className="text-[10px] mt-2 font-sans" style={{ color: 'var(--texto-tenue)' }}>Tu avance vive en este navegador. Exportalo para no perderlo o llevarlo a otro dispositivo.</p>
      </div>

      <div className="pt-2">
        {confirmando ? (
          <div className="space-y-3">
            <p className="text-xs font-sans" style={{ color: 'var(--error)' }}>¿Borrar todo el avance? No se puede deshacer.</p>
            <div className="flex gap-2">
              <button
                onClick={() => { controladorPerfil.borrarAvance(); setConfirmando(false); }}
                className="flex-1 py-2.5 text-sm rounded-xl font-sans transition-colors"
                style={{ backgroundColor: 'var(--error)', color: '#fff' }}
              >
                Confirmar
              </button>
              <button
                onClick={() => setConfirmando(false)}
                className="flex-1 py-2.5 border hover:text-white text-sm rounded-xl font-sans transition-colors"
                style={{ borderColor: 'var(--borde)', color: 'var(--texto-secundario)' }}
              >
                Cancelar
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setConfirmando(true)}
            className="w-full py-3 border text-sm rounded-xl font-sans transition-colors"
            style={{ borderColor: 'color-mix(in srgb, var(--error) 40%, transparent)', color: 'var(--error)' }}
          >
            🗑️ Borrar todo el avance
          </button>
        )}
      </div>

      {/* Acerca de */}
      <div className="pt-2 pb-2 border-t" style={{ borderColor: 'var(--borde)' }}>
        <div className="flex items-center justify-between mt-3">
          <div>
            <p className="text-sm font-semibold font-sans" style={{ color: 'var(--texto-primario)' }}>DevLab</p>
            <p className="text-[11px] font-sans mt-0.5" style={{ color: 'var(--texto-tenue)' }}>Versión {version} · Funciona sin conexión</p>
          </div>
          {promptInstalar && (
            <button
              onClick={onInstalar}
              className="px-3 py-2 rounded-xl border text-xs font-sans transition-colors"
              style={{ borderColor: 'var(--acento)', color: 'var(--acento)' }}
            >
              Instalar app
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

const TABS_NAV = [
  {
    id: 'inicio', label: 'Inicio',
    Icono: ({ activo }) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill={activo ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
  },
  {
    id: 'progreso', label: 'Progreso',
    Icono: ({ activo }) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill={activo ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="20" x2="18" y2="10" />
        <line x1="12" y1="20" x2="12" y2="4" />
        <line x1="6" y1="20" x2="6" y2="14" />
      </svg>
    ),
  },
  {
    id: 'favoritos', label: 'Favoritos',
    Icono: ({ activo }) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill={activo ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    ),
  },
  {
    id: 'ajustes', label: 'Ajustes',
    Icono: ({ activo }) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill={activo ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
      </svg>
    ),
  },
];

export default function PantallaAreas({ onSeleccionar, controladorPerfil, onVerArbol, onRecordatorios, needRefresh, onActualizar, ultimaPosicion, onContinuar }) {
  const [tabActual, setTabActual] = useState('inicio');
  const [distanciaTiro, setDistanciaTiro] = useState(0);
  const [actualizando, setActualizando] = useState(false);
  const [promptInstalar, setPromptInstalar] = useState(null);
  const inicioRef = useRef(null);

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

  const manejarTouchStart = (e) => { inicioRef.current = e.touches[0].clientY; };
  const manejarTouchMove = (e) => {
    if (inicioRef.current === null) return;
    const delta = e.touches[0].clientY - inicioRef.current;
    if (delta > 0) setDistanciaTiro(Math.min(delta, UMBRAL_PULL * 1.5));
  };
  const manejarTouchEnd = () => {
    if (distanciaTiro >= UMBRAL_PULL) { setActualizando(true); window.location.reload(); }
    setDistanciaTiro(0);
    inicioRef.current = null;
  };

  const tirando = distanciaTiro > 8;
  const listoParaSoltar = distanciaTiro >= UMBRAL_PULL;
  const opacidadIndicador = Math.min(distanciaTiro / UMBRAL_PULL, 1);

  return (
    <div
      className="min-h-[100svh] flex flex-col select-none relative"
      style={{ backgroundColor: 'var(--fondo-base)' }}
      onTouchStart={manejarTouchStart}
      onTouchMove={manejarTouchMove}
      onTouchEnd={manejarTouchEnd}
    >
      {needRefresh && !actualizando && (
        <div className="fixed top-0 left-0 right-0 z-50 px-4 py-2 flex items-center justify-between font-sans" style={{ backgroundColor: 'var(--fondo-elevado)', borderBottom: '1px solid var(--acento)' }}>
          <p className="text-xs" style={{ color: 'var(--acento)' }}>Nueva versión disponible</p>
          <button onClick={() => { setActualizando(true); onActualizar(); }} className="text-xs px-3 py-1 rounded-md transition-colors" style={{ backgroundColor: 'var(--acento-btn)', color: '#fff' }}>
            Actualizar
          </button>
        </div>
      )}

      {(tirando || actualizando) && (
        <div className="fixed top-3 left-0 right-0 flex justify-center z-40 pointer-events-none" style={{ opacity: actualizando ? 1 : opacidadIndicador }}>
          <p className="text-xs font-sans" style={{ color: 'var(--texto-tenue)' }}>
            {actualizando ? '↻ Actualizando...' : listoParaSoltar ? '↑ Suelta para actualizar' : '↓ Desliza para actualizar'}
          </p>
        </div>
      )}

      <div className={`relative overflow-hidden flex-shrink-0 ${needRefresh ? 'h-52' : 'h-60'}`}>
        {(() => { const esClasico = localStorage.getItem('tema-visual') === 'clasico'; return (<>
        <img src={esClasico ? '/banner-claro.png' : '/hero-bg.png'} alt="" className="w-full h-full object-cover object-center" draggable="false" />
        <div className="absolute inset-0" style={{ background: esClasico
          ? 'linear-gradient(to bottom, rgba(255,255,255,0.5), rgba(255,255,255,0.2), var(--fondo-base))'
          : 'linear-gradient(to bottom, rgba(0,0,0,0.5), rgba(0,0,0,0.2), var(--fondo-base))' }} />
        <button
          onClick={() => setTabActual('ajustes')}
          className={`absolute top-4 right-4 w-10 h-10 rounded-full border flex items-center justify-center transition-colors backdrop-blur-sm ${esClasico ? 'bg-white/40 border-black/10 text-black/50 hover:text-black hover:border-black/30' : 'bg-black/40 border-white/20 text-white/70 hover:text-white hover:border-white/50'}`}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
          </svg>
        </button>

        <button
          className={`absolute top-4 left-4 w-10 h-10 rounded-full border flex items-center justify-center transition-colors backdrop-blur-sm ${esClasico ? 'bg-white/40 border-black/10 text-black/50 hover:text-black hover:border-black/30' : 'bg-black/40 border-white/20 text-white/70 hover:text-white hover:border-white/50'}`}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="18" cy="5" r="3" />
            <circle cx="6" cy="12" r="3" />
            <circle cx="18" cy="19" r="3" />
            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
            <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
          </svg>
        </button>

        {promptInstalar && (
          <button
            onClick={instalarApp}
            className={`absolute top-16 left-4 flex items-center gap-2 px-3 py-1.5 rounded-full border transition-colors text-xs font-sans backdrop-blur-sm ${esClasico ? 'bg-white/40 border-black/10 text-black/50 hover:text-black hover:border-black/30' : 'bg-black/40 border-white/20 text-white/70 hover:text-white hover:border-white/50'}`}
          >
            <svg width="13" height="13" viewBox="0 0 16 16" fill="currentColor">
              <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"/>
              <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z"/>
            </svg>
            Instalar app
          </button>
        )}
        <div className="absolute bottom-5 left-0 right-0 text-center px-6">
          <h1 className="text-4xl font-bold tracking-tight font-sans drop-shadow-lg" style={{ color: esClasico ? '#1f2328' : '#fff' }}>DevLab</h1>
          <p className="mt-1 text-sm font-sans" style={{ color: esClasico ? 'rgba(31,35,40,0.5)' : 'rgba(255,255,255,0.6)' }}>Elige un área de estudio</p>
        </div>
        </>); })()}
      </div>

      <div className="flex-1 pb-20">
        {tabActual === 'inicio' && (
          <TabInicio
            onSeleccionar={onSeleccionar}
            ultimaPosicion={ultimaPosicion}
            onContinuar={onContinuar}
          />
        )}
        {tabActual === 'progreso' && <TabProgreso controladorPerfil={controladorPerfil} />}
        {tabActual === 'favoritos' && <TabFavoritos />}
        {tabActual === 'ajustes' && <TabAjustes controladorPerfil={controladorPerfil} onVerArbol={() => { onVerArbol?.(); }} onRecordatorios={onRecordatorios} promptInstalar={promptInstalar} onInstalar={instalarApp} />}
      </div>

      <nav className="fixed bottom-0 left-0 right-0 flex items-center justify-around z-30" style={{ backgroundColor: 'var(--fondo-panel)', borderTop: '1px solid var(--borde)', paddingBottom: 'env(safe-area-inset-bottom)' }}>
        {TABS_NAV.map(({ id, label, Icono }) => {
          const activo = tabActual === id;
          return (
            <button
              key={id}
              onClick={() => setTabActual(id)}
              className="flex flex-col items-center gap-1 py-3 px-5 transition-colors"
              style={{ color: activo ? 'var(--acento)' : 'var(--texto-tenue)' }}
            >
              <Icono activo={activo} />
              <span className="text-[10px] font-sans">{label}</span>
              {activo && <div className="absolute bottom-0 w-8 h-0.5 rounded-full" style={{ backgroundColor: 'var(--acento)' }} />}
            </button>
          );
        })}
      </nav>
    </div>
  );
}
