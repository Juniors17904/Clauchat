export default function PantallaConcepto({ tema, totalEjercicios, onVolver, onEmpezar }) {
  const concepto = tema?.concepto;

  return (
    <div className="min-h-[100svh] flex flex-col select-none" style={{ backgroundColor: 'var(--fondo-base)' }}>

      <div className="sticky top-0 px-4 py-3 z-10" style={{ backgroundColor: 'var(--fondo-base)', borderBottom: '1px solid var(--borde)' }}>
        <button onClick={onVolver} className="hover:text-white text-sm transition-colors" style={{ color: 'var(--texto-secundario)' }}>
          ← Volver
        </button>
      </div>

      <div className="w-full max-w-sm mx-auto flex flex-col flex-1 px-4 py-6">

        <div className="mb-7">
          <p className="text-xs font-mono uppercase tracking-widest mb-1" style={{ color: 'var(--texto-secundario)' }}>Concepto</p>
          <h2 className="text-2xl font-bold font-mono" style={{ color: 'var(--texto-primario)' }}>{tema?.nombre}</h2>
        </div>

        <div className="space-y-3 flex-1">

          <div className="rounded-xl overflow-hidden" style={{ border: '1px solid var(--borde)' }}>
            <div className="px-4 py-2" style={{ backgroundColor: 'var(--fondo-elevado)', borderBottom: '1px solid var(--borde)' }}>
              <p className="text-xs font-mono uppercase tracking-wider" style={{ color: 'var(--texto-secundario)' }}>¿Qué es?</p>
            </div>
            <div className="px-4 py-3" style={{ backgroundColor: 'var(--fondo-panel)' }}>
              <p className="text-sm font-sans leading-relaxed" style={{ color: 'var(--texto-primario)' }}>{concepto?.queEs}</p>
            </div>
          </div>

          <div className="rounded-xl overflow-hidden" style={{ border: '1px solid var(--borde)' }}>
            <div className="px-4 py-2 flex items-center justify-between" style={{ backgroundColor: 'var(--fondo-elevado)', borderBottom: '1px solid var(--borde)' }}>
              <p className="text-xs font-mono uppercase tracking-wider" style={{ color: 'var(--texto-secundario)' }}>Sintaxis</p>
              <span className="text-xs font-mono" style={{ color: 'var(--sintaxis-numero)' }}>SQL</span>
            </div>
            <div className="px-4 py-3" style={{ backgroundColor: 'var(--fondo-base)' }}>
              <pre className="text-sm font-mono leading-relaxed whitespace-pre-wrap" style={{ color: 'var(--sintaxis-numero)' }}>{concepto?.sintaxis}</pre>
            </div>
          </div>

          <div className="rounded-xl overflow-hidden" style={{ border: '1px solid var(--borde)' }}>
            <div className="px-4 py-2 flex items-center justify-between" style={{ backgroundColor: 'var(--fondo-elevado)', borderBottom: '1px solid var(--borde)' }}>
              <p className="text-xs font-mono uppercase tracking-wider" style={{ color: 'var(--texto-secundario)' }}>Ejemplo</p>
              <span className="text-xs font-mono" style={{ color: 'var(--acento)' }}>resultado</span>
            </div>
            <div className="px-4 py-3" style={{ backgroundColor: 'var(--fondo-base)' }}>
              <pre className="text-sm font-mono leading-relaxed whitespace-pre-wrap" style={{ color: 'var(--acento)' }}>{concepto?.ejemplo}</pre>
            </div>
          </div>

        </div>

        <button
          onClick={onEmpezar}
          className="mt-7 w-full py-3.5 font-sans font-semibold rounded-xl transition-colors text-sm tracking-wide"
          style={{ backgroundColor: 'var(--acento-btn)', color: '#fff' }}
        >
          Empezar {totalEjercicios} ejercicios →
        </button>

      </div>
    </div>
  );
}
