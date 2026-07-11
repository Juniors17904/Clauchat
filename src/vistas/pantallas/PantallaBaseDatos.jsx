import { useState } from 'react';
import { NIVELES } from '../../datos/niveles';
import { EJERCICIOS } from '../../datos/ejercicios';
import { TEMAS } from '../../datos/temas';

const ESPECIALIDADES = {
  'sql-base': {
    nombre: 'SQL Estándar',
    descripcion: 'Aprende SQL puro. Este curso es la base para cualquier motor de base de datos.',
    icono: '/iconos/sql-base.png',
    color: '#3fb950',
    recomendado: true,
    niveles: 8,
    ejercicios: 120,
    horas: 18,
    progreso: 32,
    bloqueado: false,
    estado: 'continuar',
  },
  'postgresql': {
    nombre: 'PostgreSQL',
    descripcion: 'Sintaxis y funciones propias de PostgreSQL.',
    icono: '/iconos/postgresql.png',
    color: '#336791',
    recomendado: false,
    bloqueado: false,
    estado: 'continuar',
  },
  'sql-server': {
    nombre: 'SQL Server',
    descripcion: 'Aprende T-SQL, TOP, IDENTITY, GETDATE(), procedimientos almacenados, etc.',
    icono: '/iconos/sql-server.png',
    color: '#0078D4',
    recomendado: false,
    bloqueado: false,
    estado: 'proximamente',
    requisito: 'Próximamente',
  },
  'mysql': {
    nombre: 'MySQL',
    descripcion: 'Aprende AUTO_INCREMENT, IFNULL(), LIMIT, GROUP_CONCAT(), etc.',
    icono: '/iconos/mysql.png',
    color: '#00758F',
    recomendado: false,
    bloqueado: false,
    estado: 'proximamente',
    requisito: 'Próximamente',
  },
  'oracle': {
    nombre: 'Oracle',
    descripcion: 'Aprende ROWNUM, Sequences, NVL(), DECODE(), PL/SQL, etc.',
    icono: '/iconos/oracle.png',
    color: '#F80000',
    recomendado: false,
    niveles: 4,
    ejercicios: 33,
    horas: 12,
    progreso: 0,
    bloqueado: false,
    estado: 'proximamente',
    requisito: 'Próximamente',
  },
};

function PantallaBaseDatos({ onSeleccionar, ultimaPosicion, onContinuar, onEmpezar, onVolver, controladorPerfil }) {
  const [seleccionada, setSeleccionada] = useState('sql-base');

  const nivelesDelArea = NIVELES.filter(n => n.areaId === 'sql-estandar');
  const idsNiveles = new Set(nivelesDelArea.map(n => n.id));
  const temasDelArea = TEMAS.filter(t => idsNiveles.has(t.nivelId));
  const ejerciciosDelArea = EJERCICIOS.filter(e => idsNiveles.has(e.nivelId));
  const totalNiveles = nivelesDelArea.length;
  const totalTemas = temasDelArea.length;
  const totalEjercicios = ejerciciosDelArea.length;
  const completados = controladorPerfil
    ? ejerciciosDelArea.filter(e => controladorPerfil.estaCompletado(e.id)).length
    : 0;
  const porcentaje = totalEjercicios > 0 ? Math.round((completados / totalEjercicios) * 100) : 0;
  const horasEstimadas = Math.max(1, Math.round(totalEjercicios * 10 / 60));

  const handleSeleccionar = (id) => {
    const esp = ESPECIALIDADES[id];
    if (esp.bloqueado && esp.estado === 'bloqueado') return;
    setSeleccionada(id);
    const areaId = id === 'sql-base' ? 'sql-estandar' : id;
    onSeleccionar?.(areaId);
  };

  return (
    <div className="min-h-[100svh] flex flex-col select-none" style={{ backgroundColor: 'var(--fondo-base)' }}>
      <div className="w-full max-w-sm mx-auto px-5 pt-5 pb-4">
        <button
          onClick={onVolver}
          className="hover:text-white transition-colors mb-4 flex items-center gap-2 text-sm"
          style={{ color: 'var(--texto-secundario)' }}
        >
          ← Volver
        </button>

        <div className="mb-6">
          <div className="flex items-center gap-3 mb-3">
            <img src="/iconos/bases-de-datos.png" alt="database" className="w-10 h-10 object-contain" style={{ filter: 'var(--filtro-icono)' }} />
            <h1 className="text-2xl font-bold" style={{ color: 'var(--texto-primario)' }}>Bases de Datos</h1>
          </div>
          <p className="text-sm font-sans leading-relaxed" style={{ color: 'var(--texto-secundario)' }}>
            Aprende SQL desde cero y luego especialízate en el motor que utilizarás.
          </p>
        </div>

        <div
          onClick={() => handleSeleccionar('sql-base')}
          className="mb-6 rounded-2xl border p-5 overflow-hidden cursor-pointer active:scale-[0.98] transition-all"
          style={{ backgroundColor: 'var(--fondo-panel)', borderColor: 'var(--acento-suave)' }}
        >
          <div className="flex items-start gap-4 mb-4">
            <div className="w-11 h-11 flex-shrink-0 flex items-center justify-center">
              <img src={ESPECIALIDADES['sql-base'].icono} alt="SQL" className="w-full h-full object-contain" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-lg font-bold" style={{ color: 'var(--texto-primario)' }}>SQL Estándar</h2>
              </div>
              <p className="text-xs font-sans" style={{ color: 'var(--texto-secundario)' }}>
                Aprende SQL puro. Este curso es la base para cualquier motor de base de datos.
              </p>
            </div>
            <div className="text-right flex-shrink-0">
              <p className="text-2xl font-bold" style={{ color: 'var(--acento)' }}>{porcentaje}%</p>
              <p className="text-xs font-sans" style={{ color: 'var(--texto-secundario)' }}>Completado</p>
            </div>
          </div>

          <div className="w-full h-2 rounded-full mb-4 overflow-hidden" style={{ backgroundColor: 'var(--fondo-elevado)' }}>
            <div
              className="h-full rounded-full transition-all"
              style={{ width: `${porcentaje}%`, backgroundColor: 'var(--acento)' }}
            />
          </div>

          <div className="flex items-center justify-between mb-4 text-xs font-sans" style={{ color: 'var(--texto-secundario)' }}>
            <div className="flex items-center gap-1">
              <span>📚</span>
              <span>{totalNiveles} niveles</span>
            </div>
            <div className="flex items-center gap-1">
              <span>📖</span>
              <span>{totalTemas} temas</span>
            </div>
            <div className="flex items-center gap-1">
              <span>📝</span>
              <span>{totalEjercicios} ejercicios</span>
            </div>
            <div className="flex items-center gap-1">
              <span>⏱️</span>
              <span>{horasEstimadas} horas</span>
            </div>
          </div>

          <button
            onClick={(e) => { e.stopPropagation(); ultimaPosicion ? onContinuar?.() : onEmpezar?.(); }}
            className="w-full py-2 px-4 font-semibold rounded-lg active:scale-[0.98] transition-all text-sm font-sans"
            style={{ backgroundColor: 'var(--acento)', color: '#fff' }}
          >
            {ultimaPosicion ? '▶ Continuar' : '▶ Empezar'}
          </button>
          {ultimaPosicion && (() => {
            const nivel = NIVELES.find(n => n.id === ultimaPosicion.tema.nivelId);
            return (
              <p className="text-center text-xs font-sans mt-2" style={{ color: 'var(--texto-secundario)' }}>
                Nivel {nivel?.orden} · Tema {ultimaPosicion.tema.orden} · Ejercicio {ultimaPosicion.completados + 1}/{ultimaPosicion.total}
              </p>
            );
          })()}
        </div>

        <div className="mb-4">
          <h3 className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: 'var(--texto-secundario)' }}>Especializaciones</h3>

          <div className="space-y-3">
            {Object.entries(ESPECIALIDADES).map(([id, esp]) => {
              if (id === 'sql-base') return null;
              const bloqueado = esp.bloqueado && esp.estado === 'bloqueado';

              return (
                <button
                  key={id}
                  onClick={() => handleSeleccionar(id)}
                  disabled={bloqueado}
                  className={`w-full rounded-xl border transition-all text-left overflow-hidden ${
                    bloqueado
                      ? 'opacity-50 cursor-not-allowed'
                      : 'active:scale-[0.98] cursor-pointer'
                  }`}
                  style={{
                    backgroundColor: bloqueado ? 'var(--fondo-base)' : 'var(--fondo-panel)',
                    borderColor: 'var(--borde)',
                  }}
                >
                  <div className="flex items-center gap-3 p-4 border-l-4" style={{ borderLeftColor: esp.color }}>
                    <div className="w-14 h-14 flex-shrink-0 flex items-center justify-center">
                      <img src={esp.icono} alt={esp.nombre} className="w-full h-full object-contain" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold font-sans" style={{ color: 'var(--texto-primario)' }}>{esp.nombre}</h4>
                      <p className="text-xs font-sans mt-1" style={{ color: 'var(--texto-secundario)' }}>{esp.descripcion}</p>
                    </div>

                    <div className="flex-shrink-0 text-right">
                      {esp.estado === 'bloqueado' && (
                        <div className="flex flex-col items-center gap-1">
                          <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" style={{ color: 'var(--texto-secundario)' }}>
                            <path d="M10 2C5.58 2 2 5.58 2 10s3.58 8 8 8 8-3.58 8-8-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6zm3.5-9c.83 0 1.5-.67 1.5-1.5S14.33 4 13.5 4 12 4.67 12 5.5s.67 1.5 1.5 1.5z" />
                          </svg>
                          <p className="text-xs font-sans text-center" style={{ color: 'var(--texto-secundario)' }}>{esp.requisito}</p>
                        </div>
                      )}
                      {esp.estado === 'proximamente' && (
                        <p className="text-xs font-sans" style={{ color: 'var(--texto-secundario)' }}>Próximamente</p>
                      )}
                      {esp.estado === 'continuar' && (
                        <svg width="20" height="20" viewBox="0 0 8 14" fill="none" className="flex-shrink-0" style={{ color: esp.color }}>
                          <path d="M1 1l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="rounded-xl p-4 mt-6" style={{ border: '1px solid var(--acento-suave)', backgroundColor: 'var(--fondo-base)' }}>
          <div className="flex items-start gap-3">
            <span className="text-lg mt-1">💡</span>
            <div>
              <p className="text-sm font-semibold font-sans mb-1" style={{ color: 'var(--acento)' }}>¿Por qué empezar con SQL Estándar?</p>
              <p className="text-xs font-sans leading-relaxed" style={{ color: 'var(--texto-secundario)' }}>
                El 80-90% de SQL es igual en todos los motores. Primero aprenderás SQL estándar y después las diferencias de cada sistema gestor.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PantallaBaseDatos;
