#!/usr/bin/env node
/**
 * tomar_captura.mjs — toma capturas de Clauchat en portrait y landscape
 *
 * Uso:
 *   node tomar_captura.mjs
 *   node tomar_captura.mjs areas
 *   node tomar_captura.mjs editor
 *
 * Requisitos:
 *   - Playwright instalado (npm install @playwright/test)
 *   - Servidor corriendo en localhost:5173 (npm run dev)
 */

import { chromium } from 'playwright';
import { mkdir } from 'fs/promises';
import { dirname } from 'path';

const PANTALLAS = {
  'areas': { ruta: '/', salida: '/tmp/clauchat/areas' },
  'editor': { ruta: '/editor', salida: '/tmp/clauchat/editor' },
};

const pantalla = process.argv[2] ?? 'areas';
const cfg = PANTALLAS[pantalla];

if (!cfg) {
  console.error('Pantalla desconocida. Opciones:', Object.keys(PANTALLAS).join(', '));
  process.exit(1);
}

const URL_APP = `http://localhost:5173${cfg.ruta}`;
const SALIDA_PORTRAIT = `${cfg.salida}_portrait.png`;
const SALIDA_LANDSCAPE = `${cfg.salida}_landscape.png`;

// Crear directorio de salida
await mkdir(dirname(cfg.salida), { recursive: true });

async function capturar(browser, ancho, alto, nombreArchivo) {
  const ctx = await browser.newContext({ viewport: { width: ancho, height: alto } });
  const page = await ctx.newPage();

  try {
    await page.goto(URL_APP, { waitUntil: 'networkidle', timeout: 15000 });
    await page.waitForTimeout(1000);
    await page.screenshot({ path: nombreArchivo });
    console.log('✓ Guardado:', nombreArchivo);
  } catch (e) {
    console.error('✗ Error:', e.message);
  } finally {
    await ctx.close();
  }
}

const browser = await chromium.launch({ headless: true });

await capturar(browser, 390, 844, SALIDA_PORTRAIT);
await capturar(browser, 844, 390, SALIDA_LANDSCAPE);

await browser.close();
console.log('✓ Listo.');
