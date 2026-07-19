const ANCHO_OCR = 2400;
const ANCHO_MINIMO = 1600;

export class MejoradorImagen {
  async prepararParaOcr(archivo) {
    const imagen = await createImageBitmap(archivo);
    let factor = 1;
    if (imagen.width > ANCHO_OCR) factor = ANCHO_OCR / imagen.width;
    else if (imagen.width < ANCHO_MINIMO) factor = Math.min(2, ANCHO_MINIMO / imagen.width);

    const ancho = Math.round(imagen.width * factor);
    const alto = Math.round(imagen.height * factor);

    const lienzo = document.createElement('canvas');
    lienzo.width = ancho;
    lienzo.height = alto;
    const contexto = lienzo.getContext('2d');
    contexto.filter = 'grayscale(1) contrast(1.4) brightness(1.05)';
    contexto.drawImage(imagen, 0, 0, ancho, alto);
    imagen.close();

    return lienzo.toDataURL('image/png');
  }
}
