import { BaseDatosUniversidad } from './base_universidad';
import { BaseDatosDeportes } from './base_deportes';
import { BaseDatosHospital } from './base_hospital';

export const BASES_DATOS = [
  new BaseDatosUniversidad(),
  new BaseDatosDeportes(),
  new BaseDatosHospital(),
];

export function obtenerBaseDatos(id) {
  return BASES_DATOS.find(bd => bd.id === id) ?? null;
}
