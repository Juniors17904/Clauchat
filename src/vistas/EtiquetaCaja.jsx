// Aviso de en qué caja va un paso o un programa, bien visible para no repetir la instalación
export default function EtiquetaCaja({ texto }) {
  return (
    <span
      className="inline-block mt-1.5 px-2 py-0.5 rounded-md text-[10px] font-bold tracking-wide"
      style={{
        backgroundColor: 'color-mix(in srgb, var(--advertencia) 18%, transparent)',
        color: 'var(--advertencia)',
        border: '1px solid var(--advertencia)',
      }}
    >
      ⚠ {texto}
    </span>
  );
}
