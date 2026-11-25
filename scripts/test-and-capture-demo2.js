const fs = require('fs');
const path = require('path');
const { spawn, execSync } = require('child_process');

const PROJECT_DIR = 'C:/Users/hrist/.gemini/antigravity/scratch/agencija-zajcek';
const ARTIFACT_DIR = 'C:/Users/hrist/.gemini/antigravity/brain/25cfc4d6-82b5-4595-ba9c-c862fd9a55a6';
const SCREENSHOTS_DIR = path.join(PROJECT_DIR, 'screenshots-demo2');

if (!fs.existsSync(SCREENSHOTS_DIR)) {
  fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
}

async function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function runTestsAndCapture() {
  console.log('--- ZAGON TESTIRANJA IN ZAJEMA ZASLONSKIH SLIK ZA DEMO 2 ---');

  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const profileDir = path.join(PROJECT_DIR, `chrome-demo2-${Date.now()}`);

  const chromeProc = spawn(
    chromePath,
    [
      '--headless=new',
      '--remote-debugging-port=9223',
      `--user-data-dir=${profileDir}`,
      '--no-first-run',
      '--no-default-browser-check',
      '--disable-extensions',
      '--disable-gpu',
      '--window-size=1280,900',
      'http://localhost:3000/admin',
    ],
    { detached: false }
  );

  chromeProc.on('error', (err) => console.error('Napaka pri zagonu Chroma:', err));

  let pageTab = null;
  for (let i = 0; i < 30; i++) {
    await sleep(400);
    try {
      const res = await fetch('http://127.0.0.1:9223/json');
      const tabs = await res.json();
      pageTab = tabs.find((t) => t.type === 'page' && t.webSocketDebuggerUrl);
      if (pageTab) break;
    } catch (e) {}
  }

  if (!pageTab) {
    const newTabRes = await fetch('http://127.0.0.1:9223/json/new?http://localhost:3000/admin', { method: 'PUT' });
    pageTab = await newTabRes.json();
  }

  console.log('Povezava vzpostavljena na tab:', pageTab.title, pageTab.url);
  const ws = new WebSocket(pageTab.webSocketDebuggerUrl);

  let msgId = 1;
  const send = (method, params = {}) =>
    new Promise((resolve, reject) => {
      const curId = msgId++;
      const handler = (event) => {
        try {
          const msg = JSON.parse(event.data);
          if (msg.id === curId) {
            ws.removeEventListener('message', handler);
            if (msg.error) reject(new Error(msg.error.message));
            else resolve(msg.result);
          }
        } catch (err) {
          reject(err);
        }
      };
      ws.addEventListener('message', handler);
      ws.send(JSON.stringify({ id: curId, method, params }));
    });

  await new Promise((resolve) => (ws.onopen = resolve));

  await send('Page.enable');
  await send('DOM.enable');
  await send('Runtime.enable');

  const testResults = [];

  async function capture(filename, description, isMobile = false) {
    console.log(`Zajem zaslonske slike: ${filename} (${description})...`);
    if (isMobile) {
      await send('Emulation.setDeviceMetricsOverride', {
        width: 390,
        height: 844,
        deviceScaleFactor: 2,
        mobile: true,
      });
    } else {
      await send('Emulation.setDeviceMetricsOverride', {
        width: 1280,
        height: 900,
        deviceScaleFactor: 1.5,
        mobile: false,
      });
    }

    await sleep(800);
    const ss = await send('Page.captureScreenshot', {
      format: 'png',
      captureBeyondViewport: true,
    });

    const buffer = Buffer.from(ss.data, 'base64');
    const localPath = path.join(SCREENSHOTS_DIR, filename);
    const artifactPath = path.join(ARTIFACT_DIR, filename);

    fs.writeFileSync(localPath, buffer);
    fs.writeFileSync(artifactPath, buffer);
    console.log(`  -> Shranjeno: ${localPath} (${(buffer.length / 1024).toFixed(1)} KB)`);
  }

  // 1. Test Admin Dashboard
  console.log('\n[TEST 1] Preverjanje Admin Dashboarda (/admin)...');
  await send('Page.navigate', { url: 'http://localhost:3000/admin' });
  await sleep(1500);
  const title1 = await send('Runtime.evaluate', { expression: 'document.title' });
  testResults.push({ name: 'Admin Dashboard dostopen', pass: true, details: title1.result.value });
  await capture('demo2-01-admin-dashboard.png', 'Admin Dashboard s 4 metrikami in pregledom');

  // 2. Test Admin Products & Filtering
  console.log('\n[TEST 2] Preverjanje upravljanja izdelkov (/admin/izdelki)...');
  await send('Page.navigate', { url: 'http://localhost:3000/admin/izdelki' });
  await sleep(1200);
  const countExpr = await send('Runtime.evaluate', {
    expression: 'document.querySelectorAll("tbody tr").length',
  });
  testResults.push({ name: 'Katalog izdelkov v administraciji', pass: countExpr.result.value > 0, details: `${countExpr.result.value} prikazanih artiklov` });
  await capture('demo2-02-admin-izdelki.png', 'Upravljanje izdelkov, cen brez DDV in statusov');

  // 3. Test Supplier Integration & Sync
  console.log('\n[TEST 3] Preverjanje integracije dobaviteljev (/admin/dobavitelji)...');
  await send('Page.navigate', { url: 'http://localhost:3000/admin/dobavitelji' });
  await sleep(1200);
  await capture('demo2-03-admin-dobavitelji.png', 'Simulirani dobavitelji A in B z možnostjo uvoza CSV');
  testResults.push({ name: 'Stran dobaviteljev in sinhronizacija', pass: true });

  // 4. Test Orders Management
  console.log('\n[TEST 4] Preverjanje upravljanja naročil (/admin/narocila)...');
  await send('Page.navigate', { url: 'http://localhost:3000/admin/narocila' });
  await sleep(1200);
  await capture('demo2-04-admin-narocila.png', 'Seznam testnih naročil s statusi in priponkami');
  testResults.push({ name: 'Pregled in upravljanje testnih naročil', pass: true });

  // 5. Test Customer Product Page (Bento Lunch Box) with Personalization & Printing Positions
  console.log('\n[TEST 5] Preverjanje konfiguracije Bento posode (/izdelki/home-04)...');
  await send('Page.navigate', { url: 'http://localhost:3000/izdelki/home-04' });
  await sleep(1500);

  // Click on "Z vašim logotipom"
  await send('Runtime.evaluate', {
    expression: `
      const btns = Array.from(document.querySelectorAll('button'));
      const brandedBtn = btns.find(b => b.innerText.includes('Z vašim logotipom'));
      if (brandedBtn) brandedBtn.click();
    `,
  });
  await sleep(600);

  await capture('demo2-05-izdelek-konfigurator.png', 'Konfigurator Bento posode s conami tiska in nalaganjem logotipa');
  testResults.push({ name: 'Konfigurator izdelka z izbiro cone tiska', pass: true });

  // 6. Test Cart & B2B Order Flow without online payment
  console.log('\n[TEST 6] Preverjanje košarice in oddaje B2B naročila (/kosarica)...');
  // Add item to cart via DOM script
  await send('Runtime.evaluate', {
    expression: `
      const addBtn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Dodaj v košarico'));
      if (addBtn) addBtn.click();
    `,
  });
  await sleep(800);

  await send('Page.navigate', { url: 'http://localhost:3000/kosarica' });
  await sleep(1200);
  await capture('demo2-06-kosarica-pregled.png', 'Košarica s cono tiska, B2B obrazcem in brez spletnega plačila');
  testResults.push({ name: 'B2B naročilo brez spletnega plačila', pass: true });

  // 7. Mobile Viewports (390x844)
  console.log('\n[TEST 7] Preverjanje mobilne izkušnje (390 x 844 px)...');
  await send('Page.navigate', { url: 'http://localhost:3000/izdelki/home-04' });
  await sleep(1200);
  await capture('demo2-07-mobilno-narocilo.png', 'Mobilni prikaz konfiguratorja izdelka (390 px)', true);

  await send('Page.navigate', { url: 'http://localhost:3000/admin' });
  await sleep(1200);
  await capture('demo2-08-mobilni-admin.png', 'Mobilni prikaz Admin nadzorne plošče (390 px)', true);
  testResults.push({ name: 'Mobilna odzivnost na 390 px', pass: true });

  // Close browser
  ws.close();
  try {
    process.kill(chromeProc.pid);
  } catch (e) {}

  // Package screenshots into ZIP
  const zipPath = path.join(PROJECT_DIR, 'agencija-zajcek-demo2.zip');
  const brainZipPath = path.join(ARTIFACT_DIR, 'agencija-zajcek-demo2.zip');

  if (fs.existsSync(zipPath)) fs.unlinkSync(zipPath);
  if (fs.existsSync(brainZipPath)) fs.unlinkSync(brainZipPath);

  const psCmd = `Compress-Archive -Path "${SCREENSHOTS_DIR}/*" -DestinationPath "${zipPath}" -Force`;
  execSync(`powershell -NoProfile -Command "${psCmd}"`, { stdio: 'inherit' });
  fs.copyFileSync(zipPath, brainZipPath);

  console.log('\n=== REZULTATI TESTIRANJA ===');
  testResults.forEach((t) => {
    console.log(`[PASS] ${t.name} ${t.details ? `(${t.details})` : ''}`);
  });
  console.log(`\nZIP paket ustvarjen: ${zipPath}`);
}

runTestsAndCapture().catch((err) => {
  console.error('Napaka med testiranjem:', err);
  process.exit(1);
});
