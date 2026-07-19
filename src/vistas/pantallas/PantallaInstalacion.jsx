import { useState, useRef, useEffect } from 'react';
import { FASES_INSTALACION } from '../../datos/fases_instalacion';
import { PASOS_INSTALACION } from '../../datos/pasos_instalacion';
import { GestorInstalacion } from '../../modelos/gestor_instalacion';
import { VisorImagen } from '../../modelos/visor_imagen';
import { CompresorImagen } from '../../modelos/compresor_imagen';
import { ReconocedorTexto } from '../../modelos/reconocedor_texto';

export default function PantallaInstalacion({ onVolver }) {
  const gestor = useRef(new GestorInstalacion());
  const visor = useRef(new VisorImagen());
  const compresor = useRef(new CompresorImagen());
  const reconocedor = useRef(new ReconocedorTexto());
  const archivoFotoRef = useRef(null);
  const [, setVersion] = useState(0);
  const [pasoAbierto, setPasoAbierto] = useState(null);
  const [imagenAmpliada, setImagenAmpliada] = useState(null);
  const [confirmandoReinicio, setConfirmandoReinicio] = useState(false);
  const [reconociendo, setReconociendo] = useState(null);
  const [avisoCampo, setAvisoCampo] = useState(null);
  const [camposAbiertos, setCamposAbiertos] = useState(new Set());
  const campoActivo = useRef(null);
  const vieneDeCamara = useRef(false);
  const archivoCamaraRef = useRef(null);

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
      const texto = await reconocedor.current.reconocer(dataUrl, (p) => setReconociendo({ campo, progreso: p }));
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
    if (!imagenAmpliada) return;
    const estadoActual = window.history.state;
    window.history.pushState({ ...estadoActual, visorFoto: true }, '');
    const cerrarConRetroceso = () => {
      visor.current.reiniciar();
      setImagenAmpliada(null);
    };
    window.addEventListener('popstate', cerrarConRetroceso);
    return () => {
      window.removeEventListener('popstate', cerrarConRetroceso);
      if (window.history.state?.visorFoto) window.history.back();
    };
  }, [imagenAmpliada]);

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
            <p className="text-sm" style={{ color: 'var(--acento)' }}>✓ Instalación completa — los 23 pasos están listos</p>
          </div>
        )}

        {FASES_INSTALACION.map(fase => {
          const pasosDeFase = PASOS_INSTALACION.filter(p => p.faseId === fase.id);
          const completadosFase = pasosDeFase.filter(p => gestor.current.estaCompletado(p.numero)).length;

          return (
            <div key={fase.id} className="mb-5">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--texto-secundario)' }}>{fase.nombre}</h2>
                <span className="text-[10px] font-mono" style={{ color: completadosFase === pasosDeFase.length ? 'var(--acento)' : 'var(--texto-tenue)' }}>
                  {completadosFase}/{pasosDeFase.length}
                </span>
              </div>
              <p className="text-[11px] mb-2.5" style={{ color: 'var(--texto-tenue)' }}>{fase.descripcion}</p>

              <div className="border rounded-xl overflow-hidden" style={{ borderColor: 'var(--borde)' }}>
                {pasosDeFase.map((paso, i) => {
                  const completado = gestor.current.estaCompletado(paso.numero);
                  const abierto = pasoAbierto === paso.numero;

                  return (
                    <div key={paso.numero} style={{ borderTop: i > 0 ? '1px solid var(--borde)' : 'none', backgroundColor: 'var(--fondo-panel)' }}>
                      <div className="flex items-center gap-3 px-3.5 py-3">
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
                          <p className="text-sm leading-snug" style={{ color: completado ? 'var(--texto-tenue)' : 'var(--texto-primario)', textDecoration: completado ? 'line-through' : 'none' }}>
                            <span className="font-mono text-xs mr-1.5" style={{ color: completado ? 'var(--texto-tenue)' : 'var(--acento)' }}>{paso.numero}.</span>
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
                            <div className="border rounded-lg px-3 py-2 mb-3" style={{ borderColor: 'var(--advertencia)', backgroundColor: 'color-mix(in srgb, var(--advertencia) 10%, transparent)' }}>
                              <p className="text-xs font-semibold" style={{ color: 'var(--advertencia)' }}>⚠️ {paso.advertencia}</p>
                            </div>
                          )}
                          <p className="text-xs leading-relaxed whitespace-pre-line mb-3" style={{ color: 'var(--texto-secundario)' }}>{paso.detalle}</p>

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
                                          onClick={() => setImagenAmpliada(fotoPaso)}
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
                                          className="flex-1 py-2.5 border border-dashed rounded-lg text-xs font-semibold transition-colors disabled:opacity-40"
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
                                      <p className="text-[10px] mt-1" style={{ color: 'var(--advertencia)' }}>No se reconoció ningún dato en la foto — completá los campos a mano.</p>
                                    )}
                                  </div>
                                );
                              })()}

                              {paso.campos.map(campo => {
                                const foto = gestor.current.obtenerFoto(paso.numero, campo);
                                const valor = gestor.current.obtenerCampo(paso.numero, campo);
                                const procesando = reconociendo?.campo === campo;
                                const clave = `${paso.numero}-${campo}`;
                                const mostrarTexto = paso.fotoUnica || valor !== '' || camposAbiertos.has(clave) || procesando;
                                return (
                                  <div key={campo}>
                                    <div className="flex items-center justify-between mb-1.5">
                                      <p className="text-[10px] font-semibold uppercase tracking-wide" style={{ color: 'var(--texto-tenue)' }}>{campo}</p>
                                      {!mostrarTexto && (
                                        <button
                                          onClick={() => { setCamposAbiertos(prev => new Set(prev).add(clave)); }}
                                          className="text-[10px]"
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
                                          onClick={() => setImagenAmpliada(foto)}
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
                                          className="flex-1 py-2.5 border border-dashed rounded-lg text-xs font-semibold transition-colors disabled:opacity-40"
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
                                        className="w-full border rounded-lg px-3 py-2 text-xs focus:outline-none"
                                        style={{ backgroundColor: 'var(--fondo-panel)', borderColor: procesando ? 'var(--acento)' : 'var(--borde)', color: 'var(--texto-primario)', fontFamily: 'var(--fuente-mono)' }}
                                        spellCheck={false}
                                      />
                                    )}
                                    {avisoCampo === campo && (
                                      <p className="text-[10px] mt-1" style={{ color: 'var(--advertencia)' }}>No se reconoció el {campo.toLowerCase()} en la foto — tocá "✎ Escribir a mano".</p>
                                    )}
                                  </div>
                                );
                              })}
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
                                  onClick={() => setImagenAmpliada(img)}
                                  className="w-full rounded-lg border cursor-zoom-in"
                                  style={{ borderColor: 'var(--borde)' }}
                                  loading="lazy"
                                />
                              ))}
                            </div>
                          )}
                          <button
                            onClick={() => { alternarPaso(paso.numero); setPasoAbierto(null); }}
                            className="w-full mt-3 py-2.5 rounded-lg text-xs font-semibold transition-colors"
                            style={{
                              backgroundColor: completado ? 'var(--fondo-elevado)' : 'var(--acento-btn)',
                              color: completado ? 'var(--texto-secundario)' : '#fff',
                            }}
                          >
                            {completado ? 'Desmarcar paso' : '✓ Marcar como completado'}
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

      {/* Imagen ampliada con zoom y arrastre */}
      {imagenAmpliada && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden"
          style={{ backgroundColor: 'rgba(0,0,0,0.9)', touchAction: 'none' }}
          onTouchStart={(e) => { visor.current.manejarInicio(Array.from(e.touches)); }}
          onTouchMove={(e) => { visor.current.manejarMovimiento(Array.from(e.touches)); setVersion(v => v + 1); }}
          onTouchEnd={(e) => {
            visor.current.manejarFin(Array.from(e.touches));
            if (e.touches.length === 0 && visor.current.manejarDobleTap()) setVersion(v => v + 1);
            setVersion(v => v + 1);
          }}
          onWheel={(e) => { visor.current.manejarRueda(e.deltaY); setVersion(v => v + 1); }}
          onDoubleClick={() => { visor.current.ampliada ? visor.current.reiniciar() : visor.current.manejarRueda(-100); setVersion(v => v + 1); }}
        >
          <button
            onClick={() => { visor.current.reiniciar(); setImagenAmpliada(null); }}
            className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full flex items-center justify-center text-white text-xl"
            style={{ backgroundColor: 'rgba(255,255,255,0.15)' }}
          >
            ×
          </button>
          <img
            src={imagenAmpliada}
            alt="Ampliada"
            draggable="false"
            className="max-w-full max-h-full rounded-lg select-none"
            style={{ transform: visor.current.estilo, transition: visor.current.ampliada ? 'none' : 'transform 200ms ease' }}
          />
          <p className="absolute bottom-5 left-0 right-0 text-center text-[11px] pointer-events-none" style={{ color: 'rgba(255,255,255,0.4)' }}>
            Pellizca para zoom · arrastra para mover · doble toque para acercar
          </p>
        </div>
      )}
    </div>
  );
}
