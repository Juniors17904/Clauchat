export default function PantallaEjercicios({ nivel, ejercicios = [], onSeleccionar, onVolver, controladorPerfil }) {

  return (
    <div className="min-h-[100svh] bg-[#0d1117] flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <button onClick={onVolver} className="text-[#8b949e] hover:text-white text-sm mb-8 flex items-center gap-1 transition-colors">
          ← Volver
        </button>

        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white">{nivel?.nombre}</h2>
          <p className="text-[#8b949e] text-sm mt-1">{ejercicios.length} ejercicios disponibles</p>
        </div>

        <div className="space-y-3">
          {ejercicios.map((ej, i) => (
            <button
              key={ej.id}
              onClick={() => onSeleccionar(ej)}
              className="w-full flex items-center gap-4 px-5 py-4 rounded-xl border bg-[#161b22] border-[#30363d] hover:border-[#388bfd] transition-all text-left"
            >
              <span className="text-[#388bfd] font-bold text-sm w-6">{i + 1}</span>
              <div className="flex-1 min-w-0">
                <p className="text-white font-medium text-sm">{ej.titulo}</p>
                <p className="text-[#8b949e] text-xs mt-0.5 line-clamp-1">{ej.enunciado}</p>
              </div>
              {controladorPerfil?.estaCompletado(ej.id) && (
                <span className="text-[#3fb950] text-sm flex-shrink-0">✓</span>
              )}
            </button>
          ))}

          <button
            onClick={() => onSeleccionar(null)}
            className="w-full flex items-center gap-4 px-5 py-4 rounded-xl border bg-[#0d1117] border-dashed border-[#30363d] hover:border-[#8b949e] transition-all text-left"
          >
            <span className="text-[#8b949e] text-lg">⌨️</span>
            <div>
              <p className="text-[#8b949e] font-medium text-sm">Práctica libre</p>
              <p className="text-[#484f58] text-xs mt-0.5">Editor SQL sin ejercicio asignado</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
