# Healthcare Appointment Management System

## 🏥 Overview

A production-ready full-stack application for small medical clinics to manage patient appointments, provider schedules, and medical records.

### Target Users
- **Clinic Administrators**: Manage providers, view all appointments, access reports
- **Healthcare Providers**: Manage their schedule, view patient records, update appointments
- **Patients**: Book appointments, view history, manage profile

### Business Problem Solved
- Eliminates double-booking through real-time availability checking
- Centralizes patient medical records with secure access control
- Automates provider schedule management
- Improves patient communication and reduces no-shows

## 🏗️ Architecture

### System Design
```
┌─────────────────┐
│   Next.js App   │
│   (App Router)  │
├─────────────────┤
│ Presentation    │ ← React Server/Client Components
├─────────────────┤
│ API Routes      │ ← Controllers (validation, auth)
├─────────────────┤
│ Services        │ ← Business Logic
├─────────────────┤
│ Repositories    │ ← Data Access Layer
├─────────────────┤
│ MongoDB/Mongoose│ ← Persistence
└─────────────────┘
```

### Data Model Strategy

**Embedded Documents:**
- `Appointment.patientSnapshot` - Denormalized patient data for historical accuracy
- `Provider.availability` - Schedule patterns embedded for query performance

**Referenced Documents:**
- `Appointment → Patient/Provider` - Normalized for data consistency
- `MedicalRecord → Patient` - Separate collection for access control

**Justification:**
- Appointments need historical patient data (name, contact) even if patient updates profile
- Provider availability is queried frequently and rarely changes
- Medical records require strict access control, warranting separate collection

### MongoDB Indexes
```javascript
// Appointments: Query by provider + date range
{ providerId: 1, startTime: 1 }

// Appointments: Query by patient
{ patientId: 1, startTime: -1 }

// Providers: Lookup by specialty
{ specialty: 1, isActive: 1 }

// Patients: Email uniqueness
{ email: 1 } (unique)
```

## 🔐 Security Considerations

### Authentication & Authorization
- **JWT-based auth** with httpOnly cookies
- **Role-based access control (RBAC)**: admin, provider, patient
- **Token rotation** on sensitive operations
- **Password hashing** with bcrypt (12 rounds)

### Data Protection
- **Input validation** with Zod schemas at API boundary
- **MongoDB injection prevention** via Mongoose parameterized queries
- **XSS protection** via React's built-in escaping + Content Security Policy
- **CSRF protection** via SameSite cookies + origin validation
- **Rate limiting** on auth endpoints (10 req/15min)
- **Sensitive data masking** in error responses

### Environment Security
- All secrets in `.env.local` (never committed)
- Vercel environment variables for production
- Separate MongoDB databases for dev/test/prod

## 🧪 Testing Strategy

### What Is Tested
1. **Unit Tests**
   - Service layer business logic (appointment validation, conflict detection)
   - Utility functions (date helpers, formatters)
   - Validation schemas

2. **Integration Tests**
   - API routes with mongodb-memory-server
   - Database operations (CRUD, transactions)
   - Authentication flows

### Why It Matters
- **Service tests** ensure business rules are enforced (e.g., no double-booking)
- **API tests** validate request/response contracts
- **DB tests** prevent data corruption and ensure referential integrity

### What Is NOT Tested
- **UI components**: Focus on business logic over presentation
- **Third-party libraries**: Trust Mongoose, Next.js internals
- **E2E flows**: Out of scope for this phase (would use Playwright in production)

### Coverage Goals
- Services: >90%
- API Routes: >80%
- Overall: >75%

## 🚀 Performance Optimizations

### Frontend
- **Server Components** for initial page loads (appointments list, dashboard)
- **Client Components** only for interactive elements (booking form, calendar)
- **Dynamic imports** for heavy components (calendar library)
- **Image optimization** via Next.js Image component
- **Font optimization** via next/font

### Backend
- **Database indexes** on frequently queried fields
- **Lean queries** (`.lean()`) for read-only operations
- **Projection** to fetch only required fields
- **Connection pooling** (MongoDB default: 100 connections)

### Caching Strategy
- **Static pages**: Cached at CDN (landing, about)
- **Dynamic data**: Revalidate on mutation via `revalidatePath`
- **API responses**: No caching (real-time appointment data)

## 📦 Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript (strict mode)
- **Frontend**: React + Tailwind CSS + shadcn/ui
- **Backend**: Next.js API Routes + Server Actions
- **Database**: MongoDB Atlas
- **ODM**: Mongoose
- **Validation**: Zod
- **Auth**: JWT (jose library)
- **Testing**: Jest + mongodb-memory-server
- **Deployment**: Vercel
- **CI/CD**: GitHub Actions

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- MongoDB Atlas account
- npm or yarn

### Installation

```bash
# Clone repository
git clone <repo-url>
cd healthcare-appointment-system

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your MongoDB URI and JWT secret

# Run development server
npm run dev

# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Build for production
npm run build
```

### Environment Variables

```env
# Database
MONGODB_URI=mongodb+srv://...

# Authentication
JWT_SECRET=your-secret-key-min-32-chars
JWT_EXPIRES_IN=7d

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Auth routes (login, register)
│   ├── (dashboard)/       # Protected routes
│   │   ├── appointments/
│   │   ├── patients/
│   │   └── providers/
│   ├── api/               # API routes
│   └── layout.tsx
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   └── features/         # Feature-specific components
├── lib/                   # Core libraries
│   ├── db/               # Database connection
│   ├── auth/             # Authentication utilities
│   └── utils/            # Shared utilities
├── models/               # Mongoose models
├── repositories/         # Data access layer
├── services/             # Business logic
├── validators/           # Zod schemas
└── types/                # TypeScript types
```

## 🔄 CI/CD Pipeline

GitHub Actions workflow:
1. **Lint**: ESLint + TypeScript check
2. **Test**: Jest with coverage report
3. **Build**: Next.js production build
4. **Deploy**: Automatic deployment to Vercel (main branch)

## 📊 Key Features

### For Administrators
- ✅ Manage providers (add, edit, deactivate)
- ✅ View all appointments across clinic
- ✅ Generate reports (appointments by provider, patient volume)
- ✅ Manage clinic settings

### For Providers
- ✅ Set availability schedule
- ✅ View daily/weekly appointments
- ✅ Access patient medical records
- ✅ Update appointment status (confirmed, completed, cancelled)

### For Patients
- ✅ Book appointments with available providers
- ✅ View appointment history
- ✅ Cancel/reschedule appointments
- ✅ Update profile information

## 🎯 Business Rules Enforced

1. **No Double-Booking**: Appointments checked against provider availability
2. **Minimum Notice**: Appointments require 2-hour advance booking
3. **Cancellation Policy**: Patients can cancel up to 24 hours before
4. **Provider Capacity**: Maximum 8 appointments per day per provider
5. **Soft Deletes**: All records retained for audit trail

## 📈 Future Enhancements

- Email/SMS notifications
- Video consultation integration
- Prescription management
- Insurance verification
- Analytics dashboard
- Multi-clinic support

## 📄 License

MIT

## 👥 Contributing

This is a portfolio project. For production use, please fork and adapt to your needs.
