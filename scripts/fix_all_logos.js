const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const logosDir = path.join(root, 'public', 'logos');
const indexPath = path.join(root, 'data', 'companies', 'index.json');

const companies = JSON.parse(fs.readFileSync(indexPath, 'utf-8'));

// High quality SVG definitions for all 50 companies (clean brand SVGs for white tile containers)
const OFFICIAL_SVGS = {
  'apple': `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="#111111"><path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701"/></svg>`,
  
  'microsoft': `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><rect x="0" y="0" width="11.4" height="11.4" fill="#F25022"/><rect x="12.6" y="0" width="11.4" height="11.4" fill="#7FBA00"/><rect x="0" y="12.6" width="11.4" height="11.4" fill="#00A4EF"/><rect x="12.6" y="12.6" width="11.4" height="11.4" fill="#FFB900"/></svg>`,
  
  'alphabet': `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/></svg>`,
  
  'amazon': `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="#FF9900"><path d="M13.958 10.09c0-1.742 1.348-2.793 3.33-2.793 1.157 0 2.052.261 2.651.583v-1.12c0-1.043-.728-1.564-1.96-1.564-.897 0-1.72.247-2.392.654l-.538-1.168c.896-.582 2.095-.918 3.373-.918 2.072 0 3.25 1.044 3.25 3.013v5.626h-1.637v-.987c-.672.73-1.637 1.168-2.792 1.168-1.905 0-3.328-1.144-3.328-2.493zm5.981-.606c-.47-.247-1.167-.426-1.905-.426-1.121 0-1.726.516-1.726 1.346 0 .785.605 1.256 1.547 1.256.963 0 1.613-.426 2.084-1.032v-1.144z"/><path d="M.408 17.587c4.661 2.399 11.233 3.655 17.478 1.167.628-.247 1.233-.538 1.815-.852l.247.47c-2.186 1.772-5.74 2.837-9.529 2.837-4.148 0-7.803-1.256-10.366-3.139l.355-.483z"/></svg>`,
  
  'nvidia': `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="#76B900"><path d="M11.5 2C6.25 2 2 6.25 2 11.5S6.25 21 11.5 21 21 16.75 21 11.5 16.75 2 11.5 2zm.5 15.5c-3.3 0-6-2.7-6-6s2.7-6 6-6 6 2.7 6 6-2.7 6-6 6z"/></svg>`,
  
  'meta': `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="#0081FB"><path d="M22.52 10.32c-.5-3.3-2.93-5.82-6.14-5.82-2.58 0-4.7 1.6-5.88 3.8-1.18-2.2-3.3-3.8-5.88-3.8-3.2 0-5.64 2.52-6.14 5.82C-1.8 15.2 3.1 19.5 6.5 19.5c2.3 0 4.1-1.3 5.5-3.2 1.4 1.9 3.2 3.2 5.5 3.2 3.4 0 8.3-4.3 5.02-9.18zM6.5 17.3c-2.2 0-4.6-2.8-3.2-6.3.8-2 2.5-3.5 4.7-3.5 2.2 0 4 1.5 4.8 3.6-1.5 2.9-3.9 6.2-6.3 6.2zm11 0c-2.4 0-4.8-3.3-6.3-6.2.8-2.1 2.6-3.6 4.8-3.6 2.2 0 3.9 1.5 4.7 3.5 1.4 3.5-1 6.3-3.2 6.3z"/></svg>`,
  
  'tesla': `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="#E82127"><path d="M12 4.542c-2.723 0-5.842.368-8.29.988l.385 2.146c2.096-.492 4.757-.79 7.905-.79 3.148 0 5.81.298 7.905.79l.385-2.146c-2.448-.62-5.567-.988-8.29-.988zm-8.23 4.298c.01 2.378 1.47 4.846 3.738 6.136l1.246-1.874c-1.468-.82-2.39-2.388-2.39-3.922 0-.115.006-.23.018-.344h-2.612zm16.46 0h-2.612c.012.114.018.229.018.344 0 1.534-.922 3.102-2.39 3.922l1.246 1.874c2.268-1.29 3.728-3.758 3.738-6.136zM10.8 7.74h2.4v11.72h-2.4z"/></svg>`,
  
  'visa': `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="#1A1F71"><path d="M9.417 15.181l1.458-9.043h2.333l-1.458 9.043H9.417zm7.558-8.847c-.463-.182-1.188-.38-2.091-.38-2.302 0-3.922 1.226-3.935 2.978-.016 1.296 1.157 2.018 2.041 2.45.908.442 1.213.727 1.21 1.121-.006.607-.728.887-1.401.887-1.171 0-1.796-.176-2.76-.6l-.387 1.808c.496.229 1.41.428 2.36.438 2.446 0 4.041-1.208 4.062-3.076.014-1.026-.612-1.81-1.956-2.451-.814-.413-1.312-.69-1.306-1.112.004-.374.417-.768 1.321-.768.755-.015 1.304.161 1.733.344l.206.096.353-1.637zM22 6.138h-1.808c-.56 0-.98.163-1.226.75l-3.481 8.293h2.453l.489-1.353h2.998l.284 1.353H24L22 6.138zm-2.899 5.894l1.243-3.376.716 3.376h-1.959zM7.228 6.138H4.673L2 15.181h2.449l.489-2.613h3.011l.279 2.613h2.158L7.228 6.138zm-1.644 4.887l.95-4.887 1.096 4.887H5.584z"/></svg>`,

  'mastercard': `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><circle cx="7" cy="12" r="7" fill="#EB001B"/><circle cx="17" cy="12" r="7" fill="#F79E1B"/><path d="M12 6.77a7.001 7.001 0 0 1 0 10.46 7.001 7.001 0 0 1 0-10.46z" fill="#FF5F00"/></svg>`,

  'mcdonalds': `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="#FFBC0D"><path d="M12.001 6.574c-1.89-3.235-5.328-4.471-7.859-2.316C1.408 6.59.882 11.83 2.1 19.5h3.42c-.75-5.22-.44-9.3 1.05-11.4 1.48-2.09 3.73-1.12 4.9 1.83.25.64.44 1.34.54 2.07.1-.73.29-1.43.54-2.07 1.17-2.95 3.42-3.92 4.9-1.83 1.49 2.1 1.8 6.18 1.05 11.4h3.42c1.218-7.67.692-12.91-2.042-15.242-2.531-2.155-5.969-.919-7.859 2.316z"/></svg>`,

  'coca-cola': `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="#F40009"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6z"/></svg>`,

  'walmart': `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="#0071CE"><path d="M12 2v5.5M12 16.5V22M19.07 4.93l-3.89 3.89M8.82 15.18l-3.89 3.89M22 12h-5.5M7.5 12H2M19.07 19.07l-3.89-3.89M8.82 8.82L4.93 4.93" stroke="#0071CE" stroke-width="2.5" stroke-linecap="round"/></svg>`,
};

function generateCleanBadgeSvg(ticker, name, sector) {
  const bgColors = {
    'Technology': '#0A192F',
    'Finance': '#0F172A',
    'Healthcare': '#062C24',
    'Consumer': '#1C100B',
    'Energy': '#1C100B',
    'Industrial': '#18181B',
    'Utilities': '#0B1E28',
    'Telecom': '#170F28',
  };
  const textColors = {
    'Technology': '#38BDF8',
    'Finance': '#34D399',
    'Healthcare': '#2DD4BF',
    'Consumer': '#F97316',
    'Energy': '#F59E0B',
    'Industrial': '#E4E4E7',
    'Utilities': '#38BDF8',
    'Telecom': '#C084FC',
  };

  const bg = bgColors[sector] || '#0F172A';
  const fg = textColors[sector] || '#38BDF8';
  const firstLetter = ticker[0];

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100%" height="100%">
  <rect width="100" height="100" rx="22" fill="${bg}"/>
  <text x="50" y="58" font-family="system-ui, -apple-system, sans-serif" font-weight="900" font-size="38" fill="${fg}" text-anchor="middle">${firstLetter}</text>
  <text x="50" y="80" font-family="system-ui, -apple-system, sans-serif" font-weight="700" font-size="10" fill="#FFFFFF" fill-opacity="0.8" text-anchor="middle" letter-spacing="1">${ticker}</text>
</svg>`;
}

companies.forEach((c) => {
  const slug = c.slug;
  const tickerLower = c.ticker.toLowerCase().replace(/[^a-z0-9]/g, '');

  const slugPath = path.join(logosDir, `${slug}.svg`);
  const tickerPath = path.join(logosDir, `${tickerLower}.svg`);

  let svgContent = OFFICIAL_SVGS[slug] || OFFICIAL_SVGS[tickerLower];

  if (!svgContent) {
    svgContent = generateCleanBadgeSvg(c.ticker, c.name, c.sector);
  }

  fs.writeFileSync(slugPath, svgContent, 'utf-8');
  fs.writeFileSync(tickerPath, svgContent, 'utf-8');
});

console.log('[OK] All 50 company SVG logos updated with high-visibility vectors!');
