import { useState, useEffect, useRef } from 'react';
import { flushSync } from 'react-dom';
import { useRegisterSW } from 'virtual:pwa-register/react';
import PantallaTiendas from './vistas/pantallas/PantallaTiendas';
import PantallaHerramientas from './vistas/pantallas/PantallaHerramientas';
import PantallaCaja from './vistas/pantallas/PantallaCaja';
import PantallaRecordatorios from './vistas/pantallas/PantallaRecordatorios';
import PantallaAcceso from './vistas/pantallas/PantallaAcceso';
import { TIENDAS } from './datos/tiendas';
import { ControladorRecordatorios } from './controladores/controlador_recordatorios';
import { GestorTemas } from './modelos/gestor_temas';
import { GestorTransiciones } from './modelos/gestor_transiciones';
import { UltimaSeccionCaja } from './modelos/ultima_seccion_caja';
import { ControlAcceso } from './modelos/control_acceso';
import { BuscadorVersion } from './modelos/buscador_version';

export default function App() {
  const buscador = useRef(new BuscadorVersion());
  const { needRefresh: [needRefresh], updateServiceWorker } = useRegisterSW({
    onRegisteredSW: (_url, registro) => buscador.current.guardarRegistro(registro),
  });

  // Al abrir y al volver a la app, revisar si hay una versión nueva publicada
  useEffect(() => buscador.current.vigilarRegreso(), []);
  const [pantalla, setPantalla] = useState('tiendas');
  const [tiendaActual, setTiendaActual] = useState(TIENDAS[0]);
  const [cajaInstalacion, setCajaInstalacion] = useState(1);
  const [seccionCaja, setSeccionCaja] = useState('xstore');
  const ctrlRecordatorios = useRef(new ControladorRecordatorios());
  useRef(new GestorTemas());
  const gestorTransiciones = useRef(new GestorTransiciones());
  const pantallaRef = useRef('tiendas');

  const control = useRef(new ControlAcceso());
  // La pantalla de inicio se ve siempre; al tocar cualquier cosa, si no hay sesión, se pide
  const [conSesion, setConSesion] = useState(control.current.iniciada);
  const [mostrandoAcceso, setMostrandoAcceso] = useState(false);
  const pedirAcceso = () => setMostrandoAcceso(true);

  useEffect(() => {
    pantallaRef.current = pantalla;
  }, [pantalla]);

  const navegar = (direccion, actualizar) => {
    gestorTransiciones.current.ejecutar(direccion, () => flushSync(actualizar));
  };

  useEffect(() => {
    window.history.replaceState({ pantalla: 'tiendas' }, '');
    const manejarRetroceso = (e) => {
      const estado = e.state ?? { pantalla: 'tiendas' };

      // Si la pantalla no cambia, solo se cerró un panel o visor: no re-renderizar
      if (estado.pantalla === pantallaRef.current) return;

      navegar('atras', () => {
        if (estado.caja) setCajaInstalacion(estado.caja);
        if (estado.seccion) setSeccionCaja(estado.seccion);
        if (estado.tiendaId) setTiendaActual(TIENDAS.find(t => t.id === estado.tiendaId) ?? TIENDAS[0]);
        setPantalla(estado.pantalla);
      });
    };
    window.addEventListener('popstate', manejarRetroceso);
    return () => window.removeEventListener('popstate', manejarRetroceso);
  }, []);

  const irAHerramientas = (tienda) => {
    navegar('adelante', () => {
      setTiendaActual(tienda);
      setPantalla('herramientas');
    });
    window.history.pushState({ pantalla: 'herramientas', tiendaId: tienda.id }, '');
  };

  const irACaja = (caja, seccion) => {
    navegar('adelante', () => {
      setCajaInstalacion(caja);
      setSeccionCaja(seccion);
      setPantalla('caja');
    });
    window.history.pushState({ pantalla: 'caja', caja, seccion, tiendaId: tiendaActual.id }, '');
  };

  // Cambiar de caja lleva a la parte donde se trabajó por última vez en ESA caja.
  // Reemplaza la entrada actual del historial: no apila, así "volver" sale de una vez.
  const cambiarCaja = (caja) => {
    const seccion = new UltimaSeccionCaja(caja, tiendaActual.id).seccion;
    setCajaInstalacion(caja);
    setSeccionCaja(seccion);
    window.history.replaceState({ pantalla: 'caja', caja, seccion, tiendaId: tiendaActual.id }, '');
  };

  const irAInstalacion = (caja = 1) => irACaja(caja, 'xstore');
  const irASoftware = (caja = 1) => irACaja(caja, 'software');

  const irARecordatorios = () => {
    navegar('adelante', () => setPantalla('recordatorios'));
    window.history.pushState({ pantalla: 'recordatorios' }, '');
  };

  if (mostrandoAcceso) {
    return (
      <PantallaAcceso
        onEntrar={() => { setConSesion(true); setMostrandoAcceso(false); }}
        onVolver={() => setMostrandoAcceso(false)}
      />
    );
  }

  if (pantalla === 'recordatorios') {
    return (
      <PantallaRecordatorios
        controladorRecordatorios={ctrlRecordatorios.current}
        onVolver={() => window.history.back()}
      />
    );
  }

  if (pantalla === 'herramientas') {
    return (
      <PantallaHerramientas
        tienda={tiendaActual}
        onVolver={() => window.history.back()}
        onXstore={irAInstalacion}
        onSoftware={irASoftware}
      />
    );
  }

  if (pantalla === 'caja') {
    // key por tienda y caja: al cambiar, la pantalla se rearma desde cero, igual que al entrar,
    // para que cargue el avance de esa caja y se enfoque su último punto
    return (
      <PantallaCaja
        key={`${tiendaActual.id}-${cajaInstalacion}`}
        tienda={tiendaActual}
        caja={cajaInstalacion}
        seccionInicial={seccionCaja}
        onVolver={() => window.history.back()}
        onCambiarCaja={cambiarCaja}
      />
    );
  }

  // Sin sesión la portada se ve igual, pero cualquier toque pide entrar
  return (
    <PantallaTiendas
      onElegir={conSesion ? irAHerramientas : pedirAcceso}
      onRecordatorios={conSesion ? irARecordatorios : pedirAcceso}
      onAjustes={conSesion ? null : pedirAcceso}
      bloqueada={!conSesion}
      needRefresh={needRefresh}
      onActualizar={() => updateServiceWorker(true)}
    />
  );
}
