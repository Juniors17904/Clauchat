import { useState } from 'react';
import PantallaAreas from './vistas/pantallas/PantallaAreas';
import PantallaNiveles from './vistas/pantallas/PantallaNiveles';
import PantallaEjercicios from './vistas/pantallas/PantallaEjercicios';
import PantallaEditor from './vistas/pantallas/PantallaEditor';

export default function App() {
  const [pantalla, setPantalla] = useState('areas');
  const [areaActual, setAreaActual] = useState(null);
  const [nivelActual, setNivelActual] = useState(null);
  const [ejercicioActual, setEjercicioActual] = useState(null);

  const irANiveles = (area) => {
    setAreaActual(area);
    setPantalla('niveles');
  };

  const irAEjercicios = (nivel) => {
    setNivelActual(nivel);
    setPantalla('ejercicios');
  };

  const irAEditor = (ejercicio) => {
    setEjercicioActual(ejercicio);
    setPantalla('editor');
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
