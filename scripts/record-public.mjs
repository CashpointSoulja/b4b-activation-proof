#!/usr/bin/env node
import fs from 'node:fs/promises';
import path from 'node:path';
import dns from 'node:dns/promises';
import net from 'node:net';
import { createRequire } from 'node:module';
import { performance } from 'node:perf_hooks';
import { execFileSync } from 'node:child_process';
import { createHash, X509Certificate } from 'node:crypto';

// This source captures an already-approved public deployment. It never deploys.
const argv = process.argv.slice(2);
const checkOnly = argv[0] === '--check-url';
const input = argv[checkOnly ? 1 : 0];
if (!input) {
  console.error('Usage: node scripts/record-public.mjs [--check-url] https://approved-public-host [capture-directory]');
  process.exit(2);
}
function isPublicAddress(address) {
  const family = net.isIP(address);
  if (family === 4) {
    const [a,b,c] = address.split('.').map(Number);
    return !(a === 0 || a === 10 || a === 127 || a >= 224 ||
      (a === 100 && b >= 64 && b <= 127) ||
      (a === 169 && b === 254) || (a === 172 && b >= 16 && b <= 31) ||
      (a === 192 && (b === 168 || b === 0 || (b === 88 && c === 99))) ||
      (a === 198 && (b === 18 || b === 19 || (b === 51 && c === 100))) ||
      (a === 203 && b === 0 && c === 113));
  }
  // Accept only global-unicast IPv6; reject documentation and transition ranges.
  if (family === 6) {
    const [first,second] = address.split(':').map(part => Number.parseInt(part || '0',16));
    return first >= 0x2000 && first <= 0x3fff && first !== 0x2002 &&
      !(first === 0x2001 && [0,0x10,0x20,0xdb8].includes(second));
  }
  return false;
}
function inheritedProxy() {
  const value = process.env.HTTPS_PROXY || process.env.HTTP_PROXY;
  if (!value) return undefined;
  const parsed = new URL(value);
  if (!['http:','https:'].includes(parsed.protocol)) throw new Error('The inherited HTTPS proxy must use HTTP or HTTPS.');
  return { server:parsed.origin,
    ...(parsed.username ? { username:decodeURIComponent(parsed.username) } : {}),
    ...(parsed.password ? { password:decodeURIComponent(parsed.password) } : {}) };
}
async function exactEnvironmentCaPin() {
  const requested = process.env.PUBLIC_CAPTURE_CA_FILE;
  if (!requested) return undefined;
  if (!process.env.NODE_EXTRA_CA_CERTS || path.resolve(requested) !== path.resolve(process.env.NODE_EXTRA_CA_CERTS))
    throw new Error('Chromium CA pin must name the exact inherited NODE_EXTRA_CA_CERTS certificate.');
  const pem = await fs.readFile(requested,'utf8');
  if ((pem.match(/-----BEGIN CERTIFICATE-----/g) || []).length !== 1)
    throw new Error('Chromium CA pin requires exactly one configured environment CA certificate.');
  const certificate = new X509Certificate(pem);
  if (!certificate.ca || Date.now() < Date.parse(certificate.validFrom) || Date.now() > Date.parse(certificate.validTo))
    throw new Error('Configured environment CA certificate is invalid or expired.');
  return createHash('sha256').update(certificate.publicKey.export({ type:'spki',format:'der' })).digest('base64');
}
async function validatePublicUrl(value) {
  const url = new URL(value);
  const host = url.hostname.toLowerCase().replace(/\.$/, '');
  if (url.protocol !== 'https:') throw new Error('Only public HTTPS capture is allowed; HTTP/local capture is refused.');
  if (url.username || url.password) throw new Error('Credentials in capture URLs are refused.');
  if (url.port && url.port !== '443') throw new Error('Capture requires the standard public HTTPS port.');
  if (!host.includes('.') || net.isIP(host.replace(/^\[|\]$/g, '')) ||
      /(^|\.)(localhost|local|internal|test|invalid|example|onion)$/.test(host))
    throw new Error('Local, reserved, or IP-literal hosts are refused.');
  const addresses = await dns.lookup(host, { all: true });
  if (!addresses.length || addresses.some(({ address }) => !isPublicAddress(address)))
    throw new Error('The host must resolve exclusively to public addresses.');
  const require = createRequire(import.meta.url);
  const { request } = require('playwright');
  const preflight = await request.newContext({ proxy:inheritedProxy(), ignoreHTTPSErrors:false });
  try {
  const response = await preflight.get(url.href, { maxRedirects:0, timeout:15000 });
  if (response.status() >= 300 && response.status() < 400) {
    const target = new URL(response.headers()['location'], url);
    if (target.origin !== url.origin) throw new Error('Cross-origin redirect refused. Supply the approved final public URL.');
    throw new Error('Supply the final public URL without redirects.');
  }
  if (!response.ok()) throw new Error(`Public URL preflight returned HTTP ${response.status()}.`);
  if (!response.headers()['content-type']?.includes('text/html'))
    throw new Error('Public URL must return the application HTML.');
  return { url, addresses: addresses.map(({ address }) => address), status: response.status() };
  } finally { await preflight.dispose(); }
}

let context;
let browser;
let capture;
let out;
try {
  const verified = await validatePublicUrl(input);
  if (checkOnly) {
    console.log(JSON.stringify({ publicHttps: true, origin: verified.url.origin, status: verified.status }));
    process.exit(0);
  }
  const require = createRequire(import.meta.url);
  const { chromium } = require('playwright');
  const caPin = await exactEnvironmentCaPin();
  out = path.resolve(argv[1] || 'work/walkthrough/capture');
  await fs.mkdir(out, { recursive: true });
  if (await fs.access(path.join(out, 'capture.json')).then(() => true, () => false))
    throw new Error('Capture directory already contains a manifest; choose a fresh directory.');
  const docs = await fs.readFile(new URL('../docs/walkthrough.md', import.meta.url), 'utf8');
  const match = docs.match(/<!-- NARRATION_JSON_START -->\s*```json\s*([\s\S]*?)```/);
  const scenes = JSON.parse(match[1]);
  if (scenes.reduce((sum,s) => sum + s.duration, 0) !== 105) throw new Error('Storyboard must total 105 seconds.');
  capture = {
    kind: 'actual-public-https-ui', completed: false, approvedOrigin: verified.url.origin,
    url: verified.url.href, resolvedAddresses: verified.addresses, recordedAt: new Date().toISOString(),
    width: 720, height: 1280, targetDuration: 105, scenes: [], downloads: [],
    fullWatchAndListen: false, sharingAuthorized: false,
    inheritedProxyConfigured: Boolean(inheritedProxy()), exactEnvironmentCaPinned: Boolean(caPin),
  };
  browser = await chromium.launch({ headless: true, proxy:inheritedProxy(),
    ...(caPin ? { args:[`--ignore-certificate-errors-spki-list=${caPin}`] } : {}),
    ...(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {}) });
  context = await browser.newContext({ viewport: { width: 720, height: 1280 },
    deviceScaleFactor: 1, acceptDownloads: true, recordVideo: { dir: path.join(out,'raw'), size: { width:720,height:1280 } } });
  await context.route('**/*', async route => {
    const requested = new URL(route.request().url());
    if (requested.origin !== verified.url.origin || requested.protocol !== 'https:') return route.abort('blockedbyclient');
    return route.continue();
  });
  await context.addInitScript(() => {
    document.addEventListener('DOMContentLoaded', () => {
      const cursor = document.createElement('div');
      cursor.id = 'walkthrough-visible-cursor';
      cursor.style.cssText = 'position:fixed;top:12px;left:12px;width:26px;height:34px;z-index:2147483647;pointer-events:none;filter:drop-shadow(0 1px 2px #ffffff);transition:transform .03s linear';
      cursor.innerHTML = '<svg viewBox="0 0 26 34" xmlns="http://www.w3.org/2000/svg"><path d="M2 2 L2 27 L9 21 L14 32 L20 29 L15 19 L25 19 Z" fill="#ffffff" stroke="#12372a" stroke-width="2"/></svg>';
      document.body.append(cursor);
      document.addEventListener('mousemove', e => { cursor.style.left = `${e.clientX}px`; cursor.style.top = `${e.clientY}px`; });
      document.addEventListener('mousedown', () => { cursor.style.transform = 'scale(.8)'; });
      document.addEventListener('mouseup', () => { cursor.style.transform = 'scale(1)'; });
    });
  });
  const page = await context.newPage();
  page.on('framenavigated', frame => {
    if (frame === page.mainFrame() && !frame.url().startsWith('about:') && new URL(frame.url()).origin !== verified.url.origin)
      throw new Error('Public UI left the approved origin.');
  });
  await page.goto(verified.url.href, { waitUntil:'networkidle', timeout:30000 });
  await page.getByText('Unofficial concept. All accounts/events are synthetic. No live CRM, outreach, payments or rides.', { exact: true }).waitFor();
  await page.getByTestId('demo-reset').click();
  await page.waitForTimeout(800);
  // Recheck DNS immediately before recording the narrative.
  await validatePublicUrl(verified.url.href);
  await page.mouse.move(620,150, { steps:12 });
  const narrativeStart = performance.now();
  async function click(id) {
    const control = id === 'run-evals' ? page.locator('#run-evals') : page.getByTestId(id);
    await control.scrollIntoViewIfNeeded();
    const box = await control.boundingBox();
    if (!box || box.width === 0 || box.height === 0) throw new Error(`Control is not visible: ${id}`);
    await page.mouse.move(box.x + box.width/2, box.y + box.height/2, { steps:12 });
    await page.waitForTimeout(200);
    await control.click();
    await page.waitForTimeout(500);
  }
  async function show(id) { await page.getByTestId(id).scrollIntoViewIfNeeded(); await page.getByTestId(id).waitFor({ state:'visible' }); }
  async function download(id,name) {
    const waiting = page.waitForEvent('download', { timeout:15000 });
    await click(id);
    const file = await waiting;
    if (await file.failure()) throw new Error(`Export failed: ${id}`);
    await file.saveAs(path.join(out,name));
    capture.downloads.push({ control:id, file:name });
  }
  for (const scene of scenes) {
    const deadline = narrativeStart + (scene.start + scene.duration) * 1000;
    const record = { ...scene, actualStartSeconds:(performance.now()-narrativeStart)/1000 };
    if (scene.id === 'account') {
      const select = page.getByTestId('account-select');
      await select.scrollIntoViewIfNeeded();
      const box = await select.boundingBox();
      await page.mouse.move(box.x + box.width/2,box.y + box.height/2,{steps:12});
      const choices = await select.locator('option').evaluateAll(options => options.map(option => option.value));
      const selectedIndex = choices.indexOf('uk-lumen');
      if (selectedIndex < 0) throw new Error('The primary synthetic account is missing.');
      await select.click();
      await select.press('Home');
      for (let index = 0; index < selectedIndex; index++) await select.press('ArrowDown');
      await select.press('Enter');
      if (await select.inputValue() !== 'uk-lumen') throw new Error('Visible account selection did not succeed.');
      await page.waitForTimeout(500);
      await page.evaluate(() => window.scrollTo({top:0,behavior:'smooth'}));
    } else if (scene.id === 'blocker') { await click('blocker-detail'); await show('blocker-detail-result'); }
    else if (scene.id === 'routing') { await click('evidence-routing'); await show('evidence-routing-result'); }
    else if (scene.id === 'ready') { await click('ready-check'); await show('ready-check-result'); await page.getByTestId('ready-check-result').filter({hasText:/All gates passed/i}).waitFor(); }
    else if (scene.id === 'first-order') { await click('first-order'); await show('first-order-result'); await page.getByTestId('first-order-result').filter({hasText:/Synthetic order accepted/i}).waitFor(); }
    else if (scene.id === 'deduplication') { await click('duplicate-order'); await show('duplicate-order-result'); await page.getByTestId('duplicate-order-result').filter({hasText:/deduplicated/i}).waitFor(); await page.waitForTimeout(1000); await click('out-of-order'); await show('out-of-order-result'); await page.getByTestId('out-of-order-result').filter({hasText:/rejected events/i}).waitFor(); }
    else if (scene.id === 'evaluations') {
      await click('run-evals'); await show('eval-result');
      await page.getByTestId('eval-result').filter({hasText:/0 failed/i}).waitFor();
      await page.waitForTimeout(1000); await click('executed-fails');
      await page.getByTestId('eval-result').filter({hasText:/[1-9][0-9]* failed/i}).waitFor();
      const failedCase = page.locator('.eval-case.fail').first();
      await failedCase.scrollIntoViewIfNeeded();
      const summary = failedCase.locator('summary'); const box = await summary.boundingBox();
      await page.mouse.move(box.x+box.width/2,box.y+box.height/2,{steps:12});
      await summary.click(); await page.waitForTimeout(400);
      await failedCase.scrollIntoViewIfNeeded();
    }
    else if (scene.id === 'holdout') { await click('holdout-report'); await show('holdout-report-result'); }
    else if (scene.id === 'exports') { await download('export-json','evidence.json'); await download('export-csv','ledger.csv'); }
    await page.screenshot({ path:path.join(out,`${String(scene.start).padStart(3,'0')}-${scene.id}.png`) });
    record.checkpointScreenshot = `${String(scene.start).padStart(3,'0')}-${scene.id}.png`;
    record.actionCompletedSeconds = (performance.now()-narrativeStart)/1000;
    if (performance.now() > deadline - 500) throw new Error(`Actions overran scene ${scene.id}; repeat with a fresh capture.`);
    await page.waitForTimeout(deadline - performance.now());
    record.actualEndSeconds = (performance.now()-narrativeStart)/1000;
    capture.scenes.push(record);
  }
  const narrativeElapsed = (performance.now()-narrativeStart)/1000;
  const video = page.video();
  await context.close(); context = undefined;
  await video.saveAs(path.join(out,'public-ui.webm'));
  const rawDuration = Number(execFileSync('ffprobe',['-v','error','-show_entries','format=duration','-of','default=noprint_wrappers=1:nokey=1',path.join(out,'public-ui.webm')],{encoding:'utf8'}).trim());
  if (!Number.isFinite(rawDuration) || rawDuration < 105) throw new Error('Raw public recording is too short.');
  capture.rawFile = 'public-ui.webm';
  capture.rawSha256 = createHash('sha256').update(await fs.readFile(path.join(out,'public-ui.webm'))).digest('hex');
  capture.rawDuration = rawDuration;
  // The browser video covers setup plus the timed narrative and closes immediately.
  capture.trimStartSeconds = Math.max(0,rawDuration - narrativeElapsed);
  capture.narrativeElapsed = narrativeElapsed;
  capture.completed = true;
  await fs.writeFile(path.join(out,'capture.json'),JSON.stringify(capture,null,2)+'\n');
  console.log(`Actual public HTTPS capture complete: ${path.join(out,'capture.json')}. Full human review is still required.`);
} catch (error) {
  if (capture && out) {
    capture.error = error.message;
    await fs.writeFile(path.join(out,'capture.json'),JSON.stringify(capture,null,2)+'\n');
  }
  console.error(`Public capture blocked: ${error.message}`);
  process.exitCode = 1;
} finally {
  await context?.close().catch(() => {});
  await browser?.close().catch(() => {});
}
