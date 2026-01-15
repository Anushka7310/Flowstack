# Testing Guide - Appointment System Fixes

## Prerequisites
- Application running on `http://localhost:3000`
- MongoDB connection working (check `.env` for `MONGODB_URI`)
- At least one provider and one patient registered

## Quick Test Checklist

### 1. Appointment Booking Flow
```
✓ Login as patient
✓ Navigate to /appointments/new
✓ Select a provider from dropdown
✓ Choose date and time
✓ Enter reason for visit
✓ Submit form
✓ Verify appointment appears in /appointments list
```

### 2. View Appointment Details (Patient)
```
✓ Login as patient
✓ Go to /appointments
✓ Click "View Details" on any appointment
✓ Verify you see:
  - Provider name and specialty
  - Appointment date and time
  - Reason for visit
  - Status badge
✓ No "Appointment not found" error
```

### 3. View Appointment Details (Provider)
```
✓ Login as provider
✓ Go to /appointments
✓ Click "View Details" on any appointment
✓ Verify you see:
  - Patient name, email, phone
  - Appointment date and time
  - Reason for visit
  - Status badge
✓ No "Appointment not found" error
```

### 4. Provider Actions - Confirm Appointment
```
✓ Login as provider
✓ Go to /appointments
✓ Click "View Details" on a "scheduled" appointment
✓ Click "Confirm Appointment" button
✓ Status changes to "confirmed"
✓ Button changes to show completion options
```

### 5. Provider Actions - Reject Appointment
```
✓ Login as provider
✓ Go to /appointments
✓ Click "View Details" on a "scheduled" appointment
✓ Click "Reject Appointment" button
✓ Status changes to "cancelled"
✓ Appointment appears as cancelled for patient
```

### 6. Provider Actions - Complete Appointment
```
✓ Login as provider
✓ Go to /appointments
✓ Click "View Details" on a "confirmed" appointment
✓ Add notes (required)
✓ Add prescription (optional)
✓ Click "Mark as Completed"
✓ Status changes to "completed"
✓ Notes and prescription are saved
```

### 7. Patient Rating System
```
✓ Login as patient
✓ Go to /appointments
✓ Click "View Details" on a "completed" appointment
✓ See "Rate Your Experience" section
✓ Click stars to select rating (1-5)
✓ Add optional feedback
✓ Click "Submit Rating"
✓ Rating appears with stars and feedback
```

### 8. Fetch Appointments List
```
✓ Login as patient
✓ Go to /appointments
✓ Verify list loads without errors
✓ See all appointments with:
  - Provider/Patient name
  - Date and time
  - Status badge
  - "View Details" link
✓ No "failed to fetch" errors
```

### 9. Authorization Tests
```
✓ Patient cannot view other patient's appointments
✓ Provider cannot view other provider's appointments
✓ Patient cannot update appointment status
✓ Provider can only see their own appointments
```

### 10. Error Handling
```
✓ Invalid appointment ID shows "Appointment not found"
✓ Unauthorized access shows "Access denied"
✓ Network errors show appropriate error messages
✓ All errors logged to browser console
```

## Browser Console Debugging

When testing, open browser DevTools (F12) and check Console tab for:

### Expected Logs
```
Fetching appointments...
Response status: 200
Appointments data: {...}
Fetching appointment: [id]
Response status: 200
Appointment data: {...}
```

### Error Logs to Watch For
```
Error response: {...}
Fetch error: ...
GET /api/appointments error: ...
PATCH /api/appointments/[id] error: ...
```

## API Endpoint Testing

### Test with cURL

#### Get Appointments List
```bash
curl -X GET http://localhost:3000/api/appointments \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json"
```

#### Get Single Appointment
```bash
curl -X GET http://localhost:3000/api/appointments/APPOINTMENT_ID \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json"
```

#### Update Appointment Status
```bash
curl -X PATCH http://localhost:3000/api/appointments/APPOINTMENT_ID \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status": "confirmed"}'
```

#### Complete Appointment with Notes
```bash
curl -X PATCH http://localhost:3000/api/appointments/APPOINTMENT_ID \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "completed",
    "notes": "Patient doing well",
    "prescription": "Take medication twice daily"
  }'
```

## Common Issues and Solutions

### Issue: "Appointment not found"
**Solution**: 
- Verify appointment ID is correct
- Check if appointment exists in database
- Ensure you're logged in as the correct user

### Issue: "Access denied"
**Solution**:
- Verify you're viewing your own appointment
- Check user role (patient/provider)
- Ensure JWT token is valid

### Issue: "Failed to fetch appointments"
**Solution**:
- Check MongoDB connection in `.env`
- Verify JWT token is valid
- Check browser console for detailed error
- Restart application

### Issue: Appointment details not loading
**Solution**:
- Clear browser cache
- Check network tab in DevTools
- Verify API response in Network tab
- Check server logs for errors

## Performance Testing

### Load Test - Fetch 100 Appointments
```bash
for i in {1..100}; do
  curl -X GET http://localhost:3000/api/appointments \
    -H "Authorization: Bearer YOUR_JWT_TOKEN" \
    -H "Content-Type: application/json"
done
```

### Response Time Check
- Appointment list should load in < 500ms
- Single appointment should load in < 300ms
- Update operations should complete in < 500ms

## Database Verification

### Check Appointments in MongoDB
```javascript
// In MongoDB shell
db.appointments.find().pretty()

// Count appointments
db.appointments.countDocuments()

// Find appointments for specific patient
db.appointments.find({ patientId: ObjectId("...") })

// Find appointments for specific provider
db.appointments.find({ providerId: ObjectId("...") })
```

## Cleanup After Testing

### Clear Test Data
```javascript
// In MongoDB shell
db.appointments.deleteMany({ reason: "Test appointment" })
```

## Success Criteria

All tests pass when:
- ✅ Appointments load without "not found" errors
- ✅ Details page shows complete information
- ✅ Provider actions update status correctly
- ✅ Patient ratings are saved
- ✅ Authorization checks work properly
- ✅ No console errors
- ✅ Response times are acceptable
- ✅ Database queries use indexes
