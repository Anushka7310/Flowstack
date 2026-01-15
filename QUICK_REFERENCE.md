# Quick Reference - New Features

## 🎨 Progress Bar (Registration)

**Where:** Registration form (`/auth/register`)

**What you see:**
- Progress bar at top of form
- Shows "X of Y fields" completed
- Color changes: Red → Yellow → Blue → Green

**How to use:**
1. Start filling form
2. Watch progress bar increase
3. Fill all fields to reach 100%
4. Submit button enables when complete

---

## 👨‍⚕️ Provider Actions (Appointment Management)

### Confirm Appointment

**When:** Appointment status is "scheduled"

**How:**
1. Login as provider
2. Go to `/appointments`
3. Click on appointment
4. Click "Confirm Appointment" button
5. Status changes to "confirmed"

**Result:** Patient sees appointment is confirmed

---

### Reject Appointment

**When:** Appointment status is "scheduled"

**How:**
1. Login as provider
2. Go to `/appointments`
3. Click on appointment
4. Click "Reject Appointment" button
5. Status changes to "cancelled"

**Result:** Patient sees appointment is cancelled

---

### Complete Appointment

**When:** Appointment status is "confirmed"

**How:**
1. Login as provider
2. Go to `/appointments`
3. Click on appointment
4. Scroll to "Complete Appointment" section
5. Add notes (required)
6. Add prescription (optional)
7. Click "Mark as Completed"

**Result:** 
- Status changes to "completed"
- Patient can now rate the appointment
- Patient sees notes and prescription

---

## ⭐ Patient Rating System

### Rate Provider

**When:** Appointment status is "completed"

**How:**
1. Login as patient
2. Go to `/appointments`
3. Click on completed appointment
4. Scroll to "Rate Your Experience" section
5. Click stars (1-5) to select rating
6. Add feedback text (optional)
7. Click "Submit Rating"

**Result:**
- Rating saved
- Provider can see your rating
- Rating displayed on appointment

---

### View Rating

**How:**
1. Go to appointment details
2. Scroll to "Patient Rating" section
3. See stars and feedback

---

## 📋 Prescription Management

### Add Prescription (Provider)

**When:** Completing appointment

**How:**
1. Click "Mark as Completed"
2. In "Complete Appointment" section
3. Fill "Prescription" field (optional)
4. Click "Mark as Completed"

**Example:**
```
Amoxicillin 500mg
Take 1 tablet 3 times daily
For 7 days
With food
```

---

### View Prescription (Patient)

**How:**
1. Go to appointment details
2. Scroll to "Prescription" section
3. Read prescription details

---

## 📊 Appointment Status Flow

```
Patient Books
    ↓
Status: "scheduled"
    ↓
Provider Confirms/Rejects
    ↓
If Confirmed:
    Status: "confirmed"
    ↓
    Provider Completes
    ↓
    Status: "completed"
    ↓
    Patient Rates
    ↓
    Rating Saved

If Rejected:
    Status: "cancelled"
    ↓
    Done
```

---

## 🔍 Troubleshooting

### Progress Bar Not Showing
- Make sure you're on registration page
- Refresh page if not visible

### Can't See Provider Actions
- Make sure you're logged in as provider
- Make sure appointment status is "scheduled"

### Can't Rate Appointment
- Appointment must be "completed" status
- Provider must have marked it complete

### Prescription Not Showing
- Provider must have added prescription
- Appointment must be "completed"

---

## 📱 Mobile Tips

- Progress bar works on mobile
- Star rating is touch-friendly
- Prescription text is readable on mobile
- All buttons are large enough to tap

---

## ✨ Pro Tips

1. **Providers:** Always add notes when completing appointments
2. **Providers:** Add prescription if patient needs medication
3. **Patients:** Rate appointments to help other patients
4. **Patients:** Read prescription carefully and follow instructions
5. **Both:** Check appointment status regularly for updates

---

## 🎯 Common Tasks

### As Provider:
1. Confirm appointment → Click "Confirm Appointment"
2. Complete appointment → Add notes → Add prescription → Click "Mark as Completed"
3. View patient rating → Scroll to "Patient Rating" section

### As Patient:
1. Book appointment → Select provider → Choose time → Submit
2. View appointment → Click on appointment in list
3. Rate provider → Click stars → Add feedback → Submit
4. View prescription → Scroll to "Prescription" section

---

## 📞 Need Help?

- Check `NEW_FEATURES.md` for detailed documentation
- Check `TROUBLESHOOTING.md` for common issues
- Check `HOW_APPOINTMENTS_WORK.md` for appointment system details
