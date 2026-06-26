import { useState, useEffect } from 'react';
import PantallaAreas from './vistas/pantallas/PantallaAreas';
import PantallaNiveles from './vistas/pantallas/PantallaNiveles';
import PantallaEjercicios from './vistas/pantallas/PantallaEjercicios';
import PantallaEditor from './vistas/pantallas/PantallaEditor';

export default function App() {
  const [pantalla, setPantalla] = useState('areas');
  const [areaActual, setAreaActual] = useState(null);
  const [nivelActual, setNivelActual] = useState(null);
  const [ejercicioActual, setEjercicioActual] = useState(null);

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
    setPantalla('ejercicios');
    window.history.pushState({ pantalla: 'ejercicios' }, '');
  };

  const irAEditor = (ejercicio) => {
    setEjercicioActual(ejercicio);
    setPantalla('editor');
    window.history.pushState({ pantalla: 'editor' }, '');
  };

  if (pantalla === 'editor') {
    return (
      <PantallaEditor
        ejercicio={ejercicioActual}
        onVolver={() => setPantalla('ejercicios')}
      />
    );
  }

  if (pantalla === 'ejercicios') {
    return (
      <PantallaEjercicios
        nivel={nivelActual}
        onSeleccionar={irAEditor}
        onVolver={() => setPantalla('niveles')}
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

  return <PantallaAreas onSeleccionar={irANiveles} />;
}
