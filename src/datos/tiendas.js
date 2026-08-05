import { Tienda } from '../modelos/tienda.js';

export const TIENDAS = [
  new Tienda({
    id: 'tambo',
    nombre: 'Tambo',
    descripcion: 'Instalación y software de las cajas de Tambo',
    color: 'var(--acento)',
    prefijosHostname: ['TL', 'TP'],
    codigoSistema: 1,
  }),
  new Tienda({
    id: 'aruma',
    nombre: 'Aruma',
    descripcion: 'Instalación y software de las cajas de Aruma',
    color: '#8250df',
    prefijosHostname: ['AL', 'AP'],
    codigoSistema: 2,
  }),
];
