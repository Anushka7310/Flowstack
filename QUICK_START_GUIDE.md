# Quick Start Guide - HealthCare+ Application

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- MongoDB Atlas account
- Git

### Installation

```bash
# 1. Clone repository
git clone <repo-url>
cd healthcare-appointment-system

# 2. Install dependencies
npm install

# 3. Set up environment variables
# Create .env file with:
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development

# 4. Run development server
npm run dev

# 5. Open browser
# Visit http://localhost:3000
```

## 📝 First Time Setup

### 1. Create Account
- Go to http://localhost:3000
- Click "Get Started"
- Choose "Patient" or "Provider"
- Fill in the form
- Click "Create Account"

### 2. Login
- Go to http://localhost:3000/auth/login
- Enter email and password
- Click "Sign In"

### 3. Explore Dashboard
- View your appointments
- See statistics
- Access quick actions

## 🎯 Main Features

### For Patients
- ✅ Browse healthcare providers
- ✅ Book appointments
- ✅ View appointment history
- ✅ Rate providers
- ✅ View prescriptions

### For Providers
- ✅ Manage appointments
- ✅ Set availability
- ✅ Confirm/reject appointments
- ✅ Complete appointments
- ✅ Add notes and prescriptions

## 📱 Pages Overview

| URL | Purpose |
|-----|---------|
| `/` | Home page |
| `/auth/login` | Login |
| `/auth/register` | Register |
| `/dashboard` | Dashboard |
| `/appointments` | Appointments list |
| `/appointments/new` | Book appointment |
| `/appointments/:id` | Appointment details |
| `/providers` | Browse providers |
| `/patients` | Patient list (provider only) |
| `/settings/availability` | Set availability (provider only) |

## 🔧 Development Commands

```bash
# Development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Run tests
npm run test

# Run tests in watch mode
npm run test:watch

# Check test coverage
npm run test:coverage

# Type checking
npm run type-check

# Linting
npm run lint
```

## 🎨 UI Components

### Material-UI Components Used
- Button
- Card
- TextField
- Dialog
- Alert
- Chip
- Rating
- Table
- Grid
- Stack
- Box
- Typography
- AppBar
- Menu
- Avatar

### Custom Components
- Header
- ThemeProvider
- ValidationProgressBar

## 🔐 Authentication

### Login Flow
1. User enters email and password
2. API validates credentials
3. JWT token generated
4. Token stored in localStorage
5. User redirected to dashboard

### Protected Routes
- All pages except `/` and `/auth/*` require authentication
- Token checked on page load
- Redirects to login if not authenticated

## 📊 Database Schema

### Collections
- **users** - User accounts
- **patients** - Patient profiles
- **providers** - Provider profiles
- **appointments** - Appointment records
- **medical_records** - Medical history

## 🐛 Troubleshooting

### Issue: "Hydration mismatch" error
**Solution**: Refresh the page. This is fixed in the latest version.

### Issue: "Cannot find module"
**Solution**: Run `npm install` to install dependencies.

### Issue: "MongoDB connection failed"
**Solution**: Check MONGODB_URI in .env file.

### Issue: "Port 3000 already in use"
**Solution**: Run on different port: `npm run dev -- -p 3001`

### Issue: "Register form not working"
**Solution**: Check browser console for errors. Ensure all fields are filled correctly.

## 📚 Documentation

- **FINAL_SUMMARY.md** - Complete project summary
- **UI_REDESIGN_COMPLETE.md** - UI implementation details
- **MATERIAL_DESIGN_3_GUIDE.md** - Component usage guide
- **HYDRATION_FIXES.md** - Hydration error fixes
- **API_DOCUMENTATION.md** - API endpoints
- **ARCHITECTURE.md** - System architecture

## 🚀 Deployment

### Deploy to Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel deploy --prod
```

### Environment Variables for Production
```
MONGODB_URI=production_mongodb_uri
JWT_SECRET=production_jwt_secret
NEXT_PUBLIC_APP_URL=https://your-domain.com
NODE_ENV=production
```

## 📞 Support

### Common Questions

**Q: How do I reset my password?**
A: Currently not implemented. Contact admin.

**Q: Can I change my role after registration?**
A: No, role is fixed at registration.

**Q: How do I delete my account?**
A: Currently not implemented. Contact admin.

**Q: Can I book multiple appointments?**
A: Yes, unlimited appointments.

**Q: What's the cancellation policy?**
A: Appointments can be cancelled 24 hours before.

## ✅ Checklist Before Deployment

- [ ] All environment variables set
- [ ] MongoDB connection working
- [ ] Build completes without errors
- [ ] All pages load correctly
- [ ] Forms work properly
- [ ] Authentication works
- [ ] No console errors
- [ ] Responsive design verified
- [ ] Performance acceptable

## 🎉 You're Ready!

The application is now ready to use. Start by:
1. Creating an account
2. Exploring the dashboard
3. Testing features
4. Providing feedback

Enjoy using HealthCare+! 🏥

---

**Last Updated**: January 16, 2026  
**Version**: 1.0.0  
**Status**: Production Ready
