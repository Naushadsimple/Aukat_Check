const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const dataDir = path.join(root, 'data');
const companiesDir = path.join(dataDir, 'companies');
const targetFile = path.join(dataDir, 'companies.json');

const indexPath = path.join(companiesDir, 'index.json');
const ratesPath = path.join(companiesDir, 'exchange_rates.json');

if (!fs.existsSync(indexPath) || !fs.existsSync(ratesPath)) {
  console.error('Missing index.json or exchange_rates.json');
  process.exit(1);
}

const index = JSON.parse(fs.readFileSync(indexPath, 'utf-8'));
const exchangeRates = JSON.parse(fs.readFileSync(ratesPath, 'utf-8'));

const fullCompanies = [];

for (const item of index) {
  const slug = item.slug;
  const companyFile = path.join(companiesDir, `${slug}.json`);
  
  if (fs.existsSync(companyFile)) {
    const raw = fs.readFileSync(companyFile, 'utf-8');
    const compData = JSON.parse(raw);
    fullCompanies.push({
      ...compData,
      slug: slug
    });
  }
}

const masterData = {
  lastUpdated: new Date().toISOString().split('T')[0],
  exchangeRates: exchangeRates,
  index: index,
  companies: fullCompanies
};

// Write consolidated master JSON
fs.writeFileSync(targetFile, JSON.stringify(masterData, null, 2), 'utf-8');
console.log(`[OK] Created consolidated master dataset -> data/companies.json (${fullCompanies.length} companies)`);

// Clean up old individual JSON files in data/companies
const files = fs.readdirSync(companiesDir);
let deletedCount = 0;
for (const file of files) {
  if (file.endsWith('.json')) {
    fs.unlinkSync(path.join(companiesDir, file));
    deletedCount++;
  }
}

// Remove empty companies directory if needed or keep it
try {
  fs.rmdirSync(companiesDir);
} catch (e) {}

console.log(`[OK] Deleted ${deletedCount} individual JSON files. Zero edge requests now!`);
