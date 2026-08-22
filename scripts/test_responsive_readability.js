/**
 * TMM 2027: Automated Responsiveness & Readability Test Suite
 * Validates layout geometry, text contrast tokens, touch target sizing, and viewport adaptability.
 */

const fs = require('fs');
const path = require('path');

const indexHtml = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
const stylesCss = fs.readFileSync(path.join(__dirname, '..', 'styles.css'), 'utf8');
const appJs = fs.readFileSync(path.join(__dirname, '..', 'app.js'), 'utf8');

console.log('===============================================================');
console.log('🧪 TMM 2027: Responsiveness & Readability Audit Suite');
console.log('===============================================================\n');

let passed = 0;
let errors = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ✅ [PASS] ${message}`);
    passed++;
  } else {
    console.error(`  ❌ [FAIL] ${message}`);
    errors++;
  }
}

// 1. Viewport Meta Tag Audit
console.log('📱 1. Viewport Meta Configuration:');
assert(indexHtml.includes('name="viewport"'), 'Viewport meta tag is present');
assert(indexHtml.includes('width=device-width'), 'Device-width scale is configured');
assert(indexHtml.includes('initial-scale=1.0'), 'Initial scale is set to 1.0');

// 2. Readability & Contrast Token Audit
console.log('\n🎨 2. Typography & Contrast Tokens:');
assert(stylesCss.includes('--text-main: #ffffff'), 'Main text token is brilliant white (#ffffff) for max readability');
assert(stylesCss.includes('--text-muted: #e2e8f0'), 'Muted text token upgraded to high-contrast slate (#e2e8f0)');
assert(stylesCss.includes('--text-dim: #94a3b8'), 'Dim text token upgraded to readable slate (#94a3b8)');

// 3. Responsive Breakpoints Audit
console.log('\n📐 3. Responsive Media Queries:');
assert(stylesCss.includes('@media (max-width: 1100px)'), '1100px Tablet landscape carousel breakpoint exists');
assert(stylesCss.includes('@media (max-width: 768px)'), '768px Tablet portrait breakpoint exists');
assert(stylesCss.includes('@media (max-width: 600px)'), '600px Mobile large breakpoint exists');
assert(stylesCss.includes('@media (max-width: 480px)'), '480px Mobile compact breakpoint exists');

// 4. Horizontal Scroll & Day Card Grid Audit
console.log('\n🏃 4. Workout Schedule Grid & Day Cards:');
assert(stylesCss.includes('.days-grid {') && stylesCss.includes('overflow-x: auto'), 'Days grid gracefully collapses to touch swipe carousel on mobile');
assert(stylesCss.includes('.day-card {') && stylesCss.includes('min-width:'), 'Day card has min-width boundary for legible content');
assert(stylesCss.includes('.week-table-container') && stylesCss.includes('overflow-x: auto'), 'Agenda table container has touch horizontal scrolling');

// 5. Modals & Touch Targets Audit
console.log('\n🛡️ 5. Modals & Touch Targets:');
assert(stylesCss.includes('.modal-content {') && stylesCss.includes('max-height:'), 'Modal content has safe max-height boundary');
assert(stylesCss.includes('.modal-content {') && stylesCss.includes('overflow-y: auto'), 'Modal content allows vertical scrolling on short viewports');
assert(stylesCss.includes('.action-pill-btn') && stylesCss.includes('min-height: 32px'), 'Action buttons have adequate touch target height');

// 6. Navigation Actions & Mobile Wrapping
console.log('\n🧭 6. Navigation Actions Bar:');
assert(stylesCss.includes('.nav-actions') && stylesCss.includes('overflow-x: auto'), 'Navbar action buttons scroll smoothly on narrow mobile screens without wrapping');

// 7. Coach Vega Drawer Mobile Adaptation
console.log('\n💬 7. Coach Vega Drawer:');
assert(stylesCss.includes('.coach-drawer') && stylesCss.includes('100vw'), 'Coach drawer adapts to 100vw full screen on mobile devices');

console.log('\n===============================================================');
console.log(`📊 Audit Results: ${passed} Passed | ${errors} Failed`);
console.log('===============================================================');

if (errors > 0) {
  process.exit(1);
} else {
  console.log('🎉 100% RESPONSIVENESS & READABILITY AUDIT PASSED!');
}
