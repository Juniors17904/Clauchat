#!/bin/bash
# tomar_captura.sh — toma capturas de Clauchat en portrait y landscape
# Uso: ./tomar_captura.sh

set -e

echo "🚀 Levantando servidor de desarrollo..."
npm run dev -- --host 0.0.0.0 > /tmp/dev.log 2>&1 &
DEV_PID=$!
sleep 8

if ! grep -q "Local:" /tmp/dev.log; then
  echo "❌ El servidor no se levantó"
  kill $DEV_PID 2>/dev/null || true
  exit 1
fi

echo "✓ Servidor corriendo en localhost:5173"

# Script Playwright para capturar en ambas orientaciones
cat > /tmp/captura_playwright.mjs << 'PLAYWRIGHT_EOF'
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';

const browser = await chromium.launch({
  headless: false,
  args: ['--enable-webgl', '--ignore-gpu-blocklist', '--use-gl=angle', '--no-sandbox']
});

console.log('📱 Tomando captura portrait (390x844)...');
const ctx1 = await browser.newContext({ viewport: { width: 390, height: 844 } });
const page1 = await ctx1.newPage();
await page1.goto('http://localhost:5173/', { waitUntil: 'networkidle', timeout: 20000 });
await page1.waitForTimeout(2000);
await page1.screenshot({ path: '/tmp/captura_portrait.png' });
await ctx1.close();
console.log('✓ Portrait guardado');

console.log('📱 Tomando captura landscape (844x390)...');
const ctx2 = await browser.newContext({ viewport: { width: 844, height: 390 } });
const page2 = await ctx2.newPage();
await page2.goto('http://localhost:5173/', { waitUntil: 'networkidle', timeout: 20000 });
await page2.waitForTimeout(2000);
await page2.screenshot({ path: '/tmp/captura_landscape.png' });
await ctx2.close();
console.log('✓ Landscape guardado');

await browser.close();
console.log('✓ Capturas completadas');
PLAYWRIGHT_EOF

echo "📸 Tomando capturas con Xvfb..."
xvfb-run --auto-servernum --server-args="-screen 0 1280x960x24" \
  node /tmp/captura_playwright.mjs

# Limpiar
kill $DEV_PID 2>/dev/null || true
sleep 1

echo ""
echo "✅ Capturas listas:"
echo "   📱 Portrait:   /tmp/captura_portrait.png"
echo "   📱 Landscape:  /tmp/captura_landscape.png"
echo ""
