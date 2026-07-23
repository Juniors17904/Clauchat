import { useState, useRef, useEffect } from 'react';
import { FASES_INSTALACION } from '../../datos/fases_instalacion';
import { PASOS_INSTALACION } from '../../datos/pasos_instalacion';
import { GestorInstalacion } from '../../modelos/gestor_instalacion';
import { CompresorImagen } from '../../modelos/compresor_imagen';
import { MejoradorImagen } from '../../modelos/mejorador_imagen';
import { ReconocedorTexto } from '../../modelos/reconocedor_texto';
import VisorGaleria from '../VisorGaleria';

// Lista plana de las imágenes del manual, para navegar en galería
const GALERIA_MANUAL = PASOS_INSTALACION.flatMap(p =>
  p.imagenes.map((src, idx) => ({ src, grupo: p.numero, etiqueta: `${p.numero}. ${p.titulo}`, color: '#3fb950', nota: p.notaDe(src), detalle: idx === 0 ? p.detalle : null }))
);

function renderizarDetalle(texto) {
  return texto.split(/(\[\[.*?\]\]|\{\{.*?\}\}|!!.*?!!)/g).map((parte, i) => {
    // Rutas y archivos → amarillo, negrita, más grande
    if (parte.startsWith('[[') && parte.endsWith(']]')) {
      return <span key={i} style={{ color: 'var(--advertencia)', fontWeight: 700, fontSize: '1.12em', wordBreak: 'break-all' }}>{parte.slice(2, -2)}</span>;
    }
    // Comandos → verde, negrita, más grande, monoespaciado
    if (parte.startsWith('{{') && parte.endsWith('}}')) {
      return <span key={i} style={{ color: 'var(--acento)', fontWeight: 700, fontSize: '1.12em', fontFamily: 'var(--fuente-mono)', wordBreak: 'break-all' }}>{parte.slice(2, -2)}</span>;
    }
    // Reiniciar / iniciar sesión → aviso grande y notorio
    if (parte.startsWith('!!') && parte.endsWith('!!')) {
      return <span key={i} className="inline-block my-1" style={{ color: '#fff', backgroundColor: 'var(--acento-btn)', fontWeight: 800, fontSize: '1.15em', padding: '3px 10px', borderRadius: 8 }}>{parte.slice(2, -2)}</span>;
    }
    return parte;
  });
}

export default function PantallaInstalacion({ onVolver, caja = 1 }) {
  const gestor = useRef(new GestorInstalacion(caja));
  const compresor = useRef(new CompresorImagen());
  const mejorador = useRef(new MejoradorImagen());
  const reconocedor = useRef(new ReconocedorTexto());
  const archivoFotoRef = useRef(null);
  const [, setVersion] = useState(0);
  const [pasoAbierto, setPasoAbierto] = useState(null);
  const [galeria, setGaleria] = useState(null);
  const [ultimaImagen, setUltimaImagen] = useState(null);
  const [ultimoVisto, setUltimoVisto] = useState(null);
  const galeriaRef = useRef(null);
  const indiceGalRef = useRef(0);

  const abrirManual = (src) => {
    const indice = GALERIA_MANUAL.findIndex(g => g.src === src);
    if (indice >= 0) { galeriaRef.current = GALERIA_MANUAL; indiceGalRef.current = indice; setGaleria({ imagenes: GALERIA_MANUAL, indice }); }
  };
  const abrirFoto = (src) => { galeriaRef.current = [{ src, grupo: 0, etiqueta: 'Foto guardada', color: '#8250df' }]; indiceGalRef.current = 0; setGaleria({ imagenes: galeriaRef.current, indice: 0 }); };
  const cerrarGaleria = () => { setUltimaImagen(galeriaRef.current?.[indiceGalRef.current]?.src ?? null); setGaleria(null); };
  const [confirmandoReinicio, setConfirmandoReinicio] = useState(false);
  const [reconociendo, setReconociendo] = useState(null);
  const [avisoCampo, setAvisoCampo] = useState(null);
  const [camposAbiertos, setCamposAbiertos] = useState(new Set());
  const [pasosManuales, setPasosManuales] = useState(new Set());
  const [referenciasAbiertas, setReferenciasAbiertas] = useState(new Set());
  const [pasoEnfocado, setPasoEnfocado] = useState(null);
  const scrollEnfoqueRef = useRef(null);
  const tactilRef = useRef({ x: 0, y: 0 });

  // Modo enfoque: abre un paso a pantalla completa; se cambia de paso deslizando de costado
  const abrirEnfoque = (numero) => { setPasoEnfocado(numero); setUltimoVisto(numero); };
  const cerrarEnfoque = () => setPasoEnfocado(null);
  const enfocarAdyacente = (dir) => {
    const idx = PASOS_INSTALACION.findIndex(p => p.numero === pasoEnfocado);
    const sig = PASOS_INSTALACION[idx + dir];
    if (sig) { setPasoEnfocado(sig.numero); setUltimoVisto(sig.numero); }
  };
  const inicioDeslizar = (e) => { const t = e.touches[0]; tactilRef.current = { x: t.clientX, y: t.clientY }; };
  const finDeslizar = (e) => {
    const t = e.changedTouches[0];
    const dx = t.clientX - tactilRef.current.x;
    const dy = t.clientY - tactilRef.current.y;
    // Solo cuenta como cambio de paso si el gesto es claramente horizontal
    if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.4) {
      enfocarAdyacente(dx < 0 ? 1 : -1);
    }
  };

  const alternarReferencia = (numero) => {
    setReferenciasAbiertas(prev => {
      const copia = new Set(prev);
      if (copia.has(numero)) copia.delete(numero); else copia.add(numero);
      return copia;
    });
  };

  // Reúne los datos (campos con valor y fotos) que un paso anterior ya guardó
  const datosDePaso = (numero) => {
    const pasoRef = PASOS_INSTALACION.find(p => p.numero === numero);
    if (!pasoRef) return null;
    const campos = pasoRef.campos
      .map(c => ({ campo: c, valor: gestor.current.obtenerCampo(numero, c) }))
      .filter(c => c.valor !== '');
    const fotos = [];
    if (pasoRef.fotoUnica) {
      const f = gestor.current.obtenerFoto(numero, '__paso');
      if (f) fotos.push(f);
    } else {
      for (const c of pasoRef.campos) {
        const f = gestor.current.obtenerFoto(numero, c);
        if (f) fotos.push(f);
      }
    }
    return { pasoRef, campos, fotos };
  };
  const campoActivo = useRef(null);
  const vieneDeCamara = useRef(false);
  const archivoCamaraRef = useRef(null);
  const pasosRef = useRef({});
  const encabezadoRef = useRef(null);
  const [altoEncabezado, setAltoEncabezado] = useState(88);

  // Mide la altura del encabezado principal para pegar debajo la cabecera del paso abierto
  useEffect(() => {
    const medir = () => { if (encabezadoRef.current) setAltoEncabezado(encabezadoRef.current.offsetHeight); };
    medir();
    window.addEventListener('resize', medir);
    return () => window.removeEventListener('resize', medir);
  }, []);

  const completarYAvanzar = (paso) => {
    const estaba = gestor.current.estaCompletado(paso.numero);
    alternarPaso(paso.numero);
    if (estaba) return; // se desmarcó: no avanzar
    const idx = PASOS_INSTALACION.findIndex(p => p.numero === paso.numero);
    const siguiente = PASOS_INSTALACION[idx + 1];
    // En modo enfoque, avanzar al siguiente paso a pantalla completa
    if (pasoEnfocado !== null) {
      if (siguiente) { setPasoEnfocado(siguiente.numero); setUltimoVisto(siguiente.numero); }
      else setPasoEnfocado(null);
      return;
    }
    if (siguiente) {
      setPasoAbierto(siguiente.numero);
      setTimeout(() => {
        pasosRef.current[siguiente.numero]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 80);
    } else {
      setPasoAbierto(null);
    }
  };

  const subirFoto = async (e, paso) => {
    const archivo = e.target.files?.[0];
    const campo = campoActivo.current;
    e.target.value = '';
    if (!archivo || !campo) return;
    setAvisoCampo(null);
    try {
      const dataUrl = await compresor.current.comprimir(archivo);
      // Todo interno: la foto se guarda en la app, sin descargas ni notificaciones
      gestor.current.guardarFoto(paso.numero, campo, dataUrl);
      setVersion(v => v + 1);
      setReconociendo({ campo, progreso: 0 });
      // El OCR trabaja sobre la foto original en alta resolución, mejorada
      const paraOcr = await mejorador.current.prepararParaOcr(archivo);
      const texto = await reconocedor.current.reconocer(paraOcr, (p) => setReconociendo({ campo, progreso: p }));
      const datos = reconocedor.current.extraerDatos(texto);
      let encontrados = 0;
      // La foto llena su campo y cualquier otro campo vacío del paso
      for (const otro of paso.campos) {
        if (datos[otro] && (otro === campo || !gestor.current.obtenerCampo(paso.numero, otro))) {
          gestor.current.guardarCampo(paso.numero, otro, datos[otro]);
          encontrados++;
        }
      }
      if (campo === '__paso' ? encontrados === 0 : !datos[campo]) {
        setAvisoCampo(campo);
      }
    } catch {
      setAvisoCampo(campo);
    } finally {
      setReconociendo(null);
      setVersion(v => v + 1);
    }
  };

  useEffect(() => {
    if (!galeria) return;
    const estadoActual = window.history.state;
    window.history.pushState({ ...estadoActual, visorFoto: true }, '');
    // Solo cerrar la galería cuando se retrocede fuera de su estado (no cerrar además el modo enfoque)
    const cerrarConRetroceso = (e) => { if (!e.state?.visorFoto) cerrarGaleria(); };
    window.addEventListener('popstate', cerrarConRetroceso);
    return () => {
      window.removeEventListener('popstate', cerrarConRetroceso);
      if (window.history.state?.visorFoto) window.history.back();
    };
  }, [galeria]);

  // El botón atrás cierra el modo enfoque (se empuja un estado al abrirlo)
  const enfoqueAbierto = pasoEnfocado !== null;
  useEffect(() => {
    if (!enfoqueAbierto) return;
    const estadoActual = window.history.state;
    window.history.pushState({ ...estadoActual, enfoquePaso: true }, '');
    // Solo cerrar el enfoque cuando su marca ya no está (si hay una imagen encima, el atrás cierra la imagen primero)
    const cerrar = (e) => { if (!e.state?.enfoquePaso) setPasoEnfocado(null); };
    window.addEventListener('popstate', cerrar);
    return () => {
      window.removeEventListener('popstate', cerrar);
      if (window.history.state?.enfoquePaso) window.history.back();
    };
  }, [enfoqueAbierto]);

  const total = PASOS_INSTALACION.length;
  const completados = gestor.current.totalCompletados;
  const porcentaje = Math.round((completados / total) * 100);

  const alternarPaso = (numero) => {
    gestor.current.alternar(numero);
    setVersion(v => v + 1);
  };

  // Marcar con el checkbox: al completar, resalta y baja al siguiente paso sin abrirlo
  const marcarConCheck = (numero) => {
    const estaba = gestor.current.estaCompletado(numero);
    gestor.current.alternar(numero);
    setVersion(v => v + 1);
    if (estaba) return;
    const idx = PASOS_INSTALACION.findIndex(p => p.numero === numero);
    const siguiente = PASOS_INSTALACION[idx + 1];
    if (siguiente) {
      setUltimoVisto(siguiente.numero);
      setTimeout(() => { pasosRef.current[siguiente.numero]?.scrollIntoView({ behavior: 'smooth', block: 'center' }); }, 80);
    }
  };

  return (
    <div className="min-h-[100svh] flex flex-col select-none" style={{ backgroundColor: 'var(--fondo-base)', fontFamily: 'var(--fuente-sans)' }}>
      {/* Header */}
      <div ref={encabezadoRef} className="sticky top-0 z-10 border-b" style={{ backgroundColor: 'var(--fondo-base)', borderColor: 'var(--borde)' }}>
        <div className="w-full max-w-sm mx-auto px-5 pt-4 pb-3">
          <button onClick={onVolver} className="flex items-center gap-2 text-sm mb-3 transition-colors" style={{ color: 'var(--texto-secundario)' }}>
            ← Volver
          </button>
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-lg font-bold" style={{ color: 'var(--texto-primario)' }}>Instalación Xstore · Caja {caja}</h1>
            <span className="text-xs font-mono" style={{ color: porcentaje === 100 ? 'var(--acento)' : 'var(--texto-secundario)' }}>
              {completados}/{total}
            </span>
          </div>
          <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--fondo-elevado)' }}>
            <div className="h-full rounded-full transition-all duration-300" style={{ width: `${porcentaje}%`, backgroundColor: 'var(--acento)' }} />
          </div>
        </div>
      </div>

      {/* Contenido */}
      <div className="flex-1 w-full max-w-sm mx-auto px-5 py-4 pb-10">
        {porcentaje === 100 && (
          <div className="border rounded-xl px-4 py-3 mb-4 banner-animado" style={{ backgroundColor: 'var(--exito-fondo)', borderColor: 'var(--acento-btn)' }}>
            <p className="text-sm" style={{ color: 'var(--acento)' }}>✓ Instalación completa — los {total} pasos están listos</p>
          </div>
        )}

        {FASES_INSTALACION.map(fase => {
          const pasosDeFase = PASOS_INSTALACION.filter(p => p.faseId === fase.id);
          const completadosFase = pasosDeFase.filter(p => gestor.current.estaCompletado(p.numero)).length;

          return (
            <div key={fase.id} className="mb-5">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-sm font-extrabold uppercase tracking-wider flex items-center gap-2" style={{ color: 'var(--acento)' }}>
                  <span className="inline-block w-1 h-4 rounded-full" style={{ backgroundColor: 'var(--acento)' }} />
                  {fase.nombre}
                </h2>
                <span className="text-xs font-mono" style={{ color: completadosFase === pasosDeFase.length ? 'var(--acento)' : 'var(--texto-tenue)' }}>
                  {completadosFase}/{pasosDeFase.length}
                </span>
              </div>
              <p className="text-xs mb-2.5" style={{ color: 'var(--texto-tenue)' }}>{fase.descripcion}</p>

              <div className="border rounded-xl" style={{ borderColor: 'var(--borde)' }}>
                {pasosDeFase.map((paso, i) => {
                  const completado = gestor.current.estaCompletado(paso.numero);
                  const estaEnfocado = pasoEnfocado === paso.numero;
                  const indiceGlobal = PASOS_INSTALACION.findIndex(p => p.numero === paso.numero);
                  const abierto = pasoAbierto === paso.numero;
                  const esUltimoVisto = !abierto && ultimoVisto === paso.numero;
                  const esPrimero = i === 0;
                  const esUltimo = i === pasosDeFase.length - 1;

                  return (
                    <div
                      key={paso.numero}
                      ref={el => { pasosRef.current[paso.numero] = el; }}
                      style={{
                        borderTop: i > 0 ? '1px solid var(--borde)' : 'none',
                        backgroundColor: abierto ? 'var(--fondo-base)' : 'var(--fondo-panel)',
                        borderLeft: abierto ? '3px solid var(--acento)' : '3px solid transparent',
                        borderTopLeftRadius: esPrimero ? 11 : 0,
                        borderTopRightRadius: esPrimero ? 11 : 0,
                        borderBottomLeftRadius: esUltimo ? 11 : 0,
                        borderBottomRightRadius: esUltimo ? 11 : 0,
                        scrollMarginTop: `${altoEncabezado}px`,
                      }}
                    >
                      <div
                        className="flex items-center gap-3 px-3.5 py-3"
                        style={{
                          backgroundColor: abierto ? 'var(--fondo-elevado)' : esUltimoVisto ? 'var(--acento-suave)' : 'transparent',
                          borderTopLeftRadius: esPrimero ? 9 : 0,
                          borderTopRightRadius: esPrimero ? 9 : 0,
                          // Recuadro alrededor de la cabecera del último paso visto, para reubicarte en la lista
                          ...(esUltimoVisto ? { boxShadow: 'inset 0 0 0 2px var(--acento)', borderRadius: 8 } : {}),
                          ...(abierto ? { position: 'sticky', top: altoEncabezado, zIndex: 5, borderBottom: '1px solid var(--borde)' } : {}),
                        }}
                      >
                        {/* Checkbox */}
                        <button
                          onClick={() => marcarConCheck(paso.numero)}
                          className="w-6 h-6 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all"
                          style={{
                            borderColor: completado ? 'var(--acento)' : 'var(--texto-tenue)',
                            backgroundColor: completado ? 'var(--acento)' : 'transparent',
                          }}
                        >
                          {completado && (
                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                              <path d="M2.5 6L5 8.5L9.5 3.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          )}
                        </button>

                        {/* Título */}
                        <button
                          onClick={() => abrirEnfoque(paso.numero)}
                          className="flex-1 min-w-0 text-left"
                        >
                          <p className="text-base leading-snug" style={{ color: completado ? 'var(--texto-tenue)' : 'var(--texto-primario)', textDecoration: completado ? 'line-through' : 'none' }}>
                            <span className="font-mono text-sm mr-1.5" style={{ color: completado ? 'var(--texto-tenue)' : 'var(--acento)' }}>{paso.numero}.</span>
                            {paso.titulo}
                          </p>
                        </button>

                        {/* Indicadores */}
                        <div className="flex items-center gap-1.5 flex-shrink-0">
                          {paso.advertencia && <span className="text-xs">⚠️</span>}
                          {paso.imagenes.length > 0 && (
                            <span className="text-[10px] font-mono" style={{ color: 'var(--texto-tenue)' }}>📷{paso.imagenes.length}</span>
                          )}
                          <button onClick={() => abrirEnfoque(paso.numero)} className="text-base" style={{ color: 'var(--texto-tenue)' }}>
                            ›
                          </button>
                        </div>
                      </div>

                      {/* Modo enfoque: el paso ocupa toda la pantalla; se cambia de paso deslizando de costado */}
                      {estaEnfocado && (
                        <div
                          className="fixed inset-0 z-40 flex flex-col select-none"
                          style={{ backgroundColor: 'var(--fondo-base)', fontFamily: 'var(--fuente-sans)' }}
                          onTouchStart={inicioDeslizar}
                          onTouchEnd={finDeslizar}
                        >
                          {/* Cabecera del modo enfoque */}
                          <div className="flex-shrink-0 border-b" style={{ backgroundColor: 'var(--fondo-elevado)', borderColor: 'var(--borde)' }}>
                            <div className="w-full max-w-sm mx-auto px-4 pt-4 pb-3">
                              <div className="flex items-center gap-3 mb-2">
                                <button onClick={cerrarEnfoque} className="text-xl flex-shrink-0" style={{ color: 'var(--texto-secundario)' }}>←</button>
                                <div className="flex-1 min-w-0">
                                  <p className="text-[11px] uppercase tracking-wide font-semibold" style={{ color: 'var(--acento)' }}>Paso {indiceGlobal + 1} de {total}</p>
                                  <p className="text-base font-bold leading-snug" style={{ color: completado ? 'var(--texto-tenue)' : 'var(--texto-primario)', textDecoration: completado ? 'line-through' : 'none' }}>
                                    <span className="font-mono text-sm mr-1.5" style={{ color: 'var(--acento)' }}>{paso.numero}.</span>{paso.titulo}
                                  </p>
                                </div>
                                <button
                                  onClick={() => marcarConCheck(paso.numero)}
                                  className="w-7 h-7 rounded-full border-2 flex-shrink-0 flex items-center justify-center"
                                  style={{ borderColor: completado ? 'var(--acento)' : 'var(--texto-tenue)', backgroundColor: completado ? 'var(--acento)' : 'transparent' }}
                                >
                                  {completado && <svg width="13" height="13" viewBox="0 0 12 12" fill="none"><path d="M2.5 6L5 8.5L9.5 3.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>}
                                </button>
                              </div>
                              <div className="w-full h-1 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--fondo-base)' }}>
                                <div className="h-full rounded-full transition-all duration-300" style={{ width: `${((indiceGlobal + 1) / total) * 100}%`, backgroundColor: 'var(--acento)' }} />
                              </div>
                            </div>
                          </div>
                          {/* Contenido desplazable del paso */}
                          <div ref={scrollEnfoqueRef} className="flex-1 overflow-y-auto">
                            <div className="w-full max-w-sm mx-auto px-4 pt-3 pb-6" style={{ backgroundColor: 'var(--fondo-base)' }}>
                          {paso.advertencia && (
                            <div className="border rounded-lg px-3 py-2.5 mb-3" style={{ borderColor: 'var(--advertencia)', backgroundColor: 'color-mix(in srgb, var(--advertencia) 10%, transparent)' }}>
                              <p className="text-sm font-semibold" style={{ color: 'var(--advertencia)' }}>⚠️ {paso.advertencia}</p>
                            </div>
                          )}
                          <p className="text-sm leading-relaxed whitespace-pre-line mb-3" style={{ color: 'var(--texto-secundario)' }}>{renderizarDetalle(paso.detalle)}</p>

                          {/* Ubicaciones (celeste), archivos (amarillo) y comandos (verde) — cada uno en su línea */}
                          {(paso.ubicaciones.length > 0 || paso.archivos.length > 0 || paso.comandos.length > 0) && (
                            <div className="mb-3 space-y-1">
                              {paso.ubicaciones.map((u, k) => (
                                <p key={`u${k}`} className="text-sm font-mono font-bold break-all leading-snug" style={{ color: '#39c5cf' }}>{u}</p>
                              ))}
                              {paso.archivos.map((a, k) => (
                                <p key={`a${k}`} className="text-sm font-mono font-bold break-all leading-snug" style={{ color: 'var(--advertencia)' }}>{a}</p>
                              ))}
                              {paso.comandos.map((c, k) => (
                                <p key={`c${k}`} className="text-sm font-mono font-bold break-all leading-snug" style={{ color: 'var(--acento)' }}>{c}</p>
                              ))}
                            </div>
                          )}

                          {/* Datos guardados en pasos anteriores (IP, hostname, nombre de tienda…) */}
                          {paso.referencias.length > 0 && (() => {
                            const refAbierta = referenciasAbiertas.has(paso.numero);
                            const refs = paso.referencias.map(datosDePaso).filter(Boolean);
                            const hayDatos = refs.some(r => r.campos.length > 0 || r.fotos.length > 0);
                            return (
                              <div className="mb-3">
                                <button
                                  onClick={() => alternarReferencia(paso.numero)}
                                  className="w-full flex items-center justify-between px-3 py-2 rounded-lg border transition-colors"
                                  style={{ borderColor: 'var(--acento)', backgroundColor: 'color-mix(in srgb, var(--acento) 8%, transparent)' }}
                                >
                                  <span className="text-xs font-semibold flex items-center gap-1.5" style={{ color: 'var(--acento)' }}>
                                    📋 Ver datos que ya guardaste
                                  </span>
                                  <span className="text-xs" style={{ color: 'var(--acento)' }}>{refAbierta ? '▲' : '▼'}</span>
                                </button>
                                {refAbierta && (
                                  <div className="mt-2 space-y-3">
                                    {!hayDatos && (
                                      <p className="text-xs" style={{ color: 'var(--texto-tenue)' }}>
                                        Todavía no cargaste estos datos. Volvé al paso {paso.referencias.join(' y ')} para tomarlos.
                                      </p>
                                    )}
                                    {refs.map(({ pasoRef, campos, fotos }) => (
                                      (campos.length > 0 || fotos.length > 0) && (
                                        <div key={pasoRef.numero} className="rounded-lg border p-2.5" style={{ borderColor: 'var(--borde)', backgroundColor: 'var(--fondo-panel)' }}>
                                          <p className="text-[11px] font-semibold uppercase tracking-wide mb-2" style={{ color: 'var(--texto-tenue)' }}>
                                            Paso {pasoRef.numero} · {pasoRef.titulo}
                                          </p>
                                          {campos.length > 0 && (
                                            <div className="space-y-1 mb-2">
                                              {campos.map(({ campo, valor }) => (
                                                <div key={campo} className="flex items-baseline justify-between gap-2">
                                                  <span className="text-[11px]" style={{ color: 'var(--texto-tenue)' }}>{campo}</span>
                                                  <span className="text-sm font-mono font-bold text-right break-all" style={{ color: 'var(--acento)' }}>{valor}</span>
                                                </div>
                                              ))}
                                            </div>
                                          )}
                                          {fotos.length > 0 && (
                                            <div className="flex gap-2 flex-wrap">
                                              {fotos.map((foto, k) => (
                                                <img
                                                  key={k}
                                                  src={foto}
                                                  alt="Dato guardado"
                                                  onClick={() => abrirFoto(foto)}
                                                  className="h-20 w-auto rounded-md border cursor-zoom-in"
                                                  style={{ borderColor: 'var(--borde)' }}
                                                />
                                              ))}
                                            </div>
                                          )}
                                        </div>
                                      )
                                    ))}
                                  </div>
                                )}
                              </div>
                            );
                          })()}

                          {/* Campos de datos: la foto primero, el texto si se reconoció */}
                          {paso.campos.length > 0 && (
                            <div className="space-y-4 mb-3">
                              {/* Una sola foto para todo el paso */}
                              {paso.fotoUnica && (() => {
                                const fotoPaso = gestor.current.obtenerFoto(paso.numero, '__paso');
                                const procesandoPaso = reconociendo?.campo === '__paso';
                                return (
                                  <div>
                                    {fotoPaso ? (
                                      <div className="relative">
                                        <img
                                          src={fotoPaso}
                                          alt="Foto del paso"
                                          onClick={() => abrirFoto(fotoPaso)}
                                          className="w-full h-36 object-cover rounded-lg border cursor-zoom-in"
                                          style={{ borderColor: 'var(--borde)' }}
                                        />
                                        {procesandoPaso && (
                                          <div className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded-md pointer-events-none" style={{ backgroundColor: 'rgba(0,0,0,0.65)' }}>
                                            <p className="text-[10px] font-semibold text-white">Reconociendo... {reconociendo.progreso}%</p>
                                          </div>
                                        )}
                                        <div className="absolute bottom-1.5 right-1.5 flex gap-1.5">
                                          <button
                                            onClick={() => { campoActivo.current = '__paso'; vieneDeCamara.current = true; archivoCamaraRef.current?.click(); }}                                            className="w-8 h-8 rounded-lg text-xs flex items-center justify-center backdrop-blur-sm disabled:opacity-40"
                                            style={{ backgroundColor: 'rgba(0,0,0,0.55)' }}
                                            title="Tomar otra foto"
                                          >
                                            📷
                                          </button>
                                          <button
                                            onClick={() => { campoActivo.current = '__paso'; vieneDeCamara.current = false; archivoFotoRef.current?.click(); }}                                            className="w-8 h-8 rounded-lg text-xs flex items-center justify-center backdrop-blur-sm disabled:opacity-40"
                                            style={{ backgroundColor: 'rgba(0,0,0,0.55)' }}
                                            title="Elegir de la galería"
                                          >
                                            🖼️
                                          </button>
                                          <button
                                            onClick={() => { gestor.current.eliminarFoto(paso.numero, '__paso'); setVersion(v => v + 1); }}                                            className="w-8 h-8 rounded-lg text-xs flex items-center justify-center backdrop-blur-sm disabled:opacity-40"
                                            style={{ backgroundColor: 'rgba(0,0,0,0.55)' }}
                                            title="Eliminar foto"
                                          >
                                            🗑
                                          </button>
                                        </div>
                                      </div>
                                    ) : (
                                      <div className="flex gap-2">
                                        <button
                                          onClick={() => { campoActivo.current = '__paso'; vieneDeCamara.current = true; archivoCamaraRef.current?.click(); }}                                          className="flex-1 py-2.5 border border-dashed rounded-lg text-sm font-semibold transition-colors disabled:opacity-40"
                                          style={{ borderColor: 'var(--acento)', color: 'var(--acento)' }}
                                        >
                                          📷 Tomar foto de la pantalla de red
                                        </button>
                                        <button
                                          onClick={() => { campoActivo.current = '__paso'; vieneDeCamara.current = false; archivoFotoRef.current?.click(); }}                                          className="w-11 border rounded-lg text-xs flex items-center justify-center transition-colors disabled:opacity-40"
                                          style={{ borderColor: 'var(--borde)', color: 'var(--texto-secundario)' }}
                                          title="Elegir de la galería"
                                        >
                                          🖼️
                                        </button>
                                      </div>
                                    )}
                                    {avisoCampo === '__paso' && (
                                      <p className="text-xs mt-1" style={{ color: 'var(--advertencia)' }}>No se reconoció ningún dato en la foto — completá los campos a mano.</p>
                                    )}
                                  </div>
                                );
                              })()}

                              {paso.campos.map(campo => {
                                const foto = gestor.current.obtenerFoto(paso.numero, campo);
                                const valor = gestor.current.obtenerCampo(paso.numero, campo);
                                const procesando = reconociendo?.campo === campo;
                                const clave = `${paso.numero}-${campo}`;
                                const mostrarTexto = valor !== '' || camposAbiertos.has(clave) || procesando || (paso.fotoUnica && pasosManuales.has(paso.numero));
                                // En foto única, si el campo no se muestra, se oculta por completo (una sola acción manual controla todos)
                                if (paso.fotoUnica && !mostrarTexto) return null;
                                return (
                                  <div key={campo}>
                                    <div className="flex items-center justify-between mb-1.5">
                                      <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--texto-tenue)' }}>{campo}</p>
                                      {!mostrarTexto && !paso.fotoUnica && (
                                        <button
                                          onClick={() => { setCamposAbiertos(prev => new Set(prev).add(clave)); }}
                                          className="text-xs"
                                          style={{ color: 'var(--texto-tenue)' }}
                                        >
                                          ✎ Escribir a mano
                                        </button>
                                      )}
                                    </div>

                                    {!paso.fotoUnica && (foto ? (
                                      <div className="relative mb-2">
                                        <img
                                          src={foto}
                                          alt={`Foto de ${campo}`}
                                          onClick={() => abrirFoto(foto)}
                                          className="w-full h-32 object-cover rounded-lg border cursor-zoom-in"
                                          style={{ borderColor: 'var(--borde)' }}
                                        />
                                        {procesando && (
                                          <div className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded-md pointer-events-none" style={{ backgroundColor: 'rgba(0,0,0,0.65)' }}>
                                            <p className="text-[10px] font-semibold text-white">Reconociendo... {reconociendo.progreso}%</p>
                                          </div>
                                        )}
                                        <div className="absolute bottom-1.5 right-1.5 flex gap-1.5">
                                          <button
                                            onClick={() => { campoActivo.current = campo; vieneDeCamara.current = true; archivoCamaraRef.current?.click(); }}                                            className="w-8 h-8 rounded-lg text-xs flex items-center justify-center backdrop-blur-sm disabled:opacity-40"
                                            style={{ backgroundColor: 'rgba(0,0,0,0.55)' }}
                                            title="Tomar otra foto"
                                          >
                                            📷
                                          </button>
                                          <button
                                            onClick={() => { campoActivo.current = campo; vieneDeCamara.current = false; archivoFotoRef.current?.click(); }}                                            className="w-8 h-8 rounded-lg text-xs flex items-center justify-center backdrop-blur-sm disabled:opacity-40"
                                            style={{ backgroundColor: 'rgba(0,0,0,0.55)' }}
                                            title="Elegir de la galería"
                                          >
                                            🖼️
                                          </button>
                                          <button
                                            onClick={() => { gestor.current.eliminarFoto(paso.numero, campo); setVersion(v => v + 1); }}                                            className="w-8 h-8 rounded-lg text-xs flex items-center justify-center backdrop-blur-sm disabled:opacity-40"
                                            style={{ backgroundColor: 'rgba(0,0,0,0.55)' }}
                                            title="Eliminar foto"
                                          >
                                            🗑
                                          </button>
                                        </div>
                                      </div>
                                    ) : (
                                      <div className="flex gap-2 mb-2">
                                        <button
                                          onClick={() => { campoActivo.current = campo; vieneDeCamara.current = true; archivoCamaraRef.current?.click(); }}                                          className="flex-1 py-2.5 border border-dashed rounded-lg text-sm font-semibold transition-colors disabled:opacity-40"
                                          style={{ borderColor: 'var(--acento)', color: 'var(--acento)' }}
                                        >
                                          📷 Tomar foto
                                        </button>
                                        <button
                                          onClick={() => { campoActivo.current = campo; vieneDeCamara.current = false; archivoFotoRef.current?.click(); }}                                          className="w-11 border rounded-lg text-xs flex items-center justify-center transition-colors disabled:opacity-40"
                                          style={{ borderColor: 'var(--borde)', color: 'var(--texto-secundario)' }}
                                          title="Elegir de la galería"
                                        >
                                          🖼️
                                        </button>
                                      </div>
                                    ))}

                                    {mostrarTexto && (
                                      <input
                                        value={valor}
                                        onChange={(e) => { gestor.current.guardarCampo(paso.numero, campo, e.target.value); setVersion(v => v + 1); }}
                                        placeholder={procesando ? `Reconociendo... ${reconociendo.progreso}%` : `Escribe el ${campo.toLowerCase()}...`}
                                        className="w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none"
                                        style={{ backgroundColor: 'var(--fondo-panel)', borderColor: procesando ? 'var(--acento)' : 'var(--borde)', color: 'var(--texto-primario)', fontFamily: 'var(--fuente-mono)' }}
                                        spellCheck={false}
                                      />
                                    )}
                                    {avisoCampo === campo && (
                                      <p className="text-xs mt-1" style={{ color: 'var(--advertencia)' }}>No se reconoció el {campo.toLowerCase()} en la foto — tocá "✎ Escribir a mano".</p>
                                    )}
                                  </div>
                                );
                              })}

                              {/* En foto única: una sola opción para escribir todo a mano */}
                              {paso.fotoUnica && !pasosManuales.has(paso.numero) && (
                                <button
                                  onClick={() => setPasosManuales(prev => new Set(prev).add(paso.numero))}
                                  className="w-full py-2.5 border border-dashed rounded-lg text-sm transition-colors"
                                  style={{ borderColor: 'var(--borde)', color: 'var(--texto-secundario)' }}
                                >
                                  ✎ Escribir los datos a mano
                                </button>
                              )}

                              <input ref={archivoFotoRef} type="file" accept="image/*" onChange={(e) => subirFoto(e, paso)} className="hidden" />
                              <input ref={archivoCamaraRef} type="file" accept="image/*" capture="environment" onChange={(e) => subirFoto(e, paso)} className="hidden" />
                            </div>
                          )}

                          {paso.imagenes.length > 0 && (
                            <div className="space-y-2">
                              {paso.imagenes.map(img => (
                                <img
                                  key={img}
                                  src={img}
                                  alt={`Paso ${paso.numero}`}
                                  onClick={() => abrirManual(img)}
                                  className="w-full rounded-lg cursor-zoom-in"
                                  style={{ border: img === ultimaImagen ? '3px solid var(--acento)' : '1px solid var(--borde)', boxShadow: img === ultimaImagen ? '0 0 0 2px var(--acento-suave)' : 'none' }}
                                  loading="lazy"
                                />
                              ))}
                            </div>
                          )}
                          <button
                            onClick={() => completarYAvanzar(paso)}
                            className="w-full mt-3 py-3 rounded-lg text-sm font-semibold transition-colors"
                            style={{
                              backgroundColor: completado ? 'var(--fondo-elevado)' : 'var(--acento-btn)',
                              color: completado ? 'var(--texto-secundario)' : '#fff',
                            }}
                          >
                            {completado ? 'Desmarcar paso' : '✓ Marcar como completado y continuar'}
                          </button>
                            </div>
                          </div>
                          {/* Indicador de posición: barra verde en el paso actual, puntos para el resto; los ya marcados quedan opacos */}
                          <div className="flex-shrink-0 flex items-center justify-center gap-1 border-t px-4 py-3" style={{ borderColor: 'var(--borde)', backgroundColor: 'var(--fondo-elevado)' }}>
                            {PASOS_INSTALACION.map(pp => {
                              const actual = pp.numero === paso.numero;
                              const hecho = gestor.current.estaCompletado(pp.numero);
                              return (
                                <button
                                  key={pp.numero}
                                  onClick={() => { setPasoEnfocado(pp.numero); setUltimoVisto(pp.numero); }}
                                  className="h-1.5 rounded-full transition-all"
                                  style={{
                                    width: actual ? 22 : 7,
                                    backgroundColor: (actual || hecho) ? 'var(--acento)' : 'var(--texto-tenue)',
                                    opacity: actual ? 1 : hecho ? 0.4 : 0.3,
                                  }}
                                  aria-label={`Ir al paso ${pp.numero}`}
                                />
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}

        {/* Reiniciar */}
        {completados > 0 && (
          confirmandoReinicio ? (
            <div className="space-y-3 mt-6">
              <p className="text-xs" style={{ color: 'var(--error)' }}>¿Reiniciar el checklist? Se desmarcarán los {completados} pasos.</p>
              <div className="flex gap-2">
                <button
                  onClick={() => { gestor.current.reiniciar(); setConfirmandoReinicio(false); setVersion(v => v + 1); }}
                  className="flex-1 py-2.5 text-sm rounded-xl transition-colors"
                  style={{ backgroundColor: 'var(--error)', color: '#fff' }}
                >
                  Confirmar
                </button>
                <button
                  onClick={() => setConfirmandoReinicio(false)}
                  className="flex-1 py-2.5 border text-sm rounded-xl transition-colors"
                  style={{ borderColor: 'var(--borde)', color: 'var(--texto-secundario)' }}
                >
                  Cancelar
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setConfirmandoReinicio(true)}
              className="w-full mt-6 py-3 border text-sm rounded-xl transition-colors"
              style={{ borderColor: 'color-mix(in srgb, var(--error) 40%, transparent)', color: 'var(--error)' }}
            >
              Reiniciar checklist
            </button>
          )
        )}
      </div>

      {/* Galería con zoom y deslizar entre imágenes */}
      {galeria && (
        <VisorGaleria
          imagenes={galeria.imagenes}
          indiceInicial={galeria.indice}
          onCambioIndice={(i) => { indiceGalRef.current = i; }}
          onCerrar={cerrarGaleria}
        />
      )}
    </div>
  );
}
