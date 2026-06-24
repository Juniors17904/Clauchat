export default function PanelResultados({ resultado }) {
  if (!resultado) {
    return (
      <div className="flex items-center justify-center h-full text-[#484f58] text-sm">
        Ejecuta una consulta para ver los resultados
      </div>
    );
  }

  if (!resultado.exitoso) {
    return (
      <div className="p-4">
        <p className="text-[#f85149] text-xs font-mono bg-[#3d0e0e] px-3 py-2 rounded-lg">
          Error: {resultado.error}
        </p>
      </div>
    );
  }

  if (!resultado.columnas.length) {
    return (
      <div className="flex items-center justify-center h-full text-[#3fb950] text-sm">
        Consulta ejecutada correctamente
      </div>
    );
  }

  return (
    <div className="overflow-auto h-full">
      <table className="w-full text-xs font-mono">
        <thead className="sticky top-0 bg-[#161b22]">
          <tr>
            {resultado.columnas.map(col => (
              <th key={col} className="text-left px-4 py-2 text-[#8b949e] border-b border-[#30363d] font-medium">
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {resultado.filas.map((fila, i) => (
            <tr key={i} className="border-b border-[#21262d] hover:bg-[#1c2128]">
              {fila.map((celda, j) => (
                <td key={j} className="px-4 py-2 text-[#e6edf3]">
                  {celda === null ? <span className="text-[#484f58]">NULL</span> : String(celda)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <p className="text-[#484f58] text-xs px-4 py-2">
        {resultado.totalFilas} {resultado.totalFilas === 1 ? 'fila' : 'filas'}
      </p>
    </div>
  );
}
