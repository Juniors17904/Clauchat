// Cada grupo de ajustes va bajo su propio título, separado por una línea
export default function Seccion({ titulo, primera = false, children }) {
  return (
    <div className={primera ? '' : 'pt-5 border-t'} style={{ borderColor: 'var(--borde)' }}>
      <p className="text-[11px] font-semibold uppercase tracking-wider mb-3 font-sans" style={{ color: 'var(--texto-tenue)' }}>{titulo}</p>
      <div className="space-y-3">{children}</div>
    </div>
  );
}
