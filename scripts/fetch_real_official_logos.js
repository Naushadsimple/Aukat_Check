const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

const root = path.resolve(__dirname, '..');
const logosDir = path.join(root, 'public', 'logos');
const indexPath = path.join(root, 'data', 'companies', 'index.json');

if (!fs.existsSync(logosDir)) {
  fs.mkdirSync(logosDir, { recursive: true });
}

const companies = JSON.parse(fs.readFileSync(indexPath, 'utf-8'));

const DOMAIN_MAP = {
  'apple': { domain: 'apple.com', simpleIcon: 'apple' },
  'microsoft': { domain: 'microsoft.com', simpleIcon: 'microsoft' },
  'alphabet': { domain: 'google.com', simpleIcon: 'google' },
  'amazon': { domain: 'amazon.com', simpleIcon: 'amazon' },
  'nvidia': { domain: 'nvidia.com', simpleIcon: 'nvidia' },
  'meta': { domain: 'meta.com', simpleIcon: 'meta' },
  'tesla': { domain: 'tesla.com', simpleIcon: 'tesla' },
  'broadcom': { domain: 'broadcom.com', simpleIcon: 'broadcom' },
  'oracle': { domain: 'oracle.com', simpleIcon: 'oracle' },
  'salesforce': { domain: 'salesforce.com', simpleIcon: 'salesforce' },
  'adobe': { domain: 'adobe.com', simpleIcon: 'adobe' },
  'cisco': { domain: 'cisco.com', simpleIcon: 'cisco' },
  'amd': { domain: 'amd.com', simpleIcon: 'amd' },
  'netflix': { domain: 'netflix.com', simpleIcon: 'netflix' },
  'intel': { domain: 'intel.com', simpleIcon: 'intel' },
  'qualcomm': { domain: 'qualcomm.com', simpleIcon: 'qualcomm' },
  'texas-instruments': { domain: 'ti.com', simpleIcon: 'texasinstruments' },
  'berkshire-hathaway': { domain: 'berkshirehathaway.com', simpleIcon: 'berkshirehathaway' },
  'jpmorgan': { domain: 'jpmorganchase.com', simpleIcon: 'chase' },
  'visa': { domain: 'visa.com', simpleIcon: 'visa' },
  'mastercard': { domain: 'mastercard.com', simpleIcon: 'mastercard' },
  'goldman-sachs': { domain: 'goldmansachs.com', simpleIcon: 'goldmansachs' },
  'unitedhealth': { domain: 'unitedhealthgroup.com', simpleIcon: 'unitedhealthgroup' },
  'johnson-johnson': { domain: 'jnj.com', simpleIcon: 'johnsonandjohnson' },
  'merck': { domain: 'merck.com', simpleIcon: 'merck' },
  'abbvie': { domain: 'abbvie.com', simpleIcon: 'abbvie' },
  'thermo-fisher': { domain: 'thermofisher.com', simpleIcon: 'thermofisherscientific' },
  'abbott': { domain: 'abbott.com', simpleIcon: 'abbott' },
  'danaher': { domain: 'danaher.com', simpleIcon: 'danaher' },
  'amgen': { domain: 'amgen.com', simpleIcon: 'amgen' },
  'intuitive-surgical': { domain: 'intuitive.com', simpleIcon: 'intuitivesurgical' },
  'walmart': { domain: 'walmart.com', simpleIcon: 'walmart' },
  'procter-gamble': { domain: 'pg.com', simpleIcon: 'procterandgamble' },
  'home-depot': { domain: 'homedepot.com', simpleIcon: 'homedepot' },
  'costco': { domain: 'costco.com', simpleIcon: 'costco' },
  'coca-cola': { domain: 'coca-colacompany.com', simpleIcon: 'cocacola' },
  'pepsico': { domain: 'pepsico.com', simpleIcon: 'pepsi' },
  'mcdonalds': { domain: 'mcdonalds.com', simpleIcon: 'mcdonalds' },
  'lowes': { domain: 'lowes.com', simpleIcon: 'lowes' },
  'disney': { domain: 'disney.com', simpleIcon: 'disney' },
  'exxon-mobil': { domain: 'exxonmobil.com', simpleIcon: 'exxonmobil' },
  'linde': { domain: 'linde.com', simpleIcon: 'linde' },
  'honeywell': { domain: 'honeywell.com', simpleIcon: 'honeywell' },
  'boeing': { domain: 'boeing.com', simpleIcon: 'boeing' },
  'caterpillar': { domain: 'caterpillar.com', simpleIcon: 'caterpillar' },
  'rtx': { domain: 'rtx.com', simpleIcon: 'rtx' },
  'accenture': { domain: 'accenture.com', simpleIcon: 'accenture' },
  'nextera-energy': { domain: 'nexteraenergy.com', simpleIcon: 'nexteraenergy' },
  'philip-morris': { domain: 'pmi.com', simpleIcon: 'philipmorrisinternational' },
  'comcast': { domain: 'comcast.com', simpleIcon: 'comcast' }
};

// Also map ticker lowercases to domain map
companies.forEach((c) => {
  const slug = c.slug;
  const tickerLower = c.ticker.toLowerCase().replace(/[^a-z0-9]/g, '');
  if (DOMAIN_MAP[slug] && !DOMAIN_MAP[tickerLower]) {
    DOMAIN_MAP[tickerLower] = DOMAIN_MAP[slug];
  }
});

const domainMapPath = path.join(root, 'lib', 'domain-map.json');
fs.writeFileSync(domainMapPath, JSON.stringify(DOMAIN_MAP, null, 2), 'utf-8');
console.log('[OK] Saved domain-map.json with ticker and slug mappings!');
