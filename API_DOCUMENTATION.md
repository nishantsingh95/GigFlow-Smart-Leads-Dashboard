# GigFlow API Documentation

Base URL: `http://localhost:5000/api`

## Authentication

All lead endpoints require a JWT token in the header:

```
Authorization: Bearer <token>
```

---

## Auth Endpoints

### Register User

`POST /auth/register`

**Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "sales"
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| name | string | Yes | User full name |
| email | string | Yes | Valid email |
| password | string | Yes | Min 6 characters |
| role | string | No | `admin` or `sales` (default: sales) |

**Response (201):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": { "id": "...", "name": "...", "email": "...", "role": "sales" },
    "token": "jwt_token_here"
  }
}
```

---

### Login

`POST /auth/login`

**Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (200):** Same structure as register.

---

### Get Current User

`GET /auth/me`

**Headers:** Authorization required

**Response (200):**
```json
{
  "success": true,
  "message": "User profile retrieved",
  "data": {
    "user": { "id": "...", "name": "...", "email": "...", "role": "admin" }
  }
}
```

---

## Lead Endpoints

### Get All Leads (with filters & pagination)

`GET /leads`

**Query Parameters:**

| Param | Type | Description |
|-------|------|-------------|
| status | string | `New`, `Contacted`, `Qualified`, `Lost` |
| source | string | `Website`, `Instagram`, `Referral` |
| search | string | Search by name or email |
| sort | string | `latest` (default) or `oldest` |
| page | number | Page number (default: 1, limit: 10 per page) |

**Example:**
```
GET /leads?status=Qualified&source=Instagram&search=Rahul&sort=latest&page=1
```

**Response (200):**
```json
{
  "success": true,
  "message": "Leads retrieved successfully",
  "data": {
    "leads": [
      {
        "_id": "...",
        "name": "Rahul Sharma",
        "email": "rahul@example.com",
        "status": "Qualified",
        "source": "Instagram",
        "createdBy": { "_id": "...", "name": "...", "email": "..." },
        "createdAt": "2026-05-19T10:00:00.000Z",
        "updatedAt": "2026-05-19T10:00:00.000Z"
      }
    ]
  },
  "pagination": {
    "currentPage": 1,
    "totalPages": 3,
    "totalRecords": 25,
    "limit": 10,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

---

### Get Single Lead

`GET /leads/:id`

**Response (200):**
```json
{
  "success": true,
  "message": "Lead retrieved successfully",
  "data": { "lead": { ... } }
}
```

---

### Create Lead

`POST /leads`

**Body:**
```json
{
  "name": "Jane Smith",
  "email": "jane@example.com",
  "status": "New",
  "source": "Website"
}
```

**Response (201):** Lead object in `data.lead`

---

### Update Lead

`PUT /leads/:id`

**Body:** Any combination of `name`, `email`, `status`, `source`

**Response (200):** Updated lead in `data.lead`

---

### Delete Lead

`DELETE /leads/:id`

**Role Required:** Admin only

**Response (200):**
```json
{
  "success": true,
  "message": "Lead deleted successfully"
}
```

---

### Export Leads as CSV

`GET /leads/export/csv`

**Role Required:** Admin only

**Query Parameters:** Same as Get All Leads (status, source, search, sort)

**Response:** CSV file download

---

## Error Response Format

```json
{
  "success": false,
  "message": "Error description",
  "errors": [
    { "field": "email", "message": "Please provide a valid email" }
  ]
}
```

## HTTP Status Codes

| Code | Description |
|------|-------------|
| 200 | Success |
| 201 | Created |
| 400 | Validation error |
| 401 | Unauthorized |
| 403 | Forbidden (RBAC) |
| 404 | Not found |
| 409 | Conflict (duplicate) |
| 500 | Server error |

## Role-Based Access Control

| Action | Admin | Sales User |
|--------|-------|------------|
| View leads | Yes | Yes |
| Create lead | Yes | No |
| Update lead | Yes | No |
| Delete lead | Yes | No |
| Export CSV | Yes | No |

> New registrations are always **Sales User**. Create an admin with:
> `cd backend && npm run create-admin -- your@email.com YourPassword123`
