# Static Code Analysis - Quick Start Guide

SonarQube has been successfully added to your project! 🎉

## Quick Start - Local Analysis (No Setup Required)

Run this command to analyze your code **without** needing a SonarQube server:

```bash
npm run analyze:local
```

This will:
- ✅ Run ESLint and generate a report
- ✅ Run tests with coverage
- ✅ Create a summary of code quality metrics
- ✅ Output results in the terminal

### View Reports

After running `npm run analyze:local`, open these files:

1. **Coverage Report** (Visual): `coverage/lcov-report/index.html`
2. **ESLint Report** (JSON): `eslint-report.json`
3. **Summary** (JSON): `analysis-summary.json`

---

## Full SonarQube Integration (Requires Setup)

For complete analysis with advanced features, you can use a SonarQube server.

### Option 1: Quick Docker Setup (Recommended)

```bash
# Start SonarQube server
docker run -d --name sonarqube -p 9000:9000 sonarqube:latest

# Wait ~2 minutes for startup, then open http://localhost:9000
# Login with: admin/admin (change password on first login)

# Create project and generate token in SonarQube UI

# Set environment variables
export SONAR_HOST_URL=http://localhost:9000
export SONAR_TOKEN=your-generated-token

# Run analysis
npm run analyze
```

### Option 2: SonarCloud (Free for Public Repos)

```bash
# Go to https://sonarcloud.io and create project
# Get your token from SonarCloud

# Set environment variables
export SONAR_HOST_URL=https://sonarcloud.io
export SONAR_TOKEN=your-sonarcloud-token
export SONAR_ORGANIZATION=your-org-key

# Run analysis
npm run analyze
```

---

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run analyze:local` | **Local analysis** (no server required) - Recommended for quick checks |
| `npm run analyze` | **Full analysis** with SonarQube upload (requires server setup) |
| `npm run lint:report` | Generate ESLint report only |
| `npm run test:coverage` | Run tests with coverage only |
| `npm run sonar` | Upload to SonarQube (requires configuration) |

---

## What Gets Analyzed

- **Code Quality**: ESLint rules, code smells, complexity
- **Test Coverage**: Lines, statements, functions, branches
- **Security**: Potential vulnerabilities
- **Duplications**: Copy-pasted code
- **Bugs**: Potential runtime errors

---

## Files Generated

| File | Description |
|------|-------------|
| `eslint-report.json` | ESLint issues in JSON format |
| `analysis-summary.json` | Quick summary of metrics |
| `coverage/` | Full test coverage reports |
| `.scannerwork/` | SonarQube scanner cache (when using full analysis) |

**Note**: These files are git-ignored automatically.

---

## Detailed Documentation

For complete setup instructions, troubleshooting, and CI/CD integration:

📖 **See [SONARQUBE.md](./SONARQUBE.md)**

---

## Example Output

```bash
$ npm run analyze:local

🔍 Running Code Quality Analysis...

📋 Step 1/3: Running ESLint...
✅ ESLint analysis complete

🧪 Step 2/3: Running tests with coverage...
✅ Test coverage complete

📊 Step 3/3: Generating summary...

ESLint Results:
  Files analyzed: 87
  Errors: 0
  Warnings: 3

Test Coverage:
  Lines: 84.5%
  Statements: 83.2%
  Functions: 79.1%
  Branches: 71.8%

✨ Analysis complete!

📁 Reports generated:
  - ESLint: eslint-report.json
  - Coverage: coverage/lcov-report/index.html
  - Summary: analysis-summary.json

💡 Tip: Open coverage/lcov-report/index.html in your browser
```

---

## Tips

1. **Run before committing**: Add `npm run analyze:local` to your workflow
2. **Check coverage**: Aim for >80% coverage on critical code
3. **Fix ESLint warnings**: Zero warnings = cleaner code
4. **CI Integration**: Add analysis to your GitHub Actions/GitLab CI

---

## Need Help?

- Issues with setup? Check [SONARQUBE.md](./SONARQUBE.md)
- Questions about metrics? See [SonarQube docs](https://docs.sonarqube.org/)
- Want to improve? Start with the eslint-report.json and coverage report

