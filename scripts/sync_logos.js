const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const logosDir = path.join(root, 'public', 'logos');
const indexPath = path.join(root, 'data', 'companies', 'index.json');

const companies = JSON.parse(fs.readFileSync(indexPath, 'utf-8'));

companies.forEach((c) => {
  const slug = c.slug;
  const tickerLower = c.ticker.toLowerCase().replace(/[^a-z0-9]/g, '');

  // Find existing file for slug
  const extensions = ['.svg', '.png', '.ico'];
  let foundExt = null;

  for (const ext of extensions) {
    if (fs.existsSync(path.join(logosDir, `${slug}${ext}`))) {
      foundExt = ext;
      break;
    }
  }

  if (foundExt) {
    // Also copy to tickerLower if different
    const source = path.join(logosDir, `${slug}${foundExt}`);
    const destTicker = path.join(logosDir, `${tickerLower}${foundExt}`);
    if (source !== destTicker && !fs.existsSync(destTicker)) {
      fs.copyFileSync(source, destTicker);
    }
  } else {
    // Generate clean SVG fallback
    const bg = '#0F172A';
    const fg = '#38BDF8';
    const firstLetter = c.ticker[0];

    const fallbackSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100%" height="100%">
  <rect width="100" height="100" rx="22" fill="${bg}"/>
  <rect width="98" height="98" x="1" y="1" rx="21" fill="none" stroke="${fg}" stroke-opacity="0.3" stroke-width="1.5"/>
  <text x="50" y="62" font-family="system-ui, sans-serif" font-weight="900" font-size="38" fill="#FFFFFF" text-anchor="middle">${firstLetter}</text>
</svg>`;

    fs.writeFileSync(path.join(logosDir, `${slug}.svg`), fallbackSvg, 'utf-8');
    fs.writeFileSync(path.join(logosDir, `${tickerLower}.svg`), fallbackSvg, 'utf-8');
  }
});

console.log('[OK] Logo mapping synced for all 50 companies!');
