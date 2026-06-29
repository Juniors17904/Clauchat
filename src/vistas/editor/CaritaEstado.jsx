import { useState, useEffect } from 'react';

const FRAMES = {
  neutral:     { frames: ['😐', '😑'], ms: 1200 },
  pensando:    { frames: ['🤔', '🧐'], ms: 600  },
  triste:      { frames: ['😢', '😭'], ms: 600  },
  confundido:  { frames: ['😕', '🫤'], ms: 600  },
  sorprendido: { frames: ['😮', '😲'], ms: 400  },
  feliz:       { frames: ['😊', '😄'], ms: 600  },
  estresado:   { frames: ['😰', '😨'], ms: 400  },
  celebrando:  { frames: ['🥳', '😁'], ms: 400  },
};

export default function CaritaEstado({ estado }) {
  const [frame, setFrame] = useState(0);
  const config = FRAMES[estado] ?? FRAMES.neutral;

  useEffect(() => {
    setFrame(0);
    const intervalo = setInterval(() => setFrame(f => (f + 1) % 2), config.ms);
    return () => clearInterval(intervalo);
  }, [estado, config.ms]);

  return (
    <span className="text-xl leading-none select-none">{config.frames[frame]}</span>
  );
}
