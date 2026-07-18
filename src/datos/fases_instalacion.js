import { FaseInstalacion } from '../modelos/fase_instalacion.js';

export const FASES_INSTALACION = [
  new FaseInstalacion({
    id: 'respaldo',
    nombre: 'Respaldo',
    descripcion: 'Antes de instalar la imagen: respaldar los datos del equipo actual',
    orden: 1,
  }),
  new FaseInstalacion({
    id: 'cuenta-local',
    nombre: 'Cuenta local Lindcorp',
    descripcion: 'Con la imagen nueva instalada, iniciar sesión con la cuenta local',
    orden: 2,
  }),
  new FaseInstalacion({
    id: 'cuenta-dominio-config',
    nombre: 'Cuenta dominio T o A · Configuración',
    descripcion: 'Iniciar sesión con la cuenta de dominio de Tambo o Aruma',
    orden: 3,
  }),
  new FaseInstalacion({
    id: 'cuenta-dominio-instalacion',
    nombre: 'Cuenta dominio T o A · Instalación',
    descripcion: 'Instalación y validación final de Xstore',
    orden: 4,
  }),
];
