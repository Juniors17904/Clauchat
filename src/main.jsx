import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { LimitadorErrores } from './vistas/LimitadorErrores.jsx'

setTimeout(() => {
  const splash = document.getElementById('splash');
  if (splash) splash.remove();
}, 5000);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <LimitadorErrores>
      <App />
    </LimitadorErrores>
  </StrictMode>,
)
