const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const projectDir = 'C:/Users/hrist/.gemini/antigravity/scratch/agencija-zajcek';
const brainDir = 'C:/Users/hrist/.gemini/antigravity/brain/25cfc4d6-82b5-4595-ba9c-c862fd9a55a6';

const srcDir = path.join(projectDir, 'screenshots');
const destDir = path.join(projectDir, 'screenshots-mobile');

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

const files = fs.readdirSync(srcDir).filter(f => f.startsWith('mobile-') && f.endsWith('.png'));
console.log(`Copying ${files.length} screenshots to ${destDir}...`);

for (const file of files) {
  fs.copyFileSync(path.join(srcDir, file), path.join(destDir, file));
}

const zipPath = path.join(projectDir, 'agencija-zajcek-mobile-demo.zip');
const brainZipPath = path.join(brainDir, 'agencija-zajcek-mobile-demo.zip');

if (fs.existsSync(zipPath)) fs.unlinkSync(zipPath);
if (fs.existsSync(brainZipPath)) fs.unlinkSync(brainZipPath);

console.log('Compressing files into agencija-zajcek-mobile-demo.zip...');
const psCmd = `Compress-Archive -Path "${destDir}/*" -DestinationPath "${zipPath}" -Force`;
execSync(`powershell -NoProfile -Command "${psCmd}"`, { stdio: 'inherit' });

fs.copyFileSync(zipPath, brainZipPath);

const zipStats = fs.statSync(zipPath);
console.log(`\nZIP created successfully: ${zipPath}`);
console.log(`Archive size: ${(zipStats.size / (1024 * 1024)).toFixed(2)} MB`);

console.log('\nVerified contents in /screenshots-mobile:');
const copied = fs.readdirSync(destDir);
copied.forEach(f => {
  const s = fs.statSync(path.join(destDir, f));
  console.log(`  - ${f} (${(s.size / 1024).toFixed(1)} KB)`);
});
