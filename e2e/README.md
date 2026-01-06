# E2E Tests

This directory contains end-to-end tests for the Clicker Game application.

## Test Credentials

Test user credentials are stored in `test-credentials.ts`:

- **Username**: denys_test
- **Password**: qweqwe123123
- **Email**: denys_test@example.com

**Note**: These are test credentials only. Do not use real user credentials in tests.

## Test Files

### `auth.spec.ts`
Tests authentication functionality:
- ✅ Login with valid credentials
- ✅ Login validation (invalid credentials, empty fields, short password)
- ✅ Navigation between login and register pages
- ✅ Register form validation
- ✅ Logout functionality

### `api.results.spec.ts`
Tests game results fetching and display:
- ✅ Display results for authenticated users
- ✅ Empty state when no results exist
- ✅ Game type indicators (Singleplayer/Multiplayer)
- ✅ Results sorting by score

### `leaderboards.spec.ts`
Tests leaderboards functionality:
- ✅ Display leaderboards page
- ✅ Tab switching (Total Score / Best Single Run)
- ✅ Table structure and columns
- ✅ User highlighting when logged in
- ✅ Accessible without authentication
- ✅ Navigation from header

### `game.spec.ts`
Gameplay tests removed as requested. This file is kept for potential future use.

## Running Tests

### Run all E2E tests:
```bash
npm run test:e2e
```

### Run specific test file:
```bash
npx playwright test e2e/auth.spec.ts
```

### Run tests in headed mode (see browser):
```bash
npx playwright test --headed
```

### Run tests in debug mode:
```bash
npx playwright test --debug
```

## Test Setup

Before running tests, ensure:
1. The development server is running on `http://localhost:5173`
2. The backend API is accessible
3. The test user exists in the database

## CI/CD

Tests are configured to run in CI environments. The Playwright config automatically detects CI mode and adjusts settings accordingly.

