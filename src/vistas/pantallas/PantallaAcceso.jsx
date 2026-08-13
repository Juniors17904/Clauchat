import { useEffect, useRef, useState } from 'react';
import { SesionGoogle } from '../../modelos/sesion_google';
import { version } from '../../../package.json';

// Pide entrar con la cuenta de Google. Solo pasan los correos autorizados.
export default function PantallaAcceso({ onEntrar }) {
  const sesion = useRef(new SesionGoogle());
  const contenedorBoton = useRef(null);
  const [aviso, setAviso] = useState(null);

  useEffect(() => {
    if (!contenedorBoton.current) return;
    sesion.current.dibujarBoton(
      contenedorBoton.current,
      (correo) => onEntrar(correo),
      (motivo) => {
        if (motivo === 'sin-conexion') setAviso('Necesitás conexión para iniciar sesión.');
        else setAviso('Esta cuenta no tiene acceso.');
      },
    );
  }, [onEntrar]);

  return (
    <div className="min-h-[100svh] flex flex-col items-center justify-center px-8 select-none" style={{ backgroundColor: 'var(--fondo-base)', fontFamily: 'var(--fuente-sans)' }}>
      <img src="/icon-192.png" alt="" className="w-20 h-20 rounded-2xl mb-6" draggable="false" />

      <h1 className="text-2xl font-bold mb-1" style={{ color: 'var(--texto-primario)' }}>DevLab</h1>
      <p className="text-sm text-center mb-8" style={{ color: 'var(--texto-secundario)' }}>Iniciá sesión para continuar</p>

      <div ref={contenedorBoton} className="min-h-[44px] flex items-center justify-center" />

      {aviso && (
        <div className="mt-6 rounded-xl border px-4 py-3 max-w-xs" style={{ borderColor: 'var(--error)', backgroundColor: 'color-mix(in srgb, var(--error) 8%, transparent)' }}>
          <p className="text-xs text-center" style={{ color: 'var(--error)' }}>{aviso}</p>
        </div>
      )}

      <p className="text-[10px] mt-10" style={{ color: 'var(--texto-tenue)' }}>Versión {version}</p>
    </div>
  );
}
