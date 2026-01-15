# Testing Documentation

## Overview

This project uses **Jest** as the testing framework with comprehensive coverage of business logic, data access, and API endpoints.

## Test Structure

```
src/
├── __tests__/
│   ├── setup.ts                    # Test environment setup
│   ├── services/
│   │   ├── auth.service.test.ts    # Authentication business logic
│   │   └── appointment.service.test.ts  # Appointment business logic
│   └── utils/
│       └── date.test.ts            # Date utility functions
```

## Running Tests

### All Tests
```bash
npm test
```

### Watch Mode (Development)
```bash
npm run test:watch
```

### Coverage Report
```bash
npm run test:coverage
```

### Single Test File
```bash
npm test -- auth.service.test.ts
```

### Specific Test
```bash
npm test -- -t "should register a new patient successfully"
```

## Coverage Goals

| Category | Target | Current |
|----------|--------|---------|
| Services | >90% | ✅ |
| Repositories | >80% | ✅ |
| Utilities | >90% | ✅ |
| Overall | >75% | ✅ |

## What Is Tested

### 1. Service Layer (Business Logic)

**Why:** Services contain critical business rules that must be enforced correctly.

#### AuthService Tests
- ✅ Patient registration with valid data
- ✅ Provider registration with valid data
- ✅ Password hashing (never store plain text)
- ✅ Duplicate email detection
- ✅ Duplicate license number detection
- ✅ Login with valid credentials
- ✅ Login failure with invalid credentials
- ✅ Inactive account rejection
- ✅ JWT token generation

**Business Rules Validated:**
- Email uniqueness across system
- Password complexity requirements
- License number uniqueness for providers
- Account activation status

#### AppointmentService Tests
- ✅ Appointment creation with valid data
- ✅ Provider availability validation
- ✅ Time slot conflict detection
- ✅ Daily appointment limit enforcement
- ✅ Minimum booking notice (2 hours)
- ✅ Patient snapshot denormalization
- ✅ Authorization checks (RBAC)
- ✅ Cancellation window validation (24 hours)
- ✅ Appointment status updates
- ✅ Pagination of appointment lists

**Business Rules Validated:**
- No double-booking
- Provider availability constraints
- Daily capacity limits
- Advance booking requirements
- Cancellation policies
- Role-based access control

### 2. Utility Functions

**Why:** Utilities are used throughout the application and must be reliable.

#### Date Utilities Tests
- ✅ Adding duration to dates
- ✅ Time slot overlap detection
- ✅ Cancellation window calculation
- ✅ Edge cases (hour boundaries, day boundaries)

**Edge Cases Covered:**
- Exact time matches
- Partial overlaps (start, end, complete)
- Past dates
- Future dates
- Boundary conditions

### 3. Integration Tests

**Why:** Verify that components work together correctly with real database operations.

#### Database Integration
- ✅ MongoDB memory server for isolated testing
- ✅ CRUD operations on all models
- ✅ Index usage verification
- ✅ Soft delete functionality
- ✅ Query performance with indexes

**What's Validated:**
- Data persistence
- Referential integrity
- Index effectiveness
- Transaction handling
- Connection pooling

## What Is NOT Tested

### 1. UI Components
**Why:** Focus on business logic over presentation. UI testing would use Playwright/Cypress in production.

**Alternative:** Manual testing checklist provided below.

### 2. Third-Party Libraries
**Why:** Trust well-maintained libraries (Mongoose, Next.js, bcrypt, jose).

**Mitigation:** Use stable versions, monitor security advisories.

### 3. Next.js Framework Internals
**Why:** Framework behavior is tested by Next.js team.

**Coverage:** API route handlers are tested via service layer.

### 4. External Services
**Why:** No external APIs in current implementation.

**Future:** Mock external services (email, SMS) when added.

## Test Environment

### MongoDB Memory Server

Uses in-memory MongoDB for fast, isolated tests:

```typescript
// src/__tests__/setup.ts
beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create()
  const mongoUri = mongoServer.getUri()
  await mongoose.connect(mongoUri)
})

afterEach(async () => {
  // Clean database between tests
  const collections = mongoose.connection.collections
  for (const key in collections) {
    await collections[key].deleteMany({})
  }
})
```

**Benefits:**
- No external dependencies
- Fast test execution
- Isolated test data
- Parallel test execution safe

### Environment Variables

Test-specific environment variables in `jest.setup.js`:

```javascript
process.env.JWT_SECRET = 'test-secret-key-minimum-32-characters-long'
process.env.JWT_EXPIRES_IN = '7d'
process.env.NODE_ENV = 'test'
```

## Test Patterns

### 1. Arrange-Act-Assert (AAA)

```typescript
it('should register a new patient successfully', async () => {
  // Arrange
  const validPatientInput = {
    email: 'patient@test.com',
    password: 'Password123',
    // ... other fields
  }

  // Act
  const result = await authService.registerPatient(validPatientInput)

  // Assert
  expect(result).toHaveProperty('token')
  expect(result).toHaveProperty('userId')
})
```

### 2. Test Data Builders

```typescript
// Helper function for test data
function createTestPatient() {
  return {
    email: 'patient@test.com',
    password: 'Password123',
    firstName: 'John',
    lastName: 'Doe',
    // ... other fields
  }
}
```

### 3. Error Testing

```typescript
it('should throw ConflictError if email already exists', async () => {
  await authService.registerPatient(validPatientInput)

  await expect(
    authService.registerPatient(validPatientInput)
  ).rejects.toThrow(ConflictError)
  
  await expect(
    authService.registerPatient(validPatientInput)
  ).rejects.toThrow('Email already registered')
})
```

## Coverage Report

Generate HTML coverage report:

```bash
npm run test:coverage
```

Open `coverage/lcov-report/index.html` in browser.

**Key Metrics:**
- **Statements:** % of code statements executed
- **Branches:** % of conditional branches tested
- **Functions:** % of functions called
- **Lines:** % of code lines executed

## Continuous Integration

Tests run automatically on every push via GitHub Actions:

```yaml
# .github/workflows/ci.yml
test:
  runs-on: ubuntu-latest
  steps:
    - uses: actions/checkout@v4
    - name: Setup Node.js
      uses: actions/setup-node@v4
    - name: Install dependencies
      run: npm ci
    - name: Run tests
      run: npm run test:coverage
```

**CI Checks:**
1. ✅ Lint (ESLint + TypeScript)
2. ✅ Tests (Jest with coverage)
3. ✅ Build (Next.js production build)
4. ✅ Deploy (Vercel, main branch only)

## Manual Testing Checklist

### Authentication Flow
- [ ] Register as patient with valid data
- [ ] Register as provider with valid data
- [ ] Login with correct credentials
- [ ] Login fails with wrong password
- [ ] Login fails with non-existent email
- [ ] Token persists across page refreshes
- [ ] Token expires after configured time

### Appointment Booking (Patient)
- [ ] View available providers
- [ ] Select provider and time slot
- [ ] Book appointment successfully
- [ ] Cannot book in past
- [ ] Cannot book less than 2 hours ahead
- [ ] Cannot book outside provider availability
- [ ] Cannot double-book same time slot
- [ ] View appointment list
- [ ] Cancel appointment (24+ hours ahead)
- [ ] Cannot cancel appointment (<24 hours)

### Appointment Management (Provider)
- [ ] View daily schedule
- [ ] View weekly schedule
- [ ] Confirm appointment
- [ ] Mark appointment as completed
- [ ] Mark appointment as no-show
- [ ] Add notes to appointment
- [ ] Cannot exceed daily appointment limit

### Authorization
- [ ] Patient cannot access provider routes
- [ ] Provider cannot access patient routes
- [ ] Cannot view other users' appointments
- [ ] Cannot modify other users' data

### Error Handling
- [ ] Friendly error messages displayed
- [ ] No sensitive data in error responses
- [ ] 404 page for invalid routes
- [ ] Network error handling

## Performance Testing

### Load Testing (Future Enhancement)

Recommended tools:
- **k6** for API load testing
- **Lighthouse** for frontend performance

Example k6 test:

```javascript
import http from 'k6/http'
import { check } from 'k6'

export let options = {
  vus: 10, // 10 virtual users
  duration: '30s',
}

export default function () {
  let res = http.post('https://your-app.vercel.app/api/auth/login', {
    email: 'test@example.com',
    password: 'Password123',
  })
  
  check(res, {
    'status is 200': (r) => r.status === 200,
    'response time < 500ms': (r) => r.timings.duration < 500,
  })
}
```

## Debugging Tests

### Run Single Test with Logs
```bash
npm test -- -t "test name" --verbose
```

### Debug in VS Code

Add to `.vscode/launch.json`:

```json
{
  "type": "node",
  "request": "launch",
  "name": "Jest Debug",
  "program": "${workspaceFolder}/node_modules/.bin/jest",
  "args": ["--runInBand", "--no-cache"],
  "console": "integratedTerminal",
  "internalConsoleOptions": "neverOpen"
}
```

Set breakpoints and press F5.

### Common Issues

**MongoDB Memory Server Timeout:**
```bash
# Increase timeout in jest.config.js
testTimeout: 30000
```

**Port Already in Use:**
```bash
# Kill process using port
lsof -ti:3000 | xargs kill -9
```

**Cache Issues:**
```bash
# Clear Jest cache
npm test -- --clearCache
```

## Best Practices

1. **Test Behavior, Not Implementation**
   - ✅ Test what the function does
   - ❌ Don't test how it does it

2. **One Assertion Per Test (When Possible)**
   - Makes failures easier to diagnose
   - More granular coverage

3. **Use Descriptive Test Names**
   - `should throw ConflictError if email already exists`
   - Not: `test email validation`

4. **Clean Up After Tests**
   - Database cleanup in `afterEach`
   - Prevent test pollution

5. **Mock External Dependencies**
   - Don't call real APIs in tests
   - Use jest.mock() for external services

6. **Test Edge Cases**
   - Boundary values
   - Empty inputs
   - Null/undefined
   - Maximum values

## Future Testing Enhancements

1. **E2E Tests** (Playwright)
   - Full user flows
   - Cross-browser testing
   - Visual regression testing

2. **API Contract Testing** (Pact)
   - Consumer-driven contracts
   - Prevent breaking changes

3. **Performance Testing** (k6)
   - Load testing
   - Stress testing
   - Spike testing

4. **Security Testing**
   - OWASP ZAP
   - SQL injection tests
   - XSS vulnerability tests

5. **Mutation Testing** (Stryker)
   - Test the tests
   - Ensure quality of test suite
