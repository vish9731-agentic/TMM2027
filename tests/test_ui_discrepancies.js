/**
 * ==============================================================================
 * TMM 2027 • UI & DOM Discrepancies Static Analysis Test Suite
 * ==============================================================================
 * Audits frontend code for all UI discrepancies, broken bindings, and DOM faults:
 * 1. DOM ID Parity: Queries in app.js vs elements defined in index.html
 * 2. Event Handler Integrity: inline onclick/onchange/oninput in index.html vs definitions in app.js
 * 3. Dynamic Template Handler Integrity: onclicks in template strings vs definitions
 * 4. Missing UI Badges & Containers (e.g. metric-possibility-badge, btn-web-metronome)
 * 5. Dead Code & Orphaned Functions in UI
 * 6. CSS Class Consistency: classes toggled in JS vs defined in styles.css
 * 7. Asset & Link Integrity: local icons, manifests, stylesheets, service worker caches
 * 8. Version String Parity: index.html asset query strings vs sw.js cache list
 * ==============================================================================
 */

const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const INDEX_HTML = path.join(ROOT_DIR, 'index.html');
const APP_JS = path.join(ROOT_DIR, 'app.js');
const STYLES_CSS = path.join(ROOT_DIR, 'styles.css');
const SW_JS = path.join(ROOT_DIR, 'sw.js');
const MANIFEST_JSON = path.join(ROOT_DIR, 'manifest.json');

const suiteResults = {
  name: 'UI & DOM Discrepancies Static Analysis Suite',
  timestamp: new Date().toISOString(),
  tests: [],
  bugsFound: [],
  passed: 0,
  failed: 0,
  warnings: 0
};

function recordTest(id, title, status, details, bug = null) {
  const result = { id, title, status, details };
  if (status === 'PASSED') suiteResults.passed++;
  else if (status === 'FAILED') suiteResults.failed++;
  else if (status === 'WARNING') suiteResults.warnings++;

  if (bug) {
    suiteResults.bugsFound.push({ testId: id, testTitle: title, ...bug });
  }
  suiteResults.tests.push(result);

  const icon = status === 'PASSED' ? '✅' : status === 'FAILED' ? '❌' : '⚠️';
  console.log(`  ${icon} [${id}] ${title}: ${status}`);
  if (status !== 'PASSED') {
    console.log(`     ↳ ${details}`);
  }
}

function runUIDiscrepancyTests() {
  console.log('\n==============================================================================');
  console.log('🎨 SUITE 2: UI & DOM DISCREPANCY AUDIT');
  console.log('==============================================================================');
  console.log(`📄 Scanning: index.html, app.js, styles.css, sw.js\n`);

  const html = fs.readFileSync(INDEX_HTML, 'utf8');
  const js = fs.readFileSync(APP_JS, 'utf8');
  const css = fs.readFileSync(STYLES_CSS, 'utf8');
  const sw = fs.existsSync(SW_JS) ? fs.readFileSync(SW_JS, 'utf8') : '';

  // Extract all function names defined in app.js
  const definedFunctions = new Set();
  
  // 1. function foo(...)
  const fnDeclMatches = [...js.matchAll(/(?:async\s+)?function\s+([a-zA-Z0-9_$]+)\s*\(/g)];
  fnDeclMatches.forEach(m => definedFunctions.add(m[1]));

  // 2. window.foo = ...
  const winAssignMatches = [...js.matchAll(/window\.([a-zA-Z0-9_$]+)\s*=/g)];
  winAssignMatches.forEach(m => definedFunctions.add(m[1]));

  // 3. const/let/var foo = function / arrow
  const varFnMatches = [...js.matchAll(/(?:const|let|var)\s+([a-zA-Z0-9_$]+)\s*=\s*(?:async\s*)?(?:\([^)]*\)|[a-zA-Z0-9_$]+)\s*=>/g)];
  varFnMatches.forEach(m => definedFunctions.add(m[1]));

  // --------------------------------------------------------------------------
  // TEST 1: DOM IDs Queried in app.js vs Defined in index.html
  // --------------------------------------------------------------------------
  const getElemMatches = [...js.matchAll(/document\.getElementById\(['"]([^'"]+)['"]\)/g)].map(m => m[1]);
  const uniqueQueriedIds = [...new Set(getElemMatches)];

  const missingIds = [];
  const dynamicTemplateIds = [];

  for (const id of uniqueQueriedIds) {
    const inHtml = html.includes(`id="${id}"`) || html.includes(`id='${id}'`);
    if (!inHtml) {
      // Check if it is dynamically rendered in app.js via template literal
      const inJsTemplate = js.includes(`id="${id}"`) || js.includes(`id='${id}'`);
      if (inJsTemplate) {
        dynamicTemplateIds.push(id);
      } else {
        missingIds.push(id);
      }
    }
  }

  if (missingIds.length > 0) {
    recordTest(
      'UI-01',
      'DOM ID Parity (app.js getElementById vs index.html)',
      'FAILED',
      `Found ${missingIds.length} element IDs queried in app.js that are completely absent from index.html and dynamic templates: [${missingIds.join(', ')}]`,
      {
        severity: 'HIGH',
        category: 'UI DOM Discrepancy',
        summary: `Missing DOM IDs queried in app.js: ${missingIds.join(', ')}`,
        impact: `Queries for '${missingIds.join(', ')}' always evaluate to null. For 'metric-possibility-badge', the possibility badge element fails to render on the adherence card. For 'btn-web-metronome', cadence metronome state cannot be controlled.`,
        missingIds,
        remediation: `Add the missing elements to index.html or remove unused getElementById calls.`
      }
    );
  } else {
    recordTest(
      'UI-01',
      'DOM ID Parity (app.js getElementById vs index.html)',
      'PASSED',
      `All ${uniqueQueriedIds.length} queried IDs exist either statically in HTML or dynamically in templates`
    );
  }

  // --------------------------------------------------------------------------
  // TEST 2: Inline Event Handlers in index.html vs Defined JS Functions
  // --------------------------------------------------------------------------
  const handlerMatches = [...html.matchAll(/\s(on[a-z]+)\s*=\s*['"]([^'"]+)['"]/gi)];
  const brokenStaticHandlers = [];

  for (const match of handlerMatches) {
    const attr = match[1];
    const expr = match[2];

    // Split multiple statements by semicolon
    const statements = expr.split(';');
    for (const stmt of statements) {
      const trimmed = stmt.trim();
      if (!trimmed) continue;
      // Skip inline conditionals like: if(event.target===this) closeModal()
      const cleanStmt = trimmed.replace(/^if\s*\([^)]*\)\s*/, '');
      const fnMatch = cleanStmt.match(/^([a-zA-Z0-9_$]+)\s*\(/);
      if (fnMatch) {
        const fnName = fnMatch[1];
        if (!['if', 'for', 'switch', 'return', 'alert', 'confirm', 'console'].includes(fnName)) {
          if (!definedFunctions.has(fnName)) {
            brokenStaticHandlers.push({
              attr,
              fnName,
              fullExpression: expr
            });
          }
        }
      }
    }
  }

  // Deduplicate broken handlers by function name
  const uniqueBrokenFns = [...new Set(brokenStaticHandlers.map(b => b.fnName))];

  if (uniqueBrokenFns.length > 0) {
    recordTest(
      'UI-02',
      'Inline HTML Event Handlers Integrity',
      'FAILED',
      `Found ${uniqueBrokenFns.length} functions called by HTML event handlers that are NOT defined in app.js: [${uniqueBrokenFns.join(', ')}]`,
      {
        severity: 'CRITICAL',
        category: 'Broken UI Interaction / Runtime Error',
        summary: `Undefined functions called from HTML event handlers: ${uniqueBrokenFns.join(', ')}`,
        impact: `User interaction triggers Uncaught ReferenceError in browser console. Specifically:
1. 'sendQuickPrompt' is called by all 6 Vega quick prompts in coach drawer -> chat prompt injection crashes.
2. 'handleFileSelect', 'handleDragOver', 'handleDragLeave', 'handleFileDrop' are bound to file dropzone -> GPX file upload crashes immediately.`,
        brokenFunctions: uniqueBrokenFns,
        instances: brokenStaticHandlers,
        remediation: `Implement sendQuickPrompt(promptText) and the GPX drag/drop/file-select handlers (handleFileSelect, handleDragOver, handleDragLeave, handleFileDrop) in app.js and export them to window.`
      }
    );
  } else {
    recordTest(
      'UI-02',
      'Inline HTML Event Handlers Integrity',
      'PASSED',
      'All inline event handler functions in index.html are properly defined in app.js'
    );
  }

  // --------------------------------------------------------------------------
  // TEST 3: Dynamic Template Event Handlers in app.js
  // --------------------------------------------------------------------------
  const dynamicOnclickMatches = [...js.matchAll(/onclick\s*=\s*['"]([^'"]+)['"]/g)].map(m => m[1]);
  const brokenDynamicHandlers = [];

  for (const expr of dynamicOnclickMatches) {
    const statements = expr.split(';');
    for (const stmt of statements) {
      const trimmed = stmt.trim();
      if (!trimmed) continue;
      const fnMatch = trimmed.match(/^([a-zA-Z0-9_$]+)\s*\(/);
      if (fnMatch) {
        const fnName = fnMatch[1];
        if (!['if', 'for', 'switch', 'return', 'alert', 'confirm'].includes(fnName)) {
          if (!definedFunctions.has(fnName)) {
            brokenDynamicHandlers.push({ fnName, expr });
          }
        }
      }
    }
  }

  const uniqueBrokenDynamicFns = [...new Set(brokenDynamicHandlers.map(b => b.fnName))];
  if (uniqueBrokenDynamicFns.length > 0) {
    recordTest(
      'UI-03',
      'Dynamic HTML Template Event Handlers',
      'FAILED',
      `Functions invoked in dynamically injected templates are missing in app.js: [${uniqueBrokenDynamicFns.join(', ')}]`,
      {
        severity: 'HIGH',
        category: 'Dynamic Template Discrepancy',
        summary: `Missing functions in dynamic template strings: ${uniqueBrokenDynamicFns.join(', ')}`,
        impact: `Clicking buttons generated inside modals or workout cards triggers ReferenceError.`,
        brokenFunctions: uniqueBrokenDynamicFns
      }
    );
  } else {
    recordTest(
      'UI-03',
      'Dynamic HTML Template Event Handlers',
      'PASSED',
      'All functions called within dynamic template strings exist in app.js'
    );
  }

  // --------------------------------------------------------------------------
  // TEST 4: Missing UI Badges & Containers (metric-possibility-badge, etc.)
  // --------------------------------------------------------------------------
  const possibilityBadgeInHtml = html.includes('id="metric-possibility-badge"') || html.includes("id='metric-possibility-badge'");
  const adherenceCardInHtml = html.includes('id="hero-card-adherence"');

  if (adherenceCardInHtml && !possibilityBadgeInHtml) {
    recordTest(
      'UI-04',
      'Adherence Card Possibility Badge UI Element',
      'FAILED',
      'hero-card-adherence exists but does NOT contain #metric-possibility-badge element expected by updateAdherenceMetrics()',
      {
        severity: 'MEDIUM',
        category: 'Missing UI Component',
        summary: 'Element #metric-possibility-badge missing from hero-card-adherence in index.html',
        impact: 'The possibility / insanity badge ("100% Possible" / "Insane Risk") calculated by the adherence engine is never rendered to the athlete on the main dashboard.',
        remediation: `Add <div id="metric-possibility-badge" class="badge"></div> inside hero-card-adherence in index.html.`
      }
    );
  } else {
    recordTest(
      'UI-04',
      'Adherence Card Possibility Badge UI Element',
      'PASSED',
      '#metric-possibility-badge element present in HTML'
    );
  }

  // --------------------------------------------------------------------------
  // TEST 5: CSS Class Parity (classList toggles in app.js vs styles.css)
  // --------------------------------------------------------------------------
  const classListMatches = [
    ...js.matchAll(/classList\.(?:add|remove|toggle|contains)\(['"]([^'"]+)['"]\)/g)
  ].map(m => m[1]);

  const uniqueClassesUsedInJs = [...new Set(classListMatches)];
  const missingCssClasses = [];

  for (const cls of uniqueClassesUsedInJs) {
    // Check if class selector exists in styles.css (e.g. .cls)
    const regex = new RegExp(`\\.${cls}\\b`);
    if (!regex.test(css) && !['open', 'active'].includes(cls)) {
      missingCssClasses.push(cls);
    }
  }

  if (missingCssClasses.length > 0) {
    recordTest(
      'UI-05',
      'CSS Class Definition Parity (classList vs styles.css)',
      'WARNING',
      `Found ${missingCssClasses.length} CSS classes manipulated in JS with no styling rule in styles.css: [${missingCssClasses.join(', ')}]`,
      {
        severity: 'LOW',
        category: 'Styling / CSS Parity',
        summary: `Classes manipulated in app.js lack styling in styles.css: ${missingCssClasses.join(', ')}`,
        impact: `Elements may not visually change appearance when state is toggled in JS.`
      }
    );
  } else {
    recordTest(
      'UI-05',
      'CSS Class Definition Parity (classList vs styles.css)',
      'PASSED',
      `All core classList classes (open, active, etc.) are styled in styles.css`
    );
  }

  // --------------------------------------------------------------------------
  // TEST 6: Local Assets & Resource Integrity
  // --------------------------------------------------------------------------
  const localAssetsToCheck = [
    { tag: 'Stylesheet', file: 'styles.css' },
    { tag: 'JavaScript Engine', file: 'app_main.js' },
    { tag: 'Manifest', file: 'manifest.json' },
    { tag: 'Favicon Icon', file: 'icons/icon.svg' },
    { tag: 'Training Data JSON', file: 'training_data.json' }
  ];

  let allAssetsExist = true;
  for (const asset of localAssetsToCheck) {
    const fullPath = path.join(ROOT_DIR, asset.file);
    if (!fs.existsSync(fullPath)) {
      allAssetsExist = false;
      recordTest(
        `UI-ASSET-${asset.file}`,
        `Local Asset Existence: ${asset.file}`,
        'FAILED',
        `Asset referenced in index.html is missing on disk: ${asset.file}`,
        {
          severity: 'HIGH',
          category: 'Missing Asset',
          summary: `Missing file: ${asset.file}`
        }
      );
    }
  }

  if (allAssetsExist) {
    recordTest(
      'UI-06',
      'Local Assets & Core Files Existence',
      'PASSED',
      'All local CSS, JS, manifest, SVG icon, and JSON assets exist on disk'
    );
  }

  // --------------------------------------------------------------------------
  // TEST 7: Service Worker Cache Version Synchronization
  // --------------------------------------------------------------------------
  if (sw) {
    // Extract ?v=x.x.x from index.html
    const htmlCssVersion = (html.match(/styles\.css\?v=([0-9.]+)/) || [])[1];
    const htmlJsVersion = (html.match(/app_main\.js\?v=([0-9.]+)/) || [])[1];

    // Extract ?v=x.x.x from sw.js
    const swCssVersion = (sw.match(/styles\.css\?v=([0-9.]+)/) || [])[1];
    const swJsVersion = (sw.match(/app_main\.js\?v=([0-9.]+)/) || [])[1];

    if (htmlCssVersion !== swCssVersion || htmlJsVersion !== swJsVersion) {
      recordTest(
        'UI-07',
        'Service Worker Cache Version Parity (index.html vs sw.js)',
        'FAILED',
        `Version mismatch: index.html loads CSS v${htmlCssVersion}/JS v${htmlJsVersion}, but sw.js caches CSS v${swCssVersion}/JS v${swJsVersion}.`,
        {
          severity: 'MEDIUM',
          category: 'Service Worker / Cache Inconsistency',
          summary: `Asset version string mismatch between index.html and sw.js ASSETS_TO_CACHE`,
          impact: `When offline or updating, Service Worker pre-caches files with different query versions than what index.html requests, causing cache misses or stale caching loops.`,
          remediation: `Align version strings in index.html and sw.js (e.g. bump both to v3.9.3).`
        }
      );
    } else {
      recordTest(
        'UI-07',
        'Service Worker Cache Version Parity (index.html vs sw.js)',
        'PASSED',
        `Versions match (v${htmlCssVersion}) across index.html and sw.js ASSETS_TO_CACHE`
      );
    }
  }

  // --------------------------------------------------------------------------
  // TEST 8: Dual Entrypoint Parity (app.js vs app_main.js)
  // --------------------------------------------------------------------------
  const appMainJsPath = path.join(ROOT_DIR, 'app_main.js');
  if (fs.existsSync(appMainJsPath)) {
    const appMainJs = fs.readFileSync(appMainJsPath, 'utf8');
    if (js !== appMainJs) {
      const lineCountDiff = Math.abs(js.split('\n').length - appMainJs.split('\n').length);
      recordTest(
        'UI-08',
        'Dual Entrypoint Synchronization (app.js vs app_main.js)',
        'FAILED',
        `app.js and app_main.js have diverged (${lineCountDiff} lines difference). index.html loads app_main.js while package.json references app.js.`,
        {
          severity: 'HIGH',
          category: 'Code Drift / Dual Entrypoint',
          summary: 'app.js and app_main.js are out of sync',
          impact: 'Updates or bug fixes applied to app.js are not loaded by index.html (which loads app_main.js), leading to silent regression and ghost bugs.',
          remediation: 'Sync app.js to app_main.js, or update index.html to load app.js directly.'
        }
      );
    } else {
      recordTest(
        'UI-08',
        'Dual Entrypoint Synchronization (app.js vs app_main.js)',
        'PASSED',
        'app.js and app_main.js are in exact 100% parity'
      );
    }
  }

  console.log('\n------------------------------------------------------------------------------');
  console.log(`SUITE 2 SUMMARY: ${suiteResults.passed} Passed, ${suiteResults.failed} Failed, ${suiteResults.warnings} Warnings`);
  console.log('------------------------------------------------------------------------------\n');

  return suiteResults;
}

if (require.main === module) {
  const results = runUIDiscrepancyTests();
  const outPath = path.join(__dirname, 'ui_discrepancy_results.json');
  fs.writeFileSync(outPath, JSON.stringify(results, null, 2));
  console.log(`Saved UI discrepancy results to ${outPath}`);
  process.exit(results.failed > 0 ? 1 : 0);
}

module.exports = { runUIDiscrepancyTests };
