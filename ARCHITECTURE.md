# Architecture Decision Record (ADR)

## Overview

This document explains the architectural decisions made for the Healthcare Appointment Management System and the reasoning behind them.

## Tech Stack Decisions

### 1. Next.js 16 (App Router)

**Decision:** Use Next.js App Router over Pages Router

**Rationale:**
- **Server Components by default** - Better performance, smaller bundle sizes
- **Streaming SSR** - Improved perceived performance
- **Layouts** - Shared UI without re-rendering
- **Route handlers** - Simplified API routes
- **Future-proof** - App Router is the future of Next.js

**Trade-offs:**
- Steeper learning curve
- Some libraries not yet optimized for Server Components
- More complex mental model (server vs client components)

**Alternatives Considered:**
- Pages Router: More mature, but being phased out
- Separate backend (Express): More complexity, deployment overhead

---

### 2. MongoDB with Mongoose

**Decision:** Use MongoDB as primary database with Mongoose ODM

**Rationale:**
- **Flexible schema** - Healthcare data can vary by specialty
- **Document model** - Natural fit for nested data (emergency contacts, availability)
- **Horizontal scaling** - Easy to scale with sharding
- **Atlas** - Excellent managed service with free tier
- **Mongoose** - Type-safe schemas, validation, middleware

**Trade-offs:**
- No ACID transactions across documents (mitigated by careful design)
- Potential for data duplication (intentional for performance)
- Less strict than relational databases

**Alternatives Considered:**
- PostgreSQL: Better for complex relationships, but overkill for this use case
- Prisma: Great ORM, but less flexible for document modeling

---

### 3. JWT Authentication

**Decision:** Use JWT tokens with jose library

**Rationale:**
- **Stateless** - No session storage needed
- **Scalable** - Works across multiple servers
- **Standard** - Industry-standard approach
- **jose library** - Modern, secure, Web Crypto API based

**Trade-offs:**
- Cannot invalidate tokens before expiry (mitigated by short expiry)
- Token size larger than session IDs
- Need to handle token refresh (future enhancement)

**Alternatives Considered:**
- Session-based auth: Requires Redis/database, not stateless
- NextAuth.js: Overkill for simple JWT auth, adds complexity

---

### 4. Zod for Validation

**Decision:** Use Zod for runtime validation

**Rationale:**
- **Type inference** - TypeScript types from schemas
- **Runtime safety** - Validates untrusted input
- **Composable** - Easy to build complex validations
- **Error messages** - Clear, customizable error messages

**Trade-offs:**
- Adds bundle size
- Validation logic separate from Mongoose schemas (intentional)

**Alternatives Considered:**
- Joi: More mature, but no TypeScript inference
- class-validator: Requires decorators, more boilerplate

---

## Architectural Patterns

### 1. Layered Architecture

**Decision:** Implement strict layered architecture

```
Presentation (API Routes)
    ↓
Services (Business Logic)
    ↓
Repositories (Data Access)
    ↓
Models (Database)
```

**Rationale:**
- **Separation of concerns** - Each layer has single responsibility
- **Testability** - Easy to test business logic in isolation
- **Maintainability** - Changes in one layer don't affect others
- **Scalability** - Can replace layers independently

**Implementation:**
- **API Routes** - Validation, authentication, error handling
- **Services** - Business rules, orchestration
- **Repositories** - Database queries, data mapping
- **Models** - Schema definition, indexes

**Example:**
```typescript
// API Route - Thin controller
export async function POST(request: NextRequest) {
  const user = await authenticate(request)
  const validatedData = createAppointmentSchema.parse(body)
  const appointmentService = new AppointmentService()
  return appointmentService.createAppointment(user.userId, validatedData)
}

// Service - Business logic
async createAppointment(patientId: string, input: CreateAppointmentInput) {
  // Validate provider exists
  // Check availability
  // Check conflicts
  // Enforce business rules
  // Create appointment
}

// Repository - Data access
async findConflictingAppointments(providerId, startTime, endTime) {
  return Appointment.find({ /* query */ }).lean()
}
```

---

### 2. Data Modeling Strategy

**Decision:** Hybrid approach - embedded and referenced documents

#### Embedded Documents

**Use Cases:**
- Provider availability schedules
- Patient emergency contacts
- Appointment patient snapshots

**Rationale:**
- **Performance** - Single query to fetch all data
- **Atomicity** - Updated together
- **Historical accuracy** - Snapshots preserve data at point in time

**Example:**
```typescript
// Appointment with embedded patient snapshot
{
  _id: ObjectId,
  patientId: ObjectId, // Reference for current data
  patientSnapshot: {   // Embedded for historical data
    firstName: "John",
    lastName: "Doe",
    email: "john@example.com",
    phone: "+1234567890"
  }
}
```

**Why:** If patient changes their name, past appointments still show the name they used at booking time.

#### Referenced Documents

**Use Cases:**
- Appointment → Patient
- Appointment → Provider
- MedicalRecord → Patient/Provider

**Rationale:**
- **Normalization** - Single source of truth
- **Data consistency** - Updates propagate
- **Access control** - Separate collections for different permissions

---

### 3. Soft Deletes

**Decision:** Implement soft deletes for all user-facing data

**Implementation:**
```typescript
{
  deletedAt: Date | null,
  isActive: boolean
}
```

**Rationale:**
- **Audit trail** - Maintain history for compliance
- **Recovery** - Can restore accidentally deleted data
- **Referential integrity** - Appointments reference deleted providers
- **Analytics** - Historical data for reporting

**Trade-offs:**
- Queries must filter `deletedAt: null`
- Database size grows over time
- Need cleanup strategy for old data

**Alternatives Considered:**
- Hard deletes: Simpler, but loses data
- Archive table: More complex, requires data migration

---

### 4. Index Strategy

**Decision:** Strategic indexes for query performance

**Indexes Implemented:**

```javascript
// Appointments - Provider schedule queries
{ providerId: 1, startTime: 1 }

// Appointments - Patient history
{ patientId: 1, startTime: -1 }

// Appointments - Status filtering
{ status: 1, startTime: 1 }

// Providers - Specialty search
{ specialty: 1, isActive: 1 }

// Patients - Email uniqueness
{ email: 1 } (unique)
```

**Rationale:**
- **Query patterns** - Indexes match common queries
- **Compound indexes** - Support multiple filter conditions
- **Sort optimization** - Indexes include sort fields
- **Uniqueness** - Enforce business constraints

**Trade-offs:**
- Write performance impact (minimal for this use case)
- Storage overhead (acceptable)
- Need to monitor index usage

---

## Security Decisions

### 1. Password Hashing

**Decision:** bcrypt with 12 rounds

**Rationale:**
- **Industry standard** - Well-tested, secure
- **Adaptive** - Can increase rounds as hardware improves
- **Salt included** - Automatic salt generation
- **12 rounds** - Balance between security and performance

**Implementation:**
```typescript
const SALT_ROUNDS = 12
await bcrypt.hash(password, SALT_ROUNDS)
```

**Alternatives Considered:**
- argon2: More secure, but less widely supported
- scrypt: Good, but bcrypt more familiar to team

---

### 2. Role-Based Access Control (RBAC)

**Decision:** Simple role-based authorization

**Roles:**
- **Patient** - Book appointments, view own data
- **Provider** - Manage schedule, view assigned appointments
- **Admin** - Full access (future enhancement)

**Implementation:**
```typescript
// Middleware
export function authorize(allowedRoles: UserRole[]) {
  return (user: JWTPayload) => {
    if (!allowedRoles.includes(user.role)) {
      throw new ForbiddenError('Insufficient permissions')
    }
  }
}

// Usage
const user = await authenticate(request)
authorize([UserRole.PATIENT])(user)
```

**Rationale:**
- **Simple** - Easy to understand and implement
- **Sufficient** - Meets current requirements
- **Extensible** - Can add permissions later

**Future Enhancement:**
- Permission-based access control (PBAC)
- Resource-level permissions
- Dynamic role assignment

---

### 3. Error Handling

**Decision:** Custom error classes with safe error responses

**Implementation:**
```typescript
// Custom errors
class AppError extends Error {
  constructor(
    public message: string,
    public statusCode: number,
    public isOperational: boolean = true
  ) {}
}

// Error handler
export function handleError(error: unknown) {
  if (error instanceof AppError) {
    return { message: error.message, statusCode: error.statusCode }
  }
  
  // Never expose internal errors
  console.error('Unexpected error:', error)
  return { message: 'An unexpected error occurred', statusCode: 500 }
}
```

**Rationale:**
- **Security** - Never expose stack traces or internal details
- **User-friendly** - Clear error messages
- **Debugging** - Log full errors server-side
- **Consistency** - Uniform error response format

---

## Performance Optimizations

### 1. Database Query Optimization

**Strategies:**
- **Lean queries** - `.lean()` for read-only operations (40% faster)
- **Projection** - Fetch only required fields
- **Indexes** - Support common query patterns
- **Connection pooling** - Reuse database connections

**Example:**
```typescript
// Bad - Full Mongoose document
const appointments = await Appointment.find({ patientId })

// Good - Lean query with projection
const appointments = await Appointment
  .find({ patientId })
  .select('startTime endTime status reason')
  .lean()
```

---

### 2. Server Components

**Decision:** Use Server Components by default

**Rationale:**
- **Zero JavaScript** - No client-side JS for static content
- **Direct database access** - No API route needed
- **Streaming** - Progressive rendering
- **SEO** - Fully rendered HTML

**When to use Client Components:**
- Interactive elements (forms, buttons)
- Browser APIs (localStorage, geolocation)
- React hooks (useState, useEffect)

---

### 3. Caching Strategy

**Current Implementation:**
- **Static pages** - Cached at CDN (landing page)
- **Dynamic data** - No caching (real-time appointments)
- **Revalidation** - `revalidatePath` after mutations

**Future Enhancements:**
- Redis for session storage
- Provider availability caching (5-minute TTL)
- Patient profile caching

---

## Testing Strategy

### 1. Test Pyramid

**Decision:** Focus on unit and integration tests

```
     /\
    /E2E\      ← Few (future)
   /------\
  /  API   \   ← Some (via services)
 /----------\
/   Unit     \ ← Many (services, utils)
--------------
```

**Rationale:**
- **Fast feedback** - Unit tests run in milliseconds
- **Reliable** - Less flaky than E2E tests
- **Maintainable** - Easier to debug failures
- **Coverage** - High coverage with fewer tests

**What's Tested:**
- ✅ Business logic (services)
- ✅ Utilities (date helpers)
- ✅ Database operations (repositories)
- ❌ UI components (manual testing)
- ❌ E2E flows (future enhancement)

---

### 2. MongoDB Memory Server

**Decision:** Use in-memory MongoDB for tests

**Rationale:**
- **Fast** - No network latency
- **Isolated** - Each test gets clean database
- **Reliable** - No external dependencies
- **CI-friendly** - Works in GitHub Actions

**Trade-offs:**
- Doesn't test MongoDB Atlas specific features
- Slightly different behavior from production

---

## Deployment Architecture

### 1. Vercel Deployment

**Decision:** Deploy to Vercel

**Rationale:**
- **Next.js optimized** - Built by same team
- **Zero config** - Automatic deployments
- **Edge network** - Global CDN
- **Serverless** - Auto-scaling
- **Free tier** - Generous limits

**Architecture:**
```
User → Vercel Edge Network → Next.js Serverless Functions → MongoDB Atlas
```

---

### 2. Environment Strategy

**Environments:**
- **Development** - Local with `.env.local`
- **Test** - In-memory MongoDB
- **Production** - Vercel + MongoDB Atlas

**Secrets Management:**
- Development: `.env.local` (gitignored)
- Production: Vercel environment variables
- CI: GitHub Secrets

---

## Future Architectural Considerations

### 1. Microservices (If Needed)

**When to consider:**
- Team size > 10 developers
- Different scaling requirements per service
- Need for polyglot persistence

**Potential services:**
- Appointment service
- Notification service
- Analytics service

---

### 2. Event-Driven Architecture

**Use cases:**
- Send email on appointment booking
- SMS reminders 24 hours before
- Analytics event tracking

**Implementation:**
- Message queue (RabbitMQ, AWS SQS)
- Event bus (EventBridge)
- Webhooks

---

### 3. Caching Layer

**When to add:**
- Response time > 500ms
- Database load > 70%
- Repeated queries for same data

**Options:**
- Redis for session storage
- Vercel Edge caching
- Application-level caching

---

## Lessons Learned

### What Worked Well

1. **Layered architecture** - Easy to test and maintain
2. **Mongoose schemas** - Type safety + validation
3. **Zod validation** - Caught many bugs early
4. **Soft deletes** - Saved us multiple times
5. **MongoDB Memory Server** - Fast, reliable tests

### What Could Be Improved

1. **Token refresh** - Need refresh token strategy
2. **Rate limiting** - Should add before production
3. **Logging** - Need structured logging (Winston, Pino)
4. **Monitoring** - Add APM (Sentry, DataDog)
5. **E2E tests** - Would catch integration issues

### What We'd Do Differently

1. **Start with E2E tests** - Would have caught UI issues earlier
2. **Add observability sooner** - Harder to add later
3. **Document decisions earlier** - This ADR should have been first
4. **Consider GraphQL** - REST is fine, but GraphQL would reduce over-fetching

---

## References

- [Next.js App Router Documentation](https://nextjs.org/docs/app)
- [MongoDB Data Modeling](https://www.mongodb.com/docs/manual/core/data-modeling-introduction/)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [12-Factor App](https://12factor.net/)
