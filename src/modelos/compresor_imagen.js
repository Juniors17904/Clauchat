const ANCHO_MAXIMO = 1400;
const CALIDAD = 0.75;

export class CompresorImagen {
  async comprimir(archivo) {
    const imagen = await createImageBitmap(archivo);
    const factor = Math.min(1, ANCHO_MAXIMO / imagen.width);
    const ancho = Math.round(imagen.width * factor);
    const alto = Math.round(imagen.height * factor);

    const lienzo = document.createElement('canvas');
    lienzo.width = ancho;
    lienzo.height = alto;
    lienzo.getContext('2d').drawImage(imagen, 0, 0, ancho, alto);
    imagen.close();

    return lienzo.toDataURL('image/jpeg', CALIDAD);
  }
}
