# Quick Start Guide

Get the Healthcare Appointment Management System running in 5 minutes.

## Prerequisites

- Node.js 18+ installed
- MongoDB Atlas account (free tier works)
- Git installed

## Step 1: Clone and Install

```bash
# Clone the repository
git clone <your-repo-url>
cd healthcare-appointment-system

# Install dependencies
npm install
```

## Step 2: Set Up MongoDB Atlas

1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster (M0)
3. Create a database user:
   - Username: `healthcareapp`
   - Password: Generate a secure password
4. Whitelist your IP:
   - Network Access → Add IP Address → Allow Access from Anywhere (0.0.0.0/0)
5. Get connection string:
   - Connect → Connect your application → Copy connection string
   - Replace `<password>` with your database user password

## Step 3: Configure Environment

```bash
# Copy example environment file
cp .env.example .env.local

# Edit .env.local with your values
```

**Required values:**
```env
MONGODB_URI=mongodb+srv://healthcareapp:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/healthcare?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-key-at-least-32-characters-long
JWT_EXPIRES_IN=7d
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

**Generate a secure JWT secret:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## Step 4: Run the Application

```bash
# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Step 5: Test the Application

### Register a Provider

```bash
curl -X POST http://localhost:3000/api/auth/register/provider \
  -H "Content-Type: application/json" \
  -d '{
    "email": "doctor@clinic.com",
    "password": "Doctor123",
    "firstName": "Dr. Sarah",
    "lastName": "Johnson",
    "phone": "+1234567890",
    "specialty": "cardiology",
    "licenseNumber": "MD123456",
    "maxDailyAppointments": 8
  }'
```

**Save the token from the response!**

### Register a Patient

```bash
curl -X POST http://localhost:3000/api/auth/register/patient \
  -H "Content-Type: application/json" \
  -d '{
    "email": "patient@example.com",
    "password": "Patient123",
    "firstName": "John",
    "lastName": "Doe",
    "phone": "+1234567891",
    "dateOfBirth": "1990-01-01",
    "address": "123 Main St, City, State 12345",
    "emergencyContact": {
      "name": "Jane Doe",
      "phone": "+1234567892",
      "relationship": "Spouse"
    }
  }'
```

**Save the token from the response!**

### Set Provider Availability

First, get the provider ID from the registration response, then:

```bash
curl -X PATCH http://localhost:3000/api/providers/PROVIDER_ID/availability \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer PROVIDER_TOKEN" \
  -d '{
    "availability": [
      {
        "dayOfWeek": 1,
        "startTime": "09:00",
        "endTime": "17:00",
        "isActive": true
      },
      {
        "dayOfWeek": 2,
        "startTime": "09:00",
        "endTime": "17:00",
        "isActive": true
      }
    ]
  }'
```

### Book an Appointment

```bash
# Calculate a future Monday at 10:00 AM
NEXT_MONDAY=$(date -d "next monday 10:00" -Iseconds)

curl -X POST http://localhost:3000/api/appointments \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer PATIENT_TOKEN" \
  -d "{
    \"providerId\": \"PROVIDER_ID\",
    \"startTime\": \"$NEXT_MONDAY\",
    \"duration\": 30,
    \"reason\": \"Regular checkup\"
  }"
```

## Step 6: Run Tests

```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Open coverage report
open coverage/lcov-report/index.html
```

## Common Issues

### MongoDB Connection Error

**Error:** `MongoServerError: bad auth`

**Solution:** 
- Check username/password in connection string
- Ensure special characters in password are URL-encoded
- Verify database user has read/write permissions

### Port Already in Use

**Error:** `EADDRINUSE: address already in use :::3000`

**Solution:**
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or use a different port
PORT=3001 npm run dev
```

### JWT Secret Error

**Error:** `JWT_SECRET environment variable is not set`

**Solution:**
- Ensure `.env.local` exists
- Check JWT_SECRET is at least 32 characters
- Restart development server after changing .env.local

### Test Timeout

**Error:** `Exceeded timeout of 5000 ms`

**Solution:**
- MongoDB Memory Server needs time to start
- Tests have 30s timeout configured
- Check internet connection (downloads MongoDB binary first time)

## Next Steps

1. **Explore the API** - See [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)
2. **Read Architecture** - See [ARCHITECTURE.md](./ARCHITECTURE.md)
3. **Deploy to Production** - See [DEPLOYMENT.md](./DEPLOYMENT.md)
4. **Understand Testing** - See [TESTING.md](./TESTING.md)

## Development Workflow

### Making Changes

1. Create a feature branch
   ```bash
   git checkout -b feature/appointment-reminders
   ```

2. Make your changes

3. Run tests
   ```bash
   npm test
   npm run lint
   npm run type-check
   ```

4. Commit and push
   ```bash
   git add .
   git commit -m "Add appointment reminders"
   git push origin feature/appointment-reminders
   ```

5. Create pull request

### Code Quality Checks

```bash
# Lint code
npm run lint

# Type check
npm run type-check

# Run all checks
npm run lint && npm run type-check && npm test
```

## Useful Commands

```bash
# Development
npm run dev              # Start dev server
npm run build            # Build for production
npm run start            # Start production server

# Testing
npm test                 # Run tests
npm run test:watch       # Run tests in watch mode
npm run test:coverage    # Run tests with coverage

# Code Quality
npm run lint             # Run ESLint
npm run type-check       # Run TypeScript compiler

# Database
# Connect to MongoDB Atlas
mongosh "mongodb+srv://cluster0.xxxxx.mongodb.net/healthcare" --username healthcareapp
```

## Project Structure

```
healthcare-appointment-system/
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── api/            # API routes
│   │   ├── (auth)/         # Auth pages
│   │   └── (dashboard)/    # Protected pages
│   ├── components/         # React components
│   ├── lib/                # Utilities
│   │   ├── auth/          # Authentication
│   │   ├── db/            # Database connection
│   │   └── utils/         # Helper functions
│   ├── models/            # Mongoose models
│   ├── repositories/      # Data access layer
│   ├── services/          # Business logic
│   ├── validators/        # Zod schemas
│   └── types/             # TypeScript types
├── __tests__/             # Test files
├── .github/               # GitHub Actions
└── docs/                  # Documentation
```

## Getting Help

- **Documentation**: Check the docs folder
- **Issues**: Open a GitHub issue
- **API Reference**: See API_DOCUMENTATION.md
- **Architecture**: See ARCHITECTURE.md

## What's Next?

After getting the app running, you can:

1. **Add Features**
   - Email notifications
   - SMS reminders
   - Video consultations
   - Prescription management

2. **Improve UI**
   - Add more shadcn/ui components
   - Implement calendar view
   - Add dashboard charts

3. **Enhance Security**
   - Add rate limiting
   - Implement refresh tokens
   - Add 2FA

4. **Scale**
   - Add Redis caching
   - Implement event-driven architecture
   - Add monitoring (Sentry, DataDog)

Happy coding! 🚀
