const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const logosDir = path.join(root, 'public', 'logos');
const indexPath = path.join(root, 'data', 'companies', 'index.json');

if (!fs.existsSync(logosDir)) {
  fs.mkdirSync(logosDir, { recursive: true });
}

const companies = JSON.parse(fs.readFileSync(indexPath, 'utf-8'));

const sectorColors = {
  Technology: ['#0A192F', '#38BDF8', '#818CF8'],
  Finance: ['#0F172A', '#34D399', '#10B981'],
  Healthcare: ['#062C24', '#2DD4BF', '#06B6D4'],
  Consumer: ['#1F1905', '#FBBF24', '#F59E0B'],
  Energy: ['#1C100B', '#F97316', '#EA580C'],
  Industrial: ['#18181B', '#E4E4E7', '#A1A1AA'],
  Utilities: ['#0B1E28', '#38BDF8', '#0284C7'],
  Telecom: ['#170F28', '#C084FC', '#A855F7'],
};

companies.forEach((c) => {
  const { slug, ticker, sector } = c;
  const [bg, fg, accent] = sectorColors[sector] || ['#0F172A', '#60A5FA', '#3B82F6'];
  const firstLetter = ticker[0];
  const subText = ticker.substring(0, 4);

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100%" height="100%">
  <defs>
    <linearGradient id="bg-grad-${ticker}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${bg}"/>
      <stop offset="100%" stop-color="#030712"/>
    </linearGradient>
    <linearGradient id="text-grad-${ticker}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFFFFF"/>
      <stop offset="100%" stop-color="${fg}"/>
    </linearGradient>
  </defs>
  <rect width="100" height="100" rx="22" fill="url(#bg-grad-${ticker})"/>
  <rect width="98" height="98" x="1" y="1" rx="21" fill="none" stroke="${fg}" stroke-opacity="0.3" stroke-width="1.5"/>
  <circle cx="50" cy="50" r="32" fill="${fg}" fill-opacity="0.08"/>
  <text x="50" y="58" font-family="system-ui, -apple-system, sans-serif" font-weight="900" font-size="34" fill="url(#text-grad-${ticker})" text-anchor="middle" letter-spacing="-1">${firstLetter}</text>
  <text x="50" y="82" font-family="system-ui, -apple-system, sans-serif" font-weight="700" font-size="10" fill="${fg}" fill-opacity="0.75" text-anchor="middle" letter-spacing="1">${subText}</text>
</svg>`;

  fs.writeFileSync(path.join(logosDir, `${slug}.svg`), svg, 'utf-8');
});

console.log(`[OK] Successfully generated ${companies.length} SVG logos in public/logos/`);
