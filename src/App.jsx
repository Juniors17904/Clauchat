import { useState, useEffect, useRef } from 'react';
import PantallaAreas from './vistas/pantallas/PantallaAreas';
import PantallaNiveles from './vistas/pantallas/PantallaNiveles';
import PantallaTemas from './vistas/pantallas/PantallaTemas';
import PantallaConcepto from './vistas/pantallas/PantallaConcepto';
import PantallaEditor from './vistas/pantallas/PantallaEditor';
import PantallaArbol from './vistas/pantallas/PantallaArbol';
import { EJERCICIOS } from './datos/ejercicios';
import { ControladorPerfil } from './controladores/controlador_perfil';

export default function App() {
  const [pantalla, setPantalla] = useState('areas');
  const [areaActual, setAreaActual] = useState(null);
  const [nivelActual, setNivelActual] = useState(null);
  const [temaActual, setTemaActual] = useState(null);
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

  const irATemas = (nivel) => {
    setNivelActual(nivel);
    setPantalla('temas');
    window.history.pushState({ pantalla: 'temas' }, '');
  };

  const irAConcepto = (tema) => {
    setTemaActual(tema);
    const mezclados = [...EJERCICIOS.filter(e => e.temaId === tema.id)]
      .sort(() => Math.random() - 0.5);
    setEjerciciosOrdenados(mezclados);
    setPantalla('concepto');
    window.history.pushState({ pantalla: 'concepto' }, '');
  };

  const iniciarEjercicios = () => {
    if (ejerciciosOrdenados.length === 0) return;
    setEjercicioActual(ejerciciosOrdenados[0]);
    setPantalla('editor');
    window.history.pushState({ pantalla: 'editor' }, '');
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
        progreso={{ actual: indiceActual + 1, total: ejerciciosOrdenados.length }}
        onVolver={() => setPantalla('concepto')}
        onSiguiente={siguienteEjercicio ? () => irAEditor(siguienteEjercicio) : null}
        onCompletado={(id) => ctrlPerfil.current.marcarCompletado(id)}
      />
    );
  }

  if (pantalla === 'concepto') {
    return (
      <PantallaConcepto
        tema={temaActual}
        totalEjercicios={ejerciciosOrdenados.length}
        onVolver={() => setPantalla('temas')}
        onEmpezar={iniciarEjercicios}
      />
    );
  }

  if (pantalla === 'temas') {
    return (
      <PantallaTemas
        nivel={nivelActual}
        onSeleccionar={irAConcepto}
        onVolver={() => setPantalla('niveles')}
      />
    );
  }

  if (pantalla === 'niveles') {
    return (
      <PantallaNiveles
        area={areaActual}
        onSeleccionar={irATemas}
        onVolver={() => setPantalla('areas')}
      />
    );
  }

  return <PantallaAreas onSeleccionar={irANiveles} controladorPerfil={ctrlPerfil.current} onVerArbol={irAArbol} />;
}
