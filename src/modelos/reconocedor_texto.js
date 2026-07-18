export class ReconocedorTexto {
  async reconocer(imagenDataUrl, alProgresar) {
    const { createWorker } = await import('tesseract.js');
    const trabajador = await createWorker('spa', 1, {
      workerPath: '/ocr/worker.min.js',
      corePath: '/ocr',
      langPath: '/ocr',
      logger: (m) => {
        if (m.status === 'recognizing text' && alProgresar) {
          alProgresar(Math.round(m.progress * 100));
        }
      },
    });
    const { data } = await trabajador.recognize(imagenDataUrl);
    await trabajador.terminate();
    return data.text;
  }

  extraerDatos(texto) {
    const datos = {};

    const usuario = texto.match(/\b((?:tambo|aruma)\.[\w.]+)/i) ?? texto.match(/([\w.]+)@Lindcorp/i);
    if (usuario) datos['Username'] = usuario[1];

    const hostnameCompleto = texto.match(/\b([\w-]+)\.LindcorpTiendas\.net\b/i);
    const hostnameCorto = texto.match(/\b((?:TL|TP|AL|AP)-\d{2,5}-\d)\b/i);
    if (hostnameCompleto) {
      datos['Hostname'] = `${hostnameCompleto[1]}.LindcorpTiendas.net`;
      datos['Nombre del equipo'] = hostnameCompleto[1];
    } else if (hostnameCorto) {
      datos['Hostname'] = `${hostnameCorto[1]}.LindcorpTiendas.net`;
      datos['Nombre del equipo'] = hostnameCorto[1];
    }

    const ips = [...texto.matchAll(/\b(\d{1,3}(?:\s*[.,]\s*\d{1,3}){3})\b/g)]
      .map(m => m[1].replace(/\s*[.,]\s*/g, '.'))
      .filter(ip => !ip.startsWith('255.') && ip.split('.').every(n => Number(n) <= 255));
    if (ips.length > 0) datos['IP'] = ips[0];

    return datos;
  }
}
