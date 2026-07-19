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
  p.imagenes.map(src => ({ src, grupo: p.numero, etiqueta: `${p.numero}. ${p.titulo}`, color: '#3fb950' }))
);

function renderizarDetalle(texto) {
  return texto.split(/(\[\[.*?\]\])/g).map((parte, i) => {
    if (parte.startsWith('[[') && parte.endsWith(']]')) {
      return <span key={i} style={{ color: 'var(--advertencia)', fontWeight: 600 }}>{parte.slice(2, -2)}</span>;
    }
    return parte;
  });
}

export default function PantallaInstalacion({ onVolver }) {
  const gestor = useRef(new GestorInstalacion());
  const compresor = useRef(new CompresorImagen());
  const mejorador = useRef(new MejoradorImagen());
  const reconocedor = useRef(new ReconocedorTexto());
  const archivoFotoRef = useRef(null);
  const [, setVersion] = useState(0);
  const [pasoAbierto, setPasoAbierto] = useState(null);
  const [galeria, setGaleria] = useState(null);

  const abrirManual = (src) => {
    const indice = GALERIA_MANUAL.findIndex(g => g.src === src);
    if (indice >= 0) setGaleria({ imagenes: GALERIA_MANUAL, indice });
  };
  const abrirFoto = (src) => setGaleria({ imagenes: [{ src, grupo: 0, etiqueta: 'Foto guardada', color: '#8250df' }], indice: 0 });
  const [confirmandoReinicio, setConfirmandoReinicio] = useState(false);
  const [reconociendo, setReconociendo] = useState(null);
  const [avisoCampo, setAvisoCampo] = useState(null);
  const [camposAbiertos, setCamposAbiertos] = useState(new Set());
  const [pasosManuales, setPasosManuales] = useState(new Set());
  const campoActivo = useRef(null);
  const vieneDeCamara = useRef(false);
  const archivoCamaraRef = useRef(null);
  const pasosRef = useRef({});

  const completarYAvanzar = (paso) => {
    const estaba = gestor.current.estaCompletado(paso.numero);
    alternarPaso(paso.numero);
    if (estaba) return; // se desmarcó: no avanzar
    const idx = PASOS_INSTALACION.findIndex(p => p.numero === paso.numero);
    const siguiente = PASOS_INSTALACION[idx + 1];
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
      gestor.current.guardarFoto(paso.numero, campo, dataUrl);
      if (vieneDeCamara.current) {
        // Guardar copia en el teléfono (carpeta Descargas) por si acaso
        const enlace = document.createElement('a');
        enlace.href = dataUrl;
        enlace.download = `paso${paso.numero}-${campo.toLowerCase().replace(/\s+/g, '-')}.jpg`;
        enlace.click();
      }
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
    const cerrarConRetroceso = () => setGaleria(null);
    window.addEventListener('popstate', cerrarConRetroceso);
    return () => {
      window.removeEventListener('popstate', cerrarConRetroceso);
      if (window.history.state?.visorFoto) window.history.back();
    };
  }, [galeria]);

  const total = PASOS_INSTALACION.length;
  const completados = gestor.current.totalCompletados;
  const porcentaje = Math.round((completados / total) * 100);

  const alternarPaso = (numero) => {
    gestor.current.alternar(numero);
    setVersion(v => v + 1);
  };

  return (
    <div className="min-h-[100svh] flex flex-col select-none" style={{ backgroundColor: 'var(--fondo-base)', fontFamily: 'var(--fuente-sans)' }}>
      {/* Header */}
      <div className="sticky top-0 z-10 border-b" style={{ backgroundColor: 'var(--fondo-base)', borderColor: 'var(--borde)' }}>
        <div className="w-full max-w-sm mx-auto px-5 pt-4 pb-3">
          <button onClick={onVolver} className="flex items-center gap-2 text-sm mb-3 transition-colors" style={{ color: 'var(--texto-secundario)' }}>
            ← Volver
          </button>
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-lg font-bold" style={{ color: 'var(--texto-primario)' }}>Instalación Xstore</h1>
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
                <h2 className="text-sm font-bold uppercase tracking-wider" style={{ color: 'var(--texto-secundario)' }}>{fase.nombre}</h2>
                <span className="text-xs font-mono" style={{ color: completadosFase === pasosDeFase.length ? 'var(--acento)' : 'var(--texto-tenue)' }}>
                  {completadosFase}/{pasosDeFase.length}
                </span>
              </div>
              <p className="text-xs mb-2.5" style={{ color: 'var(--texto-tenue)' }}>{fase.descripcion}</p>

              <div className="border rounded-xl overflow-hidden" style={{ borderColor: 'var(--borde)' }}>
                {pasosDeFase.map((paso, i) => {
                  const completado = gestor.current.estaCompletado(paso.numero);
                  const abierto = pasoAbierto === paso.numero;

                  return (
                    <div
                      key={paso.numero}
                      ref={el => { pasosRef.current[paso.numero] = el; }}
                      style={{
                        borderTop: i > 0 ? '1px solid var(--borde)' : 'none',
                        backgroundColor: abierto ? 'var(--fondo-base)' : 'var(--fondo-panel)',
                        borderLeft: abierto ? '3px solid var(--acento)' : '3px solid transparent',
                        scrollMarginTop: '96px',
                      }}
                    >
                      <div className="flex items-center gap-3 px-3.5 py-3" style={{ backgroundColor: abierto ? 'var(--fondo-elevado)' : 'transparent' }}>
                        {/* Checkbox */}
                        <button
                          onClick={() => alternarPaso(paso.numero)}
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
                          onClick={() => setPasoAbierto(abierto ? null : paso.numero)}
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
                          <button onClick={() => setPasoAbierto(abierto ? null : paso.numero)} className="text-xs" style={{ color: 'var(--texto-tenue)' }}>
                            {abierto ? '▲' : '▼'}
                          </button>
                        </div>
                      </div>

                      {/* Detalle expandido */}
                      {abierto && (
                        <div className="px-3.5 pb-3.5 pt-1" style={{ backgroundColor: 'var(--fondo-base)' }}>
                          {paso.advertencia && (
                            <div className="border rounded-lg px-3 py-2.5 mb-3" style={{ borderColor: 'var(--advertencia)', backgroundColor: 'color-mix(in srgb, var(--advertencia) 10%, transparent)' }}>
                              <p className="text-sm font-semibold" style={{ color: 'var(--advertencia)' }}>⚠️ {paso.advertencia}</p>
                            </div>
                          )}
                          <p className="text-sm leading-relaxed whitespace-pre-line mb-3" style={{ color: 'var(--texto-secundario)' }}>{renderizarDetalle(paso.detalle)}</p>

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
                                          <div className="absolute inset-0 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'rgba(0,0,0,0.55)' }}>
                                            <p className="text-xs font-semibold text-white">Reconociendo... {reconociendo.progreso}%</p>
                                          </div>
                                        )}
                                        <div className="absolute bottom-1.5 right-1.5 flex gap-1.5">
                                          <button
                                            onClick={() => { campoActivo.current = '__paso'; vieneDeCamara.current = true; archivoCamaraRef.current?.click(); }}
                                            disabled={reconociendo !== null}
                                            className="w-8 h-8 rounded-lg text-xs flex items-center justify-center backdrop-blur-sm disabled:opacity-40"
                                            style={{ backgroundColor: 'rgba(0,0,0,0.55)' }}
                                            title="Tomar otra foto"
                                          >
                                            📷
                                          </button>
                                          <button
                                            onClick={() => { campoActivo.current = '__paso'; vieneDeCamara.current = false; archivoFotoRef.current?.click(); }}
                                            disabled={reconociendo !== null}
                                            className="w-8 h-8 rounded-lg text-xs flex items-center justify-center backdrop-blur-sm disabled:opacity-40"
                                            style={{ backgroundColor: 'rgba(0,0,0,0.55)' }}
                                            title="Elegir de la galería"
                                          >
                                            🖼️
                                          </button>
                                          <button
                                            onClick={() => { gestor.current.eliminarFoto(paso.numero, '__paso'); setVersion(v => v + 1); }}
                                            disabled={reconociendo !== null}
                                            className="w-8 h-8 rounded-lg text-xs flex items-center justify-center backdrop-blur-sm disabled:opacity-40"
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
                                          onClick={() => { campoActivo.current = '__paso'; vieneDeCamara.current = true; archivoCamaraRef.current?.click(); }}
                                          disabled={reconociendo !== null}
                                          className="flex-1 py-2.5 border border-dashed rounded-lg text-sm font-semibold transition-colors disabled:opacity-40"
                                          style={{ borderColor: 'var(--acento)', color: 'var(--acento)' }}
                                        >
                                          📷 Tomar foto de la pantalla de red
                                        </button>
                                        <button
                                          onClick={() => { campoActivo.current = '__paso'; vieneDeCamara.current = false; archivoFotoRef.current?.click(); }}
                                          disabled={reconociendo !== null}
                                          className="w-11 border rounded-lg text-xs flex items-center justify-center transition-colors disabled:opacity-40"
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
                                          <div className="absolute inset-0 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'rgba(0,0,0,0.55)' }}>
                                            <p className="text-xs font-semibold text-white">Reconociendo... {reconociendo.progreso}%</p>
                                          </div>
                                        )}
                                        <div className="absolute bottom-1.5 right-1.5 flex gap-1.5">
                                          <button
                                            onClick={() => { campoActivo.current = campo; vieneDeCamara.current = true; archivoCamaraRef.current?.click(); }}
                                            disabled={reconociendo !== null}
                                            className="w-8 h-8 rounded-lg text-xs flex items-center justify-center backdrop-blur-sm disabled:opacity-40"
                                            style={{ backgroundColor: 'rgba(0,0,0,0.55)' }}
                                            title="Tomar otra foto"
                                          >
                                            📷
                                          </button>
                                          <button
                                            onClick={() => { campoActivo.current = campo; vieneDeCamara.current = false; archivoFotoRef.current?.click(); }}
                                            disabled={reconociendo !== null}
                                            className="w-8 h-8 rounded-lg text-xs flex items-center justify-center backdrop-blur-sm disabled:opacity-40"
                                            style={{ backgroundColor: 'rgba(0,0,0,0.55)' }}
                                            title="Elegir de la galería"
                                          >
                                            🖼️
                                          </button>
                                          <button
                                            onClick={() => { gestor.current.eliminarFoto(paso.numero, campo); setVersion(v => v + 1); }}
                                            disabled={reconociendo !== null}
                                            className="w-8 h-8 rounded-lg text-xs flex items-center justify-center backdrop-blur-sm disabled:opacity-40"
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
                                          onClick={() => { campoActivo.current = campo; vieneDeCamara.current = true; archivoCamaraRef.current?.click(); }}
                                          disabled={reconociendo !== null}
                                          className="flex-1 py-2.5 border border-dashed rounded-lg text-sm font-semibold transition-colors disabled:opacity-40"
                                          style={{ borderColor: 'var(--acento)', color: 'var(--acento)' }}
                                        >
                                          📷 Tomar foto
                                        </button>
                                        <button
                                          onClick={() => { campoActivo.current = campo; vieneDeCamara.current = false; archivoFotoRef.current?.click(); }}
                                          disabled={reconociendo !== null}
                                          className="w-11 border rounded-lg text-xs flex items-center justify-center transition-colors disabled:opacity-40"
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
                                  className="w-full rounded-lg border cursor-zoom-in"
                                  style={{ borderColor: 'var(--borde)' }}
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
          onCerrar={() => setGaleria(null)}
        />
      )}
    </div>
  );
}
