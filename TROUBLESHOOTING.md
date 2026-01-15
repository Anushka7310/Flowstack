# Troubleshooting Guide

## 🔴 Common Issues & Solutions

### Issue 1: "Appointment time is outside provider availability"

**What it means:** You're trying to book an appointment when the provider is not available.

**How to fix:**

1. **Check provider's availability:**
   - Go to `/providers`
   - Look at the provider's specialty and info
   - Note their working hours

2. **Provider needs to set availability:**
   - Provider logs in
   - Goes to Dashboard → Availability
   - Sets working hours (e.g., Monday-Friday 9 AM - 5 PM)
   - Saves

3. **Try booking again:**
   - Go to `/appointments/new`
   - Select the provider
   - Choose a date/time within their availability
   - Book

**Example:**
```
Provider: Dr. Sarah Johnson
Available: Monday-Friday 9 AM - 5 PM

❌ Can't book: Saturday 2 PM (not available Saturday)
❌ Can't book: Monday 6 PM (after 5 PM)
✅ Can book: Monday 2 PM (within hours)
```

---

### Issue 2: "Time slot is not available"

**What it means:** Another patient already has an appointment at that time.

**How to fix:**

1. **Choose a different time:**
   - Go to `/appointments/new`
   - Try a different time slot
   - Make sure it doesn't overlap with existing appointments

2. **Check existing appointments:**
   - Go to `/appointments`
   - See what times are already booked
   - Choose a free slot

3. **Remember appointment duration:**
   - If you book 30 minutes at 2:00 PM
   - It occupies 2:00 PM - 2:30 PM
   - Next appointment can start at 2:30 PM

**Example:**
```
Existing: 2:00 PM - 2:30 PM (John's appointment)

❌ Can't book: 2:15 PM - 2:45 PM (overlaps)
❌ Can't book: 2:00 PM - 2:30 PM (exact same time)
✅ Can book: 2:30 PM - 3:00 PM (no overlap)
✅ Can book: 1:30 PM - 2:00 PM (no overlap)
```

---

### Issue 3: "Provider has reached maximum appointments for this day"

**What it means:** The provider already has too many appointments today.

**How to fix:**

1. **Choose a different day:**
   - Go to `/appointments/new`
   - Select a different date
   - Try booking on a less busy day

2. **Provider can increase limit:**
   - Provider logs in
   - Goes to Dashboard → Availability
   - Increases "Max Daily Appointments" (default: 8)
   - Saves

3. **Try booking again:**
   - Go to `/appointments/new`
   - Book on the new day

**Example:**
```
Provider: Dr. Sarah Johnson
Max appointments per day: 8
Today's appointments: 8 (FULL)

❌ Can't book: Today (already has 8 appointments)
✅ Can book: Tomorrow (only has 3 appointments)
```

---

### Issue 4: "Appointments must be booked at least 2 hours in advance"

**What it means:** You're trying to book an appointment too soon.

**How to fix:**

1. **Choose a future time:**
   - Go to `/appointments/new`
   - Select a date/time at least 2 hours from now
   - Book

**Example:**
```
Current time: 2:00 PM

❌ Can't book: 2:30 PM (only 30 minutes away)
❌ Can't book: 3:00 PM (only 1 hour away)
✅ Can book: 4:00 PM (2 hours away)
✅ Can book: Tomorrow 2:00 PM (24+ hours away)
```

---

### Issue 5: "Email already registered"

**What it means:** Someone already created an account with that email.

**How to fix:**

1. **Use a different email:**
   - Go to `/auth/register`
   - Use a different email address
   - Register

2. **Or login if you already have an account:**
   - Go to `/auth/login`
   - Enter your email and password
   - Login

---

### Issue 6: "Invalid email or password"

**What it means:** Your login credentials are wrong.

**How to fix:**

1. **Check your email:**
   - Make sure you typed it correctly
   - Check for typos

2. **Check your password:**
   - Make sure you typed it correctly
   - Passwords are case-sensitive

3. **Forgot password?**
   - Currently not implemented
   - Register a new account with a different email

---

### Issue 7: No providers showing in dropdown

**What it means:** No providers have registered yet.

**How to fix:**

1. **Register a provider account:**
   - Go to `/auth/register`
   - Click "Register as Provider"
   - Fill in all fields
   - Click "Create Account"

2. **Provider must set availability:**
   - Provider logs in
   - Goes to Dashboard → Availability
   - Sets working hours
   - Saves

3. **Now try booking:**
   - Go to `/appointments/new`
   - Provider should appear in dropdown

---

### Issue 8: Can't cancel appointment

**What it means:** You're trying to cancel too close to the appointment time.

**How to fix:**

1. **Check cancellation window:**
   - Patients can only cancel 24+ hours before
   - Providers can cancel anytime

2. **Wait or contact provider:**
   - If less than 24 hours away, you can't cancel
   - Contact the provider directly to cancel

**Example:**
```
Appointment: Monday 2:00 PM

Current time: Sunday 1:00 PM
❌ Can't cancel (only 23 hours away)

Current time: Sunday 12:00 PM
✅ Can cancel (24+ hours away)
```

---

### Issue 9: "Database connection failed"

**What it means:** The app can't connect to MongoDB.

**How to fix:**

1. **Check `.env.local` file:**
   - Make sure it exists in root directory
   - Should have `MONGODB_URI` set

2. **Check MongoDB connection string:**
   - Go to MongoDB Atlas
   - Get your connection string
   - Make sure password is correct
   - Make sure special characters are URL-encoded

3. **Check IP whitelist:**
   - Go to MongoDB Atlas → Network Access
   - Make sure your IP is whitelisted
   - Or allow "0.0.0.0/0" for development

4. **Restart dev server:**
   ```bash
   npm run dev
   ```

---

### Issue 10: Getting HTML error instead of JSON

**What it means:** The API is crashing and returning an error page.

**How to fix:**

1. **Check browser console (F12):**
   - Open DevTools
   - Go to Console tab
   - Look for error messages

2. **Check Network tab:**
   - Go to Network tab
   - Find the failed request
   - Click on it
   - Look at Response tab for error details

3. **Check terminal:**
   - Look at terminal where `npm run dev` is running
   - See if there are error messages

4. **Common causes:**
   - MongoDB not connected
   - Missing environment variables
   - Invalid data format
   - Server error

---

## 🔧 Debug Checklist

Before reporting an issue, check:

- [ ] `.env.local` file exists with `MONGODB_URI`
- [ ] MongoDB Atlas cluster is running
- [ ] Your IP is whitelisted in MongoDB Atlas
- [ ] Dev server is running (`npm run dev`)
- [ ] You're using correct email/password
- [ ] Provider has set availability
- [ ] Appointment is within provider's hours
- [ ] Appointment is at least 2 hours from now
- [ ] No conflicting appointments at that time
- [ ] Browser console shows no errors (F12)

---

## 📞 Getting Help

If you're still stuck:

1. **Check the logs:**
   - Terminal where `npm run dev` is running
   - Browser console (F12)
   - Network tab (F12 → Network)

2. **Read the documentation:**
   - `HOW_APPOINTMENTS_WORK.md` - How the system works
   - `API_DOCUMENTATION.md` - API endpoints
   - `ARCHITECTURE.md` - System design

3. **Try the demo flow:**
   - Register provider
   - Set provider availability
   - Register patient
   - Book appointment
   - View appointment

---

## 🚀 Quick Start Checklist

To get everything working:

1. ✅ Create `.env.local` with `MONGODB_URI`
2. ✅ Run `npm run dev`
3. ✅ Register provider account
4. ✅ Provider sets availability
5. ✅ Register patient account
6. ✅ Patient books appointment
7. ✅ View appointment

That's it! 🎉
