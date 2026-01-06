# SonarQube Setup and Usage

This project is configured for static code analysis using SonarQube.

## Prerequisites

### Option 1: Local SonarQube Server (Recommended for Development)

1. **Install SonarQube using Docker:**
   ```bash
   docker run -d --name sonarqube -p 9000:9000 sonarqube:latest
   ```

2. **Access SonarQube:**
   - Open http://localhost:9000
   - Default credentials: admin/admin (you'll be prompted to change on first login)

3. **Create a Project:**
   - Click "Create Project" → "Manually"
   - Project key: `clicker-game-ui`
   - Display name: `Clicker Game UI`
   - Generate a token and save it

### Option 2: SonarCloud (Free for Public Repositories)

1. Go to https://sonarcloud.io/
2. Sign in with your GitHub account
3. Create a new project and get your token

## Configuration

### Set Environment Variables

Create a `.env` file in the project root (or set system environment variables):

```bash
# For local SonarQube
SONAR_HOST_URL=http://localhost:9000
SONAR_TOKEN=your-generated-token

# For SonarCloud
# SONAR_HOST_URL=https://sonarcloud.io
# SONAR_TOKEN=your-sonarcloud-token
# SONAR_ORGANIZATION=your-organization-key
```

**Note:** Add `.env` to `.gitignore` to keep tokens secret!

## Running Analysis

### Quick Analysis (Recommended)

Run the complete analysis pipeline:

```bash
npm run analyze
```

This command will:
1. Generate ESLint report
2. Run tests with coverage
3. Upload results to SonarQube

### Individual Commands

```bash
# Generate ESLint report only
npm run lint:report

# Run tests with coverage
npm run test:coverage

# Run SonarQube scanner (using Node.js script)
npm run sonar

# Run SonarQube scanner (using sonar-scanner CLI - requires separate installation)
npm run sonar:scan
```

## Configuration Files

- **sonar-project.properties**: Main configuration file for SonarQube
- **sonar-project.js**: Node.js script for running analysis programmatically

## What Gets Analyzed

- **Source code**: `src/` directory
- **Tests**: Files matching `**/*.test.ts`, `**/*.test.tsx`, `**/*.spec.ts`
- **Coverage**: Jest coverage reports from `coverage/lcov.info`
- **Linting**: ESLint issues from `eslint-report.json`

## Exclusions

The following are excluded from analysis:
- `node_modules/`
- `dist/` and `build/`
- `coverage/`
- `*.config.ts` and `*.config.js` files
- `public/`

## Viewing Results

After running the analysis:
1. Open your SonarQube server (http://localhost:9000 or SonarCloud)
2. Navigate to your project
3. View:
   - Code coverage
   - Code smells
   - Bugs
   - Security vulnerabilities
   - Technical debt
   - Duplications

## CI/CD Integration

To integrate with CI/CD pipelines, add the analysis step:

```yaml
# Example for GitHub Actions
- name: Run SonarQube Analysis
  env:
    SONAR_TOKEN: ${{ secrets.SONAR_TOKEN }}
    SONAR_HOST_URL: ${{ secrets.SONAR_HOST_URL }}
  run: npm run analyze
```

## Troubleshooting

### "Scanner not found" error
If you get errors running `npm run sonar:scan`, you need to install sonar-scanner CLI:

```bash
# macOS
brew install sonar-scanner

# Or use the Node.js version (already installed)
npm run sonar
```

### Coverage not showing
Make sure you run tests with coverage before analysis:
```bash
npm run test:coverage
npm run sonar
```

### Authentication errors
Ensure your `SONAR_TOKEN` environment variable is set correctly.

## Additional Resources

- [SonarQube Documentation](https://docs.sonarqube.org/)
- [SonarCloud Documentation](https://docs.sonarcloud.io/)
- [SonarQube Scanner for JavaScript/TypeScript](https://docs.sonarqube.org/latest/analysis/scan/sonarscanner-for-javascript/)

