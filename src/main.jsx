import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { LimitadorErrores } from './vistas/LimitadorErrores.jsx'
import { GestorCarga } from './vistas/gestor_carga.js'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <LimitadorErrores>
      <App />
    </LimitadorErrores>
  </StrictMode>,
)

const gestorCarga = new GestorCarga();
gestorCarga.ocultarCuandoListo();
