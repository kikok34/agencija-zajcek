const fs = require('fs');
const { spawn } = require('child_process');

async function check() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const profileDir = 'C:\\Users\\hrist\\.gemini\\antigravity\\scratch\\agencija-zajcek\\chrome-profile-mobile';
  const chromeProc = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=9222',
    '--user-data-dir=' + profileDir,
    '--no-first-run',
    '--no-default-browser-check',
    '--disable-gpu',
    '--window-size=390,844',
    'http://localhost:3000/kosarica'
  ]);

  await new Promise(r => setTimeout(r, 1500));
  const res = await fetch('http://127.0.0.1:9222/json');
  const tabs = await res.json();
  const pageTab = tabs.find(t => t.type === 'page');
  const ws = new WebSocket(pageTab.webSocketDebuggerUrl);

  ws.onopen = async () => {
    let msgId = 1;
    const send = (method, params = {}) => new Promise((resolve) => {
      const curId = msgId++;
      const handler = (event) => {
        const msg = JSON.parse(event.data);
        if (msg.id === curId) {
          ws.removeEventListener('message', handler);
          resolve(msg.result);
        }
      };
      ws.addEventListener('message', handler);
      ws.send(JSON.stringify({ id: curId, method, params }));
    });

    await send('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 2, mobile: true });
    await send('Page.navigate', { url: 'http://localhost:3000/kosarica' });
    await new Promise(r => setTimeout(r, 1800));

    const evalRes = await send('Runtime.evaluate', {
      expression: `
        (() => {
          const els = [];
          document.querySelectorAll('*').forEach(el => {
            const r = el.getBoundingClientRect();
            if (r.right > 391) {
              els.push({
                tag: el.tagName,
                id: el.id,
                className: el.className,
                rectRight: Math.round(r.right),
                rectWidth: Math.round(r.width)
              });
            }
          });
          return els;
        })()
      `,
      returnByValue: true
    });

    console.log('Overflowing elements on kosarica:', JSON.stringify(evalRes.result.value, null, 2));
    ws.close();
    chromeProc.kill();
  }
}
check();
