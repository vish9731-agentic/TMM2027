const http = require('http');
const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer-core');

const rootDir = path.resolve(__dirname, '..');

const server = http.createServer((req, res) => {
  let p = req.url === '/' ? '/index.html' : req.url.split('?')[0];
  const full = path.join(rootDir, p);
  if (fs.existsSync(full)) {
    const ext = path.extname(full);
    const mime = ext === '.html' ? 'text/html' : ext === '.css' ? 'text/css' : ext === '.js' ? 'application/javascript' : 'text/plain';
    res.writeHead(200, { 'Content-Type': mime });
    res.end(fs.readFileSync(full));
  } else {
    res.writeHead(404);
    res.end('404');
  }
}).listen(3458, '127.0.0.1', async () => {
  const browser = await puppeteer.launch({
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    headless: true,
    pipe: true,
    args: ['--no-sandbox', '--disable-gpu', '--user-data-dir=/tmp/tmm_dbg_2']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 320, height: 568 });
  await page.goto('http://127.0.0.1:3458/index.html', { waitUntil: 'networkidle0' });

  const info = await page.evaluate(() => {
    const w = window.innerWidth;
    const bodyW = document.body.scrollWidth;
    const docW = document.documentElement.scrollWidth;

    // Find all elements whose outer bounding box is wider than 320
    const wideElements = [];
    document.querySelectorAll('*').forEach(el => {
      if (el.offsetWidth > w) {
        wideElements.push({
          tag: el.tagName,
          id: el.id,
          cls: el.className,
          offsetWidth: el.offsetWidth,
          scrollWidth: el.scrollWidth,
          styleWidth: el.style.width,
          parent: el.parentElement ? `${el.parentElement.tagName}.${el.parentElement.className}` : null
        });
      }
    });

    return { windowWidth: w, bodyScrollWidth: bodyW, docScrollWidth: docW, wideElements };
  });

  console.log('DIAGNOSTIC REPORT:');
  console.log(JSON.stringify(info, null, 2));

  await browser.close();
  server.close();
  process.exit(0);
});
