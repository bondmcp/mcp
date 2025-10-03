# Healthcare Integration API Reference

**Base URL:** `https://t9xbkyb7mg.us-east-1.awsapprunner.com`

**API Version:** v1

## Authentication

All endpoints require Bearer token authentication unless otherwise specified.

```http
Authorization: Bearer <your_access_token>
```

---

## Patients API

### List Patients
```http
GET /api/v1/patients
```

**Query Parameters:**
- `limit` (integer, optional): Number of records to return (default: 50, max: 100)
- `offset` (integer, optional): Number of records to skip (default: 0)
- `search` (string, optional): Search by name, email, or phone

**Response:** `200 OK`
```json
{
  "data": [
    {
      "id": "pat_123abc",
      "first_name": "John",
      "last_name": "Doe",
      "email": "john.doe@example.com",
      "phone": "+1234567890",
      "date_of_birth": "1985-06-15",
      "gender": "male",
      "address": {
        "street": "123 Main St",
        "city": "New York",
        "state": "NY",
        "zip": "10001",
        "country": "US"
      },
      "emergency_contact": {
        "name": "Jane Doe",
        "phone": "+1234567891",
        "relationship": "spouse"
      },
      "created_at": "2025-01-15T10:00:00Z",
      "updated_at": "2025-01-15T10:00:00Z"
    }
  ],
  "total": 1,
  "limit": 50,
  "offset": 0
}
```

### Create Patient
```http
POST /api/v1/patients
```

**Request Body:**
```json
{
  "first_name": "John",
  "last_name": "Doe",
  "email": "john.doe@example.com",
  "phone": "+1234567890",
  "date_of_birth": "1985-06-15",
  "gender": "male",
  "address": {
    "street": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zip": "10001",
    "country": "US"
  },
  "emergency_contact": {
    "name": "Jane Doe",
    "phone": "+1234567891",
    "relationship": "spouse"
  }
}
```

**Response:** `201 Created`
```json
{
  "id": "pat_123abc",
  "first_name": "John",
  "last_name": "Doe",
  "email": "john.doe@example.com",
  "phone": "+1234567890",
  "date_of_birth": "1985-06-15",
  "gender": "male",
  "address": {
    "street": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zip": "10001",
    "country": "US"
  },
  "emergency_contact": {
    "name": "Jane Doe",
    "phone": "+1234567891",
    "relationship": "spouse"
  },
  "created_at": "2025-01-15T10:00:00Z",
  "updated_at": "2025-01-15T10:00:00Z"
}
```

### Get Patient
```http
GET /api/v1/patients/{patient_id}
```

**Path Parameters:**
- `patient_id` (string, required): Patient ID

**Response:** `200 OK`
```json
{
  "id": "pat_123abc",
  "first_name": "John",
  "last_name": "Doe",
  "email": "john.doe@example.com",
  "phone": "+1234567890",
  "date_of_birth": "1985-06-15",
  "gender": "male",
  "address": {
    "street": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zip": "10001",
    "country": "US"
  },
  "emergency_contact": {
    "name": "Jane Doe",
    "phone": "+1234567891",
    "relationship": "spouse"
  },
  "medical_history": {
    "allergies": ["penicillin", "peanuts"],
    "conditions": ["hypertension", "diabetes"],
    "medications": ["metformin", "lisinopril"]
  },
  "created_at": "2025-01-15T10:00:00Z",
  "updated_at": "2025-01-15T10:00:00Z"
}
```

### Update Patient
```http
PUT /api/v1/patients/{patient_id}
```

**Path Parameters:**
- `patient_id` (string, required): Patient ID

**Request Body:**
```json
{
  "phone": "+1234567899",
  "address": {
    "street": "456 Oak Ave",
    "city": "Brooklyn",
    "state": "NY",
    "zip": "11201",
    "country": "US"
  }
}
```

**Response:** `200 OK`
```json
{
  "id": "pat_123abc",
  "first_name": "John",
  "last_name": "Doe",
  "email": "john.doe@example.com",
  "phone": "+1234567899",
  "date_of_birth": "1985-06-15",
  "gender": "male",
  "address": {
    "street": "456 Oak Ave",
    "city": "Brooklyn",
    "state": "NY",
    "zip": "11201",
    "country": "US"
  },
  "emergency_contact": {
    "name": "Jane Doe",
    "phone": "+1234567891",
    "relationship": "spouse"
  },
  "created_at": "2025-01-15T10:00:00Z",
  "updated_at": "2025-01-16T14:30:00Z"
}
```

### Delete Patient
```http
DELETE /api/v1/patients/{patient_id}
```

**Path Parameters:**
- `patient_id` (string, required): Patient ID

**Response:** `204 No Content`

### Get Patient History
```http
GET /api/v1/patients/{patient_id}/history
```

**Path Parameters:**
- `patient_id` (string, required): Patient ID

**Query Parameters:**
- `start_date` (string, optional): Filter by start date (ISO 8601)
- `end_date` (string, optional): Filter by end date (ISO 8601)
- `type` (string, optional): Filter by type (appointment, prescription, medical_record)

**Response:** `200 OK`
```json
{
  "patient_id": "pat_123abc",
  "history": [
    {
      "type": "appointment",
      "id": "apt_456def",
      "date": "2025-01-10T14:00:00Z",
      "provider": "Dr. Smith",
      "reason": "Annual checkup",
      "status": "completed"
    },
    {
      "type": "prescription",
      "id": "prx_789ghi",
      "date": "2025-01-10T14:30:00Z",
      "medication": "Metformin",
      "dosage": "500mg",
      "prescriber": "Dr. Smith"
    },
    {
      "type": "medical_record",
      "id": "rec_101jkl",
      "date": "2025-01-10T14:00:00Z",
      "title": "Annual Physical Examination",
      "provider": "Dr. Smith"
    }
  ],
  "total": 3
}
```

---

## Medical Records API

### List Medical Records
```http
GET /api/v1/medical-records
```

**Query Parameters:**
- `patient_id` (string, optional): Filter by patient ID
- `limit` (integer, optional): Number of records to return (default: 50, max: 100)
- `offset` (integer, optional): Number of records to skip (default: 0)
- `start_date` (string, optional): Filter by start date (ISO 8601)
- `end_date` (string, optional): Filter by end date (ISO 8601)

**Response:** `200 OK`
```json
{
  "data": [
    {
      "id": "rec_123abc",
      "patient_id": "pat_123abc",
      "title": "Annual Physical Examination",
      "type": "examination",
      "date": "2025-01-10T14:00:00Z",
      "provider": {
        "id": "doc_456def",
        "name": "Dr. Sarah Smith",
        "specialty": "General Practice"
      },
      "diagnosis": ["Hypertension", "Type 2 Diabetes"],
      "notes": "Patient is managing conditions well with current medications.",
      "attachments": [
        {
          "id": "att_789ghi",
          "filename": "lab_results.pdf",
          "url": "https://storage.example.com/records/att_789ghi",
          "type": "application/pdf",
          "size": 245678
        }
      ],
      "created_at": "2025-01-10T14:00:00Z",
      "updated_at": "2025-01-10T14:00:00Z"
    }
  ],
  "total": 1,
  "limit": 50,
  "offset": 0
}
```

### Create Medical Record
```http
POST /api/v1/medical-records
```

**Request Body:**
```json
{
  "patient_id": "pat_123abc",
  "title": "Follow-up Visit",
  "type": "consultation",
  "date": "2025-01-20T10:00:00Z",
  "provider": {
    "id": "doc_456def",
    "name": "Dr. Sarah Smith",
    "specialty": "General Practice"
  },
  "diagnosis": ["Hypertension - stable"],
  "notes": "Blood pressure readings improved. Continue current medication.",
  "vitals": {
    "blood_pressure": "128/82",
    "heart_rate": 72,
    "temperature": 98.6,
    "weight": 180
  }
}
```

**Response:** `201 Created`
```json
{
  "id": "rec_456def",
  "patient_id": "pat_123abc",
  "title": "Follow-up Visit",
  "type": "consultation",
  "date": "2025-01-20T10:00:00Z",
  "provider": {
    "id": "doc_456def",
    "name": "Dr. Sarah Smith",
    "specialty": "General Practice"
  },
  "diagnosis": ["Hypertension - stable"],
  "notes": "Blood pressure readings improved. Continue current medication.",
  "vitals": {
    "blood_pressure": "128/82",
    "heart_rate": 72,
    "temperature": 98.6,
    "weight": 180
  },
  "attachments": [],
  "created_at": "2025-01-20T10:00:00Z",
  "updated_at": "2025-01-20T10:00:00Z"
}
```

### Get Medical Record
```http
GET /api/v1/medical-records/{record_id}
```

**Path Parameters:**
- `record_id` (string, required): Medical record ID

**Response:** `200 OK`
```json
{
  "id": "rec_123abc",
  "patient_id": "pat_123abc",
  "title": "Annual Physical Examination",
  "type": "examination",
  "date": "2025-01-10T14:00:00Z",
  "provider": {
    "id": "doc_456def",
    "name": "Dr. Sarah Smith",
    "specialty": "General Practice"
  },
  "diagnosis": ["Hypertension", "Type 2 Diabetes"],
  "notes": "Patient is managing conditions well with current medications.",
  "vitals": {
    "blood_pressure": "130/85",
    "heart_rate": 75,
    "temperature": 98.6,
    "weight": 185
  },
  "attachments": [
    {
      "id": "att_789ghi",
      "filename": "lab_results.pdf",
      "url": "https://storage.example.com/records/att_789ghi",
      "type": "application/pdf",
      "size": 245678
    }
  ],
  "created_at": "2025-01-10T14:00:00Z",
  "updated_at": "2025-01-10T14:00:00Z"
}
```

### Update Medical Record
```http
PUT /api/v1/medical-records/{record_id}
```

**Path Parameters:**
- `record_id` (string, required): Medical record ID

**Request Body:**
```json
{
  "notes": "Updated notes: Patient responding well to treatment adjustments.",
  "diagnosis": ["Hypertension - controlled", "Type 2 Diabetes - controlled"]
}
```

**Response:** `200 OK`
```json
{
  "id": "rec_123abc",
  "patient_id": "pat_123abc",
  "title": "Annual Physical Examination",
  "type": "examination",
  "date": "2025-01-10T14:00:00Z",
  "provider": {
    "id": "doc_456def",
    "name": "Dr. Sarah Smith",
    "specialty": "General Practice"
  },
  "diagnosis": ["Hypertension - controlled", "Type 2 Diabetes - controlled"],
  "notes": "Updated notes: Patient responding well to treatment adjustments.",
  "vitals": {
    "blood_pressure": "130/85",
    "heart_rate": 75,
    "temperature": 98.6,
    "weight": 185
  },
  "attachments": [
    {
      "id": "att_789ghi",
      "filename": "lab_results.pdf",
      "url": "https://storage.example.com/records/att_789ghi",
      "type": "application/pdf",
      "size": 245678
    }
  ],
  "created_at": "2025-01-10T14:00:00Z",
  "updated_at": "2025-01-15T09:30:00Z"
}
```

### Delete Medical Record
```http
DELETE /api/v1/medical-records/{record_id}
```

**Path Parameters:**
- `record_id` (string, required): Medical record ID

**Response:** `204 No Content`

### Share Medical Record
```http
POST /api/v1/medical-records/{record_id}/share
```

**Path Parameters:**
- `record_id` (string, required): Medical record ID

**Request Body:**
```json
{
  "recipient_email": "specialist@example.com",
  "recipient_type": "healthcare_provider",
  "message": "Sharing records for consultation",
  "expires_at": "2025-02-10T00:00:00Z",
  "permissions": ["view", "download"]
}
```

**Response:** `200 OK`
```json
{
  "share_id": "shr_123abc",
  "record_id": "rec_123abc",
  "recipient_email": "specialist@example.com",
  "recipient_type": "healthcare_provider",
  "message": "Sharing records for consultation",
  "access_link": "https://t9xbkyb7mg.us-east-1.awsapprunner.com/shared/shr_123abc",
  "expires_at": "2025-02-10T00:00:00Z",
  "permissions": ["view", "download"],
  "created_at": "2025-01-15T10:00:00Z"
}
```

### Get Shared Medical Records
```http
GET /api/v1/medical-records/shared
```

**Query Parameters:**
- `status` (string, optional): Filter by status (active, expired, revoked)
- `limit` (integer, optional): Number of records to return (default: 50)
- `offset` (integer, optional): Number of records to skip (default: 0)

**Response:** `200 OK`
```json
{
  "data": [
    {
      "share_id": "shr_123abc",
      "record_id": "rec_123abc",
      "record_title": "Annual Physical Examination",
      "recipient_email": "specialist@example.com",
      "recipient_type": "healthcare_provider",
      "status": "active",
      "access_link": "https://t9xbkyb7mg.us-east-1.awsapprunner.com/shared/shr_123abc",
      "expires_at": "2025-02-10T00:00:00Z",
      "permissions": ["view", "download"],
      "created_at": "2025-01-15T10:00:00Z"
    }
  ],
  "total": 1,
  "limit": 50,
  "offset": 0
}
```

---

## Prescriptions API

### List Prescriptions
```http
GET /api/v1/prescriptions
```

**Query Parameters:**
- `patient_id` (string, optional): Filter by patient ID
- `status` (string, optional): Filter by status (active, expired, cancelled)
- `limit` (integer, optional): Number of records to return (default: 50)
- `offset` (integer, optional): Number of records to skip (default: 0)

**Response:** `200 OK`
```json
{
  "data": [
    {
      "id": "prx_123abc",
      "patient_id": "pat_123abc",
      "medication": {
        "name": "Metformin",
        "generic_name": "Metformin HCl",
        "ndc": "00093-7214-01",
        "strength": "500mg",
        "form": "tablet"
      },
      "dosage": "500mg twice daily with meals",
      "quantity": 60,
      "refills": 3,
      "refills_remaining": 2,
      "prescriber": {
        "id": "doc_456def",
        "name": "Dr. Sarah Smith",
        "npi": "1234567890",
        "specialty": "General Practice"
      },
      "pharmacy": {
        "id": "phm_789ghi",
        "name": "Main Street Pharmacy",
        "phone": "+1234567892",
        "address": "789 Main St, New York, NY 10001"
      },
      "prescribed_date": "2025-01-10T14:30:00Z",
      "expires_date": "2026-01-10T14:30:00Z",
      "status": "active",
      "created_at": "2025-01-10T14:30:00Z",
      "updated_at": "2025-01-10T14:30:00Z"
    }
  ],
  "total": 1,
  "limit": 50,
  "offset": 0
}
```

### Create Prescription
```http
POST /api/v1/prescriptions
```

**Request Body:**
```json
{
  "patient_id": "pat_123abc",
  "medication": {
    "name": "Lisinopril",
    "generic_name": "Lisinopril",
    "ndc": "00093-1058-01",
    "strength": "10mg",
    "form": "tablet"
  },
  "dosage": "10mg once daily",
  "quantity": 30,
  "refills": 5,
  "prescriber": {
    "id": "doc_456def",
    "name": "Dr. Sarah Smith",
    "npi": "1234567890"
  },
  "pharmacy": {
    "id": "phm_789ghi",
    "name": "Main Street Pharmacy"
  },
  "instructions": "Take one tablet daily in the morning",
  "notes": "Monitor blood pressure regularly"
}
```

**Response:** `201 Created`
```json
{
  "id": "prx_456def",
  "patient_id": "pat_123abc",
  "medication": {
    "name": "Lisinopril",
    "generic_name": "Lisinopril",
    "ndc": "00093-1058-01",
    "strength": "10mg",
    "form": "tablet"
  },
  "dosage": "10mg once daily",
  "quantity": 30,
  "refills": 5,
  "refills_remaining": 5,
  "prescriber": {
    "id": "doc_456def",
    "name": "Dr. Sarah Smith",
    "npi": "1234567890",
    "specialty": "General Practice"
  },
  "pharmacy": {
    "id": "phm_789ghi",
    "name": "Main Street Pharmacy",
    "phone": "+1234567892",
    "address": "789 Main St, New York, NY 10001"
  },
  "instructions": "Take one tablet daily in the morning",
  "notes": "Monitor blood pressure regularly",
  "prescribed_date": "2025-01-15T10:00:00Z",
  "expires_date": "2026-01-15T10:00:00Z",
  "status": "active",
  "created_at": "2025-01-15T10:00:00Z",
  "updated_at": "2025-01-15T10:00:00Z"
}
```

### Get Prescription
```http
GET /api/v1/prescriptions/{prescription_id}
```

**Path Parameters:**
- `prescription_id` (string, required): Prescription ID

**Response:** `200 OK`
```json
{
  "id": "prx_123abc",
  "patient_id": "pat_123abc",
  "medication": {
    "name": "Metformin",
    "generic_name": "Metformin HCl",
    "ndc": "00093-7214-01",
    "strength": "500mg",
    "form": "tablet"
  },
  "dosage": "500mg twice daily with meals",
  "quantity": 60,
  "refills": 3,
  "refills_remaining": 2,
  "prescriber": {
    "id": "doc_456def",
    "name": "Dr. Sarah Smith",
    "npi": "1234567890",
    "specialty": "General Practice"
  },
  "pharmacy": {
    "id": "phm_789ghi",
    "name": "Main Street Pharmacy",
    "phone": "+1234567892",
    "address": "789 Main St, New York, NY 10001"
  },
  "instructions": "Take with food to minimize stomach upset",
  "notes": "Monitor blood glucose levels",
  "prescribed_date": "2025-01-10T14:30:00Z",
  "expires_date": "2026-01-10T14:30:00Z",
  "status": "active",
  "refill_history": [
    {
      "date": "2025-01-10T14:30:00Z",
      "quantity": 60,
      "pharmacy": "Main Street Pharmacy"
    }
  ],
  "created_at": "2025-01-10T14:30:00Z",
  "updated_at": "2025-01-10T14:30:00Z"
}
```

### Update Prescription
```http
PUT /api/v1/prescriptions/{prescription_id}
```

**Path Parameters:**
- `prescription_id` (string, required): Prescription ID

**Request Body:**
```json
{
  "dosage": "500mg three times daily with meals",
  "pharmacy": {
    "id": "phm_999xyz",
    "name": "Downtown Pharmacy"
  },
  "notes": "Increased dosage per follow-up consultation"
}
```

**Response:** `200 OK`
```json
{
  "id": "prx_123abc",
  "patient_id": "pat_123abc",
  "medication": {
    "name": "Metformin",
    "generic_name": "Metformin HCl",
    "ndc": "00093-7214-01",
    "strength": "500mg",
    "form": "tablet"
  },
  "dosage": "500mg three times daily with meals",
  "quantity": 60,
  "refills": 3,
  "refills_remaining": 2,
  "prescriber": {
    "id": "doc_456def",
    "name": "Dr. Sarah Smith",
    "npi": "1234567890",
    "specialty": "General Practice"
  },
  "pharmacy": {
    "id": "phm_999xyz",
    "name": "Downtown Pharmacy",
    "phone": "+1234567893",
    "address": "123 Downtown Ave, New York, NY 10002"
  },
  "instructions": "Take with food to minimize stomach upset",
  "notes": "Increased dosage per follow-up consultation",
  "prescribed_date": "2025-01-10T14:30:00Z",
  "expires_date": "2026-01-10T14:30:00Z",
  "status": "active",
  "created_at": "2025-01-10T14:30:00Z",
  "updated_at": "2025-01-20T11:00:00Z"
}
```

### Request Prescription Refill
```http
POST /api/v1/prescriptions/{prescription_id}/refill
```

**Path Parameters:**
- `prescription_id` (string, required): Prescription ID

**Request Body:**
```json
{
  "pharmacy_id": "phm_789ghi",
  "notes": "Routine refill request"
}
```

**Response:** `200 OK`
```json
{
  "id": "prx_123abc",
  "patient_id": "pat_123abc",
  "medication": {
    "name": "Metformin",
    "generic_name": "Metformin HCl",
    "ndc": "00093-7214-01",
    "strength": "500mg",
    "form": "tablet"
  },
  "dosage": "500mg twice daily with meals",
  "quantity": 60,
  "refills": 3,
  "refills_remaining": 1,
  "refill_request": {
    "id": "rfr_789ghi",
    "status": "pending",
    "requested_at": "2025-01-25T09:00:00Z",
    "pharmacy": "Main Street Pharmacy"
  },
  "prescriber": {
    "id": "doc_456def",
    "name": "Dr. Sarah Smith",
    "npi": "1234567890",
    "specialty": "General Practice"
  },
  "pharmacy": {
    "id": "phm_789ghi",
    "name": "Main Street Pharmacy",
    "phone": "+1234567892",
    "address": "789 Main St, New York, NY 10001"
  },
  "prescribed_date": "2025-01-10T14:30:00Z",
  "expires_date": "2026-01-10T14:30:00Z",
  "status": "active",
  "created_at": "2025-01-10T14:30:00Z",
  "updated_at": "2025-01-25T09:00:00Z"
}
```

---

## Appointments API

### List Appointments
```http
GET /api/v1/appointments
```

**Query Parameters:**
- `patient_id` (string, optional): Filter by patient ID
- `provider_id` (string, optional): Filter by provider ID
- `status` (string, optional): Filter by status (scheduled, completed, cancelled, no_show)
- `start_date` (string, optional): Filter by start date (ISO 8601)
- `end_date` (string, optional): Filter by end date (ISO 8601)
- `limit` (integer, optional): Number of records to return (default: 50)
- `offset` (integer, optional): Number of records to skip (default: 0)

**Response:** `200 OK`
```json
{
  "data": [
    {
      "id": "apt_123abc",
      "patient_id": "pat_123abc",
      "provider": {
        "id": "doc_456def",
        "name": "Dr. Sarah Smith",
        "specialty": "General Practice",
        "npi": "1234567890"
      },
      "appointment_type": "consultation",
      "reason": "Follow-up for hypertension",
      "scheduled_time": "2025-01-25T14:00:00Z",
      "duration_minutes": 30,
      "status": "scheduled",
      "location": {
        "type": "in_person",
        "address": "123 Medical Center Dr, New York, NY 10001",
        "room": "A-204"
      },
      "notes": "Please bring recent blood pressure readings",
      "created_at": "2025-01-15T10:00:00Z",
      "updated_at": "2025-01-15T10:00:00Z"
    }
  ],
  "total": 1,
  "limit": 50,
  "offset": 0
}
```

### Create Appointment
```http
POST /api/v1/appointments
```

**Request Body:**
```json
{
  "patient_id": "pat_123abc",
  "provider_id": "doc_456def",
  "appointment_type": "consultation",
  "reason": "Annual physical examination",
  "scheduled_time": "2025-02-15T10:00:00Z",
  "duration_minutes": 45,
  "location": {
    "type": "in_person",
    "address": "123 Medical Center Dr, New York, NY 10001",
    "room": "B-101"
  },
  "notes": "Patient requests fasting blood work"
}
```

**Response:** `201 Created`
```json
{
  "id": "apt_456def",
  "patient_id": "pat_123abc",
  "provider": {
    "id": "doc_456def",
    "name": "Dr. Sarah Smith",
    "specialty": "General Practice",
    "npi": "1234567890"
  },
  "appointment_type": "consultation",
  "reason": "Annual physical examination",
  "scheduled_time": "2025-02-15T10:00:00Z",
  "duration_minutes": 45,
  "status": "scheduled",
  "location": {
    "type": "in_person",
    "address": "123 Medical Center Dr, New York, NY 10001",
    "room": "B-101"
  },
  "notes": "Patient requests fasting blood work",
  "confirmation": {
    "code": "APT456DEF",
    "confirmed": false
  },
  "created_at": "2025-01-15T11:00:00Z",
  "updated_at": "2025-01-15T11:00:00Z"
}
```

### Get Appointment
```http
GET /api/v1/appointments/{appointment_id}
```

**Path Parameters:**
- `appointment_id` (string, required): Appointment ID

**Response:** `200 OK`
```json
{
  "id": "apt_123abc",
  "patient_id": "pat_123abc",
  "patient": {
    "id": "pat_123abc",
    "name": "John Doe",
    "date_of_birth": "1985-06-15",
    "phone": "+1234567890"
  },
  "provider": {
    "id": "doc_456def",
    "name": "Dr. Sarah Smith",
    "specialty": "General Practice",
    "npi": "1234567890"
  },
  "appointment_type": "consultation",
  "reason": "Follow-up for hypertension",
  "scheduled_time": "2025-01-25T14:00:00Z",
  "duration_minutes": 30,
  "status": "scheduled",
  "location": {
    "type": "in_person",
    "address": "123 Medical Center Dr, New York, NY 10001",
    "room": "A-204"
  },
  "notes": "Please bring recent blood pressure readings",
  "confirmation": {
    "code": "APT123ABC",
    "confirmed": true,
    "confirmed_at": "2025-01-16T09:00:00Z"
  },
  "reminders": [
    {
      "type": "email",
      "sent_at": "2025-01-24T14:00:00Z"
    },
    {
      "type": "sms",
      "sent_at": "2025-01-25T09:00:00Z"
    }
  ],
  "created_at": "2025-01-15T10:00:00Z",
  "updated_at": "2025-01-16T09:00:00Z"
}
```

### Update Appointment
```http
PUT /api/v1/appointments/{appointment_id}
```

**Path Parameters:**
- `appointment_id` (string, required): Appointment ID

**Request Body:**
```json
{
  "scheduled_time": "2025-01-25T15:00:00Z",
  "duration_minutes": 45,
  "notes": "Rescheduled to allow for extended consultation"
}
```

**Response:** `200 OK`
```json
{
  "id": "apt_123abc",
  "patient_id": "pat_123abc",
  "provider": {
    "id": "doc_456def",
    "name": "Dr. Sarah Smith",
    "specialty": "General Practice",
    "npi": "1234567890"
  },
  "appointment_type": "consultation",
  "reason": "Follow-up for hypertension",
  "scheduled_time": "2025-01-25T15:00:00Z",
  "duration_minutes": 45,
  "status": "scheduled",
  "location": {
    "type": "in_person",
    "address": "123 Medical Center Dr, New York, NY 10001",
    "room": "A-204"
  },
  "notes": "Rescheduled to allow for extended consultation",
  "confirmation": {
    "code": "APT123ABC",
    "confirmed": true,
    "confirmed_at": "2025-01-16T09:00:00Z"
  },
  "created_at": "2025-01-15T10:00:00Z",
  "updated_at": "2025-01-20T14:00:00Z"
}
```

### Delete Appointment
```http
DELETE /api/v1/appointments/{appointment_id}
```

**Path Parameters:**
- `appointment_id` (string, required): Appointment ID

**Response:** `204 No Content`

### Cancel Appointment
```http
POST /api/v1/appointments/{appointment_id}/cancel
```

**Path Parameters:**
- `appointment_id` (string, required): Appointment ID

**Request Body:**
```json
{
  "reason": "Patient conflict - needs to reschedule",
  "cancelled_by": "patient"
}
```

**Response:** `200 OK`
```json
{
  "id": "apt_123abc",
  "patient_id": "pat_123abc",
  "provider": {
    "id": "doc_456def",
    "name": "Dr. Sarah Smith",
    "specialty": "General Practice",
    "npi": "1234567890"
  },
  "appointment_type": "consultation",
  "reason": "Follow-up for hypertension",
  "scheduled_time": "2025-01-25T14:00:00Z",
  "duration_minutes": 30,
  "status": "cancelled",
  "cancellation": {
    "reason": "Patient conflict - needs to reschedule",
    "cancelled_by": "patient",
    "cancelled_at": "2025-01-20T16:00:00Z"
  },
  "location": {
    "type": "in_person",
    "address": "123 Medical Center Dr, New York, NY 10001",
    "room": "A-204"
  },
  "created_at": "2025-01-15T10:00:00Z",
  "updated_at": "2025-01-20T16:00:00Z"
}
```

### Get Available Appointment Slots
```http
GET /api/v1/appointments/available-slots
```

**Query Parameters:**
- `provider_id` (string, required): Provider ID
- `start_date` (string, required): Start date for availability search (ISO 8601)
- `end_date` (string, required): End date for availability search (ISO 8601)
- `duration_minutes` (integer, optional): Desired appointment duration (default: 30)

**Response:** `200 OK`
```json
{
  "provider": {
    "id": "doc_456def",
    "name": "Dr. Sarah Smith",
    "specialty": "General Practice"
  },
  "available_slots": [
    {
      "date": "2025-01-26",
      "slots": [
        {
          "start_time": "2025-01-26T09:00:00Z",
          "end_time": "2025-01-26T09:30:00Z",
          "duration_minutes": 30
        },
        {
          "start_time": "2025-01-26T10:00:00Z",
          "end_time": "2025-01-26T10:30:00Z",
          "duration_minutes": 30
        },
        {
          "start_time": "2025-01-26T14:00:00Z",
          "end_time": "2025-01-26T14:30:00Z",
          "duration_minutes": 30
        }
      ]
    },
    {
      "date": "2025-01-27",
      "slots": [
        {
          "start_time": "2025-01-27T09:00:00Z",
          "end_time": "2025-01-27T09:30:00Z",
          "duration_minutes": 30
        },
        {
          "start_time": "2025-01-27T11:00:00Z",
          "end_time": "2025-01-27T11:30:00Z",
          "duration_minutes": 30
        }
      ]
    }
  ],
  "total_slots": 5
}
```

---

## Digital Programs API

### List Digital Programs
```http
GET /api/v1/digital-programs
```

**Query Parameters:**
- `category` (string, optional): Filter by category (wellness, therapy, fitness, nutrition)
- `status` (string, optional): Filter by status (active, archived)
- `limit` (integer, optional): Number of records to return (default: 50)
- `offset` (integer, optional): Number of records to skip (default: 0)

**Response:** `200 OK`
```json
{
  "data": [
    {
      "id": "prg_123abc",
      "name": "Mindfulness & Meditation",
      "description": "8-week program to reduce stress and improve mental well-being through guided meditation",
      "category": "wellness",
      "duration_weeks": 8,
      "difficulty": "beginner",
      "provider": "Healify Digital Health",
      "features": [
        "Daily guided meditation sessions",
        "Progress tracking",
        "Expert-led video content",
        "Community support"
      ],
      "requirements": [
        "15 minutes per day",
        "Quiet space for practice"
      ],
      "outcomes": [
        "Reduced stress levels",
        "Improved sleep quality",
        "Better emotional regulation"
      ],
      "enrollment_count": 1247,
      "rating": 4.8,
      "status": "active",
      "created_at": "2025-01-01T00:00:00Z"
    }
  ],
  "total": 1,
  "limit": 50,
  "offset": 0
}
```

### Get Digital Program
```http
GET /api/v1/digital-programs/{program_id}
```

**Path Parameters:**
- `program_id` (string, required): Program ID

**Response:** `200 OK`
```json
{
  "id": "prg_123abc",
  "name": "Mindfulness & Meditation",
  "description": "8-week program to reduce stress and improve mental well-being through guided meditation",
  "category": "wellness",
  "duration_weeks": 8,
  "difficulty": "beginner",
  "provider": "Healify Digital Health",
  "features": [
    "Daily guided meditation sessions",
    "Progress tracking",
    "Expert-led video content",
    "Community support"
  ],
  "requirements": [
    "15 minutes per day",
    "Quiet space for practice"
  ],
  "outcomes": [
    "Reduced stress levels",
    "Improved sleep quality",
    "Better emotional regulation"
  ],
  "curriculum": [
    {
      "week": 1,
      "title": "Introduction to Mindfulness",
      "sessions": 7,
      "topics": ["Breath awareness", "Body scan", "Present moment awareness"]
    },
    {
      "week": 2,
      "title": "Building Consistency",
      "sessions": 7,
      "topics": ["Daily practice", "Overcoming obstacles", "Mindful movement"]
    }
  ],
  "instructors": [
    {
      "name": "Dr. Jane Williams",
      "credentials": "PhD in Clinical Psychology",
      "bio": "20+ years experience in mindfulness-based therapies"
    }
  ],
  "enrollment_count": 1247,
  "rating": 4.8,
  "reviews_count": 342,
  "status": "active",
  "created_at": "2025-01-01T00:00:00Z",
  "updated_at": "2025-01-01T00:00:00Z"
}
```

### Enroll in Digital Program
```http
POST /api/v1/digital-programs/{program_id}/enroll
```

**Path Parameters:**
- `program_id` (string, required): Program ID

**Request Body:**
```json
{
  "patient_id": "pat_123abc",
  "start_date": "2025-02-01T00:00:00Z",
  "goals": [
    "Reduce daily stress",
    "Improve sleep quality"
  ],
  "preferences": {
    "reminder_time": "08:00",
    "reminder_frequency": "daily"
  }
}
```

**Response:** `201 Created`
```json
{
  "enrollment_id": "enr_123abc",
  "program_id": "prg_123abc",
  "patient_id": "pat_123abc",
  "program_name": "Mindfulness & Meditation",
  "start_date": "2025-02-01T00:00:00Z",
  "expected_completion_date": "2025-03-29T00:00:00Z",
  "status": "enrolled",
  "progress": {
    "current_week": 0,
    "sessions_completed": 0,
    "total_sessions": 56,
    "completion_percentage": 0
  },
  "goals": [
    "Reduce daily stress",
    "Improve sleep quality"
  ],
  "preferences": {
    "reminder_time": "08:00",
    "reminder_frequency": "daily"
  },
  "next_session": {
    "title": "Introduction to Breath Awareness",
    "scheduled_date": "2025-02-01T08:00:00Z",
    "duration_minutes": 15
  },
  "created_at": "2025-01-25T10:00:00Z"
}
```

---

## Error Responses

All endpoints may return the following error responses:

### 400 Bad Request
```json
{
  "error": {
    "code": "INVALID_REQUEST",
    "message": "Invalid request parameters",
    "details": [
      {
        "field": "email",
        "message": "Invalid email format"
      }
    ]
  }
}
```

### 401 Unauthorized
```json
{
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Authentication required"
  }
}
```

### 403 Forbidden
```json
{
  "error": {
    "code": "FORBIDDEN",
    "message": "Insufficient permissions to access this resource"
  }
}
```

### 404 Not Found
```json
{
  "error": {
    "code": "NOT_FOUND",
    "message": "Resource not found",
    "resource_type": "patient",
    "resource_id": "pat_123abc"
  }
}
```

### 409 Conflict
```json
{
  "error": {
    "code": "CONFLICT",
    "message": "Resource already exists",
    "details": "Patient with email john.doe@example.com already exists"
  }
}
```

### 422 Unprocessable Entity
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Request validation failed",
    "details": [
      {
        "field": "date_of_birth",
        "message": "Date must be in the past"
      }
    ]
  }
}
```

### 429 Too Many Requests
```json
{
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Rate limit exceeded",
    "retry_after": 60
  }
}
```

### 500 Internal Server Error
```json
{
  "error": {
    "code": "INTERNAL_ERROR",
    "message": "An unexpected error occurred",
    "request_id": "req_123abc"
  }
}
```

---

## Rate Limiting

API requests are rate limited to prevent abuse:

- **Default limit:** 1000 requests per hour per API key
- **Burst limit:** 100 requests per minute

Rate limit headers are included in all responses:
```http
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 847
X-RateLimit-Reset: 1706198400
```

---

## Pagination

List endpoints support pagination using `limit` and `offset` parameters:

```http
GET /api/v1/patients?limit=20&offset=40
```

Pagination metadata is included in responses:
```json
{
  "data": [...],
  "total": 150,
  "limit": 20,
  "offset": 40,
  "has_more": true
}
```

---

## HIPAA Compliance

All healthcare data is handled in compliance with HIPAA regulations:

- **Encryption:** All data is encrypted in transit (TLS 1.2+) and at rest (AES-256)
- **Audit Logging:** All API access is logged for audit purposes
- **Access Controls:** Role-based access control (RBAC) enforced
- **Data Retention:** Configurable retention policies per regulation requirements
- **Patient Consent:** Explicit consent required for data sharing

---

## Webhooks

Subscribe to real-time events via webhooks (contact support for configuration):

**Available Events:**
- `patient.created`
- `patient.updated`
- `medical_record.created`
- `medical_record.shared`
- `prescription.created`
- `prescription.refill_requested`
- `appointment.scheduled`
- `appointment.cancelled`
- `appointment.completed`
- `digital_program.enrollment_completed`

**Webhook Payload Example:**
```json
{
  "event": "appointment.scheduled",
  "timestamp": "2025-01-25T10:00:00Z",
  "data": {
    "appointment_id": "apt_123abc",
    "patient_id": "pat_123abc",
    "scheduled_time": "2025-02-15T10:00:00Z"
  }
}
```

---

## Support

**Documentation:** https://t9xbkyb7mg.us-east-1.awsapprunner.com/docs  
**API Status:** https://status.healify.example.com  
**Support Email:** api-support@healify.example.com

---

*Last Updated: 2025-01-25*
