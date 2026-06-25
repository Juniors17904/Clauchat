const PALETA = [
  { cabecera: 'bg-[#1f6feb]', borde: 'border-[#1f6feb]' },
  { cabecera: 'bg-[#8250df]', borde: 'border-[#8250df]' },
  { cabecera: 'bg-[#1a7f37]', borde: 'border-[#1a7f37]' },
  { cabecera: 'bg-[#9a6700]', borde: 'border-[#9a6700]' },
  { cabecera: 'bg-[#cf222e]', borde: 'border-[#cf222e]' },
  { cabecera: 'bg-[#0550ae]', borde: 'border-[#0550ae]' },
  { cabecera: 'bg-[#6639ba]', borde: 'border-[#6639ba]' },
  { cabecera: 'bg-[#116329]', borde: 'border-[#116329]' },
  { cabecera: 'bg-[#953800]', borde: 'border-[#953800]' },
];

export default function DiagramaBD({ tablas, abierto, onCerrar }) {
  if (!abierto) return null;

  return (
    <div className="fixed inset-0 z-40 bg-[#0d1117] flex flex-col">

      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#30363d] flex-shrink-0 bg-[#161b22]">
        <p className="text-white font-medium text-sm font-sans">📊 Diagrama de tablas</p>
        <button onClick={onCerrar} className="text-[#8b949e] hover:text-white text-xl leading-none transition-colors">×</button>
      </div>

      {/* Diagrama */}
      <div className="flex-1 overflow-auto p-4">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {tablas.map((tabla, i) => {
            const color = PALETA[i % PALETA.length];
            return (
              <div key={tabla.nombre} className={`rounded-lg border ${color.borde} overflow-hidden bg-[#161b22] flex flex-col`}>

                {/* Nombre de tabla */}
                <div className={`${color.cabecera} px-3 py-2`}>
                  <p className="text-white font-bold text-xs font-sans tracking-wide">{tabla.nombre}</p>
                </div>

                {/* Columnas */}
                <div className="flex-1 divide-y divide-[#21262d]">
                  {tabla.columnas.map(col => (
                    <div key={col.nombre} className="px-2 py-1.5">
                      <div className="flex items-center gap-1.5">
                        {col.esPrimaria && (
                          <span className="text-[#d29922] text-xs font-bold font-sans flex-shrink-0">PK</span>
                        )}
                        {col.esForanea && (
                          <span className="text-[#388bfd] text-xs font-bold font-sans flex-shrink-0">FK</span>
                        )}
                        {!col.esPrimaria && !col.esForanea && (
                          <span className="text-transparent text-xs font-sans flex-shrink-0 select-none">··</span>
                        )}
                        <span className="text-[#e6edf3] text-xs font-mono truncate">{col.nombre}</span>
                      </div>
                      <div className="flex items-center justify-between mt-0.5 pl-6">
                        <span className="text-[#484f58] text-xs font-mono">{col.tipo}</span>
                        {col.referenciaTabla && (
                          <span className="text-[#388bfd] text-xs font-sans">→ {col.referenciaTabla}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {tablas.length === 0 && (
          <p className="text-[#484f58] text-sm text-center mt-16 font-sans">Sin tablas disponibles</p>
        )}
      </div>
    </div>
  );
}
