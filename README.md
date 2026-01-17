# HealthCare+ Appointment Management System

A modern, full-stack healthcare appointment management system built with Next.js 15, TypeScript, MongoDB, and Material-UI. This application enables seamless appointment scheduling between patients and healthcare providers with real-time availability management.

🔗 **Live Demo**: [https://flowstack-virid.vercel.app/](https://flowstack-virid.vercel.app/)

![HealthCare+ Banner](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue?style=for-the-badge&logo=typescript)
![MongoDB](https://img.shields.io/badge/MongoDB-8.9-green?style=for-the-badge&logo=mongodb)
![Material-UI](https://img.shields.io/badge/Material--UI-7.3-007FFF?style=for-the-badge&logo=mui)

---

## 📋 Table of Contents

- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Project Structure](#-project-structure)
- [API Documentation](#-api-documentation)
- [Deployment](#-deployment)
- [Testing](#-testing)
- [Contributing](#-contributing)

---

## ✨ Key Features

### 🔐 Authentication & Authorization
- **Dual Role System**: Separate registration and login flows for Patients and Healthcare Providers
- **JWT-based Authentication**: Secure token-based authentication with 7-day expiration
- **Password Security**: Bcrypt hashing with salt rounds for password protection
- **Role-based Access Control**: Protected routes and API endpoints based on user roles
- **Real-time Form Validation**: Progressive validation with visual feedback

### 👨‍⚕️ Provider Features
- **Availability Management**: Configure working hours for each day of the week
- **Flexible Scheduling**: Set custom start/end times with toggle on/off for specific days
- **Appointment Dashboard**: View all appointments with status tracking (scheduled, confirmed, completed, cancelled)
- **Patient Management**: Access list of unique patients with appointment history
- **Appointment Actions**: Update appointment status, add notes, prescriptions, and ratings
- **License Verification**: Unique license number validation for provider registration

### 🏥 Patient Features
- **Smart Appointment Booking**: 5-step guided booking process
  1. Select Provider (by specialty)
  2. Choose Date
  3. Pick Time Slot (shows only available slots)
  4. Add Details (reason for visit)
  5. Review & Book
- **Real-time Slot Availability**: Dynamic slot generation based on provider availability and existing appointments
- **Appointment History**: View past and upcoming appointments with detailed information
- **Provider Search**: Browse providers by specialty (General Practice, Cardiology, Dermatology, etc.)
- **Appointment Management**: Cancel appointments with 24-hour advance notice requirement

### 📊 Dashboard & Analytics
- **Statistics Overview**: 
  - Total appointments count
  - Upcoming appointments
  - Completed appointments
  - Patient/Provider count (role-dependent)
- **Quick Actions**: Fast access to frequently used features
- **Responsive Design**: Fully responsive across desktop, tablet, and mobile devices

### 🎨 UI/UX Features
- **Material Design 3**: Modern, clean interface following Material Design principles
- **Progress Indicators**: Visual feedback for form completion and loading states
- **Animated Transitions**: Smooth page transitions and component animations
- **Validation Progress Bar**: Real-time validation feedback with shimmer effects
- **Error Handling**: User-friendly error messages with actionable guidance
- **Accessibility**: WCAG compliant with proper ARIA labels and keyboard navigation

### 🔒 Security & Validation
- **Input Validation**: Comprehensive validation using Zod schemas
  - Email format validation
  - Phone number validation (10+ digits)
  - Password strength requirements (uppercase, lowercase, number)
  - Date of birth validation (age restrictions)
  - License number uniqueness check
- **API Security**: Protected endpoints with JWT verification
- **SQL Injection Prevention**: MongoDB parameterized queries
- **XSS Protection**: Input sanitization and output encoding
- **CORS Configuration**: Controlled cross-origin resource sharing

### ⏰ Smart Scheduling
- **Conflict Detection**: Prevents double-booking of time slots
- **Past Slot Filtering**: Automatically hides slots that have passed
- **30-Minute Advance Booking**: Ensures appointments are booked with adequate notice
- **Duration Options**: 15, 30, 45, or 60-minute appointment durations
- **Timezone Handling**: Consistent local time handling across client and server
- **Daily Appointment Limits**: Configurable maximum appointments per provider per day

---

## 🛠 Tech Stack

### Frontend
- **Framework**: Next.js 15.1.3 (App Router)
- **Language**: TypeScript 5.7.3
- **UI Library**: Material-UI (MUI) 7.3.7
- **Icons**: Lucide React 0.468.0
- **Styling**: 
  - Tailwind CSS 3.4.17
  - Emotion (CSS-in-JS)
- **State Management**: React Hooks (useState, useEffect)
- **Form Handling**: Controlled components with real-time validation
- **Date Handling**: date-fns 4.1.0

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Next.js API Routes (Serverless)
- **Database**: MongoDB 8.9.3 with Mongoose ODM
- **Authentication**: 
  - JWT (jose 5.9.6)
  - Bcrypt 5.1.1
- **Validation**: Zod 3.24.1
- **Architecture Pattern**: Repository Pattern with Service Layer

### Development & Testing
- **Testing Framework**: Jest 29.7.0
- **Testing Library**: React Testing Library 16.1.0
- **Test Database**: MongoDB Memory Server 10.1.2
- **Linting**: ESLint 9.18.0
- **Type Checking**: TypeScript strict mode

### Deployment & CI/CD
- **Hosting**: Vercel (Serverless deployment)
- **CI/CD**: Automated deployment on push to main branch
- **Build Command**: `npm run build`
- **Environment**: Production-optimized with automatic scaling

---

## 🏗 Architecture

### Design Patterns
1. **Repository Pattern**: Data access abstraction layer
2. **Service Layer**: Business logic separation
3. **Middleware Pattern**: Authentication and authorization
4. **Factory Pattern**: Model creation and initialization

### Folder Structure Philosophy
- **Feature-based organization**: Related components grouped together
- **Separation of concerns**: Clear boundaries between layers
- **Reusability**: Shared components and utilities
- **Type safety**: Comprehensive TypeScript interfaces

### Data Flow
```
Client Request → Middleware (Auth) → API Route → Service Layer → Repository → Database
                                                      ↓
Client Response ← API Route ← Service Layer ← Repository ← Database
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18.0.0 or higher
- npm or yarn package manager
- MongoDB Atlas account (or local MongoDB instance)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/healthcare-appointment-system.git
cd healthcare-appointment-system
```

2. **Install dependencies**
```bash
npm install
# or
yarn install
```

3. **Set up environment variables**

Create a `.env` file in the root directory:

```env
# Database
MONGODB_URI=your_mongodb_connection_string

# Authentication
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=7d

# Application
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

4. **Run the development server**
```bash
npm run dev
# or
yarn dev
```

5. **Open your browser**

Navigate to [http://localhost:3000](http://localhost:3000)

### 🎯 First Time Setup Guide

**Important**: To fully test the application, you need to create accounts in the following order:

#### Step 1: Create a Provider Account
1. Click on **"Create Account"** on the login page
2. Select **"Healthcare Provider"** as the user type
3. Fill in the provider details:
   - Email, Password, Name, Phone
   - Select a **Specialty** (e.g., General Practice, Cardiology)
   - Enter a unique **License Number** (e.g., MED12345)
4. Click **"Register"** to create the provider account
5. You'll be redirected to the provider dashboard
6. **Set your availability**: Click "Set Availability" to configure your working hours
7. Log out after setting availability

#### Step 2: Create a Patient Account
1. Return to the login page and click **"Create Account"**
2. Select **"Patient"** as the user type
3. Fill in the patient details:
   - Email, Password, Name, Phone
   - Date of Birth, Address
   - Emergency Contact information
4. Click **"Register"** to create the patient account
5. You'll be redirected to the patient dashboard

#### Step 3: Book an Appointment
1. As a patient, click **"Book Appointment"**
2. You'll now see the provider you created in Step 1 in the providers list
3. Follow the 5-step booking process:
   - Select the provider
   - Choose a date
   - Pick an available time slot
   - Add reason for visit
   - Review and confirm

#### Step 4: Manage Appointments (Provider)
1. Log out from the patient account
2. Log in with the provider credentials
3. View appointments from the dashboard or appointments page
4. Click on any appointment to view details
5. **Manage appointment status**:
   - **Confirm** the appointment to acknowledge the booking
   - **Complete** the appointment after the consultation
   - **Cancel** if needed (with reason)
6. Add **notes** or **prescriptions** for completed appointments
7. View patient information and appointment history

#### Step 5: Rate & Review (Patient)
1. Log back in with the patient account
2. Go to the **Appointments** page from the dashboard
3. Find **completed** appointments
4. Click on a completed appointment to view details
5. **Provide feedback**:
   - Give a **rating** (1-5 stars) for the consultation
   - Add **patient feedback** comments about your experience
6. View your appointment history and upcoming appointments

### 📊 Complete User Flow

```
Provider Setup:
1. Register as Provider → 2. Set Availability → 3. Log out

Patient Booking:
4. Register as Patient → 5. Book Appointment → 6. Wait for confirmation

Provider Management:
7. Provider logs in → 8. Views appointments → 9. Confirms/Completes appointment

Patient Feedback:
10. Patient logs in → 11. Views completed appointments → 12. Rates provider
```


### Building for Production

```bash
# Build the application
npm run build

# Start production server
npm start
```

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

### Type Checking

```bash
npm run type-check
```

---

## 🔑 Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `MONGODB_URI` | MongoDB connection string | Yes | - |
| `JWT_SECRET` | Secret key for JWT signing | Yes | - |
| `JWT_EXPIRES_IN` | JWT token expiration time | No | `7d` |
| `NEXT_PUBLIC_APP_URL` | Application base URL | No | `http://localhost:3000` |
| `NODE_ENV` | Environment mode | No | `development` |

### Generating JWT Secret

```bash
# Generate a secure random secret
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

---

## 📁 Project Structure

```
healthcare-appointment-system/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── (auth)/                   # Auth route group
│   │   │   └── login/                # Login page
│   │   ├── api/                      # API routes
│   │   │   ├── appointments/         # Appointment endpoints
│   │   │   │   ├── [id]/            # Dynamic appointment routes
│   │   │   │   └── route.ts         # List/Create appointments
│   │   │   ├── auth/                # Authentication endpoints
│   │   │   │   ├── login/           # Login endpoint
│   │   │   │   └── register/        # Registration endpoints
│   │   │   ├── patients/            # Patient endpoints
│   │   │   └── providers/           # Provider endpoints
│   │   │       └── availability/    # Availability management
│   │   ├── appointments/            # Appointment pages
│   │   │   ├── [id]/               # Appointment detail page
│   │   │   ├── new/                # Book appointment page
│   │   │   └── page.tsx            # Appointments list
│   │   ├── auth/                   # Auth pages
│   │   │   ├── login/              # Login page
│   │   │   └── register/           # Registration page
│   │   ├── dashboard/              # Dashboard page
│   │   ├── patients/               # Patients list page
│   │   ├── providers/              # Providers list page
│   │   ├── settings/               # Settings pages
│   │   │   └── availability/       # Provider availability settings
│   │   ├── globals.css             # Global styles
│   │   ├── layout.tsx              # Root layout
│   │   └── page.tsx                # Home page
│   ├── components/                 # Reusable components
│   │   ├── AvailableSlots.tsx     # Time slot picker
│   │   ├── Header.tsx             # Navigation header
│   │   ├── ThemeProvider.tsx      # MUI theme provider
│   │   └── ValidationProgressBar.tsx # Form validation indicator
│   ├── lib/                        # Utility libraries
│   │   ├── auth/                   # Authentication utilities
│   │   │   ├── jwt.ts             # JWT token handling
│   │   │   └── password.ts        # Password hashing
│   │   ├── db/                     # Database utilities
│   │   │   └── connection.ts      # MongoDB connection
│   │   ├── middleware/             # Middleware functions
│   │   │   └── auth.middleware.ts # Auth middleware
│   │   ├── theme/                  # Theme configuration
│   │   │   └── theme.ts           # MUI theme
│   │   └── utils/                  # Helper utilities
│   │       ├── cn.ts              # Class name utility
│   │       ├── date.ts            # Date utilities
│   │       └── errors.ts          # Error handling
│   ├── models/                     # Mongoose models
│   │   ├── Appointment.ts         # Appointment schema
│   │   ├── MedicalRecord.ts       # Medical record schema
│   │   ├── Patient.ts             # Patient schema
│   │   ├── Provider.ts            # Provider schema
│   │   └── User.ts                # Base user schema
│   ├── repositories/               # Data access layer
│   │   ├── appointment.repository.ts
│   │   ├── patient.repository.ts
│   │   └── provider.repository.ts
│   ├── services/                   # Business logic layer
│   │   ├── appointment.service.ts
│   │   └── auth.service.ts
│   ├── types/                      # TypeScript types
│   │   └── index.ts               # Shared type definitions
│   └── validators/                 # Zod validation schemas
│       ├── appointment.validator.ts
│       ├── auth.validator.ts
│       └── provider.validator.ts
├── __tests__/                      # Test files
│   ├── services/                   # Service tests
│   └── utils/                      # Utility tests
├── .env                            # Environment variables
├── .eslintrc.json                  # ESLint configuration
├── .gitignore                      # Git ignore rules
├── jest.config.js                  # Jest configuration
├── jest.setup.js                   # Jest setup
├── next.config.js                  # Next.js configuration
├── package.json                    # Dependencies
├── postcss.config.js               # PostCSS configuration
├── tailwind.config.ts              # Tailwind configuration
├── tsconfig.json                   # TypeScript configuration
└── README.md                       # This file
```

### Key Directories Explained

- **`src/app/api/`**: Serverless API routes following Next.js 15 conventions
- **`src/models/`**: Mongoose schemas defining database structure
- **`src/repositories/`**: Data access layer abstracting database operations
- **`src/services/`**: Business logic layer containing application rules
- **`src/validators/`**: Zod schemas for request/response validation
- **`src/lib/`**: Shared utilities and helper functions
- **`src/components/`**: Reusable React components

---

## 🚀 Deployment

### Vercel Deployment (Recommended)

This application is deployed on Vercel with automatic CI/CD pipeline.

**Live URL**: [https://flowstack-virid.vercel.app/](https://flowstack-virid.vercel.app/)

#### Deployment Steps:

1. **Connect Repository**
   - Push your code to GitHub
   - Import project in Vercel dashboard
   - Connect your GitHub repository

2. **Configure Environment Variables**
   - Add all environment variables in Vercel dashboard
   - Settings → Environment Variables
   - Add variables for Production, Preview, and Development

3. **Configure Build Settings**
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Install Command: `npm install`

4. **Deploy**
   - Vercel automatically deploys on push to main branch
   - Preview deployments for pull requests
   - Production deployment on merge to main

#### CI/CD Pipeline

The application uses Vercel's built-in CI/CD:

```yaml
# Automatic workflow:
1. Push to GitHub
2. Vercel detects changes
3. Runs: npm install
4. Runs: npm run build
5. Runs: npm run lint (optional)
6. Deploys to production/preview
7. Provides deployment URL
```

### Manual Deployment

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy to production
vercel --prod
```

### Environment Variables for Production

Ensure these are set in Vercel:
- `MONGODB_URI`: Production MongoDB connection string
- `JWT_SECRET`: Strong secret key for production
- `JWT_EXPIRES_IN`: Token expiration (e.g., 7d)
- `NEXT_PUBLIC_APP_URL`: Your production URL
- `NODE_ENV`: production

---

## 🧪 Testing

### Test Structure

```
src/__tests__/
├── services/
│   ├── appointment.service.test.ts
│   └── auth.service.test.ts
└── utils/
    └── date.test.ts
```

### Running Tests

```bash
# Run all tests
npm test

# Watch mode for development
npm run test:watch

# Generate coverage report
npm run test:coverage

# Type checking
npm run type-check
```

### Test Coverage

The application includes unit tests for:
- Authentication service
- Appointment service
- Date utility functions
- Validation schemas

---

## 📝 License

This project is licensed under the MIT License.

---

## 👥 Authors

- **Anushka Gupta**

---