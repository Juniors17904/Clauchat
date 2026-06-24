export default function AutocompletadorSQL({ sugerencias, onSeleccionar }) {
  if (!sugerencias.length) return null;

  return (
    <div className="flex gap-1.5 flex-wrap px-3 py-2 bg-[#1c2128] border-t border-[#30363d]">
      {sugerencias.map(s => (
        <button
          key={s}
          onMouseDown={(e) => { e.preventDefault(); onSeleccionar(s); }}
          className="px-2.5 py-1 rounded-md bg-[#21262d] hover:bg-[#30363d] text-[#79c0ff] text-xs font-mono transition-colors border border-[#30363d]"
        >
          {s}
        </button>
      ))}
    </div>
  );
}
