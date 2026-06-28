const COLORES = {
  keyword: 'text-[#79c0ff] border-[#79c0ff22]',
  tabla:   'text-[#d29922] border-[#d2992222]',
  columna: 'text-[#bc8cff] border-[#bc8cff22]',
};

export default function AutocompletadorSQL({ sugerencias, onSeleccionar }) {
  if (!sugerencias.length) return null;

  return (
    <div className="flex gap-1.5 flex-wrap px-3 py-2 bg-[#1c2128] border-t border-[#30363d]">
      {sugerencias.map((s, i) => (
        <button
          key={`${s.texto}-${i}`}
          onMouseDown={(e) => { e.preventDefault(); onSeleccionar(s.texto); }}
          className={`px-2.5 py-1 rounded-md bg-[#21262d] hover:bg-[#30363d] text-xs font-mono transition-colors border ${COLORES[s.tipo] ?? COLORES.keyword}`}
        >
          {s.texto}
        </button>
      ))}
    </div>
  );
}
