// Maneja la cámara del equipo para tomar la foto de un dato: enciende, apaga y recorta
// solo lo que quedó dentro del encuadre, en la resolución original de la cámara.
export class CamaraEquipo {
  #stream = null;

  get encendida() { return this.#stream !== null; }

  async encender(video) {
    this.#stream = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: { ideal: 'environment' },
        width: { ideal: 1920 },
        height: { ideal: 1080 },
      },
      audio: false,
    });
    video.srcObject = this.#stream;
    await video.play();
    return this.#stream;
  }

  apagar(video) {
    this.#stream?.getTracks().forEach(pista => pista.stop());
    this.#stream = null;
    if (video) video.srcObject = null;
  }

  // El video se muestra recortado para llenar la pantalla, así que hay que llevar
  // las medidas del encuadre a las coordenadas reales del video antes de cortar.
  async recortar(video, marco, caja) {
    const anchoVideo = video.videoWidth;
    const altoVideo = video.videoHeight;
    if (!anchoVideo || !altoVideo) throw new Error('La cámara todavía no está lista');

    const escala = Math.max(caja.ancho / anchoVideo, caja.alto / altoVideo);
    const margenX = (caja.ancho - anchoVideo * escala) / 2;
    const margenY = (caja.alto - altoVideo * escala) / 2;

    const limitar = (valor, maximo) => Math.max(0, Math.min(valor, maximo));
    const x = limitar((marco.x - margenX) / escala, anchoVideo);
    const y = limitar((marco.y - margenY) / escala, altoVideo);
    const ancho = limitar(marco.ancho / escala, anchoVideo - x);
    const alto = limitar(marco.alto / escala, altoVideo - y);

    const lienzo = document.createElement('canvas');
    lienzo.width = Math.round(ancho);
    lienzo.height = Math.round(alto);
    lienzo.getContext('2d').drawImage(video, x, y, ancho, alto, 0, 0, lienzo.width, lienzo.height);

    const blob = await new Promise(listo => lienzo.toBlob(listo, 'image/jpeg', 0.95));
    return new File([blob], 'captura.jpg', { type: 'image/jpeg' });
  }
}
