import { BASE_UNIVERSIDAD } from './base_universidad';
import { BASE_DEPORTES } from './base_deportes';
import { BASE_HOSPITAL } from './base_hospital';

export const BASES_DATOS = [BASE_UNIVERSIDAD, BASE_DEPORTES, BASE_HOSPITAL];

export function obtenerBaseDatos(id) {
  return BASES_DATOS.find(bd => bd.id === id) ?? null;
}
