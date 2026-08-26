#!/usr/bin/env python3
"""
==============================================================================
TMM 2027 • Python Responsiveness Test Suite
==============================================================================
Validates responsive HTML structure, viewport meta tags, container constraints,
flex/grid breakpoints, media queries, and runs the Node/Puppeteer multi-device test runner.
==============================================================================
"""

import os
import sys
import re
import json
import subprocess
import unittest

ROOT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
INDEX_HTML = os.path.join(ROOT_DIR, 'index.html')
SIMULATOR_HTML = os.path.join(ROOT_DIR, 'simulator.html')
STYLES_CSS = os.path.join(ROOT_DIR, 'styles.css')
TEST_RUNNER_JS = os.path.join(ROOT_DIR, 'tests', 'responsive_test.js')

class TestResponsivenessMetaAndStructure(unittest.TestCase):
    """Static and structural responsiveness assertions."""

    def test_viewport_meta_tags(self):
        """Ensure all HTML files declare correct viewport meta tag for mobile scaling."""
        for file_path in [INDEX_HTML, SIMULATOR_HTML]:
            self.assertTrue(os.path.exists(file_path), f"File missing: {file_path}")
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
            self.assertRegex(
                content,
                r'<meta\s+name=["\']viewport["\']\s+content=["\'][^"\']*width=device-width[^"\']*["\']',
                f"Missing or invalid viewport meta tag in {os.path.basename(file_path)}"
            )

    def test_css_media_queries_coverage(self):
        """Ensure CSS defines comprehensive media query breakpoints covering standard mobile, tablet, and desktop viewports."""
        self.assertTrue(os.path.exists(STYLES_CSS), f"File missing: {STYLES_CSS}")
        with open(STYLES_CSS, 'r', encoding='utf-8') as f:
            css = f.read()

        # Find all media queries
        media_queries = re.findall(r'@media[^{]+', css)
        self.assertGreater(len(media_queries), 5, "CSS should contain comprehensive media queries")

        # Verify key breakpoints exist
        breakpoints_to_check = ['max-width: 360px', 'max-width: 480px', 'max-width: 768px', 'max-width: 1100px']
        for bp in breakpoints_to_check:
            self.assertTrue(
                any(bp in mq for mq in media_queries),
                f"Missing essential breakpoint '{bp}' in styles.css"
            )

    def test_no_hardcoded_overflow_widening(self):
        """Ensure fixed overlay elements do not have width > 100vw or negative transforms causing layout inflation."""
        with open(STYLES_CSS, 'r', encoding='utf-8') as f:
            css = f.read()

        # Grain overlay should be constrained to 100vw/100vh
        grain_match = re.search(r'\.kold-grain-overlay\s*\{([^}]+)\}', css)
        if grain_match:
            props = grain_match.group(1)
            self.assertIn('overflow: hidden', props)
            self.assertNotIn('width: 200%', props)

    def test_run_headless_browser_matrix(self):
        """Executes the full 28-viewport Puppeteer headless test suite and verifies 100% pass rate."""
        self.assertTrue(os.path.exists(TEST_RUNNER_JS), f"Runner missing: {TEST_RUNNER_JS}")
        result = subprocess.run(
            [sys.executable.replace('python3', 'node') if 'node' in sys.executable else 'node', TEST_RUNNER_JS],
            cwd=ROOT_DIR,
            capture_output=True,
            text=True
        )
        print(result.stdout)
        if result.returncode != 0:
            print(result.stderr, file=sys.stderr)
        self.assertEqual(result.returncode, 0, "Headless responsive test suite encountered failures")

        # Verify generated JSON report
        report_json = os.path.join(ROOT_DIR, 'tests', 'responsiveness_report.json')
        self.assertTrue(os.path.exists(report_json), "responsiveness_report.json not generated")
        with open(report_json, 'r', encoding='utf-8') as f:
            report = json.load(f)

        self.assertEqual(report['failedTests'], 0, f"Expected 0 failed tests, got {report['failedTests']}")
        self.assertEqual(report['passRate'], '100%')

if __name__ == '__main__':
    unittest.main(verbosity=2)
