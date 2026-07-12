import { useState, useEffect, useRef } from 'react';
import { flushSync } from 'react-dom';
import { useRegisterSW } from 'virtual:pwa-register/react';
import PantallaAreas from './vistas/pantallas/PantallaAreas';
import PantallaBaseDatos from './vistas/pantallas/PantallaBaseDatos';
import PantallaNiveles from './vistas/pantallas/PantallaNiveles';
import PantallaTemas from './vistas/pantallas/PantallaTemas';
import PantallaConcepto from './vistas/pantallas/PantallaConcepto';
import PantallaEditor from './vistas/pantallas/PantallaEditor';
import PantallaArbol from './vistas/pantallas/PantallaArbol';
import PantallaRecordatorios from './vistas/pantallas/PantallaRecordatorios';
import { EJERCICIOS } from './datos/ejercicios';
import { TEMAS } from './datos/temas';
import { NIVELES } from './datos/niveles';
import { AREAS, AREAS_ESPECIALIZACION } from './datos/areas';
import { ControladorPerfil } from './controladores/controlador_perfil';
import { ControladorRecordatorios } from './controladores/controlador_recordatorios';
import { GestorTemas } from './modelos/gestor_temas';
import { GestorTransiciones } from './modelos/gestor_transiciones';

export default function App() {
  const { needRefresh: [needRefresh], updateServiceWorker } = useRegisterSW();
  const [pantalla, setPantalla] = useState('areas');
  const [areaActual, setAreaActual] = useState(null);
  const [nivelActual, setNivelActual] = useState(null);
  const [temaActual, setTemaActual] = useState(null);
  const [ejercicioActual, setEjercicioActual] = useState(null);
  const [ejerciciosOrdenados, setEjerciciosOrdenados] = useState([]);
  const ctrlPerfil = useRef(new ControladorPerfil());
  const ctrlRecordatorios = useRef(new ControladorRecordatorios());
  useRef(new GestorTemas());
  const gestorTransiciones = useRef(new GestorTransiciones());

  const navegar = (direccion, actualizar) => {
    gestorTransiciones.current.ejecutar(direccion, () => flushSync(actualizar));
  };

  useEffect(() => {
    window.history.replaceState({ pantalla: 'areas' }, '');
    const manejarRetroceso = (e) => {
      const estado = e.state ?? { pantalla: 'areas' };

      navegar('atras', () => {
        if (estado.areaId) {
          const area = [...AREAS, ...AREAS_ESPECIALIZACION].find(a => a.id === estado.areaId);
          setAreaActual(area ?? null);
        } else {
          setAreaActual(null);
        }

        if (estado.nivelId) {
          setNivelActual(NIVELES.find(n => n.id === estado.nivelId) ?? null);
        } else {
          setNivelActual(null);
        }

        if (estado.temaId) {
          const tema = TEMAS.find(t => t.id === estado.temaId);
          setTemaActual(tema ?? null);
          if (tema) {
            setEjerciciosOrdenados([...EJERCICIOS.filter(ej => ej.temaId === tema.id)].sort(() => Math.random() - 0.5));
          }
        } else {
          setTemaActual(null);
        }

        setPantalla(estado.pantalla);
      });
    };
    window.addEventListener('popstate', manejarRetroceso);
    return () => window.removeEventListener('popstate', manejarRetroceso);
  }, []);

  const irANiveles = (area) => {
    navegar('adelante', () => {
      setAreaActual(area);
      setPantalla(area.id === 'bases-de-datos' ? 'base-datos' : 'niveles');
    });
    if (area.id === 'bases-de-datos') {
      window.history.pushState({ pantalla: 'base-datos' }, '');
    } else {
      window.history.pushState({ pantalla: 'niveles', areaId: area.id }, '');
    }
  };

  const irATemas = (nivel) => {
    navegar('adelante', () => {
      setNivelActual(nivel);
      setPantalla('temas');
    });
    window.history.pushState({ pantalla: 'temas', areaId: areaActual?.id, nivelId: nivel.id }, '');
  };

  const irAConcepto = (tema) => {
    const mezclados = [...EJERCICIOS.filter(e => e.temaId === tema.id)]
      .sort(() => Math.random() - 0.5);
    navegar('adelante', () => {
      setTemaActual(tema);
      setEjerciciosOrdenados(mezclados);
      setPantalla('concepto');
    });
    window.history.pushState({ pantalla: 'concepto', areaId: areaActual?.id, nivelId: nivelActual?.id, temaId: tema.id }, '');
  };

  const iniciarEjercicios = () => {
    if (ejerciciosOrdenados.length === 0) return;
    navegar('adelante', () => {
      setEjercicioActual(ejerciciosOrdenados[0]);
      setPantalla('editor');
    });
    window.history.pushState({ pantalla: 'editor', areaId: areaActual?.id, nivelId: nivelActual?.id, temaId: temaActual?.id }, '');
  };

  const irAEditor = (ejercicio) => {
    navegar('adelante', () => {
      setEjercicioActual(ejercicio);
    });
  };

  const irAArbol = () => {
    navegar('adelante', () => {
      setPantalla('arbol');
    });
    window.history.pushState({ pantalla: 'arbol' }, '');
  };

  const irARecordatorios = () => {
    navegar('adelante', () => {
      setPantalla('recordatorios');
    });
    window.history.pushState({ pantalla: 'recordatorios' }, '');
  };

  const irAContinuar = () => {
    const pos = ctrlPerfil.current.obtenerUltimaPosicion(EJERCICIOS, TEMAS);
    if (!pos) return;
    const deTema = EJERCICIOS.filter(e => e.temaId === pos.tema.id);
    const nivel = NIVELES.find(n => n.id === pos.tema.nivelId) ?? null;
    const area = nivel ? ([...AREAS, ...AREAS_ESPECIALIZACION].find(a => a.id === nivel.areaId) ?? null) : null;
    navegar('adelante', () => {
      setAreaActual(area);
      setNivelActual(nivel);
      setTemaActual(pos.tema);
      setEjerciciosOrdenados(deTema);
      setEjercicioActual(pos.ejercicio);
      setPantalla('editor');
    });
    window.history.pushState({ pantalla: 'editor', areaId: area?.id, nivelId: nivel?.id, temaId: pos.tema.id }, '');
  };

  const irAEmpezar = () => {
    const area = AREAS_ESPECIALIZACION.find(a => a.id === 'sql-estandar') ?? null;
    if (!area) return;
    navegar('adelante', () => {
      setAreaActual(area);
      setPantalla('niveles');
    });
    window.history.pushState({ pantalla: 'niveles', areaId: area.id }, '');
  };

  const ultimaPosicion = ctrlPerfil.current.obtenerUltimaPosicion(EJERCICIOS, TEMAS);

  if (pantalla === 'recordatorios') {
    return (
      <PantallaRecordatorios
        controladorRecordatorios={ctrlRecordatorios.current}
        onVolver={() => window.history.back()}
      />
    );
  }

  if (pantalla === 'arbol') {
    return <PantallaArbol onVolver={() => window.history.back()} />;
  }

  if (pantalla === 'base-datos') {
    return (
      <PantallaBaseDatos
        onSeleccionar={(areaId) => {
          const area = [...AREAS, ...AREAS_ESPECIALIZACION].find(a => a.id === areaId);
          if (!area) return;
          navegar('adelante', () => {
            setAreaActual(area);
            setPantalla('niveles');
          });
          window.history.pushState({ pantalla: 'niveles', areaId: area.id }, '');
        }}
        onVolver={() => window.history.back()}
        onContinuar={irAContinuar}
        onEmpezar={irAEmpezar}
        ultimaPosicion={ultimaPosicion}
        controladorPerfil={ctrlPerfil.current}
      />
    );
  }

  if (pantalla === 'editor' && ejercicioActual) {
    const indiceActual = ejerciciosOrdenados.findIndex(e => e.id === ejercicioActual?.id);
    const siguienteEjercicio = ejerciciosOrdenados[indiceActual + 1] ?? null;

    return (
      <PantallaEditor
        ejercicio={ejercicioActual}
        progreso={{ actual: indiceActual + 1, total: ejerciciosOrdenados.length }}
        onVolver={() => window.history.back()}
        onSiguiente={siguienteEjercicio ? () => irAEditor(siguienteEjercicio) : null}
        onTerminar={() => {
          navegar('atras', () => {
            setEjercicioActual(null);
            setTemaActual(null);
            setPantalla('temas');
          });
          window.history.pushState({ pantalla: 'temas', areaId: areaActual?.id, nivelId: nivelActual?.id }, '');
        }}
        onCompletado={(id) => ctrlPerfil.current.marcarCompletado(id)}
      />
    );
  }

  if (pantalla === 'concepto' && temaActual) {
    return (
      <PantallaConcepto
        tema={temaActual}
        totalEjercicios={ejerciciosOrdenados.length}
        onVolver={() => window.history.back()}
        onEmpezar={iniciarEjercicios}
      />
    );
  }

  if (pantalla === 'temas' && nivelActual) {
    return (
      <PantallaTemas
        nivel={nivelActual}
        onSeleccionar={irAConcepto}
        onVolver={() => window.history.back()}
        controladorPerfil={ctrlPerfil.current}
      />
    );
  }

  if (pantalla === 'niveles' && areaActual) {
    return (
      <PantallaNiveles
        area={areaActual}
        onSeleccionar={irATemas}
        onVolver={() => window.history.back()}
        controladorPerfil={ctrlPerfil.current}
      />
    );
  }

  return (
    <PantallaAreas
      onSeleccionar={irANiveles}
      controladorPerfil={ctrlPerfil.current}
      onVerArbol={irAArbol}
      onRecordatorios={irARecordatorios}
      needRefresh={needRefresh}
      onActualizar={() => updateServiceWorker(true)}
      ultimaPosicion={ultimaPosicion}
      onContinuar={irAContinuar}
    />
  );
}
