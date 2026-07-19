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
    await trabajador.setParameters({ tessedit_pageseg_mode: '6' });
    const { data } = await trabajador.recognize(imagenDataUrl);
    await trabajador.terminate();
    return data.text;
  }

  #normalizarNumeros(texto) {
    // Corregir confusiones típicas del OCR dentro de números: O→0, l/I/|→1, S→5, B→8
    return texto
      .replace(/(?<=[\d.,\s])[OoQ](?=[\d.,])|(?<=[\d.,])[OoQ](?=[\d.,\s])/g, '0')
      .replace(/(?<=[\d.,])[lI|](?=[\d.,])/g, '1')
      .replace(/(?<=[\d.,])S(?=[\d.,])/g, '5')
      .replace(/(?<=[\d.,])B(?=[\d.,])/g, '8');
  }

  extraerCampo(texto, campo) {
    return this.extraerDatos(texto)[campo] ?? '';
  }

  extraerDatos(texto) {
    const datos = {};

    const usuario = texto.match(/\b((?:tambo|aruma)\.[\w.]+)/i) ?? texto.match(/([\w.]+)@Lindcorp/i);
    if (usuario) datos['Username'] = usuario[1];

    const hostnameCompleto = texto.match(/\b([\w-]+)\.LindcorpTiendas\.net\b/i);
    const hostnameCorto = texto.match(/\b((?:TL|TP|AL|AP)-\d{2,5}-\d)\b/i);
    if (hostnameCompleto) {
      datos['Hostname'] = `${hostnameCompleto[1]}.LindcorpTiendas.net`;
    } else if (hostnameCorto) {
      datos['Hostname'] = `${hostnameCorto[1]}.LindcorpTiendas.net`;
    }

    const storeName = texto.match(/storeName\s*[=:]\s*([^\n#]+)/i)
      ?? texto.match(/\b((?:TAMBO|ARUMA)\s+[A-ZÁÉÍÓÚÑ][A-ZÁÉÍÓÚÑ0-9 .\-]{3,50})/);
    if (storeName) datos['Nombre de tienda'] = storeName[1].trim();

    this.#extraerRed(texto, datos);

    return datos;
  }

  #extraerRed(textoCrudo, datos) {
    const texto = this.#normalizarNumeros(textoCrudo);
    const buscarIpEnLinea = (linea) => {
      const m = linea.match(/\b(\d{1,3}(?:\s*[.,]\s*\d{1,3}){3})\b/);
      return m ? m[1].replace(/\s*[.,]\s*/g, '.') : null;
    };

    const etiquetas = [
      ['Dirección IP', /direcci[oó]n\s*ip/i],
      ['Máscara de subred', /m[aá]scara/i],
      ['Puerta de enlace', /puerta\s*de\s*enlace/i],
      ['DNS preferido', /dns\s*preferido|servidor\s*dns\s*preferido/i],
      ['DNS alternativo', /dns\s*alternativo/i],
    ];

    // Primero por etiqueta: la IP en la misma línea que el rótulo
    for (const linea of texto.split('\n')) {
      for (const [campo, patron] of etiquetas) {
        if (!datos[campo] && patron.test(linea)) {
          const ip = buscarIpEnLinea(linea);
          if (ip) datos[campo] = ip;
        }
      }
    }

    // Luego por orden de aparición para lo que falte
    const todas = [...texto.matchAll(/\b(\d{1,3}(?:\s*[.,]\s*\d{1,3}){3})\b/g)]
      .map(m => m[1].replace(/\s*[.,]\s*/g, '.'))
      .filter(ip => ip.split('.').every(n => Number(n) <= 255));
    const usadas = new Set(Object.values(datos));
    const libres = todas.filter(ip => !usadas.has(ip));

    if (!datos['Máscara de subred']) {
      const mascara = libres.find(ip => ip.startsWith('255.'));
      if (mascara) { datos['Máscara de subred'] = mascara; libres.splice(libres.indexOf(mascara), 1); }
    }
    const restantes = libres.filter(ip => !ip.startsWith('255.'));
    for (const campo of ['Dirección IP', 'Puerta de enlace', 'DNS preferido', 'DNS alternativo']) {
      if (!datos[campo] && restantes.length > 0) {
        datos[campo] = restantes.shift();
      }
    }
  }
}
