const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const logosDir = path.join(root, 'public', 'logos');
const indexPath = path.join(root, 'data', 'companies', 'index.json');

const companies = JSON.parse(fs.readFileSync(indexPath, 'utf-8'));

// Authentic brand color pairs for all 50 companies
const BRAND_COLORS = {
  'apple': ['#000000', '#FFFFFF', ''],
  'microsoft': ['#0F0F10', '#00A4EF', 'MSFT'],
  'alphabet': ['#111827', '#4285F4', 'G'],
  'amazon': ['#131921', '#FF9900', 'a'],
  'nvidia': ['#040D04', '#76B900', 'NVIDIA'],
  'meta': ['#06142E', '#0081FB', '∞'],
  'tesla': ['#111111', '#E82127', 'T'],
  'broadcom': ['#0F172A', '#CC092F', 'AVGO'],
  'oracle': ['#1C1917', '#C74634', 'ORCL'],
  'salesforce': ['#0B192C', '#00A1E0', 'CRM'],
  'adobe': ['#18181B', '#FF0000', 'Aa'],
  'cisco': ['#0B1E28', '#049FD9', 'CSCO'],
  'amd': ['#18181B', '#ED1C24', 'AMD'],
  'netflix': ['#000000', '#E50914', 'N'],
  'intel': ['#0A192F', '#0068B5', 'intel'],
  'qualcomm': ['#0B192C', '#3253DC', 'QCOM'],
  'texas-instruments': ['#18181B', '#CC0000', 'TI'],
  'berkshire-hathaway': ['#0F172A', '#60A5FA', 'BRK'],
  'jpmorgan': ['#0B192C', '#117ACA', 'JPM'],
  'visa': ['#0B192C', '#1A1F71', 'VISA'],
  'mastercard': ['#0F172A', '#EB001B', 'MC'],
  'goldman-sachs': ['#0B192C', '#7399C6', 'GS'],
  'unitedhealth': ['#0F172A', '#002677', 'UNH'],
  'johnson-johnson': ['#1C1917', '#D51900', 'JNJ'],
  'merck': ['#062C24', '#007A78', 'MRK'],
  'abbvie': ['#0B192C', '#071D49', 'ABBV'],
  'thermo-fisher': ['#0F172A', '#E31837', 'TMO'],
  'abbott': ['#0B192C', '#0096D6', 'ABT'],
  'danaher': ['#0F172A', '#00529B', 'DHR'],
  'amgen': ['#0B192C', '#005696', 'AMGN'],
  'intuitive-surgical': ['#062C24', '#00A3E0', 'ISRG'],
  'walmart': ['#0B192C', '#0071CE', 'WMT'],
  'procter-gamble': ['#0B192C', '#003A70', 'P&G'],
  'home-depot': ['#1C100B', '#F96302', 'HD'],
  'costco': ['#0B192C', '#E31837', 'COST'],
  'coca-cola': ['#18181B', '#F40009', 'Coke'],
  'pepsico': ['#0B192C', '#005CB9', 'PEP'],
  'mcdonalds': ['#1C1917', '#FFBC0D', 'M'],
  'lowes': ['#0B192C', '#004990', 'LOW'],
  'disney': ['#0B192C', '#113CCF', 'DIS'],
  'exxon-mobil': ['#1C100B', '#EE1C25', 'XOM'],
  'linde': ['#0B192C', '#0087CF', 'LIN'],
  'honeywell': ['#1C1917', '#DE1E27', 'HON'],
  'boeing': ['#0B192C', '#0033A0', 'BA'],
  'caterpillar': ['#18181B', '#FFCD00', 'CAT'],
  'rtx': ['#0B192C', '#E2231A', 'RTX'],
  'accenture': ['#0F172A', '#A100FF', '>'],
  'nextera-energy': ['#0B192C', '#78BE20', 'NEE'],
  'philip-morris': ['#18181B', '#000000', 'PM'],
  'comcast': ['#0B192C', '#FF0000', 'CMCSA']
};

companies.forEach((c) => {
  const slug = c.slug;
  const tickerLower = c.ticker.toLowerCase().replace(/[^a-z0-9]/g, '');

  const targetPathSlug = path.join(logosDir, `${slug}.svg`);
  const targetPathTicker = path.join(logosDir, `${tickerLower}.svg`);

  // Check if a valid SVG already exists (and is not empty)
  let hasValidSvg = false;
  if (fs.existsSync(targetPathSlug)) {
    const stat = fs.statSync(targetPathSlug);
    if (stat.size > 100) hasValidSvg = true;
  }

  if (!hasValidSvg) {
    const [bg, fg, label] = BRAND_COLORS[slug] || ['#0F172A', '#38BDF8', c.ticker];
    
    const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100%" height="100%">
  <defs>
    <linearGradient id="bg-${slug}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${bg}"/>
      <stop offset="100%" stop-color="#020617"/>
    </linearGradient>
  </defs>
  <rect width="100" height="100" rx="22" fill="url(#bg-${slug})"/>
  <rect width="98" height="98" x="1" y="1" rx="21" fill="none" stroke="${fg}" stroke-opacity="0.3" stroke-width="1.5"/>
  <text x="50" y="58" font-family="system-ui, -apple-system, sans-serif" font-weight="900" font-size="${label.length > 4 ? '20' : label.length > 2 ? '28' : '36'}" fill="${fg}" text-anchor="middle" letter-spacing="-0.5">${label}</text>
  <text x="50" y="80" font-family="system-ui, -apple-system, sans-serif" font-weight="700" font-size="9" fill="#94A3B8" text-anchor="middle" letter-spacing="1">${c.ticker}</text>
</svg>`;

    fs.writeFileSync(targetPathSlug, svgContent, 'utf-8');
    fs.writeFileSync(targetPathTicker, svgContent, 'utf-8');
  } else {
    // Copy slug.svg to ticker.svg to ensure both exist
    fs.copyFileSync(targetPathSlug, targetPathTicker);
  }
});

console.log('[OK] Guaranteed 100% SVG logos created for all 50 companies!');
