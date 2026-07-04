import { useState } from 'react';

const FRECUENCIAS = [
  { id: 'diario', nombre: 'Diario', descripcion: 'Todos los días' },
  { id: 'tres-veces', nombre: '3 veces por semana', descripcion: 'Lunes, miércoles y viernes' },
  { id: 'semanal', nombre: 'Semanal', descripcion: 'Una vez por semana (domingo)' },
];

const MENSAJES_PREVIEW = {
  'diario': { titulo: '¡Te faltan ejercicios!', cuerpo: '5 minutos diarios bastan para avanzar' },
  'tres-veces': { titulo: '¡Hoy toca practicar!', cuerpo: '3 días a la semana hacen la diferencia' },
  'semanal': { titulo: 'Resumen semanal', cuerpo: 'Revisa tu progreso y planifica la siguiente semana' },
};

const HORAS = Array.from({ length: 18 }, (_, i) => {
  const h = i + 6;
  return `${String(h).padStart(2, '0')}:00`;
});

export default function PantallaRecordatorios({ controladorRecordatorios, onVolver }) {
  const config = controladorRecordatorios.configuracion;
  const [frecuencia, setFrecuencia] = useState(config.frecuencia);
  const [hora, setHora] = useState(config.hora);
  const [activo, setActivo] = useState(config.activo);
  const [guardado, setGuardado] = useState(false);

  const permiso = controladorRecordatorios.permisoNotificaciones;
  const preview = MENSAJES_PREVIEW[frecuencia];

  const guardar = async () => {
    if (permiso !== 'granted') {
      const resultado = await controladorRecordatorios.solicitarPermiso();
      if (resultado !== 'granted') return;
    }
    controladorRecordatorios.activar(frecuencia, hora);
    setActivo(true);
    setGuardado(true);
    setTimeout(() => setGuardado(false), 2000);
  };

  const desactivar = () => {
    controladorRecordatorios.desactivar();
    setActivo(false);
  };

  const probar = () => {
    controladorRecordatorios.enviarPrueba(preview.titulo, preview.cuerpo);
  };

  return (
    <div className="min-h-[100svh] bg-[#0d1117] flex flex-col select-none">
      <div className="sticky top-0 bg-[#0d1117] border-b border-[#30363d] px-4 py-3 z-10">
        <button onClick={onVolver} className="text-[#8b949e] hover:text-white text-sm transition-colors">
          ← Volver
        </button>
      </div>

      <div className="w-full max-w-sm mx-auto px-4 py-6 space-y-6">
        <div>
          <h2 className="text-xl font-bold text-white font-sans">Recordatorios</h2>
          <p className="text-[#8b949e] text-xs mt-1 font-sans">Configura cuándo quieres que te avisemos</p>
        </div>

        {/* Frecuencia */}
        <div className="space-y-2">
          <p className="text-[#8b949e] text-xs font-sans uppercase tracking-widest">Frecuencia</p>
          {FRECUENCIAS.map(f => (
            <button
              key={f.id}
              onClick={() => setFrecuencia(f.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border transition-all text-left ${
                frecuencia === f.id
                  ? 'bg-[#388bfd]/10 border-[#388bfd]'
                  : 'bg-[#161b22] border-[#30363d] hover:border-[#8b949e]'
              }`}
            >
              <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                frecuencia === f.id ? 'border-[#388bfd]' : 'border-[#484f58]'
              }`}>
                {frecuencia === f.id && <div className="w-2 h-2 rounded-full bg-[#388bfd]" />}
              </div>
              <div>
                <p className="text-white text-sm font-sans font-medium">{f.nombre}</p>
                <p className="text-[#8b949e] text-xs font-sans">{f.descripcion}</p>
              </div>
            </button>
          ))}
        </div>

        {/* Hora */}
        <div>
          <p className="text-[#8b949e] text-xs font-sans uppercase tracking-widest mb-2">Hora del recordatorio</p>
          <select
            value={hora}
            onChange={e => setHora(e.target.value)}
            className="w-full bg-[#161b22] border border-[#30363d] rounded-xl px-4 py-3 text-white text-sm font-mono focus:outline-none focus:border-[#388bfd] cursor-pointer"
            style={{ WebkitAppearance: 'none' }}
          >
            {HORAS.map(h => (
              <option key={h} value={h}>{h}</option>
            ))}
          </select>
        </div>

        {/* Vista previa */}
        <div>
          <p className="text-[#8b949e] text-xs font-sans uppercase tracking-widest mb-2">Vista previa</p>
          <div className="bg-[#161b22] border border-[#30363d] rounded-xl px-4 py-3 flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#388bfd]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#388bfd" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
            </div>
            <div>
              <p className="text-white text-sm font-sans font-medium">{preview.titulo}</p>
              <p className="text-[#8b949e] text-xs font-sans mt-0.5">{preview.cuerpo}</p>
            </div>
          </div>
        </div>

        {/* Estado del permiso */}
        {permiso === 'denied' && (
          <div className="bg-[#f85149]/10 border border-[#f85149]/30 rounded-xl px-4 py-3">
            <p className="text-[#f85149] text-xs font-sans">Las notificaciones están bloqueadas en tu navegador. Ve a la configuración del sitio para habilitarlas.</p>
          </div>
        )}

        {permiso === 'no-soportado' && (
          <div className="bg-[#d29922]/10 border border-[#d29922]/30 rounded-xl px-4 py-3">
            <p className="text-[#d29922] text-xs font-sans">Tu navegador no soporta notificaciones.</p>
          </div>
        )}

        {/* Botones */}
        <div className="space-y-3 pt-2">
          {activo && (
            <div className="flex items-center gap-2 px-4 py-3 bg-[#3fb950]/10 border border-[#3fb950]/30 rounded-xl">
              <span className="text-[#3fb950] text-sm">✓</span>
              <p className="text-[#3fb950] text-xs font-sans">
                Activados — {FRECUENCIAS.find(f => f.id === config.frecuencia)?.nombre.toLowerCase()} a las {config.hora}
              </p>
            </div>
          )}

          <button
            onClick={guardar}
            disabled={permiso === 'denied' || permiso === 'no-soportado'}
            className="w-full py-3 bg-[#238636] hover:bg-[#2ea043] disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm rounded-xl font-sans transition-colors"
          >
            {guardado ? '✓ Guardado' : activo ? 'Guardar cambios' : 'Activar recordatorios'}
          </button>

          {permiso === 'granted' && (
            <button
              onClick={probar}
              className="w-full py-3 border border-[#30363d] text-[#8b949e] hover:text-white hover:border-[#8b949e] text-sm rounded-xl font-sans transition-colors"
            >
              Enviar notificación de prueba
            </button>
          )}

          {activo && (
            <button
              onClick={desactivar}
              className="w-full py-3 border border-[#f85149]/40 text-[#f85149] hover:bg-[#f85149]/10 text-sm rounded-xl font-sans transition-colors"
            >
              Desactivar recordatorios
            </button>
          )}
        </div>

        {/* Estado Supabase */}
        <div className="pt-4 border-t border-[#21262d]">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#d29922]" />
            <p className="text-[#484f58] text-xs font-sans">Modo local</p>
          </div>
          <p className="text-[#30363d] text-xs font-sans mt-1 ml-4">Las notificaciones solo llegan si la app estuvo abierta recientemente. Conecta Supabase para que lleguen siempre.</p>
        </div>
      </div>
    </div>
  );
}
