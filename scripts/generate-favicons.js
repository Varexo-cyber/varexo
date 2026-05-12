/**
 * Generate favicon PNGs and .ico from favicon-v2.svg
 * Run: node scripts/generate-favicons.js
 */
const sharp = require('sharp');
const pngToIco = require('png-to-ico').default || require('png-to-ico');
const fs = require('fs');
const path = require('path');

const PUBLIC_DIR = path.join(__dirname, '..', 'public');
const SVG_PATH = path.join(PUBLIC_DIR, 'favicon-v2.svg');

const SIZES = [
  { name: 'favicon-v2-16x16.png', size: 16 },
  { name: 'favicon-v2-32x32.png', size: 32 },
  { name: 'favicon-v2-48x48.png', size: 48 },
  { name: 'apple-touch-icon.png', size: 180 },
  { name: 'logo192.png', size: 192 },
  { name: 'logo512.png', size: 512 },
];

async function generate() {
  if (!fs.existsSync(SVG_PATH)) {
    console.error(`SVG not found at ${SVG_PATH}`);
    process.exit(1);
  }

  const svgBuffer = fs.readFileSync(SVG_PATH);

  // Generate PNGs
  for (const { name, size } of SIZES) {
    const outPath = path.join(PUBLIC_DIR, name);
    await sharp(svgBuffer)
      .resize(size, size, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png()
      .toFile(outPath);
    console.log(`✓ ${name} (${size}x${size})`);
  }

  // Generate multi-size .ico (16, 32, 48)
  const icoSources = [16, 32, 48].map(s =>
    path.join(PUBLIC_DIR, `favicon-v2-${s === 48 ? '48x48' : s + 'x' + s}.png`)
  );

  const icoBuffer = await pngToIco(icoSources);
  fs.writeFileSync(path.join(PUBLIC_DIR, 'favicon-v2.ico'), icoBuffer);
  console.log('✓ favicon-v2.ico (multi-size 16/32/48)');

  console.log('\nAll favicons generated successfully!');
}

generate().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
