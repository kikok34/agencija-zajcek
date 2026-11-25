const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const ARTIFACT_DIR = 'C:/Users/hrist/.gemini/antigravity/brain/25cfc4d6-82b5-4595-ba9c-c862fd9a55a6';
const LOCAL_DIR = 'C:/Users/hrist/.gemini/antigravity/scratch/agencija-zajcek/screenshots';

if (!fs.existsSync(LOCAL_DIR)) {
  fs.mkdirSync(LOCAL_DIR, { recursive: true });
}

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
  console.log('1. Starting Headless Chrome with isolated profile...');
  
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const profileDir = `C:\\Users\\hrist\\.gemini\\antigravity\\scratch\\agencija-zajcek\\chrome-p-${Date.now()}`;

  const chromeProc = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=9222',
    `--user-data-dir=${profileDir}`,
    '--no-first-run',
    '--no-default-browser-check',
    '--disable-extensions',
    '--disable-gpu',
    '--window-size=390,844',
    'http://localhost:3000/'
  ], { detached: false });

  chromeProc.on('error', (err) => {
    console.error('Failed to spawn Chrome:', err);
  });

  // Wait for port 9222 to become available
  let pageTab = null;
  for (let i = 0; i < 25; i++) {
    await sleep(400);
    try {
      const res = await fetch('http://127.0.0.1:9222/json');
      const tabs = await res.json();
      pageTab = tabs.find(t => t.type === 'page' && t.webSocketDebuggerUrl);
      if (pageTab) break;
    } catch (e) {
      // wait
    }
  }

  if (!pageTab) {
    console.log('Creating a new page tab...');
    const newTabRes = await fetch('http://127.0.0.1:9222/json/new?http://localhost:3000', { method: 'PUT' });
    pageTab = await newTabRes.json();
  }

  console.log('Connected to target tab:', pageTab.title, pageTab.url);
  const ws = new WebSocket(pageTab.webSocketDebuggerUrl);

  let msgId = 1;
  const send = (method, params = {}) => new Promise((resolve, reject) => {
    const curId = msgId++;
    const handler = (event) => {
      try {
        const msg = JSON.parse(event.data);
        if (msg.id === curId) {
          ws.removeEventListener('message', handler);
          if (msg.error) {
            reject(new Error(msg.error.message));
          } else {
            resolve(msg.result);
          }
        }
      } catch (err) {
        reject(err);
      }
    };
    ws.addEventListener('message', handler);
    ws.send(JSON.stringify({ id: curId, method, params }));
  });

  await new Promise((resolve) => {
    ws.onopen = resolve;
  });

  console.log('WebSocket connection established. Initializing mobile emulation...');

  await send('Page.enable');
  await send('DOM.enable');
  await send('Runtime.enable');

  await send('Emulation.setDeviceMetricsOverride', {
    width: 390,
    height: 844,
    deviceScaleFactor: 2,
    mobile: true,
  });
  await send('Emulation.setTouchEmulationEnabled', {
    enabled: true,
  });

  const pagesToCapture = [
    {
      id: '01',
      name: 'mobile-01-domov.png',
      title: 'Domov (Homepage)',
      url: 'http://localhost:3000/',
      setup: null,
    },
    {
      id: '02',
      name: 'mobile-02-katalogi.png',
      title: 'Katalogi (Pregled 6 B2B katalogov)',
      url: 'http://localhost:3000/katalogi',
      setup: null,
    },
    {
      id: '03',
      name: 'mobile-03-katalog-promo-tekstil.png',
      title: 'Katalog Promo tekstil (Notranja stran kataloga s filtri)',
      url: 'http://localhost:3000/katalogi/promo-tekstil',
      setup: null,
    },
    {
      id: '04',
      name: 'mobile-04-kategorija-promo-tekstil.png',
      title: 'Kategorija Promo tekstil (Katalog izdelkov s filtri)',
      url: 'http://localhost:3000/kategorije/promo-tekstil',
      setup: null,
    },
    {
      id: '05',
      name: 'mobile-05-product-detail.png',
      title: 'Product page (Organska unisex majica Creator 180g)',
      url: 'http://localhost:3000/izdelki/tek-01',
      setup: null,
    },
    {
      id: '06',
      name: 'mobile-06-outlet-shop.png',
      title: 'Outlet Shop (Zaloge, popusti in hitri nakup)',
      url: 'http://localhost:3000/outlet',
      setup: null,
    },
    {
      id: '07',
      name: 'mobile-07-az-darila.png',
      title: 'AZ darila (3 kurirani darilni kompleti)',
      url: 'http://localhost:3000/az-darila',
      setup: null,
    },
    {
      id: '08',
      name: 'mobile-08-kontakt.png',
      title: 'Kontakt (Podatki podjetja, zemljevid in FAQ)',
      url: 'http://localhost:3000/kontakt',
      setup: null,
    },
    {
      id: '09',
      name: 'mobile-09-kosarica-2-izdelka.png',
      title: 'Košarica z 2 izdelkoma (Pregled artiklov, količine, DDV in B2B checkout)',
      url: 'http://localhost:3000/kosarica',
      setup: async () => {
        // Preload 2 items in localStorage
        await send('Runtime.evaluate', {
          expression: `
            localStorage.setItem("az_cart_v1", JSON.stringify([
              {
                "id": "tek-01",
                "sku": "AZ-TEK-101",
                "name": "Organska unisex majica Organic Creator 180g",
                "price": 4.85,
                "quantity": 100,
                "image": "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80",
                "color": "Mornarsko modra",
                "size": "L",
                "printTechnique": "Sitotisk",
                "minQuantity": 25,
                "stock": 2400
              },
              {
                "id": "pen-01",
                "sku": "AZ-PEN-301",
                "name": "Kovinsko pisalo z lasersko gravuro Titan SoftTouch",
                "price": 0.79,
                "quantity": 250,
                "image": "https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?auto=format&fit=crop&w=800&q=80",
                "color": "Mat črna",
                "printTechnique": "Laserska gravura",
                "minQuantity": 100,
                "stock": 12000
              }
            ]));
          `
        });
      },
    },
    {
      id: '10',
      name: 'mobile-10-povprasevalni-obrazec.png',
      title: 'Povpraševalni obrazec (Modalno okno Zahtevaj ponudbo z demo podatki)',
      url: 'http://localhost:3000/',
      setup: async () => {
        // Trigger quote modal and fill realistic demo data
        await send('Runtime.evaluate', {
          expression: `
            const buttons = Array.from(document.querySelectorAll('button'));
            const heroBtn = buttons.find(b => b.textContent && b.textContent.includes('Zahtevaj ponudbo'));
            if (heroBtn) heroBtn.click();
          `
        });
        await sleep(600);
        // Fill demo inputs inside modal
        await send('Runtime.evaluate', {
          expression: `
            const inputs = document.querySelectorAll('input[type="text"], input[type="email"], input[type="tel"]');
            if (inputs.length >= 4) {
              inputs[0].value = "Luka Novak";
              inputs[0].dispatchEvent(new Event('input', { bubbles: true }));
              inputs[1].value = "Adria Solutions d.o.o.";
              inputs[1].dispatchEvent(new Event('input', { bubbles: true }));
              inputs[2].value = "luka.novak@adria-solutions.si";
              inputs[2].dispatchEvent(new Event('input', { bubbles: true }));
              inputs[3].value = "041 947 065";
              inputs[3].dispatchEvent(new Event('input', { bubbles: true }));
            }
            const textarea = document.querySelector('textarea');
            if (textarea) {
              textarea.value = "Zanima nas dotisk logotipa v dveh barvah za predvideni dogodek v prihodnjem mesecu.";
              textarea.dispatchEvent(new Event('input', { bubbles: true }));
            }
          `
        });
        await sleep(400);
      },
      isModal: true
    },
  ];

  const results = [];

  for (const page of pagesToCapture) {
    console.log(`\nCapturing [${page.id}/10] ${page.title}...`);
    
    await send('Emulation.setDeviceMetricsOverride', {
      width: 390,
      height: 844,
      deviceScaleFactor: 2,
      mobile: true,
    });

    await send('Page.navigate', { url: page.url });
    await sleep(2200);

    if (page.setup) {
      await page.setup();
      if (page.url.includes('/kosarica')) {
        await send('Page.navigate', { url: page.url });
        await sleep(1500);
      }
    }

    // Scroll down and up to trigger all image loads
    await send('Runtime.evaluate', {
      expression: `window.scrollTo(0, document.body.scrollHeight / 2);`
    });
    await sleep(350);
    await send('Runtime.evaluate', {
      expression: `window.scrollTo(0, document.body.scrollHeight);`
    });
    await sleep(350);
    await send('Runtime.evaluate', {
      expression: `window.scrollTo(0, 0);`
    });
    await sleep(300);

    // Get true layout metrics
    const layoutMetrics = await send('Page.getLayoutMetrics');
    const contentSize = layoutMetrics.cssContentSize || layoutMetrics.contentSize;
    let fullHeight = Math.ceil(contentSize.height);

    if (page.isModal) {
      fullHeight = 844;
    }

    console.log(`  Full-page height: ${fullHeight}px, width: ${contentSize.width}px`);

    await send('Emulation.setDeviceMetricsOverride', {
      width: 390,
      height: fullHeight,
      deviceScaleFactor: 2,
      mobile: true,
    });
    await sleep(600);

    const screenshotData = await send('Page.captureScreenshot', {
      format: 'png',
      captureBeyondViewport: true,
    });

    const buffer = Buffer.from(screenshotData.data, 'base64');
    
    const artifactPath = path.join(ARTIFACT_DIR, page.name);
    fs.writeFileSync(artifactPath, buffer);

    const localPath = path.join(LOCAL_DIR, page.name);
    fs.writeFileSync(localPath, buffer);

    const stat = fs.statSync(artifactPath);
    console.log(`  ✅ Saved ${page.name} (${Math.round(stat.size / 1024)} KB)`);

    results.push({
      id: page.id,
      name: page.name,
      title: page.title,
      sizeKb: Math.round(stat.size / 1024),
      fullHeight,
      artifactPath,
      localPath,
    });
  }

  ws.close();
  chromeProc.kill();
  console.log('\nAll 10 mobile screenshots captured successfully!');
  console.log(JSON.stringify(results, null, 2));
}

main().catch((err) => {
  console.error('Fatal error during capture:', err);
  process.exit(1);
});
