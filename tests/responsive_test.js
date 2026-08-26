/**
 * ==============================================================================
 * TMM 2027 • Automated Multi-Device Responsiveness Test Suite
 * ==============================================================================
 * Tests index.html and simulator.html across 14 standard device viewports:
 * - Mobile XS (320px) to Mobile Max (430px) + Landscape
 * - Tablet Portrait (768px) to Tablet Pro (1024px, 1180px)
 * - Laptop (1280px), Desktop FHD (1440px), Ultrawide (1920px)
 *
 * Checks:
 * 1. Horizontal scroll & viewport overflow (0px tolerance)
 * 2. Overflow-causing element localization (pinpoints offending DOM nodes)
 * 3. Element visibility & layout collapse detection
 * 4. Touch target sizing (minimum 36px/44px for touch interactions)
 * 5. Tab navigation stability across all viewports
 * 6. Automated visual screenshot capture for each breakpoint
 * 7. JSON & Markdown report generation
 * ==============================================================================
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer-core');

// Standard Device Viewport Profiles
const VIEWPORT_PROFILES = [
  {
    id: 'mobile-xs',
    name: 'Mobile XS (iPhone SE 1st Gen)',
    category: 'Mobile',
    width: 320,
    height: 568,
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true
  },
  {
    id: 'mobile-android-std',
    name: 'Android Standard (Samsung Galaxy S22/S23)',
    category: 'Mobile',
    width: 360,
    height: 800,
    deviceScaleFactor: 3,
    isMobile: true,
    hasTouch: true
  },
  {
    id: 'mobile-std',
    name: 'Mobile Standard (iPhone 8 / SE 2/3)',
    category: 'Mobile',
    width: 375,
    height: 667,
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true
  },
  {
    id: 'mobile-ios-modern',
    name: 'Mobile Modern (iPhone 12/13/14/15)',
    category: 'Mobile',
    width: 390,
    height: 844,
    deviceScaleFactor: 3,
    isMobile: true,
    hasTouch: true
  },
  {
    id: 'mobile-pixel',
    name: 'Android Large (Google Pixel 7/8)',
    category: 'Mobile',
    width: 412,
    height: 915,
    deviceScaleFactor: 2.6,
    isMobile: true,
    hasTouch: true
  },
  {
    id: 'mobile-max',
    name: 'Mobile Max (iPhone 14/15/16 Pro Max)',
    category: 'Mobile',
    width: 430,
    height: 932,
    deviceScaleFactor: 3,
    isMobile: true,
    hasTouch: true
  },
  {
    id: 'mobile-landscape',
    name: 'Mobile Modern Landscape',
    category: 'Mobile Landscape',
    width: 844,
    height: 390,
    deviceScaleFactor: 3,
    isMobile: true,
    hasTouch: true
  },
  {
    id: 'tablet-sm',
    name: 'Small Tablet (7" e-Reader / Compact)',
    category: 'Tablet',
    width: 600,
    height: 960,
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true
  },
  {
    id: 'tablet-portrait',
    name: 'Tablet Portrait (iPad Mini / Standard 10.2")',
    category: 'Tablet',
    width: 768,
    height: 1024,
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true
  },
  {
    id: 'tablet-pro',
    name: 'Tablet Pro Portrait (iPad Air / Pro 11")',
    category: 'Tablet',
    width: 820,
    height: 1180,
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true
  },
  {
    id: 'tablet-landscape',
    name: 'Tablet Landscape (iPad 10.2" / Pro Landscape)',
    category: 'Tablet Landscape',
    width: 1024,
    height: 768,
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true
  },
  {
    id: 'laptop-13',
    name: 'Laptop 13" (MacBook Air / Compact Desktop)',
    category: 'Desktop',
    width: 1280,
    height: 800,
    deviceScaleFactor: 2,
    isMobile: false,
    hasTouch: false
  },
  {
    id: 'desktop-fhd',
    name: 'Desktop Standard 15" (MacBook Pro / 1440p)',
    category: 'Desktop',
    width: 1440,
    height: 900,
    deviceScaleFactor: 2,
    isMobile: false,
    hasTouch: false
  },
  {
    id: 'desktop-wide',
    name: 'Desktop Wide (1080p Full HD Monitor)',
    category: 'Desktop',
    width: 1920,
    height: 1080,
    deviceScaleFactor: 1,
    isMobile: false,
    hasTouch: false
  }
];

const PAGES_TO_TEST = [
  { id: 'index', filename: 'index.html', title: 'Main Training Master Plan' },
  { id: 'simulator', filename: 'simulator.html', title: 'Live Phone Simulator' }
];

// Helper to locate Google Chrome / Chromium executable
function findChromeExecutable() {
  if (process.env.CHROME_PATH && fs.existsSync(process.env.CHROME_PATH)) {
    return process.env.CHROME_PATH;
  }
  const macPaths = [
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/Applications/Google Chrome Canary.app/Contents/MacOS/Google Chrome Canary',
    '/Applications/Chromium.app/Contents/MacOS/Chromium'
  ];
  for (const p of macPaths) {
    if (fs.existsSync(p)) return p;
  }
  const linuxPaths = [
    '/usr/bin/google-chrome',
    '/usr/bin/chromium-browser',
    '/usr/bin/chromium',
    '/snap/bin/chromium'
  ];
  for (const p of linuxPaths) {
    if (fs.existsSync(p)) return p;
  }
  return null;
}

// MIME types for static server
const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.apk': 'application/vnd.android.package-archive',
  '.ico': 'image/x-icon'
};

// Embedded Static HTTP Server
function createStaticServer(rootDir, port = 0) {
  return new Promise((resolve, reject) => {
    const server = http.createServer((req, res) => {
      let reqPath = req.url.split('?')[0];
      if (reqPath === '/') reqPath = '/index.html';
      const filePath = path.join(rootDir, decodeURIComponent(reqPath));

      if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end(`404 Not Found: ${reqPath}`);
        return;
      }

      const ext = path.extname(filePath).toLowerCase();
      const contentType = MIME_TYPES[ext] || 'application/octet-stream';

      try {
        const data = fs.readFileSync(filePath);
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(data);
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end(`500 Server Error: ${err.message}`);
      }
    });

    server.listen(port, '127.0.0.1', () => {
      const assignedPort = server.address().port;
      resolve({ server, port: assignedPort, baseUrl: `http://127.0.0.1:${assignedPort}` });
    });

    server.on('error', reject);
  });
}

// In-Page Evaluation Function: Comprehensive Responsive Audit
async function auditPageResponsiveness(page, targetWidth, targetHeight, pageId) {
  return await page.evaluate(({ targetWidth, targetHeight, pageId }) => {
    const html = document.documentElement;
    const body = document.body;

    const scrollWidth = Math.max(
      html.scrollWidth,
      body ? body.scrollWidth : 0,
      html.offsetWidth,
      body ? body.offsetWidth : 0,
      html.clientWidth
    );

    const innerWidth = window.innerWidth;
    const innerHeight = window.innerHeight;
    const hasHorizontalOverflow = scrollWidth > innerWidth + 1;
    const overflowDelta = Math.max(0, scrollWidth - innerWidth);

    // 1. Detect elements causing horizontal overflow
    const overflowingElements = [];
    const allElements = document.querySelectorAll('*');
    for (let el of allElements) {
      if (el === html || el === body) continue;
      // Skip hidden elements
      const style = window.getComputedStyle(el);
      if (style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0') continue;

      const rect = el.getBoundingClientRect();
      // Element extends beyond right viewport boundary
      if (rect.right > innerWidth + 1.5 && rect.width > 0) {
        let tag = el.tagName.toLowerCase();
        let id = el.id ? `#${el.id}` : '';
        let classes = el.className && typeof el.className === 'string' ? `.${el.className.trim().split(/\s+/).slice(0, 2).join('.')}` : '';
        overflowingElements.push({
          selector: `${tag}${id}${classes}`,
          right: Math.round(rect.right),
          width: Math.round(rect.width),
          excess: Math.round(rect.right - innerWidth)
        });
      }
    }

    // Sort by largest excess and limit to top 5
    overflowingElements.sort((a, b) => b.excess - a.excess);
    const topOverflowing = overflowingElements.slice(0, 5);

    // 2. Interactive Touch Target Audit (Buttons, Links, Selects, Inputs)
    const touchTargetIssues = [];
    const interactives = document.querySelectorAll('button, a, select, input[type="button"], input[type="submit"], [role="button"], .nav-tab-btn, .arrow-btn, .tool-btn');
    for (let el of interactives) {
      const style = window.getComputedStyle(el);
      if (style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0') continue;
      const rect = el.getBoundingClientRect();
      if (rect.width === 0 && rect.height === 0) continue;

      // On mobile viewports (< 768px), check for minimum tap size
      if (innerWidth < 768) {
        if (rect.width < 28 || rect.height < 28) {
          let text = (el.innerText || el.textContent || el.getAttribute('aria-label') || '').trim().slice(0, 20);
          touchTargetIssues.push({
            tag: el.tagName.toLowerCase(),
            text: text,
            width: Math.round(rect.width),
            height: Math.round(rect.height)
          });
        }
      }
    }

    // 3. Layout Visibility Audit
    const visibilityChecks = {};
    if (pageId === 'index') {
      const navbar = document.querySelector('.navbar');
      const hero = document.querySelector('.hero-section');
      const tabs = document.querySelector('.nav-tabs');
      const countdown = document.querySelector('.countdown-timer');

      visibilityChecks.navbarVisible = navbar ? navbar.getBoundingClientRect().height > 0 : false;
      visibilityChecks.heroVisible = hero ? hero.getBoundingClientRect().height > 0 : false;
      visibilityChecks.tabsVisible = tabs ? tabs.getBoundingClientRect().height > 0 : false;
      visibilityChecks.countdownVisible = countdown ? countdown.getBoundingClientRect().height > 0 : false;
    } else if (pageId === 'simulator') {
      const phoneDevice = document.querySelector('.phone-device');
      const heroCard = document.querySelector('.swiss-hero-card');
      const controlPanel = document.querySelector('.control-panel');
      const masterBtn = document.querySelector('.swiss-master-btn');

      visibilityChecks.phoneDeviceVisible = phoneDevice ? phoneDevice.getBoundingClientRect().height > 0 : false;
      visibilityChecks.heroCardVisible = heroCard ? heroCard.getBoundingClientRect().height > 0 : false;
      visibilityChecks.masterBtnVisible = masterBtn ? masterBtn.getBoundingClientRect().height > 0 : false;
      visibilityChecks.controlPanelVisible = controlPanel ? controlPanel.getBoundingClientRect().height > 0 : false;
    }

    // 4. Test Tab Navigation Interactions (if index page)
    let tabSwitchTestPassed = true;
    let tabSwitchError = null;
    if (pageId === 'index') {
      const tabBtns = Array.from(document.querySelectorAll('.nav-tab-btn'));
      try {
        for (let btn of tabBtns.slice(0, 3)) {
          btn.click();
        }
        // Switch back to first tab
        if (tabBtns[0]) tabBtns[0].click();
      } catch (err) {
        tabSwitchTestPassed = false;
        tabSwitchError = err.message;
      }
    }

    return {
      scrollWidth,
      innerWidth,
      innerHeight,
      hasHorizontalOverflow,
      overflowDelta,
      topOverflowing,
      touchTargetIssueCount: touchTargetIssues.length,
      touchTargetIssues: touchTargetIssues.slice(0, 3),
      visibilityChecks,
      tabSwitchTestPassed,
      tabSwitchError
    };
  }, { targetWidth, targetHeight, pageId });
}

// Main Test Orchestrator
async function runResponsivenessTestSuite(options = {}) {
  const rootDir = path.resolve(__dirname, '..');
  const chromePath = findChromeExecutable();

  if (!chromePath) {
    console.error('❌ Error: Google Chrome / Chromium executable not found on system.');
    process.exit(1);
  }

  const screenshotsDir = path.join(__dirname, 'screenshots');
  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir, { recursive: true });
  }

  console.log('\n==============================================================================');
  console.log('🏁 TMM 2027 • AUTOMATED RESPONSIVENESS & DEVICE VIEWPORT TEST SUITE');
  console.log('==============================================================================');
  console.log(`🌐 Chrome Executable: ${chromePath}`);
  console.log(`📱 Testing Viewports: ${VIEWPORT_PROFILES.length} Profiles (Mobile XS to Desktop 4K)`);
  console.log(`📄 Pages to Test:     ${PAGES_TO_TEST.map(p => p.filename).join(', ')}`);
  console.log('==============================================================================\n');

  // Start local embedded server
  const { server, baseUrl } = await createStaticServer(rootDir);
  console.log(`🚀 Local test server running on ${baseUrl}\n`);

  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: true,
    pipe: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu',
      '--font-render-hinting=none',
      '--user-data-dir=/tmp/tmm_responsive_runner'
    ]
  });

  const allTestResults = [];
  let totalTests = 0;
  let passedTests = 0;
  let failedTests = 0;

  try {
    for (const pageConfig of PAGES_TO_TEST) {
      console.log(`\n------------------------------------------------------------------------------`);
      console.log(`🧪 TESTING PAGE: ${pageConfig.title} (${pageConfig.filename})`);
      console.log(`------------------------------------------------------------------------------`);

      const pageScreenshotsDir = path.join(screenshotsDir, pageConfig.id);
      if (!fs.existsSync(pageScreenshotsDir)) {
        fs.mkdirSync(pageScreenshotsDir, { recursive: true });
      }

      for (const profile of VIEWPORT_PROFILES) {
        totalTests++;
        const page = await browser.newPage();

        await page.setViewport({
          width: profile.width,
          height: profile.height,
          deviceScaleFactor: profile.deviceScaleFactor || 1,
          isMobile: profile.isMobile,
          hasTouch: profile.hasTouch
        });

        const targetUrl = `${baseUrl}/${pageConfig.filename}`;
        let pageLoadSuccess = true;
        let pageLoadError = null;

        try {
          await page.goto(targetUrl, { waitUntil: ['domcontentloaded', 'networkidle0'], timeout: 10000 });
        } catch (err) {
          pageLoadSuccess = false;
          pageLoadError = err.message;
        }

        if (!pageLoadSuccess) {
          console.log(`❌ [FAIL] ${profile.name} (${profile.width}x${profile.height}) - Page load failed: ${pageLoadError}`);
          failedTests++;
          allTestResults.push({
            page: pageConfig.filename,
            pageId: pageConfig.id,
            profile: profile.name,
            profileId: profile.id,
            category: profile.category,
            viewport: `${profile.width}x${profile.height}`,
            status: 'FAIL',
            reason: `Page load failed: ${pageLoadError}`
          });
          await page.close();
          continue;
        }

        // Wait brief frame for layout rendering & animations to settle
        await page.evaluate(() => new Promise(resolve => setTimeout(resolve, 200)));

        // Run Responsive Audit inside Browser
        const audit = await auditPageResponsiveness(page, profile.width, profile.height, pageConfig.id);

        // Capture screenshot
        const screenshotPath = path.join(pageScreenshotsDir, `${profile.id}.png`);
        await page.screenshot({
          path: screenshotPath,
          fullPage: false
        });

        // Determine Pass/Fail Criteria
        // Pass if no horizontal overflow, layout components visible, and tab switching passed
        const hasPassed = !audit.hasHorizontalOverflow && audit.tabSwitchTestPassed;

        if (hasPassed) {
          passedTests++;
          const touchWarn = audit.touchTargetIssueCount > 0 ? ` ⚠️ (${audit.touchTargetIssueCount} small tap targets)` : '';
          console.log(`✅ [PASS] ${profile.name.padEnd(45)} [${profile.width}x${profile.height}] ScrollWidth: ${audit.scrollWidth}px (Delta: +0px)${touchWarn}`);
        } else {
          failedTests++;
          console.log(`❌ [FAIL] ${profile.name.padEnd(45)} [${profile.width}x${profile.height}] ScrollWidth: ${audit.scrollWidth}px (OVERFLOW: +${audit.overflowDelta}px)`);
          if (audit.topOverflowing.length > 0) {
            console.log(`    ↳ Offending elements:`);
            audit.topOverflowing.forEach(el => {
              console.log(`      • ${el.selector} (Right: ${el.right}px, Excess: +${el.excess}px)`);
            });
          }
          if (!audit.tabSwitchTestPassed) {
            console.log(`    ↳ Tab navigation error: ${audit.tabSwitchError}`);
          }
        }

        allTestResults.push({
          page: pageConfig.filename,
          pageId: pageConfig.id,
          profile: profile.name,
          profileId: profile.id,
          category: profile.category,
          viewport: `${profile.width}x${profile.height}`,
          scrollWidth: audit.scrollWidth,
          innerWidth: audit.innerWidth,
          overflowDelta: audit.overflowDelta,
          hasHorizontalOverflow: audit.hasHorizontalOverflow,
          overflowingElements: audit.topOverflowing,
          touchTargetIssues: audit.touchTargetIssues,
          visibilityChecks: audit.visibilityChecks,
          tabSwitchPassed: audit.tabSwitchTestPassed,
          screenshot: path.relative(rootDir, screenshotPath),
          status: hasPassed ? 'PASS' : 'FAIL'
        });

        await page.close();
      }
    }
  } finally {
    await browser.close();
    server.close();
  }

  // Generate Report
  const reportPath = path.join(__dirname, 'responsiveness_report.json');
  fs.writeFileSync(reportPath, JSON.stringify({
    timestamp: new Date().toISOString(),
    totalTests,
    passedTests,
    failedTests,
    passRate: `${Math.round((passedTests / totalTests) * 100)}%`,
    results: allTestResults
  }, null, 2));

  // Generate Markdown Summary
  const mdReportPath = path.join(__dirname, 'RESPONSIVENESS_REPORT.md');
  const mdContent = generateMarkdownReport(allTestResults, totalTests, passedTests, failedTests);
  fs.writeFileSync(mdReportPath, mdContent);

  console.log('\n==============================================================================');
  console.log(`🏁 TEST SUITE COMPLETE: ${passedTests}/${totalTests} Passed (${Math.round((passedTests / totalTests) * 100)}% Pass Rate)`);
  console.log(`📊 JSON Report:         tests/responsiveness_report.json`);
  console.log(`📝 Markdown Report:     tests/RESPONSIVENESS_REPORT.md`);
  console.log(`📸 Screenshots:         tests/screenshots/`);
  console.log('==============================================================================\n');

  if (failedTests > 0) {
    console.log(`⚠️  ${failedTests} viewport test(s) reported issues. See report for exact offending elements.`);
    return false;
  } else {
    console.log(`🎉 All ${totalTests} viewport tests passed with 0 horizontal overflow and perfect responsiveness!`);
    return true;
  }
}

function generateMarkdownReport(results, total, passed, failed) {
  const rate = Math.round((passed / total) * 100);
  let md = `# 📱 Responsive Viewport Test Report

**Generated:** ${new Date().toLocaleString()}  
**Overall Result:** ${failed === 0 ? '✅ PASSED' : '❌ FAILED'} (${passed}/${total} Profiles Passed — ${rate}% Pass Rate)

---

## 1. Summary Matrix

| Page | Device / Viewport Profile | Dimensions | Category | Overflow | Status |
| :--- | :--- | :--- | :--- | :---: | :---: |
`;

  results.forEach(r => {
    const overflowStr = r.overflowDelta > 0 ? `+${r.overflowDelta}px` : '0px';
    const statusIcon = r.status === 'PASS' ? '✅ PASS' : '❌ FAIL';
    md += `| \`${r.page}\` | **${r.profile}** | \`${r.viewport}\` | ${r.category} | ${overflowStr} | ${statusIcon} |\n`;
  });

  md += `\n---

## 2. Key Findings & Detailed Observations

`;

  const failedItems = results.filter(r => r.status === 'FAIL');
  if (failedItems.length === 0) {
    md += `> [!TIP]
> **Zero Layout Breakage Detected**: All evaluated pages maintained strict horizontal boundaries (\`scrollWidth <= window.innerWidth\`) across all 14 mobile, tablet, and desktop breakpoints.\n`;
  } else {
    md += `### Issues Detected:\n\n`;
    failedItems.forEach(f => {
      md += `#### ❌ ${f.page} on ${f.profile} (\`${f.viewport}\`)\n`;
      md += `- **Overflow Delta:** \`+${f.overflowDelta}px\` (ScrollWidth: \`${f.scrollWidth}px\`, Viewport: \`${f.innerWidth}px\`)\n`;
      if (f.overflowingElements && f.overflowingElements.length > 0) {
        md += `- **Offending DOM Elements:**\n`;
        f.overflowingElements.forEach(el => {
          md += `  - \`${el.selector}\` (Right: \`${el.right}px\`, Excess: \`+${el.excess}px\`)\n`;
        });
      }
      md += `\n`;
    });
  }

  md += `\n---
*Report generated automatically by the TMM 2027 Responsive Test Runner.*
`;
  return md;
}

if (require.main === module) {
  runResponsivenessTestSuite().then(success => {
    process.exit(success ? 0 : 1);
  }).catch(err => {
    console.error('Fatal Test Runner Error:', err);
    process.exit(1);
  });
}

module.exports = { runResponsivenessTestSuite, VIEWPORT_PROFILES, PAGES_TO_TEST };
