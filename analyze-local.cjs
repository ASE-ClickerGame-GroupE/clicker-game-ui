#!/usr/bin/env node

/**
 * Local Code Quality Analysis Script
 *
 * This script runs static analysis without requiring a SonarQube server.
 * It generates reports that can be viewed locally.
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔍 Running Code Quality Analysis...\n');

// 1. Run ESLint
console.log('📋 Step 1/3: Running ESLint...');
try {
  execSync('npm run lint:report', { stdio: 'inherit' });
  console.log('✅ ESLint analysis complete\n');
} catch (error) {
  console.warn('⚠️  ESLint found issues (see eslint-report.json)\n');
}

// 2. Run Tests with Coverage
console.log('🧪 Step 2/3: Running tests with coverage...');
try {
  execSync('npm run test:coverage', { stdio: 'inherit' });
  console.log('✅ Test coverage complete\n');
} catch (error) {
  console.warn('⚠️  Some tests failed (see coverage report)\n');
}

// 3. Generate Summary Report
console.log('📊 Step 3/3: Generating summary...\n');

const reports = {
  eslint: 'eslint-report.json',
  coverage: 'coverage/coverage-summary.json'
};

const summary = {
  timestamp: new Date().toISOString(),
  reports: {}
};

// Read ESLint report
if (fs.existsSync(reports.eslint)) {
  const eslintData = JSON.parse(fs.readFileSync(reports.eslint, 'utf8'));
  const totalFiles = eslintData.length;
  const totalErrors = eslintData.reduce((sum, file) => sum + file.errorCount, 0);
  const totalWarnings = eslintData.reduce((sum, file) => sum + file.warningCount, 0);

  summary.reports.eslint = {
    files: totalFiles,
    errors: totalErrors,
    warnings: totalWarnings
  };

  console.log('ESLint Results:');
  console.log(`  Files analyzed: ${totalFiles}`);
  console.log(`  Errors: ${totalErrors}`);
  console.log(`  Warnings: ${totalWarnings}`);
  console.log('');
}

// Read Coverage report
if (fs.existsSync(reports.coverage)) {
  const coverageData = JSON.parse(fs.readFileSync(reports.coverage, 'utf8'));
  const totals = coverageData.total;

  summary.reports.coverage = {
    lines: totals.lines.pct,
    statements: totals.statements.pct,
    functions: totals.functions.pct,
    branches: totals.branches.pct
  };

  console.log('Test Coverage:');
  console.log(`  Lines: ${totals.lines.pct}%`);
  console.log(`  Statements: ${totals.statements.pct}%`);
  console.log(`  Functions: ${totals.functions.pct}%`);
  console.log(`  Branches: ${totals.branches.pct}%`);
  console.log('');
}

// Save summary
const summaryPath = path.join(process.cwd(), 'analysis-summary.json');
fs.writeFileSync(summaryPath, JSON.stringify(summary, null, 2));

console.log('✨ Analysis complete!');
console.log('\n📁 Reports generated:');
console.log(`  - ESLint: ${reports.eslint}`);
console.log(`  - Coverage: coverage/lcov-report/index.html`);
console.log(`  - Summary: ${summaryPath}`);
console.log('\n💡 Tip: Open coverage/lcov-report/index.html in your browser to view detailed coverage');

// Check if SonarQube is available
console.log('\n🔗 SonarQube Integration:');
console.log('  To upload results to SonarQube, run: npm run sonar');
console.log('  See SONARQUBE.md for setup instructions');

