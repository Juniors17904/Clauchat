import { useState, useEffect, useRef } from 'react';
import PantallaAreas from './vistas/pantallas/PantallaAreas';
import PantallaNiveles from './vistas/pantallas/PantallaNiveles';
import PantallaEjercicios from './vistas/pantallas/PantallaEjercicios';
import PantallaEditor from './vistas/pantallas/PantallaEditor';
import PantallaArbol from './vistas/pantallas/PantallaArbol';
import { EJERCICIOS } from './datos/ejercicios';
import { ControladorPerfil } from './controladores/controlador_perfil';

export default function App() {
  const [pantalla, setPantalla] = useState('areas');
  const [areaActual, setAreaActual] = useState(null);
  const [nivelActual, setNivelActual] = useState(null);
  const [ejercicioActual, setEjercicioActual] = useState(null);
  const [ejerciciosOrdenados, setEjerciciosOrdenados] = useState([]);
  const ctrlPerfil = useRef(new ControladorPerfil());

  useEffect(() => {
    window.history.replaceState({ pantalla: 'areas' }, '');
    const manejarRetroceso = (e) => {
      setPantalla(e.state?.pantalla ?? 'areas');
    };
    window.addEventListener('popstate', manejarRetroceso);
    return () => window.removeEventListener('popstate', manejarRetroceso);
  }, []);

  const irANiveles = (area) => {
    setAreaActual(area);
    setPantalla('niveles');
    window.history.pushState({ pantalla: 'niveles' }, '');
  };

  const irAEjercicios = (nivel) => {
    setNivelActual(nivel);
    const mezclados = [...EJERCICIOS.filter(e => e.nivelId === nivel.id)]
      .sort(() => Math.random() - 0.5);
    setEjerciciosOrdenados(mezclados);
    setPantalla('ejercicios');
    window.history.pushState({ pantalla: 'ejercicios' }, '');
  };

  const irAEditor = (ejercicio) => {
    setEjercicioActual(ejercicio);
    setPantalla('editor');
    window.history.pushState({ pantalla: 'editor' }, '');
  };

  const irAArbol = () => {
    setPantalla('arbol');
    window.history.pushState({ pantalla: 'arbol' }, '');
  };

  if (pantalla === 'arbol') {
    return <PantallaArbol onVolver={() => setPantalla('areas')} />;
  }

  if (pantalla === 'editor') {
    const indiceActual = ejerciciosOrdenados.findIndex(e => e.id === ejercicioActual?.id);
    const siguienteEjercicio = ejerciciosOrdenados[indiceActual + 1] ?? null;

    return (
      <PantallaEditor
        ejercicio={ejercicioActual}
        onVolver={() => setPantalla('ejercicios')}
        onSiguiente={siguienteEjercicio ? () => irAEditor(siguienteEjercicio) : null}
        onCompletado={(id) => ctrlPerfil.current.marcarCompletado(id)}
      />
    );
  }

  if (pantalla === 'ejercicios') {
    return (
      <PantallaEjercicios
        nivel={nivelActual}
        ejercicios={ejerciciosOrdenados}
        onSeleccionar={irAEditor}
        onVolver={() => setPantalla('niveles')}
        controladorPerfil={ctrlPerfil.current}
      />
    );
  }

  if (pantalla === 'niveles') {
    return (
      <PantallaNiveles
        area={areaActual}
        onSeleccionar={irAEjercicios}
        onVolver={() => setPantalla('areas')}
      />
    );
  }

  return <PantallaAreas onSeleccionar={irANiveles} controladorPerfil={ctrlPerfil.current} onVerArbol={irAArbol} />;
}
