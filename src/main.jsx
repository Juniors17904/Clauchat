import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { LimitadorErrores } from './vistas/LimitadorErrores.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <LimitadorErrores>
      <App />
    </LimitadorErrores>
  </StrictMode>,
)

// Quitar el splash con un fundido apenas la app pintó, para que no parpadee ni salte
function ocultarSplash() {
  const splash = document.getElementById('splash');
  if (!splash) return;
  splash.style.opacity = '0';
  setTimeout(() => splash.remove(), 380);
}
requestAnimationFrame(() => requestAnimationFrame(ocultarSplash));
