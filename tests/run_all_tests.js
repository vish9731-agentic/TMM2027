/**
 * ==============================================================================
 * TMM 2027 • Master Test Runner & Comprehensive Bug Detection Orchestrator
 * ==============================================================================
 * Sequentially executes:
 * 1. Suite 1: Supabase Schema & Database Parity Test Suite (test_supabase_schema.js)
 * 2. Suite 2: UI & DOM Discrepancies Static Analyzer (test_ui_discrepancies.js)
 * 3. Suite 3: Browser E2E Functional & Interactive UI Suite (test_ui_functional.js)
 *
 * Produces:
 * - Aggregated test execution metrics (Total, Passed, Failed, Warnings)
 * - Machine-readable JSON artifact: tests/test_results.json
 * - Comprehensive Markdown Bug Report: tests/BUG_REPORT.md
 * ==============================================================================
 */

const fs = require('fs');
const path = require('path');

const { runSupabaseSchemaTests } = require('./test_supabase_schema');
const { runUIDiscrepancyTests } = require('./test_ui_discrepancies');
const { runUIFunctionalTests } = require('./test_ui_functional');

const ROOT_DIR = path.resolve(__dirname, '..');
const REPORT_MD_PATH = path.join(__dirname, 'BUG_REPORT.md');
const RESULTS_JSON_PATH = path.join(__dirname, 'test_results.json');

async function runAllTests() {
  const startTime = Date.now();
  console.log('\n==============================================================================');
  console.log('🏆 TMM 2027 • MASTER TEST RUNNER & AUTOMATED BUG AUDIT');
  console.log('==============================================================================');
  console.log(`⏱️  Started At: ${new Date().toLocaleString()}`);
  console.log(`📁 Workspace:  ${ROOT_DIR}\n`);

  // Execute Suite 1
  let suite1 = null;
  try {
    suite1 = await runSupabaseSchemaTests();
  } catch (e) {
    console.error('❌ Error executing Suite 1 (Supabase Schema):', e);
    suite1 = { name: 'Supabase Schema Suite', passed: 0, failed: 1, warnings: 0, tests: [], bugsFound: [{
      severity: 'CRITICAL',
      category: 'Runner Error',
      summary: `Suite 1 failed to execute: ${e.message}`
    }] };
  }

  // Execute Suite 2
  let suite2 = null;
  try {
    suite2 = runUIDiscrepancyTests();
  } catch (e) {
    console.error('❌ Error executing Suite 2 (UI Discrepancies):', e);
    suite2 = { name: 'UI Discrepancies Suite', passed: 0, failed: 1, warnings: 0, tests: [], bugsFound: [{
      severity: 'CRITICAL',
      category: 'Runner Error',
      summary: `Suite 2 failed to execute: ${e.message}`
    }] };
  }

  // Execute Suite 3
  let suite3 = null;
  try {
    suite3 = await runUIFunctionalTests();
  } catch (e) {
    console.error('❌ Error executing Suite 3 (Browser Functional):', e);
    suite3 = { name: 'Browser Functional Suite', passed: 0, failed: 1, warnings: 0, tests: [], bugsFound: [{
      severity: 'CRITICAL',
      category: 'Runner Error',
      summary: `Suite 3 failed to execute: ${e.message}`
    }] };
  }

  const durationSec = ((Date.now() - startTime) / 1000).toFixed(2);

  // Aggregate results
  const totalPassed = suite1.passed + suite2.passed + suite3.passed;
  const totalFailed = suite1.failed + suite2.failed + suite3.failed;
  const totalWarnings = suite1.warnings + suite2.warnings + suite3.warnings;
  const totalTests = totalPassed + totalFailed + totalWarnings;

  // Deduplicate and aggregate bugs
  const allBugs = [
    ...(suite1.bugsFound || []),
    ...(suite2.bugsFound || []),
    ...(suite3.bugsFound || [])
  ];

  const aggregatedResults = {
    summary: {
      timestamp: new Date().toISOString(),
      durationSeconds: parseFloat(durationSec),
      totalTests,
      passed: totalPassed,
      failed: totalFailed,
      warnings: totalWarnings,
      totalBugsFound: allBugs.length,
      overallStatus: totalFailed === 0 ? 'PASSED' : 'BUGS_DETECTED'
    },
    suites: [suite1, suite2, suite3],
    bugs: allBugs
  };

  // Write JSON artifact
  fs.writeFileSync(RESULTS_JSON_PATH, JSON.stringify(aggregatedResults, null, 2));

  // Generate Markdown Bug Report
  generateMarkdownReport(aggregatedResults, REPORT_MD_PATH);

  // Print Executive Summary
  console.log('\n==============================================================================');
  console.log('📊 MASTER TEST EXECUTION SUMMARY');
  console.log('==============================================================================');
  console.log(`⏱️  Duration:     ${durationSec}s`);
  console.log(`🧪 Total Tests:  ${totalTests}`);
  console.log(`✅ Passed:       ${totalPassed}`);
  console.log(`❌ Failed:       ${totalFailed}`);
  console.log(`⚠️  Warnings:     ${totalWarnings}`);
  console.log(`🐛 Total Bugs:   ${allBugs.length}`);
  console.log('==============================================================================\n');

  if (allBugs.length > 0) {
    console.log('🚨 DISCOVERED BUGS & DISCREPANCIES (GROUPED BY SEVERITY):\n');
    const severities = ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'];
    severities.forEach(sev => {
      const bugsOfSev = allBugs.filter(b => b.severity === sev);
      if (bugsOfSev.length > 0) {
        console.log(`[${sev}] (${bugsOfSev.length} bug${bugsOfSev.length > 1 ? 's' : ''}):`);
        bugsOfSev.forEach((b, idx) => {
          console.log(`  ${idx + 1}. [${b.category || 'General'}] ${b.summary || b.testTitle}`);
          if (b.impact) console.log(`     Impact: ${b.impact.slice(0, 120)}${b.impact.length > 120 ? '...' : ''}`);
        });
        console.log('');
      }
    });
  }

  console.log(`📄 Comprehensive Bug Report saved to: ${REPORT_MD_PATH}`);
  console.log(`📦 Machine-readable JSON saved to:     ${RESULTS_JSON_PATH}\n`);

  return aggregatedResults;
}

function generateMarkdownReport(results, outputPath) {
  const s = results.summary;
  const bugs = results.bugs;

  const criticalBugs = bugs.filter(b => b.severity === 'CRITICAL');
  const highBugs = bugs.filter(b => b.severity === 'HIGH');
  const mediumBugs = bugs.filter(b => b.severity === 'MEDIUM');
  const lowBugs = bugs.filter(b => b.severity === 'LOW');

  let md = `# 🐞 TMM 2027 Automated Test & Bug Detection Report

**Executed:** ${new Date(s.timestamp).toLocaleString()}  
**Overall Result:** ${s.overallStatus === 'PASSED' ? '✅ ALL TESTS PASSED' : '❌ BUGS DETECTED'}  
**Execution Duration:** ${s.durationSeconds}s  
**Test Matrix:** ${s.passed} Passed / ${s.failed} Failed / ${s.warnings} Warnings (${s.totalTests} Total Tests)  
**Total Discrepancies & Bugs Found:** ${s.totalBugsFound}

---

## 1. Executive Summary

| Category | Suite Name | Tests Passed | Tests Failed | Warnings | Status |
| :--- | :--- | :---: | :---: | :---: | :---: |
| **Supabase Database** | Supabase Schema & Database Parity | ${results.suites[0].passed} | ${results.suites[0].failed} | ${results.suites[0].warnings} | ${results.suites[0].failed === 0 ? '✅ Pass' : '❌ Fail'} |
| **UI & DOM Analysis** | UI & DOM Discrepancies Static Audit | ${results.suites[1].passed} | ${results.suites[1].failed} | ${results.suites[1].warnings} | ${results.suites[1].failed === 0 ? '✅ Pass' : '❌ Fail'} |
| **Browser Functional** | Puppeteer End-to-End Interactive E2E | ${results.suites[2].passed} | ${results.suites[2].failed} | ${results.suites[2].warnings} | ${results.suites[2].failed === 0 ? '✅ Pass' : '❌ Fail'} |
| **TOTAL** | **All 3 Suites** | **${s.passed}** | **${s.failed}** | **${s.warnings}** | **${s.overallStatus}** |

---

## 2. Bug Classification by Severity

| Severity Level | Count | Primary Impact |
| :--- | :---: | :--- |
| 🔴 **CRITICAL** | **${criticalBugs.length}** | Application crashes on user interaction, data loss on Supabase sync, missing DB columns on write |
| 🟠 **HIGH** | **${highBugs.length}** | Broken features (drag-and-drop GPX upload, missing DOM elements, write rejections) |
| 🟡 **MEDIUM** | **${mediumBugs.length}** | Mathematical planned km inconsistencies, phase boundary misalignments, unauthenticated writes |
| 🔵 **LOW** | **${lowBugs.length}** | Missing optional keys, incomplete reference table seeds |

---

## 3. Detailed Bug Log & Discrepancies

`;

  bugs.forEach((b, i) => {
    const sevBadge = b.severity === 'CRITICAL' ? '🔴 CRITICAL' :
      b.severity === 'HIGH' ? '🟠 HIGH' :
      b.severity === 'MEDIUM' ? '🟡 MEDIUM' : '🔵 LOW';

    md += `### Bug #${i + 1}: ${b.summary || b.testTitle}\n\n`;
    md += `- **Severity:** \`${sevBadge}\`\n`;
    md += `- **Category:** ${b.category || 'Discrepancy'}\n`;
    md += `- **Associated Test:** \`[${b.testId}] ${b.testTitle}\`\n`;
    if (b.impact) {
      md += `- **Athlete / User Impact:**\n  > ${b.impact}\n`;
    }
    if (b.remediation) {
      md += `- **Remediation / Fix Guidance:**\n  \`\`\`sql\n  ${b.remediation}\n  \`\`\`\n`;
    }
    md += `\n---\n\n`;
  });

  md += `## 4. Test Suite Execution Breakdown\n\n`;
  results.suites.forEach((suite, idx) => {
    md += `### Suite ${idx + 1}: ${suite.name}\n\n`;
    md += `| Test ID | Assertion / Specification | Result | Details |\n`;
    md += `| :--- | :--- | :---: | :--- |\n`;
    suite.tests.forEach(t => {
      const statusIcon = t.status === 'PASSED' ? '✅ PASS' : t.status === 'FAILED' ? '❌ FAIL' : '⚠️ WARN';
      md += `| \`${t.id}\` | **${t.title}** | ${statusIcon} | ${t.details} |\n`;
    });
    md += `\n`;
  });

  md += `\n*Report automatically generated by TMM 2027 Automated Test Suite on ${new Date().toISOString()}*\n`;

  fs.writeFileSync(outputPath, md);
}

if (require.main === module) {
  runAllTests().then((results) => {
    process.exit(results.summary.failed > 0 ? 1 : 0);
  });
}

module.exports = { runAllTests };
