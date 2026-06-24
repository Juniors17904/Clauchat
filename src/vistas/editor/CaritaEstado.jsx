const CARITAS = {
  neutral:  { emoji: '😐', color: '#8b949e', label: 'Listo' },
  pensando: { emoji: '🤔', color: '#d29922', label: 'Analizando...' },
  feliz:    { emoji: '😊', color: '#3fb950', label: '¡Correcto!' },
  triste:   { emoji: '😢', color: '#f85149', label: 'Incorrecto' },
};

export default function CaritaEstado({ estado }) {
  const { emoji, color, label } = CARITAS[estado] ?? CARITAS.neutral;

  return (
    <div className="flex items-center gap-2">
      <span className="text-xl leading-none">{emoji}</span>
      <span className="text-xs font-medium" style={{ color }}>{label}</span>
    </div>
  );
}
