const { spawn } = require('child_process');
const { resolve } = require('path');
const http = require('http');

const PLUGIN_ROOT = process.env.CLAUDE_PLUGIN_ROOT || resolve(__dirname, '..');
const HTTP_PORT = process.env.CESIUM_HTTP_PORT || '9101';
const ION_TOKEN = process.env.CESIUM_ION_TOKEN || '';
const WS_PORT = process.env.CESIUM_WS_PORT || '9100';

const params = [];
if (ION_TOKEN) params.push(`token=${ION_TOKEN}`);
if (WS_PORT !== '9100') params.push(`ws=${WS_PORT}`);
const qs = params.length ? `?${params.join('&')}` : '';
const VIEWER_URL = `http://localhost:${HTTP_PORT}${qs}`;

function isServerRunning() {
  return new Promise((res) => {
    const req = http.get(`http://localhost:${HTTP_PORT}`, (r) => {
      res(r.statusCode === 200);
    });
    req.on('error', () => res(false));
    req.setTimeout(1500, () => { req.destroy(); res(false); });
  });
}

function startViewerServer() {
  const serverScript = resolve(PLUGIN_ROOT, 'scripts', 'start-server.js');
  const child = spawn('node', [serverScript], {
    detached: true,
    stdio: 'ignore',
    env: { ...process.env, CESIUM_HTTP_PORT: HTTP_PORT, CLAUDE_PLUGIN_ROOT: PLUGIN_ROOT },
  });
  child.unref();
}

function openBrowser(url) {
  try {
    if (process.platform === 'win32') {
      spawn('cmd', ['/c', 'start', '', url], { detached: true, stdio: 'ignore' }).unref();
    } else if (process.platform === 'darwin') {
      spawn('open', [url], { detached: true, stdio: 'ignore' }).unref();
    } else {
      spawn('xdg-open', [url], { detached: true, stdio: 'ignore' }).unref();
    }
  } catch {}
}

(async () => {
  const running = await isServerRunning();
  if (!running) {
    startViewerServer();
    setTimeout(() => openBrowser(VIEWER_URL), 1500);
  }
  // If already running, don't open browser again
  process.stdout.write(JSON.stringify({ continue: true, suppressOutput: true }));
})();
