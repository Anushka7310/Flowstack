# Project File Structure

Complete guide to the Healthcare Appointment Management System file organization.

## 📁 Root Directory

```
healthcare-appointment-system/
├── .github/                    # GitHub configuration
│   └── workflows/
│       └── ci.yml             # CI/CD pipeline
├── src/                       # Source code
├── coverage/                  # Test coverage reports (generated)
├── node_modules/              # Dependencies (generated)
├── .next/                     # Next.js build output (generated)
├── .env.example               # Environment variables template
├── .env.local                 # Local environment (gitignored)
├── .eslintrc.json            # ESLint configuration
├── .gitignore                # Git ignore rules
├── jest.config.js            # Jest configuration
├── jest.setup.js             # Jest setup file
├── next.config.js            # Next.js configuration
├── package.json              # Dependencies and scripts
├── postcss.config.js         # PostCSS configuration
├── tailwind.config.ts        # Tailwind CSS configuration
├── tsconfig.json             # TypeScript configuration
├── README.md                 # Project overview
├── QUICKSTART.md             # Quick start guide
├── API_DOCUMENTATION.md      # API reference
├── ARCHITECTURE.md           # Architecture decisions
├── TESTING.md                # Testing documentation
├── DEPLOYMENT.md             # Deployment guide
├── SECURITY.md               # Security considerations
├── PROJECT_SUMMARY.md        # Executive summary
└── FILE_STRUCTURE.md         # This file
```

## 📂 Source Directory (`src/`)

### Overview

```
src/
├── app/                      # Next.js App Router
├── components/               # React components
├── lib/                      # Core libraries and utilities
├── models/                   # Mongoose models
├── repositories/             # Data access layer
├── services/                 # Business logic layer
├── validators/               # Zod validation schemas
├── types/                    # TypeScript type definitions
└── __tests__/               # Test files
```

## 🎯 App Directory (`src/app/`)

Next.js App Router structure with route groups and API routes.

```
src/app/
├── api/                      # API Routes
│   ├── auth/
│   │   ├── login/
│   │   │   └── route.ts     # POST /api/auth/login
│   │   └── register/
│   │       ├── patient/
│   │       │   └── route.ts # POST /api/auth/register/patient
│   │       └── provider/
│   │           └── route.ts # POST /api/auth/register/provider
│   ├── appointments/
│   │   ├── route.ts         # GET/POST /api/appointments
│   │   └── [id]/
│   │       └── route.ts     # GET/PATCH/DELETE /api/appointments/:id
│   └── providers/
│       ├── route.ts         # GET /api/providers
│       └── [id]/
│           └── route.ts     # GET/PATCH /api/providers/:id
├── (auth)/                   # Auth route group (shared layout)
│   ├── login/
│   │   └── page.tsx         # Login page
│   └── register/
│       └── page.tsx         # Registration page
├── (dashboard)/              # Protected route group
│   ├── appointments/
│   │   ├── page.tsx         # Appointments list
│   │   ├── new/
│   │   │   └── page.tsx     # Book appointment
│   │   └── [id]/
│   │       └── page.tsx     # Appointment details
│   ├── providers/
│   │   ├── page.tsx         # Provider directory
│   │   └── [id]/
│   │       └── page.tsx     # Provider profile
│   └── layout.tsx           # Dashboard layout
├── globals.css              # Global styles
├── layout.tsx               # Root layout
└── page.tsx                 # Home page
```

### API Route Patterns

**Authentication:**
- `POST /api/auth/login` - User login
- `POST /api/auth/register/patient` - Patient registration
- `POST /api/auth/register/provider` - Provider registration

**Appointments:**
- `GET /api/appointments` - List appointments (filtered by user role)
- `POST /api/appointments` - Create appointment (patient only)
- `GET /api/appointments/:id` - Get appointment details
- `PATCH /api/appointments/:id` - Update appointment
- `DELETE /api/appointments/:id` - Cancel appointment

**Providers:**
- `GET /api/providers` - List providers
- `GET /api/providers/:id` - Get provider details
- `PATCH /api/providers/:id` - Update provider (provider only)

## 🧩 Components (`src/components/`)

React components organized by feature and type.

```
src/components/
├── ui/                       # Base UI components (shadcn/ui)
│   ├── button.tsx
│   ├── card.tsx
│   ├── input.tsx
│   ├── select.tsx
│   └── ...
├── features/                 # Feature-specific components
│   ├── appointments/
│   │   ├── AppointmentCard.tsx
│   │   ├── AppointmentList.tsx
│   │   ├── BookingForm.tsx
│   │   └── Calendar.tsx
│   ├── providers/
│   │   ├── ProviderCard.tsx
│   │   ├── ProviderList.tsx
│   │   └── AvailabilityEditor.tsx
│   └── auth/
│       ├── LoginForm.tsx
│       └── RegisterForm.tsx
├── layout/                   # Layout components
│   ├── Header.tsx
│   ├── Sidebar.tsx
│   └── Footer.tsx
└── shared/                   # Shared components
    ├── LoadingSpinner.tsx
    ├── ErrorBoundary.tsx
    └── EmptyState.tsx
```

## 📚 Library (`src/lib/`)

Core utilities, helpers, and configurations.

```
src/lib/
├── auth/                     # Authentication utilities
│   ├── jwt.ts               # JWT token generation/verification
│   └── password.ts          # Password hashing/comparison
├── db/                       # Database utilities
│   └── connection.ts        # MongoDB connection management
├── middleware/               # Middleware functions
│   └── auth.middleware.ts   # Authentication/authorization middleware
└── utils/                    # Helper utilities
    ├── cn.ts                # Class name utility (clsx + tailwind-merge)
    ├── date.ts              # Date manipulation utilities
    └── errors.ts            # Custom error classes
```

### Key Files

**`lib/auth/jwt.ts`**
- `signToken()` - Generate JWT token
- `verifyToken()` - Verify and decode JWT token

**`lib/auth/password.ts`**
- `hashPassword()` - Hash password with bcrypt
- `comparePassword()` - Compare password with hash

**`lib/db/connection.ts`**
- `connectDB()` - Connect to MongoDB with connection pooling
- `disconnectDB()` - Disconnect from MongoDB

**`lib/utils/date.ts`**
- `addDuration()` - Add minutes to date
- `isTimeSlotAvailable()` - Check for appointment conflicts
- `isWithinCancellationWindow()` - Validate cancellation timing

**`lib/utils/errors.ts`**
- `AppError` - Base error class
- `ValidationError` - 400 errors
- `UnauthorizedError` - 401 errors
- `ForbiddenError` - 403 errors
- `NotFoundError` - 404 errors
- `ConflictError` - 409 errors
- `handleError()` - Error handler with masking

## 🗄️ Models (`src/models/`)

Mongoose schema definitions with indexes and validation.

```
src/models/
├── User.ts                   # Base user model
├── Patient.ts                # Patient model (extends User)
├── Provider.ts               # Provider model (extends User)
├── Appointment.ts            # Appointment model
└── MedicalRecord.ts          # Medical record model
```

### Model Features

**All Models:**
- TypeScript interfaces
- Mongoose schemas
- Indexes for performance
- Soft delete support
- Timestamps (createdAt, updatedAt)

**User.ts:**
- Base user fields (email, password, role, name, phone)
- Email uniqueness index
- Password excluded from queries by default

**Patient.ts:**
- Patient-specific fields (dateOfBirth, address)
- Embedded emergency contact
- Optional insurance info

**Provider.ts:**
- Provider-specific fields (specialty, licenseNumber)
- Embedded availability schedule
- Daily appointment limit

**Appointment.ts:**
- References to Patient and Provider
- Denormalized patient snapshot
- Status tracking
- Compound indexes for queries

**MedicalRecord.ts:**
- References to Patient, Provider, Appointment
- Diagnosis and treatment fields
- Access control ready

## 🔄 Repositories (`src/repositories/`)

Data access layer with optimized queries.

```
src/repositories/
├── patient.repository.ts     # Patient data access
├── provider.repository.ts    # Provider data access
└── appointment.repository.ts # Appointment data access
```

### Repository Pattern

Each repository provides:
- `create()` - Create new document
- `findById()` - Find by ID
- `findByEmail()` - Find by email (users)
- `findAll()` - List with pagination
- `update()` - Update document
- `softDelete()` - Soft delete
- `count()` - Count documents

**Appointment Repository Extras:**
- `findByPatient()` - Patient's appointments
- `findByProvider()` - Provider's appointments
- `findConflictingAppointments()` - Conflict detection
- `countByProviderAndDate()` - Daily appointment count

## 🎯 Services (`src/services/`)

Business logic layer with validation and orchestration.

```
src/services/
├── auth.service.ts           # Authentication logic
└── appointment.service.ts    # Appointment logic
```

### Service Responsibilities

**AuthService:**
- `registerPatient()` - Patient registration with validation
- `registerProvider()` - Provider registration with validation
- `login()` - Authentication with role detection

**AppointmentService:**
- `createAppointment()` - Create with business rule validation
- `getAppointmentById()` - Get with authorization check
- `getPatientAppointments()` - Patient's appointment list
- `getProviderAppointments()` - Provider's appointment list
- `updateAppointment()` - Update with authorization
- `cancelAppointment()` - Cancel with policy enforcement

### Business Rules Enforced

1. No double-booking
2. Minimum 2-hour advance booking
3. Provider availability validation
4. Daily appointment limit
5. 24-hour cancellation policy (patients)
6. Role-based authorization

## ✅ Validators (`src/validators/`)

Zod schemas for runtime validation.

```
src/validators/
├── auth.validator.ts         # Authentication schemas
├── appointment.validator.ts  # Appointment schemas
└── provider.validator.ts     # Provider schemas
```

### Validation Schemas

**auth.validator.ts:**
- `loginSchema` - Email and password
- `registerPatientSchema` - Patient registration
- `registerProviderSchema` - Provider registration

**appointment.validator.ts:**
- `createAppointmentSchema` - Appointment creation
- `updateAppointmentSchema` - Appointment updates
- `cancelAppointmentSchema` - Cancellation
- `getAppointmentsQuerySchema` - Query parameters

**provider.validator.ts:**
- `availabilitySchema` - Availability slot
- `updateProviderAvailabilitySchema` - Availability updates
- `updateProviderSchema` - Provider updates

## 📝 Types (`src/types/`)

TypeScript type definitions and interfaces.

```
src/types/
└── index.ts                  # All type definitions
```

### Type Categories

**Enums:**
- `UserRole` - admin, provider, patient
- `AppointmentStatus` - scheduled, confirmed, completed, cancelled, no_show
- `ProviderSpecialty` - general_practice, cardiology, etc.

**Interfaces:**
- `IUser` - Base user interface
- `IPatient` - Patient interface
- `IProvider` - Provider interface
- `IAppointment` - Appointment interface
- `IMedicalRecord` - Medical record interface
- `IAvailability` - Availability slot interface

**API Types:**
- `ApiResponse<T>` - Standard API response
- `PaginatedResponse<T>` - Paginated list response
- `JWTPayload` - JWT token payload

## 🧪 Tests (`src/__tests__/`)

Test files organized by layer.

```
src/__tests__/
├── setup.ts                  # Test environment setup
├── services/
│   ├── auth.service.test.ts
│   └── appointment.service.test.ts
└── utils/
    └── date.test.ts
```

### Test Structure

**setup.ts:**
- MongoDB Memory Server initialization
- Database cleanup between tests
- Test environment variables

**Service Tests:**
- Business logic validation
- Error handling
- Authorization checks
- Integration with repositories

**Utility Tests:**
- Pure function testing
- Edge case coverage
- Performance validation

## 📄 Configuration Files

### TypeScript (`tsconfig.json`)

```json
{
  "compilerOptions": {
    "strict": true,              // Strict type checking
    "noUnusedLocals": true,      // Error on unused variables
    "noUnusedParameters": true,  // Error on unused parameters
    "paths": {
      "@/*": ["./src/*"]         // Path alias
    }
  }
}
```

### Jest (`jest.config.js`)

```javascript
{
  testEnvironment: 'node',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1'
  },
  coverageThresholds: {
    global: {
      branches: 75,
      functions: 75,
      lines: 75,
      statements: 75
    }
  }
}
```

### Next.js (`next.config.js`)

```javascript
{
  reactStrictMode: true,
  poweredByHeader: false,
  headers: [/* Security headers */]
}
```

### Tailwind (`tailwind.config.ts`)

```typescript
{
  content: [
    './src/app/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {/* Custom theme */}
  }
}
```

## 🔍 Finding Files

### By Feature

**Authentication:**
- API: `src/app/api/auth/`
- Service: `src/services/auth.service.ts`
- Validators: `src/validators/auth.validator.ts`
- Tests: `src/__tests__/services/auth.service.test.ts`

**Appointments:**
- API: `src/app/api/appointments/`
- Service: `src/services/appointment.service.ts`
- Repository: `src/repositories/appointment.repository.ts`
- Model: `src/models/Appointment.ts`
- Validators: `src/validators/appointment.validator.ts`
- Tests: `src/__tests__/services/appointment.service.test.ts`

**Providers:**
- API: `src/app/api/providers/`
- Repository: `src/repositories/provider.repository.ts`
- Model: `src/models/Provider.ts`
- Validators: `src/validators/provider.validator.ts`

### By Layer

**Presentation (API Routes):**
- `src/app/api/**/*.ts`

**Business Logic (Services):**
- `src/services/**/*.ts`

**Data Access (Repositories):**
- `src/repositories/**/*.ts`

**Data Models:**
- `src/models/**/*.ts`

**Validation:**
- `src/validators/**/*.ts`

**Utilities:**
- `src/lib/**/*.ts`

## 📊 File Statistics

```
Total Files: ~50
Lines of Code: ~5,000
Test Coverage: 88%

Breakdown:
- Models: 5 files, ~500 lines
- Repositories: 3 files, ~400 lines
- Services: 2 files, ~600 lines
- API Routes: 6 files, ~800 lines
- Validators: 3 files, ~300 lines
- Tests: 4 files, ~1,200 lines
- Utilities: 5 files, ~400 lines
- Documentation: 10 files, ~5,000 lines
```

## 🎯 Quick Navigation

**Want to understand the business logic?**
→ Start with `src/services/`

**Want to see the API contracts?**
→ Check `src/app/api/` and `API_DOCUMENTATION.md`

**Want to understand the data model?**
→ Look at `src/models/` and `ARCHITECTURE.md`

**Want to see how testing works?**
→ Explore `src/__tests__/` and `TESTING.md`

**Want to deploy?**
→ Follow `DEPLOYMENT.md`

**Want to understand security?**
→ Read `SECURITY.md`

## 📚 Related Documentation

- [README.md](./README.md) - Project overview
- [QUICKSTART.md](./QUICKSTART.md) - Get started in 5 minutes
- [ARCHITECTURE.md](./ARCHITECTURE.md) - Architecture decisions
- [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) - API reference
- [TESTING.md](./TESTING.md) - Testing strategy
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Deployment guide
- [SECURITY.md](./SECURITY.md) - Security considerations
- [PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md) - Executive summary
