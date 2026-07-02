import { useState } from 'react';
import { NIVELES } from '../../datos/niveles';

const ESPECIALIDADES = {
  'sql-base': {
    nombre: 'Curso Base SQL',
    descripcion: 'Aprende SQL estándar. Este curso es la base para cualquier motor de base de datos.',
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
    niveles: 4,
    ejercicios: 35,
    horas: 12,
    progreso: 0,
    bloqueado: true,
    estado: 'bloqueado',
    requisito: 'Completa el Curso Base',
  },
  'sql-server': {
    nombre: 'SQL Server',
    descripcion: 'Aprende T-SQL, TOP, IDENTITY, GETDATE(), procedimientos almacenados, etc.',
    icono: '/iconos/sql-server.png',
    color: '#0078D4',
    recomendado: false,
    niveles: 4,
    ejercicios: 32,
    horas: 11,
    progreso: 0,
    bloqueado: true,
    estado: 'bloqueado',
    requisito: 'Completa el Curso Base',
  },
  'mysql': {
    nombre: 'MySQL',
    descripcion: 'Aprende AUTO_INCREMENT, IFNULL(), LIMIT, GROUP_CONCAT(), etc.',
    icono: '/iconos/mysql.png',
    color: '#00758F',
    recomendado: false,
    niveles: 4,
    ejercicios: 30,
    horas: 10,
    progreso: 0,
    bloqueado: true,
    estado: 'bloqueado',
    requisito: 'Completa el Curso Base',
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

function PantallaBaseDatos({ onSeleccionar, ultimaPosicion, onContinuar, onEmpezar, onVolver }) {
  const [seleccionada, setSeleccionada] = useState('sql-base');

  const handleSeleccionar = (id) => {
    if (!ESPECIALIDADES[id].bloqueado) {
      setSeleccionada(id);
      onSeleccionar?.(ESPECIALIDADES[id]);
    }
  };

  return (
    <div className="w-full max-w-sm mx-auto px-5 pt-5 pb-4">
      {/* Header con botón Volver */}
      <button
        onClick={onVolver}
        className="text-[#8b949e] hover:text-white transition-colors mb-4 flex items-center gap-2 text-sm"
      >
        ← Volver
      </button>

      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-3">
          <img src="/iconos/bases-de-datos.png" alt="database" className="w-10 h-10 object-contain" />
          <h1 className="text-2xl font-bold text-white">Bases de Datos</h1>
        </div>
        <p className="text-sm text-[#8b949e] font-sans leading-relaxed">
          Aprende SQL desde cero y luego especialízate en el motor que utilizarás.
        </p>
      </div>

      {/* Tarjeta Curso Base SQL */}
      <div
        onClick={() => handleSeleccionar('sql-base')}
        className="mb-6 rounded-2xl border bg-[#161b22] p-5 overflow-hidden cursor-pointer active:scale-[0.98] transition-all"
        style={{ borderColor: '#3fb95040' }}
      >
        <div className="flex items-start gap-4 mb-4">
          <div className="w-11 h-11 flex-shrink-0 flex items-center justify-center">
            <img src={ESPECIALIDADES['sql-base'].icono} alt="SQL" className="w-full h-full object-contain" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-lg font-bold text-white">Curso Base SQL</h2>
              <span className="px-2 py-1 text-xs font-semibold text-white bg-[#3fb950] rounded">RECOMENDADO</span>
            </div>
            <p className="text-xs text-[#8b949e] font-sans">
              Aprende SQL estándar. Este curso es la base para cualquier motor de base de datos.
            </p>
          </div>
          <div className="text-right flex-shrink-0">
            <p className="text-2xl font-bold text-[#3fb950]">32%</p>
            <p className="text-xs text-[#8b949e] font-sans">Completado</p>
          </div>
        </div>

        {/* Barra de progreso */}
        <div className="w-full h-2 bg-[#21262d] rounded-full mb-4 overflow-hidden">
          <div
            className="h-full bg-[#3fb950] rounded-full transition-all"
            style={{ width: '32%' }}
          />
        </div>

        {/* Estadísticas */}
        <div className="flex items-center justify-between mb-4 text-xs text-[#8b949e] font-sans">
          <div className="flex items-center gap-1">
            <span>📚</span>
            <span>8 niveles</span>
          </div>
          <div className="flex items-center gap-1">
            <span>📝</span>
            <span>120 ejercicios</span>
          </div>
          <div className="flex items-center gap-1">
            <span>⏱️</span>
            <span>18 horas</span>
          </div>
        </div>

        {/* Botón Continuar / Empezar */}
        <button
          onClick={(e) => { e.stopPropagation(); ultimaPosicion ? onContinuar?.() : onEmpezar?.(); }}
          className="w-full py-2 px-4 bg-[#3fb950] text-white font-semibold rounded-lg hover:bg-[#3fb950]/90 active:scale-[0.98] transition-all text-sm font-sans"
        >
          {ultimaPosicion ? '▶ Continuar' : '▶ Empezar'}
        </button>
        {ultimaPosicion && (() => {
          const nivel = NIVELES.find(n => n.id === ultimaPosicion.tema.nivelId);
          return (
            <p className="text-center text-[#8b949e] text-xs font-sans mt-2">
              Nivel {nivel?.orden} · Tema {ultimaPosicion.tema.orden} · Ejercicio {ultimaPosicion.completados + 1}/{ultimaPosicion.total}
            </p>
          );
        })()}
      </div>

      {/* Sección Especializaciones */}
      <div className="mb-4">
        <h3 className="text-xs font-bold text-[#8b949e] uppercase tracking-wider mb-3">Especializaciones</h3>

        <div className="space-y-3">
          {Object.entries(ESPECIALIDADES).map(([id, esp]) => {
            if (id === 'sql-base') return null;

            return (
              <button
                key={id}
                onClick={() => handleSeleccionar(id)}
                disabled={esp.bloqueado && esp.estado === 'bloqueado'}
                className={`w-full rounded-xl border transition-all text-left overflow-hidden ${
                  esp.bloqueado && esp.estado === 'bloqueado'
                    ? 'opacity-50 cursor-not-allowed bg-[#0d1117] border-[#30363d]'
                    : 'bg-[#161b22] border-[#30363d] hover:border-[#3fb950]/40 active:scale-[0.98] cursor-pointer'
                }`}
              >
                <div className="flex items-center gap-3 p-4 border-l-4" style={{ borderLeftColor: esp.color }}>
                  {/* Ícono */}
                  <div className="w-9 h-9 flex-shrink-0 flex items-center justify-center">
                    <img src={esp.icono} alt={esp.nombre} className="w-full h-full object-contain" />
                  </div>

                  {/* Contenido */}
                  <div className="flex-1 min-w-0">
                    <h4 className="text-white font-semibold font-sans">{esp.nombre}</h4>
                    {esp.estado === 'proximamente' ? (
                      <p className="text-xs text-[#d29922] font-sans mt-1">Próximamente</p>
                    ) : (
                      <p className="text-xs text-[#8b949e] font-sans mt-1">{esp.descripcion}</p>
                    )}
                  </div>

                  {/* Estado */}
                  <div className="flex-shrink-0 text-right">
                    {esp.estado === 'bloqueado' && (
                      <div className="flex flex-col items-center gap-1">
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" className="text-[#8b949e]">
                          <path d="M10 2C5.58 2 2 5.58 2 10s3.58 8 8 8 8-3.58 8-8-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6zm3.5-9c.83 0 1.5-.67 1.5-1.5S14.33 4 13.5 4 12 4.67 12 5.5s.67 1.5 1.5 1.5z" />
                        </svg>
                        <p className="text-xs text-[#8b949e] font-sans text-center">{esp.requisito}</p>
                      </div>
                    )}
                    {esp.estado === 'proximamente' && (
                      <div className="flex flex-col items-center gap-1">
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" className="text-[#d29922]">
                          <path d="M10 2C5.58 2 2 5.58 2 10s3.58 8 8 8 8-3.58 8-8-3.58-8-8-8zm1 13h-2v-2h2v2zm0-4h-2V5h2v6z" />
                        </svg>
                        <p className="text-xs text-[#d29922] font-sans">Próximamente</p>
                      </div>
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

      {/* Sección Info */}
      <div className="rounded-xl border border-[#388bfd]/20 bg-[#0d1117]/50 p-4 mt-6">
        <div className="flex items-start gap-3">
          <span className="text-lg mt-1">💡</span>
          <div>
            <p className="text-sm font-semibold text-[#388bfd] font-sans mb-1">¿Por qué existe un Curso Base?</p>
            <p className="text-xs text-[#8b949e] font-sans leading-relaxed">
              El 80-90% de SQL es igual en todos los motores. Primero aprenderás SQL estándar y después las diferencias de cada sistema gestor.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PantallaBaseDatos;
