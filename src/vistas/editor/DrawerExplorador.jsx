import { useState } from 'react';

export default function DrawerExplorador({ tablas, onObtenerDatos, abierto, onCerrar, baseDatos }) {
  const [tablaActiva, setTablaActiva] = useState(null);
  const [datosTabla, setDatosTabla] = useState(null);

  const seleccionarTabla = async (tabla) => {
    if (tablaActiva?.nombre === tabla.nombre) {
      setTablaActiva(null);
      setDatosTabla(null);
      return;
    }
    setTablaActiva(tabla);
    setDatosTabla(await onObtenerDatos(tabla.nombre));
  };

  return (
    <>
      {/* Overlay */}
      {abierto && (
        <div
          className="fixed inset-0 bg-black/50 z-20"
          onClick={onCerrar}
        />
      )}

      {/* Panel deslizable */}
      <div className={`fixed top-0 right-0 h-full w-72 bg-[#161b22] border-l border-[#30363d] z-30 flex flex-col transition-transform duration-300 ease-in-out ${abierto ? 'translate-x-0' : 'translate-x-full'}`}>

        {/* Header */}
        <div className="border-b border-[#30363d] flex-shrink-0">
          <div className="flex items-center justify-between px-4 py-2.5">
            <p className="text-[#8b949e] text-xs font-sans">Explorador</p>
            <button onClick={onCerrar} className="text-[#8b949e] hover:text-white transition-colors text-lg leading-none">×</button>
          </div>
          {baseDatos && (
            <div className="px-4 pb-3">
              <p className="text-[#e6edf3] text-sm font-medium font-sans">
                {baseDatos.icono} {baseDatos.nombre}
              </p>
              <p className="text-[#8b949e] text-xs font-sans mt-0.5">{baseDatos.descripcion}</p>
            </div>
          )}
        </div>

        {/* Lista de tablas */}
        <div className="flex-1 overflow-y-auto min-h-0">
          {tablas.length === 0 ? (
            <p className="text-[#484f58] text-xs text-center mt-8 font-sans">Sin tablas disponibles</p>
          ) : (
            tablas.map(tabla => {
              const activa = tablaActiva?.nombre === tabla.nombre;
              return (
                <div key={tabla.nombre}>
                  {/* Nombre de la tabla */}
                  <button
                    onClick={() => seleccionarTabla(tabla)}
                    className={`w-full flex items-center gap-2 px-4 py-3 text-left border-b border-[#21262d] transition-colors font-sans
                      ${activa ? 'bg-[#1c2128]' : 'hover:bg-[#1c2128]'}`}
                  >
                    <span className={`text-[#388bfd] text-xs transition-transform duration-200 ${activa ? 'rotate-90' : ''}`}>▶</span>
                    <span className="text-[#e6edf3] text-sm font-medium">{tabla.nombre}</span>
                  </button>

                  {/* Columnas y datos: solo si está activa */}
                  {activa && (
                    <>
                      {/* Columnas con tipos */}
                      <div className="border-b border-[#30363d] bg-[#0d1117]">
                        <p className="text-[#484f58] text-xs px-4 py-1.5 font-sans bg-[#1c2128]">Columnas</p>
                        {tabla.columnas.map(col => (
                          <div key={col.nombre} className="flex items-center gap-2 px-4 py-1.5 border-t border-[#21262d]">
                            <span className={`text-[8px] font-bold font-sans w-5 flex-shrink-0 ${col.esPrimaria && col.esForanea ? 'text-[#8250df]' : col.esPrimaria ? 'text-[#d29922]' : col.esForanea ? 'text-[#388bfd]' : 'text-transparent'}`}>
                              {col.esPrimaria && col.esForanea ? 'PF' : col.esPrimaria ? 'PK' : col.esForanea ? 'FK' : '··'}
                            </span>
                            <span className="text-[#e6edf3] text-xs font-mono flex-1 truncate">{col.nombre}</span>
                            <span className="text-[#484f58] text-[10px] font-mono bg-[#161b22] px-1.5 py-0.5 rounded flex-shrink-0">{col.tipo || 'TEXT'}</span>
                          </div>
                        ))}
                      </div>

                      {datosTabla && (
                        <div className="border-b border-[#30363d]">
                          <p className="text-[#388bfd] text-xs px-4 py-2 font-sans bg-[#1c2128]">
                            Datos · {datosTabla.totalFilas} filas
                          </p>
                          <div className="overflow-x-auto">
                            <table className="w-full text-xs font-mono">
                              <thead>
                                <tr className="bg-[#161b22]">
                                  {datosTabla.columnas.map(col => (
                                    <th key={col} className="text-left px-3 py-1.5 text-[#8b949e] border-b border-[#30363d] whitespace-nowrap font-medium">
                                      {col}
                                    </th>
                                  ))}
                                </tr>
                              </thead>
                              <tbody>
                                {datosTabla.filas.map((fila, i) => (
                                  <tr key={i} className="border-b border-[#21262d] hover:bg-[#1c2128]">
                                    {fila.map((celda, j) => (
                                      <td key={j} className="px-3 py-1.5 text-[#e6edf3] whitespace-nowrap">
                                        {celda === null ? <span className="text-[#484f58]">NULL</span> : String(celda)}
                                      </td>
                                    ))}
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </>
  );
}
