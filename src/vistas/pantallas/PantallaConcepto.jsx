export default function PantallaConcepto({ tema, totalEjercicios, onVolver, onEmpezar }) {
  const concepto = tema?.concepto;

  return (
    <div className="min-h-[100svh] bg-[#0d1117] flex flex-col select-none">

      <div className="sticky top-0 bg-[#0d1117] border-b border-[#30363d] px-4 py-3 z-10">
        <button onClick={onVolver} className="text-[#8b949e] hover:text-white text-sm transition-colors">
          ← Volver
        </button>
      </div>

      <div className="w-full max-w-sm mx-auto flex flex-col flex-1 px-4 py-6">

        {/* Header del tema */}
        <div className="mb-7">
          <p className="text-[#8b949e] text-xs font-mono uppercase tracking-widest mb-1">Concepto</p>
          <h2 className="text-2xl font-bold text-white font-mono">{tema?.nombre}</h2>
        </div>

        <div className="space-y-3 flex-1">

          {/* Qué es */}
          <div className="rounded-xl overflow-hidden border border-[#30363d]">
            <div className="bg-[#1c2128] px-4 py-2 border-b border-[#30363d]">
              <p className="text-[#8b949e] text-xs font-mono uppercase tracking-wider">¿Qué es?</p>
            </div>
            <div className="bg-[#161b22] px-4 py-3">
              <p className="text-[#e6edf3] text-sm font-sans leading-relaxed">{concepto?.queEs}</p>
            </div>
          </div>

          {/* Sintaxis */}
          <div className="rounded-xl overflow-hidden border border-[#30363d]">
            <div className="bg-[#1c2128] px-4 py-2 border-b border-[#30363d] flex items-center justify-between">
              <p className="text-[#8b949e] text-xs font-mono uppercase tracking-wider">Sintaxis</p>
              <span className="text-[#79c0ff] text-xs font-mono">SQL</span>
            </div>
            <div className="bg-[#0d1117] px-4 py-3">
              <pre className="text-[#79c0ff] text-sm font-mono leading-relaxed whitespace-pre-wrap">{concepto?.sintaxis}</pre>
            </div>
          </div>

          {/* Ejemplo */}
          <div className="rounded-xl overflow-hidden border border-[#30363d]">
            <div className="bg-[#1c2128] px-4 py-2 border-b border-[#30363d] flex items-center justify-between">
              <p className="text-[#8b949e] text-xs font-mono uppercase tracking-wider">Ejemplo</p>
              <span className="text-[#3fb950] text-xs font-mono">resultado</span>
            </div>
            <div className="bg-[#0d1117] px-4 py-3">
              <pre className="text-[#3fb950] text-sm font-mono leading-relaxed whitespace-pre-wrap">{concepto?.ejemplo}</pre>
            </div>
          </div>

        </div>

        <button
          onClick={onEmpezar}
          className="mt-7 w-full py-3.5 bg-[#238636] hover:bg-[#2ea043] text-white font-sans font-semibold rounded-xl transition-colors text-sm tracking-wide"
        >
          Empezar {totalEjercicios} ejercicios →
        </button>

      </div>
    </div>
  );
}
