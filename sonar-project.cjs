const scanner = require('sonarqube-scanner')

// Check if running in dry-run mode
const isDryRun = process.argv.includes('--dry-run') || !process.env.SONAR_TOKEN

if (isDryRun) {
  console.log('🔍 SonarQube Configuration:')
  console.log('  Server URL:', process.env.SONAR_HOST_URL || 'http://localhost:9000')
  console.log('  Project Key: clicker-game-ui')
  console.log('  Project Name: Clicker Game UI')
  console.log('  Sources: src')
  console.log('  Tests: src,e2e')
  console.log('')
  console.log('⚠️  No SONAR_TOKEN found in environment variables')
  console.log('')
  console.log('To run SonarQube analysis:')
  console.log('1. Start SonarQube server:')
  console.log('   docker run -d -p 9000:9000 sonarqube:latest')
  console.log('')
  console.log('2. Create a project and get a token from http://localhost:9000')
  console.log('')
  console.log('3. Set environment variables:')
  console.log('   export SONAR_HOST_URL=http://localhost:9000')
  console.log('   export SONAR_TOKEN=your-token-here')
  console.log('')
  console.log('4. Run: npm run analyze')
  console.log('')
  console.log('💡 For local analysis without a server: npm run analyze:local')
  process.exit(0)
}

console.log('🚀 Starting SonarQube analysis...')
console.log('   Server:', process.env.SONAR_HOST_URL || 'http://localhost:9000')

scanner.scan(
  {
    serverUrl: process.env.SONAR_HOST_URL || 'http://localhost:9000',
    token: process.env.SONAR_TOKEN,
    options: {
      'sonar.projectKey': 'clicker-game-ui',
      'sonar.projectName': 'Clicker Game UI',
      'sonar.projectVersion': '1.0.0',
      'sonar.sources': 'src',
      'sonar.tests': 'src,e2e',
      'sonar.test.inclusions': '**/*.test.ts,**/*.test.tsx,**/*.spec.ts',
      'sonar.exclusions': '**/node_modules/**,**/dist/**,**/build/**,**/coverage/**,**/*.config.ts,**/*.config.js,**/public/**,**/playwright-report/**,**/test-results/**,**/blob-report/**,**/.scannerwork/**',
      'sonar.typescript.lcov.reportPaths': 'coverage/lcov.info',
      'sonar.javascript.lcov.reportPaths': 'coverage/lcov.info',
      'sonar.testExecutionReportPaths': 'test-results/sonar-report.xml',
      'sonar.sourceEncoding': 'UTF-8',
      'sonar.eslint.reportPaths': 'eslint-report.json',
    },
  },
  (error) => {
    if (error) {
      console.error('\n❌ SonarQube analysis failed!')
      console.error('')

      if (error.code === 'ECONNREFUSED' || error.message?.includes('ECONNREFUSED')) {
        console.error('🔌 Cannot connect to SonarQube server')
        console.error('')
        console.error('Make sure SonarQube is running:')
        console.error('  docker run -d -p 9000:9000 sonarqube:latest')
        console.error('')
        console.error('Or use local analysis instead:')
        console.error('  npm run analyze:local')
      } else {
        console.error('Error:', error.message || error)
      }

      process.exit(1)
    }
    console.log('\n✅ SonarQube analysis complete!')
    console.log('   View results at:', process.env.SONAR_HOST_URL || 'http://localhost:9000')
  }
)

