# Security Considerations

## Overview

This document details the security measures implemented in the Healthcare Appointment Management System and provides guidance for maintaining security in production.

## 🔐 Authentication & Authorization

### JWT Implementation

**Library:** `jose` (modern, Web Crypto API based)

**Token Structure:**
```typescript
{
  userId: string,
  email: string,
  role: 'patient' | 'provider' | 'admin',
  iat: number,  // Issued at
  exp: number   // Expiration
}
```

**Security Measures:**
- ✅ HS256 algorithm (HMAC with SHA-256)
- ✅ Secret key minimum 32 characters
- ✅ Token expiration (default: 7 days)
- ✅ Signature verification on every request
- ✅ No sensitive data in payload

**Token Storage:**
- Client: localStorage or sessionStorage (for demo)
- Production: httpOnly cookies (recommended)

**Implementation:**
```typescript
// Token generation
export async function signToken(payload: JWTPayload): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(secret)
}

// Token verification
export async function verifyToken(token: string): Promise<JWTPayload> {
  const { payload } = await jwtVerify(token, secret)
  return payload as JWTPayload
}
```

### Password Security

**Hashing Algorithm:** bcrypt with 12 rounds

**Why bcrypt:**
- Industry standard
- Adaptive (can increase rounds as hardware improves)
- Built-in salt generation
- Resistant to rainbow table attacks

**Implementation:**
```typescript
const SALT_ROUNDS = 12

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS)
}

export async function comparePassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}
```

**Password Requirements:**
- Minimum 8 characters
- At least 1 uppercase letter
- At least 1 lowercase letter
- At least 1 number
- Validated with Zod schema

### Role-Based Access Control (RBAC)

**Roles:**
- `patient` - Book appointments, view own data
- `provider` - Manage schedule, view assigned appointments
- `admin` - Full system access (future)

**Authorization Middleware:**
```typescript
export async function authenticate(request: NextRequest): Promise<JWTPayload> {
  const authHeader = request.headers.get('authorization')
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new UnauthorizedError('No token provided')
  }
  
  const token = authHeader.substring(7)
  return verifyToken(token)
}

export function authorize(allowedRoles: UserRole[]) {
  return (user: JWTPayload) => {
    if (!allowedRoles.includes(user.role)) {
      throw new ForbiddenError('Insufficient permissions')
    }
  }
}
```

**Usage in API Routes:**
```typescript
export async function POST(request: NextRequest) {
  const user = await authenticate(request)
  authorize([UserRole.PATIENT])(user)
  
  // Only patients can reach this point
}
```

## 🛡️ Input Validation

### Zod Schema Validation

**Why Zod:**
- Runtime type checking
- TypeScript type inference
- Composable schemas
- Clear error messages

**Example Schema:**
```typescript
export const createAppointmentSchema = z.object({
  providerId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid provider ID'),
  startTime: z.string().refine((date) => {
    const appointmentDate = new Date(date)
    const now = new Date()
    const twoHoursFromNow = new Date(now.getTime() + 2 * 60 * 60 * 1000)
    return appointmentDate >= twoHoursFromNow
  }, 'Appointments must be booked at least 2 hours in advance'),
  duration: z.number().min(15).max(120),
  reason: z.string().min(5).max(500),
})
```

**Validation at API Boundary:**
```typescript
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = createAppointmentSchema.parse(body)
    // validatedData is now type-safe and validated
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        success: false,
        error: error.errors[0].message
      }, { status: 400 })
    }
  }
}
```

### MongoDB Injection Prevention

**Protection Mechanisms:**

1. **Mongoose Parameterized Queries**
   ```typescript
   // Safe - uses parameterized query
   await User.findOne({ email: userInput })
   
   // Unsafe - string concatenation (DON'T DO THIS)
   await User.findOne({ $where: `this.email == '${userInput}'` })
   ```

2. **Type Validation**
   ```typescript
   // Validate ObjectId format
   z.string().regex(/^[0-9a-fA-F]{24}$/)
   ```

3. **No Direct Query String Usage**
   - All inputs validated with Zod
   - No raw MongoDB queries
   - Mongoose handles escaping

## 🔒 Data Protection

### Sensitive Data Handling

**Password Storage:**
- ✅ Never stored in plain text
- ✅ Hashed with bcrypt (12 rounds)
- ✅ Not included in API responses (`.select('+password')` required)

**Mongoose Schema:**
```typescript
password: {
  type: String,
  required: true,
  select: false,  // Exclude from queries by default
}
```

**PII Protection:**
- Patient medical records separate collection
- Access control at repository layer
- Audit logging (future enhancement)

### Error Masking

**Never Expose:**
- Stack traces
- Database errors
- Internal system details
- File paths
- Environment variables

**Error Handler:**
```typescript
export function handleError(error: unknown): { message: string; statusCode: number } {
  if (error instanceof AppError) {
    // Operational errors - safe to expose
    return {
      message: error.message,
      statusCode: error.statusCode,
    }
  }

  // Unexpected errors - mask details
  console.error('Unexpected error:', error)
  return {
    message: 'An unexpected error occurred',
    statusCode: 500,
  }
}
```

**API Response:**
```typescript
// Good - masked error
{
  "success": false,
  "error": "An unexpected error occurred"
}

// Bad - exposed error (DON'T DO THIS)
{
  "success": false,
  "error": "MongoError: connection refused at 192.168.1.100:27017"
}
```

## 🌐 HTTP Security

### Security Headers

**Implemented in next.config.js:**

```javascript
headers: [
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on'
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload'
  },
  {
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN'  // Prevent clickjacking
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff'  // Prevent MIME sniffing
  },
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block'  // XSS filter
  },
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin'
  },
  {
    key: 'Content-Security-Policy',
    value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'..."
  }
]
```

### CORS Configuration

**Current:** Same-origin only (Next.js default)

**For API-only deployment:**
```typescript
// Add CORS middleware
export async function middleware(request: NextRequest) {
  const response = NextResponse.next()
  
  response.headers.set('Access-Control-Allow-Origin', 'https://your-frontend.com')
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  
  return response
}
```

### CSRF Protection

**Current Protection:**
- SameSite cookies (when implemented)
- Origin header validation
- No state-changing GET requests

**Future Enhancement:**
```typescript
// CSRF token generation
export function generateCSRFToken(): string {
  return crypto.randomBytes(32).toString('hex')
}

// CSRF token validation
export function validateCSRFToken(token: string, sessionToken: string): boolean {
  return crypto.timingSafeEqual(
    Buffer.from(token),
    Buffer.from(sessionToken)
  )
}
```

## 🔑 Environment Variables

### Secure Management

**Development:**
```bash
# .env.local (gitignored)
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your-secret-key-min-32-chars
```

**Production (Vercel):**
- Stored in Vercel dashboard
- Encrypted at rest
- Not exposed in logs
- Separate per environment

**GitHub Actions:**
- Stored as GitHub Secrets
- Encrypted
- Not visible in logs
- Masked in output

### Secret Rotation

**JWT Secret Rotation:**
1. Generate new secret
2. Update environment variable
3. Existing tokens remain valid until expiry
4. New tokens use new secret

**Database Credentials:**
1. Create new database user
2. Update connection string
3. Deploy with new credentials
4. Delete old user after verification

## 🚨 Rate Limiting

### Recommended Implementation

**Auth Endpoints:**
```typescript
// 10 requests per 15 minutes per IP
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: 'Too many authentication attempts, please try again later'
})
```

**API Endpoints:**
```typescript
// 100 requests per 15 minutes per user
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  keyGenerator: (req) => req.user.userId
})
```

**Implementation Options:**
- Vercel Edge Middleware
- Redis-based rate limiting
- Upstash Rate Limit

## 🔍 Audit Logging

### What to Log

**Authentication Events:**
- ✅ Login attempts (success/failure)
- ✅ Registration
- ✅ Password changes
- ✅ Token refresh

**Authorization Events:**
- ✅ Access denied (403)
- ✅ Unauthorized access (401)
- ✅ Role changes

**Data Access:**
- ✅ Medical record access
- ✅ Patient data exports
- ✅ Bulk operations

**System Events:**
- ✅ Configuration changes
- ✅ User deactivation
- ✅ Data deletion

### Log Format

```typescript
interface AuditLog {
  timestamp: Date
  userId: string
  action: string
  resource: string
  result: 'success' | 'failure'
  ipAddress: string
  userAgent: string
  metadata?: Record<string, any>
}
```

### Implementation

```typescript
export async function logAuditEvent(event: AuditLog): Promise<void> {
  await AuditLog.create(event)
  
  // Also send to external service (Datadog, Splunk, etc.)
  if (process.env.NODE_ENV === 'production') {
    await sendToAuditService(event)
  }
}
```

## 🛠️ Security Testing

### Automated Security Checks

**npm audit:**
```bash
# Check for vulnerable dependencies
npm audit

# Fix automatically
npm audit fix
```

**Dependabot:**
- Enabled in GitHub
- Automatic PR for security updates
- Weekly dependency updates

### Manual Security Testing

**OWASP Top 10 Checklist:**

1. **Injection** ✅
   - Parameterized queries
   - Input validation
   - No eval() or Function()

2. **Broken Authentication** ✅
   - Strong password requirements
   - JWT with expiration
   - No session fixation

3. **Sensitive Data Exposure** ✅
   - HTTPS only
   - Password hashing
   - Error masking

4. **XML External Entities (XXE)** N/A
   - No XML parsing

5. **Broken Access Control** ✅
   - RBAC implementation
   - Authorization checks
   - Resource-level permissions

6. **Security Misconfiguration** ✅
   - Security headers
   - No default credentials
   - Error handling

7. **Cross-Site Scripting (XSS)** ✅
   - React auto-escaping
   - CSP headers
   - Input sanitization

8. **Insecure Deserialization** ✅
   - JSON only
   - Schema validation
   - No eval()

9. **Using Components with Known Vulnerabilities** ✅
   - npm audit
   - Dependabot
   - Regular updates

10. **Insufficient Logging & Monitoring** 🔄
    - Basic logging implemented
    - Need production monitoring

### Penetration Testing

**Recommended Tools:**
- **OWASP ZAP** - Automated security scanner
- **Burp Suite** - Manual testing
- **SQLMap** - SQL injection testing (not applicable)

**Testing Checklist:**
- [ ] Authentication bypass attempts
- [ ] Authorization escalation
- [ ] Input validation bypass
- [ ] Session management
- [ ] CSRF attacks
- [ ] XSS attacks
- [ ] API abuse

## 📋 Security Checklist

### Pre-Production

- [x] All secrets in environment variables
- [x] Password hashing implemented
- [x] JWT authentication working
- [x] RBAC enforced
- [x] Input validation on all endpoints
- [x] Error masking implemented
- [x] Security headers configured
- [x] HTTPS enforced (Vercel default)
- [ ] Rate limiting implemented
- [ ] Audit logging configured
- [ ] Security testing completed
- [ ] Dependency audit clean

### Production Monitoring

- [ ] Error tracking (Sentry)
- [ ] Performance monitoring (DataDog)
- [ ] Uptime monitoring (UptimeRobot)
- [ ] Log aggregation (Logtail)
- [ ] Security alerts configured
- [ ] Backup strategy implemented

### Ongoing Maintenance

- [ ] Weekly dependency updates
- [ ] Monthly security audits
- [ ] Quarterly penetration testing
- [ ] Annual security review
- [ ] Incident response plan
- [ ] Data breach notification procedure

## 🚨 Incident Response

### Security Incident Procedure

1. **Detect**
   - Monitor logs for suspicious activity
   - Alert on failed authentication attempts
   - Track API abuse patterns

2. **Contain**
   - Disable compromised accounts
   - Rotate compromised secrets
   - Block malicious IPs

3. **Investigate**
   - Review audit logs
   - Identify attack vector
   - Assess data exposure

4. **Remediate**
   - Patch vulnerabilities
   - Update security measures
   - Deploy fixes

5. **Notify**
   - Inform affected users
   - Report to authorities (if required)
   - Document incident

### Emergency Contacts

```
Security Team: security@example.com
On-Call Engineer: +1-XXX-XXX-XXXX
Legal Team: legal@example.com
```

## 📚 Security Resources

### Standards & Compliance

- **OWASP Top 10**: https://owasp.org/www-project-top-ten/
- **HIPAA** (if applicable): https://www.hhs.gov/hipaa/
- **GDPR** (if EU users): https://gdpr.eu/
- **PCI DSS** (if payments): https://www.pcisecuritystandards.org/

### Tools & Libraries

- **jose**: JWT implementation
- **bcrypt**: Password hashing
- **zod**: Input validation
- **helmet**: Security headers (alternative)
- **rate-limiter-flexible**: Rate limiting

### Further Reading

- [OWASP Cheat Sheet Series](https://cheatsheetseries.owasp.org/)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)
- [MongoDB Security Checklist](https://docs.mongodb.com/manual/administration/security-checklist/)

## 🎯 Conclusion

This application implements industry-standard security practices:

✅ **Authentication** - JWT with secure token handling
✅ **Authorization** - Role-based access control
✅ **Input Validation** - Zod schemas at API boundary
✅ **Data Protection** - Password hashing, error masking
✅ **HTTP Security** - Security headers, HTTPS
✅ **Dependency Management** - Regular audits and updates

**Remaining Work:**
- Rate limiting implementation
- Production monitoring setup
- Comprehensive audit logging
- Penetration testing

**This application is production-ready from a security perspective with the recommended enhancements implemented.**
