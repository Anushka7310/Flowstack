# API Documentation

Base URL: `https://your-app.vercel.app/api`

## Authentication

All protected endpoints require a Bearer token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## Response Format

All responses follow this structure:

```typescript
{
  success: boolean
  data?: any
  error?: string
  message?: string
}
```

## Endpoints

### Authentication

#### Register Patient

```http
POST /api/auth/register/patient
```

**Request Body:**
```json
{
  "email": "patient@example.com",
  "password": "Password123",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+1234567890",
  "dateOfBirth": "1990-01-01",
  "address": "123 Main St, City, State",
  "emergencyContact": {
    "name": "Jane Doe",
    "phone": "+1234567891",
    "relationship": "Spouse"
  },
  "insuranceInfo": {
    "provider": "Blue Cross",
    "policyNumber": "BC123456"
  }
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "userId": "507f1f77bcf86cd799439011"
  },
  "message": "Patient registered successfully"
}
```

**Validation Rules:**
- Email: Valid email format
- Password: Min 8 chars, 1 uppercase, 1 lowercase, 1 number
- Phone: E.164 format
- Date of Birth: Valid date, age 0-120

---

#### Register Provider

```http
POST /api/auth/register/provider
```

**Request Body:**
```json
{
  "email": "provider@example.com",
  "password": "Password123",
  "firstName": "Dr. Jane",
  "lastName": "Smith",
  "phone": "+1234567890",
  "specialty": "cardiology",
  "licenseNumber": "LIC123456",
  "maxDailyAppointments": 8
}
```

**Specialties:**
- `general_practice`
- `cardiology`
- `dermatology`
- `pediatrics`
- `orthopedics`
- `psychiatry`

**Response:** `201 Created`
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "userId": "507f1f77bcf86cd799439012"
  },
  "message": "Provider registered successfully"
}
```

---

#### Login

```http
POST /api/auth/login
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "Password123"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "userId": "507f1f77bcf86cd799439011",
    "role": "patient"
  },
  "message": "Login successful"
}
```

**Roles:**
- `patient`
- `provider`
- `admin`

---

### Appointments

#### Create Appointment

```http
POST /api/appointments
```

**Authorization:** Patient only

**Request Body:**
```json
{
  "providerId": "507f1f77bcf86cd799439012",
  "startTime": "2024-01-20T10:00:00Z",
  "duration": 30,
  "reason": "Regular checkup"
}
```

**Business Rules:**
- Must be booked at least 2 hours in advance
- Duration: 15-120 minutes
- Provider must be available at requested time
- No conflicting appointments
- Provider daily limit not exceeded

**Response:** `201 Created`
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439013",
    "patientId": "507f1f77bcf86cd799439011",
    "providerId": "507f1f77bcf86cd799439012",
    "startTime": "2024-01-20T10:00:00.000Z",
    "endTime": "2024-01-20T10:30:00.000Z",
    "status": "scheduled",
    "reason": "Regular checkup",
    "patientSnapshot": {
      "firstName": "John",
      "lastName": "Doe",
      "email": "patient@example.com",
      "phone": "+1234567890"
    },
    "createdAt": "2024-01-15T08:00:00.000Z",
    "updatedAt": "2024-01-15T08:00:00.000Z"
  },
  "message": "Appointment created successfully"
}
```

**Error Responses:**

`400 Bad Request` - Validation error
```json
{
  "success": false,
  "error": "Appointments must be booked at least 2 hours in advance"
}
```

`404 Not Found` - Provider not found
```json
{
  "success": false,
  "error": "Provider not found or inactive"
}
```

`409 Conflict` - Time slot unavailable
```json
{
  "success": false,
  "error": "Time slot is not available"
}
```

---

#### Get Appointments

```http
GET /api/appointments?page=1&limit=10
```

**Authorization:** Patient or Provider

**Query Parameters:**
- `page` (optional): Page number, default 1
- `limit` (optional): Items per page, default 10, max 100
- `startDate` (optional, provider only): Filter start date (ISO 8601)
- `endDate` (optional, provider only): Filter end date (ISO 8601)

**Patient Response:** Returns patient's appointments
```json
{
  "success": true,
  "data": {
    "appointments": [
      {
        "_id": "507f1f77bcf86cd799439013",
        "providerId": {
          "firstName": "Dr. Jane",
          "lastName": "Smith",
          "specialty": "cardiology"
        },
        "startTime": "2024-01-20T10:00:00.000Z",
        "endTime": "2024-01-20T10:30:00.000Z",
        "status": "scheduled",
        "reason": "Regular checkup"
      }
    ],
    "total": 5
  }
}
```

**Provider Response:** Returns provider's appointments in date range
```json
{
  "success": true,
  "data": {
    "appointments": [
      {
        "_id": "507f1f77bcf86cd799439013",
        "patientSnapshot": {
          "firstName": "John",
          "lastName": "Doe",
          "phone": "+1234567890"
        },
        "startTime": "2024-01-20T10:00:00.000Z",
        "endTime": "2024-01-20T10:30:00.000Z",
        "status": "scheduled",
        "reason": "Regular checkup"
      }
    ],
    "total": 12
  }
}
```

---

#### Get Appointment by ID

```http
GET /api/appointments/:id
```

**Authorization:** Patient (own appointments) or Provider (own appointments)

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439013",
    "patientId": {
      "firstName": "John",
      "lastName": "Doe",
      "email": "patient@example.com",
      "phone": "+1234567890"
    },
    "providerId": {
      "firstName": "Dr. Jane",
      "lastName": "Smith",
      "specialty": "cardiology"
    },
    "startTime": "2024-01-20T10:00:00.000Z",
    "endTime": "2024-01-20T10:30:00.000Z",
    "status": "scheduled",
    "reason": "Regular checkup",
    "notes": null
  }
}
```

---

#### Update Appointment

```http
PATCH /api/appointments/:id
```

**Authorization:** Patient (notes only) or Provider (status and notes)

**Request Body (Patient):**
```json
{
  "notes": "Please bring previous test results"
}
```

**Request Body (Provider):**
```json
{
  "status": "confirmed",
  "notes": "Patient confirmed via phone"
}
```

**Appointment Statuses:**
- `scheduled` - Initial state
- `confirmed` - Provider confirmed
- `completed` - Appointment finished
- `cancelled` - Cancelled by patient or provider
- `no_show` - Patient didn't show up

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439013",
    "status": "confirmed",
    "notes": "Patient confirmed via phone",
    ...
  },
  "message": "Appointment updated successfully"
}
```

---

#### Cancel Appointment

```http
DELETE /api/appointments/:id
```

**Authorization:** Patient or Provider

**Business Rules:**
- Patients can only cancel 24+ hours in advance
- Providers can cancel anytime
- Sets status to `cancelled`
- Soft delete (not removed from database)

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Appointment cancelled successfully"
}
```

**Error Response:**

`400 Bad Request` - Outside cancellation window
```json
{
  "success": false,
  "error": "Appointments can only be cancelled at least 24 hours in advance"
}
```

---

## Error Codes

| Status Code | Description |
|-------------|-------------|
| 400 | Bad Request - Validation error or business rule violation |
| 401 | Unauthorized - Missing or invalid token |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource doesn't exist |
| 409 | Conflict - Resource conflict (duplicate email, time slot taken) |
| 500 | Internal Server Error - Unexpected error |

## Rate Limiting

Currently not implemented. Recommended for production:
- Auth endpoints: 10 requests per 15 minutes per IP
- Other endpoints: 100 requests per 15 minutes per user

## Pagination

Endpoints that return lists support pagination:

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10, max: 100)

**Response includes:**
```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 45,
    "totalPages": 5
  }
}
```

## Testing with cURL

**Register Patient:**
```bash
curl -X POST https://your-app.vercel.app/api/auth/register/patient \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Password123",
    "firstName": "Test",
    "lastName": "User",
    "phone": "+1234567890",
    "dateOfBirth": "1990-01-01",
    "address": "123 Test St",
    "emergencyContact": {
      "name": "Emergency Contact",
      "phone": "+1234567891",
      "relationship": "Friend"
    }
  }'
```

**Login:**
```bash
curl -X POST https://your-app.vercel.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Password123"
  }'
```

**Create Appointment:**
```bash
curl -X POST https://your-app.vercel.app/api/appointments \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "providerId": "507f1f77bcf86cd799439012",
    "startTime": "2024-01-20T10:00:00Z",
    "duration": 30,
    "reason": "Regular checkup"
  }'
```

## Postman Collection

Import this collection for easy testing:

```json
{
  "info": {
    "name": "Healthcare Appointment System",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "variable": [
    {
      "key": "baseUrl",
      "value": "https://your-app.vercel.app/api"
    },
    {
      "key": "token",
      "value": ""
    }
  ]
}
```

Save your token after login and use `{{token}}` in Authorization headers.
