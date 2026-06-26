const CARITAS = {
  neutral:  '😐',
  pensando: '🤔',
  feliz:    '😊',
  triste:   '😢',
};

export default function CaritaEstado({ estado }) {
  return (
    <span className="text-xl leading-none">{CARITAS[estado] ?? CARITAS.neutral}</span>
  );
}
