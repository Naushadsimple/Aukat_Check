const fs = require('fs');
const path = require('path');
const https = require('https');

const root = path.resolve(__dirname, '..');
const logosDir = path.join(root, 'public', 'logos');
const domainMapPath = path.join(root, 'lib', 'domain-map.json');

const domainMap = JSON.parse(fs.readFileSync(domainMapPath, 'utf-8'));

function downloadFile(url, targetPath) {
  return new Promise((resolve) => {
    https.get(url, (res) => {
      if (res.statusCode === 200) {
        const fileStream = fs.createWriteStream(targetPath);
        res.pipe(fileStream);
        fileStream.on('finish', () => {
          fileStream.close();
          resolve(true);
        });
      } else if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        downloadFile(res.headers.location, targetPath).then(resolve);
      } else {
        resolve(false);
      }
    }).on('error', () => resolve(false));
  });
}

async function main() {
  console.log('Downloading FULL-COLOR official HD brand logos into public/logos/...');

  // Delete old monochrome .svg files
  const existingFiles = fs.readdirSync(logosDir);
  for (const f of existingFiles) {
    fs.unlinkSync(path.join(logosDir, f));
  }

  const entries = Object.entries(domainMap);
  let okCount = 0;

  for (const [key, value] of entries) {
    const domain = value.domain;
    const targetPng = path.join(logosDir, `${key}.png`);

    // 1. Try Clearbit first
    const clearbitUrl = `https://logo.clearbit.com/${domain}`;
    let ok = await downloadFile(clearbitUrl, targetPng);

    if (!ok) {
      // 2. Try Google 128px HD Favicon API (Always succeeds with full color logo!)
      const googleUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
      ok = await downloadFile(googleUrl, targetPng);
    }

    if (ok) {
      okCount++;
      console.log(`[OK] Saved full-color logo for ${key} (${domain})`);
    }
  }

  console.log(`Finished downloading ${okCount} full-color brand logos into public/logos/!`);
}

main();
