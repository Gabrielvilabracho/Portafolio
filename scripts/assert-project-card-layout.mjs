import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { extname, resolve, sep } from 'node:path';
import { spawn } from 'node:child_process';
import { tmpdir } from 'node:os';

const basePath = '/Portafolio';
const distDirectory = resolve('dist');
const minimumGap = 0.5;
const viewports = [
  { name: 'desktop', width: 1440, height: 1100 },
  { name: 'mobile', width: 390, height: 844 },
];
const mobileBreakpoint = 767;
const mimeTypes = {
  '.css': 'text/css',
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.svg': 'image/svg+xml',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
};

if (!existsSync(distDirectory)) {
  throw new Error('Missing dist/. Run `npm run build` before the browser layout assertion.');
}

function layoutProbe() {
  return `
    async () => {
      await document.fonts.ready;
      await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));

      const rect = (element) => {
        const { x, y, width, height, top, right, bottom, left } = element.getBoundingClientRect();
        return { x, y, width, height, top, right, bottom, left };
      };
      const cards = [...document.querySelectorAll('#projects [data-editorial-card-content]')];

      return {
        viewport: { width: window.innerWidth, height: window.innerHeight },
        mobileBreakpointActive: window.matchMedia('(max-width: ${mobileBreakpoint}px)').matches,
        fontLoaded: document.fonts.check('1em "ABC Monument Grotesk"'),
        cards: cards.map((card) => {
          const mark = card.querySelector('[data-editorial-card-mark]');
          const metadata = card.querySelector('[data-editorial-card-metadata]');
          return {
            mark: mark?.textContent?.trim(),
            markRect: rect(mark),
            metadataRect: rect(metadata),
            intendedGap: Number.parseFloat(getComputedStyle(card).rowGap),
          };
        }),
      };
    }
  `;
}

function validateMeasurement(engine, viewport, windowRect, measurement) {
  const failures = [];
  const viewportWidthMatchesRequest = measurement.viewport.width === viewport.width;
  const breakpointMatchesViewport = measurement.mobileBreakpointActive === (measurement.viewport.width <= mobileBreakpoint);
  if (!measurement.fontLoaded) failures.push('ABC Monument Grotesk was not loaded.');
  if (measurement.cards.length !== 4) failures.push(`Expected four project cards, found ${measurement.cards.length}.`);
  if (!breakpointMatchesViewport) failures.push(`Mobile breakpoint execution disagrees with the actual ${measurement.viewport.width}px content width.`);

  const lines = measurement.cards.map((card) => {
    const gap = card.metadataRect.top - card.markRect.bottom;
    const overlaps = card.markRect.bottom > card.metadataRect.top;
    if (!/^P-0[1-4]$/.test(card.mark ?? '')) failures.push(`Unexpected project mark: ${card.mark ?? '(missing)'}.`);
    if (overlaps) failures.push(`${card.mark} overlaps its metadata.`);
    if (gap < minimumGap) failures.push(`${card.mark} has a ${gap.toFixed(2)}px gap; expected a positive gap of at least ${minimumGap}px.`);
    if (Math.abs(gap - card.intendedGap) > 0.1) {
      failures.push(`${card.mark} gap ${gap.toFixed(2)}px does not match the ${card.intendedGap.toFixed(2)}px grid gap.`);
    }
    return `  ${card.mark}: mark=${formatRect(card.markRect)} metadata=${formatRect(card.metadataRect)} gap=${gap.toFixed(2)}px`;
  });

  const title = `${engine.name} ${engine.version} — ${viewport.name} requested ${viewport.width}x${viewport.height}, window ${windowRect.width}x${windowRect.height}, content ${measurement.viewport.width}x${measurement.viewport.height}, mobile-breakpoint=${measurement.mobileBreakpointActive}`;
  console.log(`${title}\n${lines.join('\n')}`);
  if (!viewportWidthMatchesRequest) {
    const limitation = `${title}\n  SKIPPED: requested viewport width was not honored; geometry was not asserted for this scenario.`;
    if (engine.name === 'Safari' && viewport.name === 'mobile') {
      console.warn(limitation);
      return false;
    }
    throw new Error(`${limitation}\nExpected content viewport width ${viewport.width}px.`);
  }
  if (failures.length) throw new Error(`${title}\n${failures.join('\n')}`);
  return true;
}

function formatRect({ x, y, width, height }) {
  return `(${x.toFixed(2)},${y.toFixed(2)} ${width.toFixed(2)}x${height.toFixed(2)})`;
}

function startStaticServer() {
  const server = createServer(async (request, response) => {
    try {
      const pathname = new URL(request.url ?? '/', 'http://localhost').pathname;
      if (pathname !== basePath && !pathname.startsWith(`${basePath}/`)) {
        response.writeHead(404).end();
        return;
      }

      let relativePath = pathname.slice(basePath.length) || '/';
      if (relativePath.endsWith('/')) relativePath += 'index.html';
      const filePath = resolve(distDirectory, `.${relativePath}`);
      if (!filePath.startsWith(`${distDirectory}${sep}`)) throw new Error('Invalid static file path.');

      const file = await readFile(filePath);
      response.writeHead(200, { 'content-type': mimeTypes[extname(filePath)] ?? 'application/octet-stream' }).end(file);
    } catch {
      response.writeHead(404).end();
    }
  });

  return new Promise((resolve) => {
    server.listen(0, '127.0.0.1', () => resolve(server));
  });
}

async function webdriverRequest(url, method, body) {
  const response = await fetch(url, {
    method,
    headers: body ? { 'content-type': 'application/json' } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });
  const payload = await response.json();
  if (!response.ok) throw new Error(payload.value?.message ?? `WebDriver ${response.status}`);
  return payload.value;
}

async function waitForSafariLoad(driverUrl, sessionId) {
  const result = await webdriverRequest(`${driverUrl}/session/${sessionId}/execute/async`, 'POST', {
    script: `const done = arguments[arguments.length - 1];
      const finish = () => done({ readyState: document.readyState });
      if (document.readyState === 'complete') finish();
      else window.addEventListener('load', finish, { once: true });`,
    args: [],
  });
  if (result.readyState !== 'complete') throw new Error(`Safari navigation did not complete (readyState=${result.readyState}).`);
}

async function runSafari(url) {
  const driverUrl = process.env.SAFARI_WEBDRIVER_URL ?? 'http://127.0.0.1:4444';
  let sessionId;
  try {
    const session = await webdriverRequest(`${driverUrl}/session`, 'POST', {
      capabilities: { alwaysMatch: { browserName: 'safari' } },
    });
    sessionId = session.sessionId;
    const engine = { name: 'Safari', version: session.capabilities.browserVersion ?? 'unknown' };
    await webdriverRequest(`${driverUrl}/session/${sessionId}/timeouts`, 'POST', { script: 30000 });

    for (const viewport of viewports) {
      await webdriverRequest(`${driverUrl}/session/${sessionId}/window/rect`, 'POST', viewport);
      const windowRect = await webdriverRequest(`${driverUrl}/session/${sessionId}/window/rect`, 'GET');
      await webdriverRequest(`${driverUrl}/session/${sessionId}/url`, 'POST', { url });
      await waitForSafariLoad(driverUrl, sessionId);
      const measurement = await webdriverRequest(`${driverUrl}/session/${sessionId}/execute/async`, 'POST', {
        script: `const done = arguments[arguments.length - 1]; (${layoutProbe()})().then(done).catch((error) => done({ error: error.message }));`,
        args: [],
      });
      if (measurement.error) throw new Error(measurement.error);
      validateMeasurement(engine, viewport, windowRect, measurement);
    }
  } catch (error) {
    throw new Error(`Safari WebDriver assertion failed at ${driverUrl}: ${error.message}`);
  } finally {
    if (sessionId) await fetch(`${driverUrl}/session/${sessionId}`, { method: 'DELETE' });
  }
}

async function launchChrome() {
  const executable = process.env.CHROME_BIN ?? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
  if (!existsSync(executable)) throw new Error(`Chrome executable not found: ${executable}`);

  const userDataDirectory = resolve(tmpdir(), `portafolio-layout-${process.pid}`);
  const chrome = spawn(executable, [
    '--headless=new',
    '--remote-debugging-port=0',
    `--user-data-dir=${userDataDirectory}`,
    '--no-first-run',
    '--no-default-browser-check',
    'about:blank',
  ], { stdio: ['ignore', 'pipe', 'pipe'] });

  const endpoint = await new Promise((resolve, reject) => {
    let output = '';
    const timer = setTimeout(() => reject(new Error(`Chrome did not expose a DevTools endpoint.\n${output}`)), 15000);
    const inspect = (chunk) => {
      output += chunk.toString();
      const match = output.match(/DevTools listening on (ws:\/\/[^\s]+)/);
      if (match) {
        clearTimeout(timer);
        resolve(match[1]);
      }
    };
    chrome.stdout.on('data', inspect);
    chrome.stderr.on('data', inspect);
    chrome.once('error', reject);
    chrome.once('exit', (code) => reject(new Error(`Chrome exited before startup (${code}).\n${output}`)));
  });

  return { chrome, endpoint };
}

function connectCdp(endpoint) {
  const socket = new WebSocket(endpoint);
  let sequence = 0;
  const pending = new Map();
  const eventWaiters = new Set();
  const ready = new Promise((resolve, reject) => {
    socket.addEventListener('open', resolve, { once: true });
    socket.addEventListener('error', () => reject(new Error('Could not connect to Chrome DevTools.')), { once: true });
  });
  socket.addEventListener('message', ({ data }) => {
    const message = JSON.parse(data);
    if (message.method) {
      for (const waiter of eventWaiters) {
        if (waiter.method === message.method && waiter.sessionId === message.sessionId) {
          clearTimeout(waiter.timer);
          eventWaiters.delete(waiter);
          waiter.resolve(message.params);
          break;
        }
      }
      return;
    }
    const request = pending.get(message.id);
    if (!request) return;
    pending.delete(message.id);
    message.error ? request.reject(new Error(message.error.message)) : request.resolve(message.result);
  });

  return {
    ready,
    send(method, params = {}, sessionId) {
      return new Promise((resolve, reject) => {
        const id = ++sequence;
        pending.set(id, { resolve, reject });
        socket.send(JSON.stringify({ id, method, params, ...(sessionId ? { sessionId } : {}) }));
      });
    },
    waitForEvent(method, sessionId, timeout = 30000) {
      return new Promise((resolve, reject) => {
        const waiter = {
          method,
          sessionId,
          resolve,
          timer: setTimeout(() => {
            eventWaiters.delete(waiter);
            reject(new Error(`Timed out waiting for Chrome DevTools event ${method}.`));
          }, timeout),
        };
        eventWaiters.add(waiter);
      });
    },
    close() { socket.close(); },
  };
}

async function runChrome(url) {
  const { chrome, endpoint } = await launchChrome();
  const cdp = connectCdp(endpoint);
  try {
    await cdp.ready;
    const version = await cdp.send('Browser.getVersion');
    const target = await cdp.send('Target.createTarget', { url: 'about:blank' });
    const attached = await cdp.send('Target.attachToTarget', { targetId: target.targetId, flatten: true });
    const engine = { name: 'Chrome', version: version.product.replace('Chrome/', '') };
    await cdp.send('Page.enable', {}, attached.sessionId);

    for (const viewport of viewports) {
      await cdp.send('Emulation.setDeviceMetricsOverride', {
        width: viewport.width,
        height: viewport.height,
        deviceScaleFactor: 1,
        mobile: false,
      }, attached.sessionId);
      const pageLoaded = cdp.waitForEvent('Page.loadEventFired', attached.sessionId);
      await cdp.send('Page.navigate', { url }, attached.sessionId);
      await pageLoaded;
      const result = await cdp.send('Runtime.evaluate', {
        expression: `(${layoutProbe()})()`,
        awaitPromise: true,
        returnByValue: true,
      }, attached.sessionId);
      const measurement = result.result.value;
      if (measurement?.error) throw new Error(measurement.error);
      validateMeasurement(engine, viewport, viewport, measurement);
    }
  } finally {
    cdp.close();
    chrome.kill();
  }
}

const server = await startStaticServer();
const address = server.address();
const url = `http://127.0.0.1:${address.port}${basePath}/`;

try {
  await runSafari(url);
  await runChrome(url);
  console.log('Project-card browser geometry assertions passed in Safari and Chrome (computed grid gap must be positive and match geometry).');
} finally {
  await new Promise((resolve) => server.close(resolve));
}
