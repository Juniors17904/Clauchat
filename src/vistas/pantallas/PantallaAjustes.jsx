import { useRef, useState } from 'react';
import { GestorTemas } from '../../modelos/gestor_temas';
import { GestorRespaldo } from '../../modelos/gestor_respaldo';
import { DescargadorData } from '../../modelos/descargador_data';
import { SesionGoogle } from '../../modelos/sesion_google';
import { RegistroCajas } from '../../modelos/registro_cajas';
import { GestorInstalacion } from '../../modelos/gestor_instalacion';
import { GestorSoftware } from '../../modelos/gestor_software';
import { TIENDAS } from '../../datos/tiendas';
import Seccion from '../Seccion';
import { version } from '../../../package.json';

export default function PantallaAjustes({ onRecordatorios, promptInstalar, onInstalar }) {
  const gestorTemas = useRef(new GestorTemas());
  const gestorRespaldo = useRef(new GestorRespaldo());
  const descargador = useRef(new DescargadorData());
  const sesion = useRef(new SesionGoogle());
  const archivoRef = useRef(null);

  const [temaId, setTemaId] = useState(gestorTemas.current.temaActual.id);
  const [temaGlobal, setTemaGlobal] = useState(gestorTemas.current.esGlobal);
  const [textoImportar, setTextoImportar] = useState(null);
  const [avisoImportar, setAvisoImportar] = useState(null);
  const [confirmando, setConfirmando] = useState(false);
  const [descarga, setDescarga] = useState(descargador.current.listo ? 'listo' : null);

  const cambiarTema = (id) => {
    gestorTemas.current.cambiar(id);
    setTemaId(id);
  };

  const descargarData = async () => {
    if (descarga && descarga !== 'listo') return;
    setDescarga({ hechas: 0, total: descargador.current.total });
    await descargador.current.descargar((hechas, total) => setDescarga({ hechas, total }));
    setDescarga('listo');
  };

  const seleccionarArchivo = (e) => {
    const archivo = e.target.files?.[0];
    e.target.value = '';
    if (!archivo) return;
    const lector = new FileReader();
    lector.onload = () => setTextoImportar(lector.result);
    lector.readAsText(archivo);
  };

  const confirmarImportar = () => {
    const ok = gestorRespaldo.current.importar(textoImportar);
    setTextoImportar(null);
    if (ok) window.location.reload();
    else setAvisoImportar('El archivo no es un respaldo válido.');
  };

  // Borra el avance de todas las cajas de todas las tiendas
  const borrarTodo = () => {
    for (const tienda of TIENDAS) {
      for (const caja of new RegistroCajas(tienda.id).lista) {
        new GestorInstalacion(caja, tienda.id).reiniciar();
        new GestorSoftware(caja, tienda.id).reiniciar();
      }
    }
    setConfirmando(false);
    window.location.reload();
  };

  return (
    <div className="w-full max-w-sm mx-auto px-5 pt-6 pb-4 space-y-5">
      <h2 className="text-lg font-semibold font-sans" style={{ color: 'var(--texto-primario)' }}>Ajustes</h2>

      <Seccion titulo="Apariencia" primera>
        <div className="grid grid-cols-2 gap-2">
          {gestorTemas.current.temas.map(t => {
            const c = t.colores;
            const activo = temaId === t.id;
            return (
              <button
                key={t.id}
                onClick={() => cambiarTema(t.id)}
                className="p-2.5 rounded-xl border-2 transition-all text-left"
                style={{ backgroundColor: c['fondo-base'], borderColor: activo ? c['acento'] : c['borde'] }}
              >
                <div className="flex gap-1 mb-1.5">
                  <div className="w-3.5 h-3.5 rounded-sm" style={{ backgroundColor: c['acento'] }} />
                  <div className="w-3.5 h-3.5 rounded-sm" style={{ backgroundColor: c['sintaxis-clave'] }} />
                  <div className="w-3.5 h-3.5 rounded-sm" style={{ backgroundColor: c['sintaxis-cadena'] }} />
                  <div className="w-3.5 h-3.5 rounded-sm" style={{ backgroundColor: c['sintaxis-funcion'] }} />
                </div>
                <span className="text-[11px] font-medium font-sans" style={{ color: c['texto-primario'] }}>{t.nombre}</span>
              </button>
            );
          })}
        </div>
        <div className="flex items-center justify-between">
          <p className="text-xs font-sans" style={{ color: 'var(--texto-secundario)' }}>Aplicar a toda la app</p>
          <button
            onClick={() => { gestorTemas.current.alternarGlobal(); setTemaGlobal(gestorTemas.current.esGlobal); }}
            className="relative w-10 h-[22px] rounded-full transition-colors duration-200 flex-shrink-0"
            style={{ backgroundColor: temaGlobal ? 'var(--acento)' : 'var(--fondo-elevado)' }}
          >
            <div
              className="absolute top-[3px] w-4 h-4 rounded-full transition-all duration-200"
              style={{ left: temaGlobal ? 21 : 3, backgroundColor: temaGlobal ? '#fff' : 'var(--texto-tenue)' }}
            />
          </button>
        </div>
      </Seccion>

      <Seccion titulo="Datos">
        <button
          onClick={descargarData}
          disabled={descarga !== null && descarga !== 'listo'}
          className="w-full py-3 border rounded-xl text-sm font-sans transition-colors"
          style={{
            borderColor: descarga === 'listo' ? 'var(--acento)' : 'var(--borde)',
            color: descarga === 'listo' ? 'var(--acento)' : 'var(--texto-secundario)',
          }}
        >
          {descarga === 'listo' ? '✓ Data descargada' : descarga ? `${descarga.hechas}/${descarga.total}` : 'Descargar data'}
        </button>

        {textoImportar ? (
          <div className="space-y-3">
            <p className="text-xs font-sans" style={{ color: 'var(--advertencia)' }}>Esto reemplazará tu avance actual con el del archivo. ¿Continuar?</p>
            <div className="flex gap-2">
              <button onClick={confirmarImportar} className="flex-1 py-2.5 text-sm rounded-xl font-sans transition-colors" style={{ backgroundColor: 'var(--acento-btn)', color: '#fff' }}>
                Importar
              </button>
              <button onClick={() => setTextoImportar(null)} className="flex-1 py-2.5 border text-sm rounded-xl font-sans transition-colors" style={{ borderColor: 'var(--borde)', color: 'var(--texto-secundario)' }}>
                Cancelar
              </button>
            </div>
          </div>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={() => gestorRespaldo.current.descargar()}
              className="flex-1 py-3 border rounded-xl text-sm font-sans transition-colors flex items-center justify-center gap-2"
              style={{ borderColor: 'var(--borde)', color: 'var(--texto-secundario)' }}
            >
              <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
                <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"/>
                <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z"/>
              </svg>
              Exportar
            </button>
            <button
              onClick={() => archivoRef.current?.click()}
              className="flex-1 py-3 border rounded-xl text-sm font-sans transition-colors flex items-center justify-center gap-2"
              style={{ borderColor: 'var(--borde)', color: 'var(--texto-secundario)' }}
            >
              <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
                <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"/>
                <path d="M7.646 1.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 2.707V11.5a.5.5 0 0 1-1 0V2.707L5.354 4.854a.5.5 0 1 1-.708-.708l3-3z"/>
              </svg>
              Importar
            </button>
            <input ref={archivoRef} type="file" accept=".json,application/json" onChange={seleccionarArchivo} className="hidden" />
          </div>
        )}
        {avisoImportar && <p className="text-[11px] font-sans" style={{ color: 'var(--error)' }}>{avisoImportar}</p>}
      </Seccion>

      {onRecordatorios && (
        <Seccion titulo="Avisos">
          <button
            onClick={onRecordatorios}
            className="w-full py-3 border rounded-xl text-sm font-sans transition-colors flex items-center justify-center gap-2"
            style={{ borderColor: 'var(--borde)', color: 'var(--texto-secundario)' }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
            Recordatorios
          </button>
        </Seccion>
      )}

      {sesion.current.iniciada && (
        <Seccion titulo="Cuenta">
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs font-sans truncate" style={{ color: 'var(--texto-tenue)' }}>{sesion.current.correo}</p>
            <button
              onClick={() => { sesion.current.cerrar(); window.location.reload(); }}
              className="text-xs font-sans flex-shrink-0 px-3 py-1.5 border rounded-lg transition-colors"
              style={{ borderColor: 'var(--borde)', color: 'var(--texto-secundario)' }}
            >
              Salir
            </button>
          </div>
        </Seccion>
      )}

      {/* Aparte del resto: no se puede deshacer */}
      <div className="pt-6">
        {confirmando ? (
          <div className="space-y-3 rounded-xl border p-4" style={{ borderColor: 'var(--error)', backgroundColor: 'color-mix(in srgb, var(--error) 8%, transparent)' }}>
            <p className="text-sm font-semibold font-sans" style={{ color: 'var(--error)' }}>¿Borrar todo el avance?</p>
            <p className="text-xs font-sans" style={{ color: 'var(--texto-secundario)' }}>Se borran los pasos, datos y fotos de todas las cajas, en las dos tiendas. No se puede deshacer.</p>
            <div className="flex gap-2">
              <button onClick={borrarTodo} className="flex-1 py-2.5 text-sm font-semibold rounded-xl font-sans transition-colors" style={{ backgroundColor: 'var(--error)', color: '#fff' }}>
                Sí, borrar
              </button>
              <button onClick={() => setConfirmando(false)} className="flex-1 py-2.5 border text-sm rounded-xl font-sans transition-colors" style={{ borderColor: 'var(--borde)', color: 'var(--texto-secundario)' }}>
                Cancelar
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setConfirmando(true)}
            className="w-full py-3 border text-sm rounded-xl font-sans transition-colors"
            style={{ borderColor: 'color-mix(in srgb, var(--error) 40%, transparent)', color: 'var(--error)' }}
          >
            🗑️ Borrar todo el avance
          </button>
        )}
      </div>

      <div className="pt-5 border-t flex items-center justify-between" style={{ borderColor: 'var(--borde)' }}>
        <div>
          <p className="text-sm font-semibold font-sans" style={{ color: 'var(--texto-primario)' }}>Migración Xstore</p>
          <p className="text-[11px] font-sans mt-0.5" style={{ color: 'var(--texto-tenue)' }}>Versión {version} · Funciona sin conexión</p>
        </div>
        {promptInstalar && (
          <button
            onClick={onInstalar}
            className="px-3 py-2 rounded-xl border text-xs font-sans transition-colors"
            style={{ borderColor: 'var(--acento)', color: 'var(--acento)' }}
          >
            Instalar app
          </button>
        )}
      </div>
    </div>
  );
}
