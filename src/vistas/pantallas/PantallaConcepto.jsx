export default function PantallaConcepto({ tema, totalEjercicios, onVolver, onEmpezar }) {
  const concepto = tema?.concepto;

  return (
    <div className="min-h-[100svh] bg-[#0d1117] flex flex-col px-4 py-6">
      <div className="w-full max-w-sm mx-auto flex flex-col flex-1">

        <button
          onClick={onVolver}
          className="text-[#8b949e] hover:text-white text-sm mb-6 flex items-center gap-1 transition-colors self-start"
        >
          ← Volver
        </button>

        <div className="mb-6">
          <p className="text-[#8b949e] text-xs mb-1 font-sans">Tema</p>
          <h2 className="text-2xl font-bold text-white font-mono">{tema?.nombre}</h2>
        </div>

        <div className="space-y-5 flex-1">

          {/* Qué es */}
          <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-4">
            <p className="text-[#8b949e] text-xs mb-2 font-sans uppercase tracking-wider">¿Qué es?</p>
            <p className="text-[#e6edf3] text-sm font-sans leading-relaxed">{concepto?.queEs}</p>
          </div>

          {/* Sintaxis */}
          <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-4">
            <p className="text-[#8b949e] text-xs mb-2 font-sans uppercase tracking-wider">Sintaxis</p>
            <pre className="text-[#79c0ff] text-sm font-mono leading-relaxed whitespace-pre-wrap">{concepto?.sintaxis}</pre>
          </div>

          {/* Ejemplo */}
          <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-4">
            <p className="text-[#8b949e] text-xs mb-2 font-sans uppercase tracking-wider">Ejemplo</p>
            <pre className="text-[#3fb950] text-sm font-mono leading-relaxed whitespace-pre-wrap">{concepto?.ejemplo}</pre>
          </div>

        </div>

        <button
          onClick={onEmpezar}
          className="mt-8 w-full py-3.5 bg-[#238636] hover:bg-[#2ea043] text-white font-sans font-medium rounded-xl transition-colors text-sm"
        >
          Empezar {totalEjercicios} ejercicios →
        </button>

      </div>
    </div>
  );
}
