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

// Domain mapping for clearbit / simpleicons / vector logos
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

function downloadUrl(url, targetPath) {
  return new Promise((resolve) => {
    const client = url.startsWith('https') ? https : http;
    client.get(url, (res) => {
      if (res.statusCode === 200) {
        const fileStream = fs.createWriteStream(targetPath);
        res.pipe(fileStream);
        fileStream.on('finish', () => {
          fileStream.close();
          resolve(true);
        });
      } else if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        downloadUrl(res.headers.location, targetPath).then(resolve);
      } else {
        resolve(false);
      }
    }).on('error', () => resolve(false));
  });
}

async function main() {
  console.log(`Downloading real public logos for ${companies.length} companies...`);
  
  for (const c of companies) {
    const slug = c.slug;
    const info = DOMAIN_MAP[slug] || { domain: `${slug}.com`, simpleIcon: slug.replace(/-/g, '') };
    
    // First try SimpleIcons SVG CDN
    const simpleIconUrl = `https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/${info.simpleIcon}.svg`;
    const svgPath = path.join(logosDir, `${slug}.svg`);
    const pngPath = path.join(logosDir, `${slug}.png`);
    
    let ok = await downloadUrl(simpleIconUrl, svgPath);
    
    if (ok) {
      console.log(`[OK] Downloaded SVG logo for ${c.name} (${slug})`);
    } else {
      // Fallback to Clearbit logo PNG
      const clearbitUrl = `https://logo.clearbit.com/${info.domain}`;
      let okPng = await downloadUrl(clearbitUrl, pngPath);
      if (okPng) {
        console.log(`[OK] Downloaded PNG logo for ${c.name} (${slug})`);
      } else {
        // Fallback DuckDuckGo favicon/logo CDN
        const ddgUrl = `https://icons.duckduckgo.com/ip3/${info.domain}.ico`;
        await downloadUrl(ddgUrl, path.join(logosDir, `${slug}.ico`));
        console.log(`[OK] Downloaded fallback icon for ${c.name} (${slug})`);
      }
    }
  }
  
  console.log('Finished downloading all logos into public/logos/');
}

main();
