# How the Appointment System Works

## 🏥 Overview

The Healthcare Appointment Management System prevents double-booking and ensures appointments are scheduled within provider availability windows. Here's how it all works:

## 📅 Step-by-Step Flow

### Step 1: Provider Sets Availability

**What happens:**
- Provider logs in and goes to **Dashboard → Availability**
- Sets working hours for each day (e.g., Monday-Friday 9 AM - 5 PM)
- Saves availability

**Why it matters:**
- Patients can ONLY book appointments during these hours
- Prevents booking outside working hours

**Example:**
```
Monday:    9:00 AM - 5:00 PM ✓ Available
Tuesday:   9:00 AM - 5:00 PM ✓ Available
Wednesday: 9:00 AM - 5:00 PM ✓ Available
Thursday:  9:00 AM - 5:00 PM ✓ Available
Friday:    9:00 AM - 5:00 PM ✓ Available
Saturday:  ✗ Not Available
Sunday:    ✗ Not Available
```

### Step 2: Patient Books Appointment

**What happens:**
1. Patient logs in and goes to **Book Appointment**
2. Selects a provider
3. Chooses date and time
4. Selects duration (15 min, 30 min, 1 hour, etc.)
5. Enters reason for visit
6. Clicks "Book Appointment"

**System checks:**
- ✅ Is the appointment at least 2 hours from now?
- ✅ Is the appointment within provider's availability window?
- ✅ Does the appointment conflict with existing appointments?
- ✅ Has the provider reached their daily limit?

### Step 3: Conflict Detection

**How double-booking is prevented:**

The system checks for **time overlaps**. If a provider has:
- **Appointment 1:** 12:30 PM - 1:00 PM

Then these bookings will be **REJECTED**:
- ❌ 12:00 PM - 12:45 PM (overlaps at start)
- ❌ 12:32 PM - 1:15 PM (overlaps in middle)
- ❌ 12:15 PM - 12:50 PM (completely overlaps)
- ❌ 12:30 PM - 1:00 PM (exact same time)

But these will be **ACCEPTED**:
- ✅ 11:00 AM - 12:30 PM (ends exactly when next starts)
- ✅ 1:00 PM - 1:30 PM (starts exactly when previous ends)
- ✅ 2:00 PM - 2:30 PM (completely separate)

## 🔍 Technical Implementation

### Availability Validation

**Code in `src/services/appointment.service.ts`:**

```typescript
// Check if appointment is within provider's availability
const dayOfWeek = startTime.getDay()  // 0=Sunday, 1=Monday, etc.
const timeString = `${hours}:${minutes}`  // "14:30"

const isWithinAvailability = provider.availability.some((avail) => {
  return (
    avail.dayOfWeek === dayOfWeek &&      // Same day of week
    avail.isActive &&                      // Availability is active
    timeString >= avail.startTime &&       // After start time
    timeString < avail.endTime             // Before end time
  )
})

if (!isWithinAvailability) {
  throw new ValidationError('Appointment time is outside provider availability')
}
```

### Conflict Detection

**Code in `src/repositories/appointment.repository.ts`:**

```typescript
async findConflictingAppointments(
  providerId: string,
  startTime: Date,
  endTime: Date
): Promise<IAppointment[]> {
  return Appointment.find({
    providerId,
    deletedAt: null,
    status: { $nin: ['cancelled', 'no_show'] },
    $or: [
      // New appointment starts during existing appointment
      { startTime: { $gte: startTime, $lt: endTime } },
      
      // New appointment ends during existing appointment
      { endTime: { $gt: startTime, $lte: endTime } },
      
      // New appointment completely contains existing appointment
      { startTime: { $lte: startTime }, endTime: { $gte: endTime } }
    ]
  })
}
```

### Daily Limit Check

**Code in `src/services/appointment.service.ts`:**

```typescript
// Check if provider has reached daily appointment limit
const appointmentCount = await this.appointmentRepo.countByProviderAndDate(
  input.providerId,
  startTime
)

if (appointmentCount >= provider.maxDailyAppointments) {
  throw new ConflictError('Provider has reached maximum appointments for this day')
}
```

## 🚀 Complete Setup Guide

### For Providers:

1. **Register as Provider**
   - Go to `/auth/register`
   - Click "Register as Provider"
   - Fill in details (name, email, specialty, license)

2. **Set Availability**
   - Go to `/dashboard`
   - Click "Manage" under Availability
   - Set working hours for each day
   - Click "Save Availability"

3. **View Appointments**
   - Go to `/appointments`
   - See all booked appointments

### For Patients:

1. **Register as Patient**
   - Go to `/auth/register`
   - Click "Register as Patient"
   - Fill in details (name, email, address, emergency contact)

2. **Browse Providers**
   - Go to `/providers`
   - See all available providers

3. **Book Appointment**
   - Go to `/appointments/new`
   - Select provider
   - Choose date/time (must be within provider's availability)
   - Select duration
   - Enter reason
   - Click "Book Appointment"

4. **View Appointments**
   - Go to `/appointments`
   - See all your appointments
   - Click on appointment to view details
   - Cancel if needed (24+ hours before)

## ⚠️ Common Errors & Solutions

### Error: "Appointment time is outside provider availability"

**Cause:** You're trying to book outside provider's working hours

**Solution:**
1. Ask provider to set their availability first
2. Check provider's availability hours
3. Book within those hours

**Example:**
- Provider available: Monday-Friday 9 AM - 5 PM
- ❌ Can't book: Saturday 2 PM
- ❌ Can't book: Monday 6 PM
- ✅ Can book: Monday 2 PM

### Error: "Time slot is not available"

**Cause:** Another appointment already booked at that time

**Solution:**
1. Choose a different time
2. Check provider's schedule
3. Book at least 30 minutes after previous appointment

**Example:**
- Existing appointment: 2:00 PM - 2:30 PM
- ❌ Can't book: 2:15 PM - 2:45 PM (overlaps)
- ✅ Can book: 2:30 PM - 3:00 PM (no overlap)

### Error: "Provider has reached maximum appointments for this day"

**Cause:** Provider has too many appointments already

**Solution:**
1. Choose a different day
2. Ask provider to increase daily limit
3. Book on a less busy day

## 📊 Database Indexes for Performance

The system uses strategic MongoDB indexes to make these checks fast:

```javascript
// Query appointments by provider and date range
{ providerId: 1, startTime: 1 }

// Query appointments by patient
{ patientId: 1, startTime: -1 }

// Query by status and date
{ status: 1, startTime: 1 }
```

These indexes ensure conflict detection is **O(log n)** instead of **O(n)**.

## 🔒 Business Rules Enforced

1. **Minimum 2-hour advance booking**
   - Can't book appointments less than 2 hours from now

2. **No overlapping appointments**
   - Two appointments can't overlap by even 1 minute

3. **Within provider availability**
   - Can only book during provider's set hours

4. **Daily appointment limit**
   - Default: 8 appointments per day
   - Configurable per provider

5. **24-hour cancellation policy**
   - Patients can only cancel 24+ hours before
   - Providers can cancel anytime

## 📈 Example Scenario

**Provider Setup:**
- Dr. Sarah Johnson
- Specialty: Cardiology
- Available: Monday-Friday 9 AM - 5 PM
- Max appointments: 8 per day
- Appointment duration: 30 minutes

**Patient Bookings:**

| Time | Patient | Status | Reason |
|------|---------|--------|--------|
| 9:00 - 9:30 | John | ✅ Booked | Regular checkup |
| 9:30 - 10:00 | Jane | ✅ Booked | Heart palpitations |
| 10:00 - 10:30 | Bob | ✅ Booked | Blood pressure check |
| 10:30 - 11:00 | Alice | ✅ Booked | Medication review |
| 11:00 - 11:30 | Charlie | ✅ Booked | Follow-up |
| 11:30 - 12:00 | Diana | ✅ Booked | Consultation |
| 12:00 - 1:00 | - | 🍽️ Lunch | - |
| 1:00 - 1:30 | Eve | ✅ Booked | ECG test |
| 1:30 - 2:00 | Frank | ✅ Booked | Stress test |

**Attempted Bookings:**

| Time | Patient | Status | Reason |
|------|---------|--------|--------|
| 9:15 - 9:45 | George | ❌ Rejected | Overlaps with John's appointment |
| 2:00 - 2:30 | Helen | ✅ Booked | No conflict |
| 6:00 - 6:30 | Ivan | ❌ Rejected | Outside availability (after 5 PM) |
| Saturday 2 PM | Jack | ❌ Rejected | Provider not available Saturday |

## 🎯 Key Takeaways

1. **Providers must set availability first** - Patients can only book within those hours
2. **No overlapping appointments** - System prevents double-booking automatically
3. **Minimum 2-hour advance** - Can't book last-minute appointments
4. **Daily limits** - Prevents provider overload
5. **Cancellation policy** - Patients need 24 hours notice

This ensures a smooth, conflict-free appointment system! 🚀
