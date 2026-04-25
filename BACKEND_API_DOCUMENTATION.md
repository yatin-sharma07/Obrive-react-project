# Backend API Documentation

**Project:** Obrive - Employee & HR Management System  
**Backend Port:** 5000  
**Base URL:** `http://localhost:5000/api`

---

## Table of Contents

1. [Authentication](#authentication)
2. [API Endpoints](#api-endpoints)
   - [Auth Module](#auth-module)
   - [Employee Module](#employee-module)
   - [HR Module](#hr-module)
   - [Admin Module](#admin-module)
   - [Client Module](#client-module)
   - [Meetings Module](#meetings-module)
   - [Projects Module](#projects-module)
   - [Events Module](#events-module)
   - [Sticky Notes Module](#sticky-notes-module)
   - [Timer Module](#timer-module)
3. [Data Models](#data-models)
4. [Error Handling](#error-handling)
5. [Workflows](#workflows)

---

## Authentication

### Overview
- **JWT-based Authentication** with token in Authorization header or as Bearer token
- **Token Expiration:** 24 hours
- **Cookie Support:** Credentials required in CORS
- **Roles:** `EMPLOYEE`, `HR`, `ADMIN`, `CLIENT`

### Token Usage
```
Header: Authorization: Bearer <token>
```

### Public Endpoints
- `POST /auth/login` - Employee/HR/Admin login
- `POST /auth/client/login` - Client login
- `POST /employee/login-direct` - Direct employee login
- `GET /health` - Health check

---

## API Endpoints

### Auth Module
**Base Route:** `/api/auth`

#### 1. Login User (Employee/HR/Admin)
- **Endpoint:** `POST /login`
- **Auth Required:** ❌ No
- **Role Required:** N/A
- **Description:** Authenticate employee, HR, or admin users

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Request Validation:**
- `email` - Must be valid email format
- `password` - Must not be empty

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "email": "user@example.com",
      "name": "John Doe",
      "role": "employee"
    }
  }
}
```

**Response (Error - 401):**
```json
{
  "success": false,
  "message": "Invalid password"
}
```

---

#### 2. Login Client
- **Endpoint:** `POST /client/login`
- **Auth Required:** ❌ No
- **Role Required:** N/A
- **Description:** Authenticate client users

**Request Body:**
```json
{
  "clientId": "client-123"
}
```

**Request Validation:**
- `clientId` - Required, must not be empty

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 5,
      "email": "client@company.com",
      "name": "Client Name",
      "role": "client"
    }
  }
}
```

---

#### 3. Logout
- **Endpoint:** `POST /logout`
- **Auth Required:** ✅ Yes
- **Role Required:** All roles
- **Description:** Logout user and invalidate session

**Request Body:** `{}`

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

#### 4. Refresh Token
- **Endpoint:** `POST /refresh`
- **Auth Required:** ❌ No
- **Role Required:** N/A
- **Description:** Refresh JWT token before expiration

**Request Body:**
```json
{
  "token": "expiredToken..."
}
```

**Response (Success - 200):**
```json
{
  "success": true,
  "data": {
    "token": "newToken..."
  }
}
```

---

#### 5. Get All Users
- **Endpoint:** `GET /users`
- **Auth Required:** ✅ Yes
- **Role Required:** All roles
- **Description:** Retrieve all registered users

**Query Parameters:** None

**Response (Success - 200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "userid": "EMP001",
      "email": "employee@example.com",
      "name": "John Doe",
      "role": "employee",
      "status": "online",
      "department": "Engineering",
      "job_title": "Senior Developer",
      "is_active": true
    }
  ]
}
```

---

### Employee Module
**Base Route:** `/api/employee`

#### 1. Employee Login
- **Endpoint:** `POST /login`
- **Auth Required:** ❌ No
- **Role Required:** N/A
- **Description:** Direct login for employees

**Request Body:**
```json
{
  "email": "employee@example.com",
  "password": "password123"
}
```

**Response:** Same as Auth login endpoint

---

#### 2. Get My Profile
- **Endpoint:** `GET /me`
- **Auth Required:** ✅ Yes
- **Role Required:** `EMPLOYEE`
- **Description:** Retrieve authenticated employee's profile

**Response (Success - 200):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "userid": "EMP001",
    "email": "john@example.com",
    "name": "John Doe",
    "role": "employee",
    "department": "Engineering",
    "job_title": "Senior Developer",
    "phone_number": "+1234567890",
    "date_of_birth": "1990-05-15",
    "join_date": "2022-01-15",
    "biography": "Passionate developer with 5 years experience",
    "status": "online",
    "is_active": true
  }
}
```

---

#### 3. Update My Profile
- **Endpoint:** `PUT /me`
- **Auth Required:** ✅ Yes
- **Role Required:** `EMPLOYEE`
- **Description:** Update employee profile information

**Request Body:**
```json
{
  "name": "John Doe Updated",
  "phone_number": "+1234567890",
  "biography": "Updated bio",
  "date_of_birth": "1990-05-15"
}
```

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "id": 1,
    "name": "John Doe Updated",
    "phone_number": "+1234567890",
    "biography": "Updated bio",
    "date_of_birth": "1990-05-15"
  }
}
```

---

#### 4. Get My Availability
- **Endpoint:** `GET /availability`
- **Auth Required:** ✅ Yes
- **Role Required:** `EMPLOYEE`, `HR`, `ADMIN`
- **Description:** Get employee's availability slots

**Response (Success - 200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "employee_id": 1,
      "date": "2026-04-24",
      "startTime": "09:00",
      "endTime": "12:00",
      "slotType": "FREE",
      "created_at": "2026-04-23T10:00:00Z"
    }
  ]
}
```

---

#### 5. Add Availability Slot
- **Endpoint:** `POST /availability`
- **Auth Required:** ✅ Yes
- **Role Required:** `EMPLOYEE`
- **Description:** Create new availability slot

**Request Body:**
```json
{
  "date": "2026-04-25",
  "startTime": "09:00",
  "endTime": "17:00",
  "slotType": "FREE"
}
```

**Request Validation:**
- `date` - Must be valid date (YYYY-MM-DD format)
- `startTime` - Must be HH:MM format
- `endTime` - Must be HH:MM format
- `slotType` - Must be `FREE` or `BUSY`

**Response (Success - 201):**
```json
{
  "success": true,
  "message": "Availability slot created",
  "data": {
    "id": 2,
    "employee_id": 1,
    "date": "2026-04-25",
    "startTime": "09:00",
    "endTime": "17:00",
    "slotType": "FREE"
  }
}
```

---

#### 6. Update Availability Slot
- **Endpoint:** `PUT /availability/:slotId`
- **Auth Required:** ✅ Yes
- **Role Required:** `EMPLOYEE`
- **Description:** Update existing availability slot

**URL Parameters:**
- `slotId` - Availability slot ID

**Request Body:**
```json
{
  "startTime": "10:00",
  "endTime": "16:00",
  "slotType": "BUSY"
}
```

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Availability slot updated",
  "data": {
    "id": 2,
    "startTime": "10:00",
    "endTime": "16:00",
    "slotType": "BUSY"
  }
}
```

---

#### 7. Delete Availability Slot
- **Endpoint:** `DELETE /availability/:slotId`
- **Auth Required:** ✅ Yes
- **Role Required:** `EMPLOYEE`
- **Description:** Delete availability slot

**URL Parameters:**
- `slotId` - Availability slot ID

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Availability slot deleted"
}
```

---

#### 8. Get Employee Availability (HR/Admin)
- **Endpoint:** `GET /:employeeId/availability`
- **Auth Required:** ✅ Yes
- **Role Required:** `HR`, `ADMIN`
- **Description:** View specific employee's availability

**URL Parameters:**
- `employeeId` - Employee ID

**Response:** Same format as "Get My Availability"

---

#### 9. Get My Projects
- **Endpoint:** `GET /my-projects`
- **Auth Required:** ✅ Yes
- **Role Required:** `EMPLOYEE`
- **Description:** Get all projects assigned to employee

**Response (Success - 200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "project_id": "PRJ001",
      "name": "Mobile App Development",
      "description": "Build iOS and Android app",
      "priority": "high",
      "created_at": "2026-01-15T10:00:00Z"
    }
  ]
}
```

---

#### 10. Get My Logs
- **Endpoint:** `GET /my-logs`
- **Auth Required:** ✅ Yes
- **Role Required:** `EMPLOYEE`
- **Description:** Get employee's login logs

**Response (Success - 200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "userId": 1,
      "ipAddress": "192.168.1.100",
      "userAgent": "Mozilla/5.0...",
      "loginTime": "2026-04-23T08:30:00Z",
      "logoutTime": "2026-04-23T17:30:00Z",
      "sessionDuration": 32400
    }
  ]
}
```

---

### HR Module
**Base Route:** `/api/hr`

#### 1. Get HR Dashboard
- **Endpoint:** `GET /dashboard`
- **Auth Required:** ✅ Yes
- **Role Required:** `HR`
- **Description:** Get HR dashboard overview

**Response (Success - 200):**
```json
{
  "success": true,
  "data": {
    "total_employees": 25,
    "active_employees": 23,
    "inactive_employees": 2,
    "departments": {
      "Engineering": 10,
      "HR": 3,
      "Sales": 8,
      "Finance": 4
    },
    "recent_logins": [...]
  }
}
```

---

#### 2. Get HR Profile
- **Endpoint:** `GET /profile`
- **Auth Required:** ✅ Yes
- **Role Required:** `HR`
- **Description:** Get HR user's profile

**Response (Success - 200):**
```json
{
  "success": true,
  "data": {
    "id": 2,
    "email": "hr@example.com",
    "name": "Sarah HR",
    "role": "hr",
    "department": "Human Resources",
    "phone_number": "+1234567890",
    "is_active": true
  }
}
```

---

#### 3. Update HR Profile
- **Endpoint:** `PUT /profile`
- **Auth Required:** ✅ Yes
- **Role Required:** `HR`
- **Description:** Update HR profile information

**Request Body:**
```json
{
  "name": "Sarah HR Updated",
  "phone_number": "+9876543210"
}
```

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {...}
}
```

---

#### 4. Get All Employees
- **Endpoint:** `GET /employees`
- **Auth Required:** ✅ Yes
- **Role Required:** `HR`
- **Description:** Retrieve all employees

**Query Parameters:**
- `limit` - Results per page (default: 10)
- `offset` - Pagination offset (default: 0)

**Response (Success - 200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "userid": "EMP001",
      "email": "employee@example.com",
      "name": "John Doe",
      "role": "employee",
      "department": "Engineering",
      "job_title": "Senior Developer",
      "status": "online",
      "is_active": true,
      "join_date": "2022-01-15"
    }
  ],
  "total": 25,
  "limit": 10,
  "offset": 0
}
```

---

#### 5. Search Employees
- **Endpoint:** `GET /employees/search`
- **Auth Required:** ✅ Yes
- **Role Required:** `HR`
- **Description:** Search employees by name or email

**Query Parameters:**
- `q` - Search query (name or email)
- `department` - Filter by department (optional)

**Response (Success - 200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "userid": "EMP001",
      "email": "john@example.com",
      "name": "John Doe",
      "department": "Engineering"
    }
  ]
}
```

---

#### 6. Get Employee By ID
- **Endpoint:** `GET /employees/:id`
- **Auth Required:** ✅ Yes
- **Role Required:** `HR`
- **Description:** Get specific employee details

**URL Parameters:**
- `id` - Employee ID

**Response (Success - 200):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "userid": "EMP001",
    "email": "john@example.com",
    "name": "John Doe",
    "role": "employee",
    "department": "Engineering",
    "job_title": "Senior Developer",
    "phone_number": "+1234567890",
    "date_of_birth": "1990-05-15",
    "join_date": "2022-01-15",
    "biography": "Passionate developer",
    "status": "online",
    "is_active": true,
    "created_at": "2022-01-15T10:00:00Z"
  }
}
```

---

#### 7. Update Employee
- **Endpoint:** `PUT /employees/:id`
- **Auth Required:** ✅ Yes
- **Role Required:** `HR`
- **Description:** Update employee information

**URL Parameters:**
- `id` - Employee ID

**Request Body:**
```json
{
  "name": "John Doe Updated",
  "department": "Product",
  "job_title": "Lead Developer",
  "phone_number": "+9876543210",
  "date_of_birth": "1990-05-15"
}
```

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Employee updated successfully",
  "data": {...}
}
```

---

#### 8. Delete Employee
- **Endpoint:** `DELETE /employees/:id`
- **Auth Required:** ✅ Yes
- **Role Required:** `HR`
- **Description:** Delete/deactivate employee

**URL Parameters:**
- `id` - Employee ID

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Employee deleted successfully"
}
```

---

### Admin Module
**Base Route:** `/api/admin`

#### 1. Create Employee (Admin/HR)
- **Endpoint:** `POST /users/employee`
- **Auth Required:** ✅ Yes
- **Role Required:** `ADMIN`, `HR`
- **Description:** Create new employee user

**Request Body:**
```json
{
  "email": "newemployee@example.com",
  "password": "SecurePass123",
  "fullName": "Jane Smith",
  "department": "Engineering",
  "job_title": "Developer"
}
```

**Request Validation:**
- `email` - Must be valid email
- `password` - Minimum 6 characters
- `fullName` - Required, not empty

**Response (Success - 201):**
```json
{
  "success": true,
  "message": "Employee created successfully",
  "data": {
    "id": 15,
    "email": "newemployee@example.com",
    "name": "Jane Smith",
    "role": "employee",
    "userid": "EMP015",
    "is_active": true,
    "created_at": "2026-04-23T10:00:00Z"
  }
}
```

---

#### 2. Create HR (Admin Only)
- **Endpoint:** `POST /users/hr`
- **Auth Required:** ✅ Yes
- **Role Required:** `ADMIN`
- **Description:** Create new HR user

**Request Body:**
```json
{
  "email": "newhr@example.com",
  "password": "SecurePass123",
  "fullName": "Alice HR Manager"
}
```

**Request Validation:** Same as employee creation

**Response (Success - 201):**
```json
{
  "success": true,
  "message": "HR user created successfully",
  "data": {
    "id": 16,
    "email": "newhr@example.com",
    "name": "Alice HR Manager",
    "role": "hr",
    "is_active": true
  }
}
```

---

#### 3. Create Client (Admin/HR)
- **Endpoint:** `POST /users/client`
- **Auth Required:** ✅ Yes
- **Role Required:** `ADMIN`, `HR`
- **Description:** Create new client user

**Request Body:**
```json
{
  "email": "client@company.com",
  "password": "SecurePass123",
  "companyName": "Tech Corp",
  "contactName": "Bob Johnson"
}
```

**Request Validation:**
- `email` - Must be valid email
- `password` - Minimum 6 characters
- `companyName` - Required, not empty
- `contactName` - Required, not empty

**Response (Success - 201):**
```json
{
  "success": true,
  "message": "Client created successfully",
  "data": {
    "id": 17,
    "email": "client@company.com",
    "name": "Bob Johnson",
    "role": "client",
    "company": "Tech Corp",
    "is_active": true
  }
}
```

---

#### 4. Toggle User Active Status
- **Endpoint:** `PUT /users/:id/toggle-active`
- **Auth Required:** ✅ Yes
- **Role Required:** `ADMIN`, `HR`
- **Description:** Activate/deactivate user

**URL Parameters:**
- `id` - User ID

**Request Body:** `{}`

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "User status toggled",
  "data": {
    "id": 1,
    "email": "user@example.com",
    "is_active": false
  }
}
```

---

#### 5. Delete User (Admin Only)
- **Endpoint:** `DELETE /users/:id`
- **Auth Required:** ✅ Yes
- **Role Required:** `ADMIN`
- **Description:** Permanently delete user

**URL Parameters:**
- `id` - User ID

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "User deleted successfully"
}
```

---

#### 6. Get All Users (Admin/HR)
- **Endpoint:** `GET /users`
- **Auth Required:** ✅ Yes
- **Role Required:** `ADMIN`, `HR`
- **Description:** Retrieve all users in system

**Query Parameters:**
- `role` - Filter by role (employee, hr, admin, client)
- `status` - Filter by status (online, offline)
- `limit` - Results per page
- `offset` - Pagination offset

**Response (Success - 200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "userid": "EMP001",
      "email": "employee@example.com",
      "name": "John Doe",
      "role": "employee",
      "status": "online",
      "is_active": true
    }
  ],
  "total": 45
}
```

---

#### 7. Get All Logs (Admin Only)
- **Endpoint:** `GET /logs`
- **Auth Required:** ✅ Yes
- **Role Required:** `ADMIN`
- **Description:** Get system-wide login logs

**Query Parameters:**
- `userId` - Filter by user
- `startDate` - Filter from date
- `endDate` - Filter to date
- `limit` - Results per page

**Response (Success - 200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "userId": 1,
      "user_email": "john@example.com",
      "ipAddress": "192.168.1.100",
      "userAgent": "Mozilla/5.0...",
      "loginTime": "2026-04-23T08:30:00Z",
      "logoutTime": "2026-04-23T17:30:00Z",
      "sessionDuration": 32400
    }
  ]
}
```

---

#### 8. Get Dashboard Stats (Admin Only)
- **Endpoint:** `GET /stats`
- **Auth Required:** ✅ Yes
- **Role Required:** `ADMIN`
- **Description:** Get system statistics

**Response (Success - 200):**
```json
{
  "success": true,
  "data": {
    "total_users": 50,
    "active_users": 45,
    "total_employees": 35,
    "total_hr": 5,
    "total_admins": 2,
    "total_clients": 8,
    "online_now": 28,
    "sessions_today": 150,
    "avg_session_duration": 28800,
    "top_departments": {
      "Engineering": 15,
      "Sales": 12,
      "HR": 5
    }
  }
}
```

---

### Client Module
**Base Route:** `/api/client` or `/api/clients`

#### 1. Client Login
- **Endpoint:** `POST /login`
- **Auth Required:** ❌ No
- **Role Required:** N/A
- **Description:** Login as client

**Request Body:**
```json
{
  "clientId": "CLIENT123"
}
```

**Response:** Same as auth login

---

#### 2. Get Client Dashboard
- **Endpoint:** `GET /dashboard`
- **Auth Required:** ✅ Yes
- **Role Required:** `CLIENT`
- **Description:** Client dashboard overview

**Response (Success - 200):**
```json
{
  "success": true,
  "data": {
    "company_name": "Tech Corp",
    "contact_name": "Bob Johnson",
    "active_projects": 3,
    "total_projects": 5,
    "pending_requests": 2,
    "projects": [
      {
        "id": 1,
        "name": "Mobile App",
        "status": "in_progress",
        "progress": 65,
        "team_size": 5
      }
    ]
  }
}
```

---

#### 3. Get Client Profile
- **Endpoint:** `GET /profile`
- **Auth Required:** ✅ Yes
- **Role Required:** `CLIENT`
- **Description:** Get client profile information

**Response (Success - 200):**
```json
{
  "success": true,
  "data": {
    "id": 5,
    "email": "client@company.com",
    "name": "Bob Johnson",
    "company": "Tech Corp",
    "phone": "+1234567890",
    "address": "123 Business St",
    "is_active": true
  }
}
```

---

#### 4. Update Client Profile
- **Endpoint:** `PUT /profile`
- **Auth Required:** ✅ Yes
- **Role Required:** `CLIENT`
- **Description:** Update client information

**Request Body:**
```json
{
  "name": "Bob Johnson Updated",
  "phone": "+9876543210",
  "address": "456 New Address St"
}
```

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {...}
}
```

---

#### 5. Get My Projects
- **Endpoint:** `GET /projects`
- **Auth Required:** ✅ Yes
- **Role Required:** `CLIENT`
- **Description:** Get all projects for client

**Response (Success - 200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "project_id": "PRJ001",
      "name": "Mobile App Development",
      "description": "Build iOS and Android app",
      "priority": "high",
      "created_at": "2026-01-15T10:00:00Z",
      "status": "in_progress"
    }
  ]
}
```

---

#### 6. Get Project By ID
- **Endpoint:** `GET /projects/:id`
- **Auth Required:** ✅ Yes
- **Role Required:** `CLIENT`
- **Description:** Get specific project details

**URL Parameters:**
- `id` - Project ID

**Response (Success - 200):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "project_id": "PRJ001",
    "name": "Mobile App Development",
    "description": "Build iOS and Android app",
    "priority": "high",
    "team": [
      {
        "id": 1,
        "name": "John Doe",
        "role": "Lead Developer",
        "email": "john@example.com"
      }
    ],
    "tasks": [...],
    "created_at": "2026-01-15T10:00:00Z"
  }
}
```

---

#### 7. Request Project
- **Endpoint:** `POST /projects/request`
- **Auth Required:** ✅ Yes
- **Role Required:** `CLIENT`
- **Description:** Request new project

**Request Body:**
```json
{
  "name": "New Web Application",
  "description": "Build responsive web app",
  "budget": 50000,
  "timeline": "3 months",
  "requirements": "React, Node.js, PostgreSQL"
}
```

**Response (Success - 201):**
```json
{
  "success": true,
  "message": "Project request submitted",
  "data": {
    "request_id": "REQ001",
    "status": "pending",
    "created_at": "2026-04-23T10:00:00Z"
  }
}
```

---

### Meetings Module
**Base Route:** `/api/meetings`

#### 1. Get All Meetings
- **Endpoint:** `GET /`
- **Auth Required:** ✅ Yes
- **Role Required:** `HR`, `ADMIN`, `EMPLOYEE`
- **Description:** Get all meetings for authenticated user

**Query Parameters:**
- `status` - Filter by status (scheduled, completed, cancelled)
- `date` - Filter by date

**Response (Success - 200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "Team Standup",
      "date": "2026-04-24",
      "startTime": "10:00",
      "endTime": "10:30",
      "participants": [
        {
          "id": 1,
          "name": "John Doe",
          "email": "john@example.com"
        }
      ],
      "status": "scheduled",
      "created_at": "2026-04-23T09:00:00Z"
    }
  ]
}
```

---

#### 2. Schedule Meeting
- **Endpoint:** `POST /`
- **Auth Required:** ✅ Yes
- **Role Required:** `HR`, `ADMIN`
- **Description:** Create new meeting

**Request Body:**
```json
{
  "title": "Team Standup",
  "date": "2026-04-24",
  "startTime": "10:00",
  "endTime": "10:30",
  "participantIds": [1, 2, 3]
}
```

**Request Validation:**
- `title` - Required, not empty
- `date` - Must be valid date
- `startTime` - Must be HH:MM format
- `endTime` - Must be HH:MM format
- `participantIds` - Array with minimum 1 participant

**Response (Success - 201):**
```json
{
  "success": true,
  "message": "Meeting scheduled successfully",
  "data": {
    "id": 1,
    "title": "Team Standup",
    "date": "2026-04-24",
    "startTime": "10:00",
    "endTime": "10:30",
    "status": "scheduled",
    "created_at": "2026-04-23T09:00:00Z"
  }
}
```

---

#### 3. Update Meeting Status
- **Endpoint:** `PUT /:id/status`
- **Auth Required:** ✅ Yes
- **Role Required:** `HR`, `ADMIN`
- **Description:** Update meeting status

**URL Parameters:**
- `id` - Meeting ID

**Request Body:**
```json
{
  "status": "completed"
}
```

**Valid Status Values:** `scheduled`, `in_progress`, `completed`, `cancelled`

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Meeting status updated",
  "data": {
    "id": 1,
    "status": "completed",
    "updated_at": "2026-04-24T10:30:00Z"
  }
}
```

---

#### 4. Cancel Meeting
- **Endpoint:** `DELETE /:id`
- **Auth Required:** ✅ Yes
- **Role Required:** `HR`, `ADMIN`
- **Description:** Cancel meeting

**URL Parameters:**
- `id` - Meeting ID

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Meeting cancelled successfully"
}
```

---

### Projects Module
**Base Route:** `/api/projects`

#### 1. Get All Projects
- **Endpoint:** `GET /`
- **Auth Required:** ✅ Yes
- **Role Required:** All authenticated users
- **Description:** Get all projects

**Query Parameters:**
- `status` - Filter by status
- `priority` - Filter by priority
- `limit` - Results per page
- `offset` - Pagination offset

**Response (Success - 200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "project_id": "PRJ001",
      "name": "Mobile App Development",
      "description": "Build iOS and Android app",
      "priority": "high",
      "assigned_employees": 5,
      "created_at": "2026-01-15T10:00:00Z"
    }
  ]
}
```

---

#### 2. Get Project By ID
- **Endpoint:** `GET /:id`
- **Auth Required:** ✅ Yes
- **Role Required:** All authenticated users
- **Description:** Get specific project details

**URL Parameters:**
- `id` - Project ID

**Response (Success - 200):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "project_id": "PRJ001",
    "name": "Mobile App Development",
    "description": "Build iOS and Android app",
    "priority": "high",
    "assigned_employees": [
      {
        "id": 1,
        "name": "John Doe",
        "email": "john@example.com",
        "role": "Lead Developer"
      }
    ],
    "tasks": [...],
    "created_at": "2026-01-15T10:00:00Z"
  }
}
```

---

### Events Module
**Base Route:** `/api/events`

#### 1. Get All Events
- **Endpoint:** `GET /`
- **Auth Required:** ✅ Yes
- **Role Required:** All roles
- **Description:** Get all events

**Response (Success - 200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "Company Outing",
      "description": "Team building event",
      "event_date": "2026-05-15",
      "event_time": "14:00",
      "location": "Central Park",
      "event_type": "team_building",
      "category": "social",
      "priority": "medium",
      "created_by": 2,
      "is_recurring": false,
      "created_at": "2026-04-23T10:00:00Z"
    }
  ]
}
```

---

#### 2. Get Nearest Events
- **Endpoint:** `GET /nearest`
- **Auth Required:** ✅ Yes
- **Role Required:** All roles
- **Description:** Get upcoming events

**Query Parameters:**
- `limit` - Number of events to return (default: 5)
- `days` - Number of days ahead to search (default: 30)

**Response (Success - 200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "Company Outing",
      "event_date": "2026-05-15",
      "event_time": "14:00",
      "days_until": 22
    }
  ]
}
```

---

#### 3. Get Events By Date Range
- **Endpoint:** `GET /range`
- **Auth Required:** ✅ Yes
- **Role Required:** All roles
- **Description:** Get events within date range

**Query Parameters:**
- `startDate` - Start date (YYYY-MM-DD)
- `endDate` - End date (YYYY-MM-DD)

**Response:** Same format as "Get All Events"

---

#### 4. Create Event (HR Only)
- **Endpoint:** `POST /`
- **Auth Required:** ✅ Yes
- **Role Required:** `HR`
- **Description:** Create new event

**Request Body:**
```json
{
  "title": "Company Outing",
  "description": "Team building event",
  "event_date": "2026-05-15",
  "event_time": "14:00:00",
  "location": "Central Park",
  "event_type": "team_building",
  "category": "social",
  "priority": "medium",
  "is_recurring": false
}
```

**Response (Success - 201):**
```json
{
  "success": true,
  "message": "Event created successfully",
  "data": {
    "id": 1,
    "title": "Company Outing",
    "event_date": "2026-05-15",
    "event_time": "14:00:00"
  }
}
```

---

#### 5. Update Event (HR Only)
- **Endpoint:** `PUT /:id`
- **Auth Required:** ✅ Yes
- **Role Required:** `HR`
- **Description:** Update event

**URL Parameters:**
- `id` - Event ID

**Request Body:** (partial update allowed)
```json
{
  "title": "Updated Event Title",
  "location": "New Location"
}
```

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Event updated successfully",
  "data": {...}
}
```

---

#### 6. Delete Event (HR Only)
- **Endpoint:** `DELETE /:id`
- **Auth Required:** ✅ Yes
- **Role Required:** `HR`
- **Description:** Delete event

**URL Parameters:**
- `id` - Event ID

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Event deleted successfully"
}
```

---

### Sticky Notes Module
**Base Route:** `/api/sticky-notes`

#### 1. Get All Sticky Notes
- **Endpoint:** `GET /`
- **Auth Required:** ✅ Yes
- **Role Required:** `EMPLOYEE`, `HR`, `ADMIN`, `CLIENT`
- **Description:** Get all sticky notes for user

**Response (Success - 200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "user_id": 1,
      "content": "Important task reminder",
      "color": "yellow",
      "note_date": "2026-04-23",
      "position": 1,
      "created_at": "2026-04-23T09:00:00Z"
    }
  ]
}
```

---

#### 2. Get Sticky Notes By Date
- **Endpoint:** `GET /by-date`
- **Auth Required:** ✅ Yes
- **Role Required:** `EMPLOYEE`, `HR`, `ADMIN`, `CLIENT`
- **Description:** Get sticky notes for specific date

**Query Parameters:**
- `date` - Date in YYYY-MM-DD format (required)

**Response:** Same format as "Get All Sticky Notes"

---

#### 3. Get Sticky Notes By Date Range
- **Endpoint:** `GET /by-range`
- **Auth Required:** ✅ Yes
- **Role Required:** `EMPLOYEE`, `HR`, `ADMIN`, `CLIENT`
- **Description:** Get sticky notes within date range

**Query Parameters:**
- `startDate` - Start date in YYYY-MM-DD format (required)
- `endDate` - End date in YYYY-MM-DD format (required)

**Response:** Same format as "Get All Sticky Notes"

---

#### 4. Get Sticky Notes By Color
- **Endpoint:** `GET /by-color`
- **Auth Required:** ✅ Yes
- **Role Required:** `EMPLOYEE`, `HR`, `ADMIN`, `CLIENT`
- **Description:** Get sticky notes filtered by color

**Query Parameters:**
- `color` - Color name (e.g., "yellow", "red", "blue", "green")

**Response:** Same format as "Get All Sticky Notes"

---

#### 5. Get Sticky Note By ID
- **Endpoint:** `GET /:id`
- **Auth Required:** ✅ Yes
- **Role Required:** `EMPLOYEE`, `HR`, `ADMIN`, `CLIENT`
- **Description:** Get specific sticky note

**URL Parameters:**
- `id` - Note ID (must be integer)

**Response (Success - 200):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "user_id": 1,
    "content": "Important task reminder",
    "color": "yellow",
    "note_date": "2026-04-23",
    "position": 1,
    "created_at": "2026-04-23T09:00:00Z",
    "updated_at": "2026-04-23T09:30:00Z"
  }
}
```

---

#### 6. Create Sticky Note
- **Endpoint:** `POST /`
- **Auth Required:** ✅ Yes
- **Role Required:** `EMPLOYEE`, `HR`, `ADMIN`, `CLIENT`
- **Description:** Create new sticky note

**Request Body:**
```json
{
  "content": "Important task reminder",
  "note_date": "2026-04-24",
  "color": "yellow",
  "position": 1
}
```

**Request Validation:**
- `content` - Required, not empty
- `note_date` - Must be valid date (YYYY-MM-DD)
- `color` - Optional string
- `position` - Optional integer

**Response (Success - 201):**
```json
{
  "success": true,
  "message": "Sticky note created successfully",
  "data": {
    "id": 2,
    "content": "Important task reminder",
    "color": "yellow",
    "note_date": "2026-04-24",
    "position": 1,
    "created_at": "2026-04-23T10:00:00Z"
  }
}
```

---

#### 7. Update Sticky Note
- **Endpoint:** `PUT /:id`
- **Auth Required:** ✅ Yes
- **Role Required:** `EMPLOYEE`, `HR`, `ADMIN`, `CLIENT`
- **Description:** Update sticky note

**URL Parameters:**
- `id` - Note ID (must be integer)

**Request Body:** (partial update allowed)
```json
{
  "content": "Updated reminder",
  "color": "red",
  "position": 2
}
```

**Request Validation:**
- `content` - Optional, but cannot be empty if provided
- `note_date` - Optional, must be valid date if provided
- `color` - Optional string
- `position` - Optional integer

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Sticky note updated successfully",
  "data": {
    "id": 2,
    "content": "Updated reminder",
    "color": "red",
    "note_date": "2026-04-24",
    "position": 2,
    "updated_at": "2026-04-23T10:30:00Z"
  }
}
```

---

#### 8. Delete Sticky Note
- **Endpoint:** `DELETE /:id`
- **Auth Required:** ✅ Yes
- **Role Required:** `EMPLOYEE`, `HR`, `ADMIN`, `CLIENT`
- **Description:** Delete sticky note

**URL Parameters:**
- `id` - Note ID (must be integer)

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Sticky note deleted successfully"
}
```

---

### Timer Module
**Base Route:** `/api/timer`

#### 1. Start Timer
- **Endpoint:** `POST /start`
- **Auth Required:** ✅ Yes
- **Role Required:** `EMPLOYEE`
- **Description:** Start work timer

**Request Body:**
```json
{
  "project_id": 1
}
```

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Timer started",
  "data": {
    "session_id": 1,
    "start_time": "2026-04-23T09:00:00Z",
    "project_id": 1,
    "status": "running"
  }
}
```

---

#### 2. Stop Timer
- **Endpoint:** `POST /stop`
- **Auth Required:** ✅ Yes
- **Role Required:** `EMPLOYEE`
- **Description:** Stop work timer

**Request Body:**
```json
{
  "session_id": 1
}
```

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Timer stopped",
  "data": {
    "session_id": 1,
    "start_time": "2026-04-23T09:00:00Z",
    "end_time": "2026-04-23T17:30:00Z",
    "duration_seconds": 30600,
    "status": "completed"
  }
}
```

---

#### 3. Batch Save Duration
- **Endpoint:** `POST /batch-save`
- **Auth Required:** ✅ Yes
- **Role Required:** `EMPLOYEE`
- **Description:** Batch save timer duration every 15 minutes

**Request Body:**
```json
{
  "session_id": 1,
  "duration_seconds": 900
}
```

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Duration saved",
  "data": {
    "session_id": 1,
    "duration_seconds": 900,
    "last_saved": "2026-04-23T09:15:00Z"
  }
}
```

---

#### 4. Get All Sessions
- **Endpoint:** `GET /sessions`
- **Auth Required:** ✅ Yes
- **Role Required:** `EMPLOYEE`, `HR`, `ADMIN`
- **Description:** Get all timer sessions

**Query Parameters:**
- `userId` - Filter by user (HR/ADMIN only)
- `date` - Filter by date
- `status` - Filter by status (running, completed, paused)

**Response (Success - 200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "user_id": 1,
      "project_id": 1,
      "start_time": "2026-04-23T09:00:00Z",
      "end_time": "2026-04-23T17:30:00Z",
      "duration_seconds": 30600,
      "status": "completed"
    }
  ]
}
```

---

#### 5. Get Total Hours
- **Endpoint:** `GET /total`
- **Auth Required:** ✅ Yes
- **Role Required:** `EMPLOYEE`, `HR`, `ADMIN`
- **Description:** Get total hours worked

**Query Parameters:**
- `userId` - User ID (HR/ADMIN only)
- `startDate` - Filter from date
- `endDate` - Filter to date

**Response (Success - 200):**
```json
{
  "success": true,
  "data": {
    "user_id": 1,
    "total_seconds": 720000,
    "total_hours": 200,
    "total_days": 25,
    "period": {
      "start": "2026-01-01",
      "end": "2026-04-23"
    }
  }
}
```

---

#### 6. Get Today's Hours
- **Endpoint:** `GET /today`
- **Auth Required:** ✅ Yes
- **Role Required:** `EMPLOYEE`, `HR`, `ADMIN`
- **Description:** Get hours worked today

**Query Parameters:**
- `userId` - User ID (HR/ADMIN only)

**Response (Success - 200):**
```json
{
  "success": true,
  "data": {
    "user_id": 1,
    "date": "2026-04-23",
    "total_seconds": 28800,
    "total_hours": 8,
    "sessions": 2
  }
}
```

---

#### 7. Get Active Session
- **Endpoint:** `GET /active`
- **Auth Required:** ✅ Yes
- **Role Required:** `EMPLOYEE`
- **Description:** Get currently active timer session

**Response (Success - 200):**
```json
{
  "success": true,
  "data": {
    "session_id": 1,
    "start_time": "2026-04-23T09:00:00Z",
    "elapsed_seconds": 3600,
    "project_id": 1,
    "status": "running"
  }
}
```

**Response (No Active Session - 204):**
```json
{
  "success": true,
  "data": null
}
```

---

## Data Models

### User Model
```javascript
{
  id: integer (primary key),
  userid: string (unique) - Employee/User ID
  email: string (unique),
  name: string,
  role: string - 'employee' | 'hr' | 'admin' | 'client',
  password: string (hashed),
  status: string - 'online' | 'offline',
  created_at: timestamp,
  updated_at: timestamp,
  department: string (optional),
  biography: string (optional),
  is_active: boolean,
  job_title: string (optional),
  join_date: date (optional),
  phone_number: string (optional),
  date_of_birth: date (optional),
  bio: string (optional)
}
```

### Project Model
```javascript
{
  id: integer (primary key),
  project_id: string (unique),
  name: string,
  description: string (optional),
  priority: string - 'low' | 'medium' | 'high',
  created_at: timestamp
}
```

### Task Model
```javascript
{
  id: integer (primary key),
  project_id: integer (foreign key),
  task_number: string,
  title: string,
  description: string (optional),
  deadline: date (optional),
  status: string - 'pending' | 'in_progress' | 'completed' | 'on_hold',
  assigned_to: integer (foreign key to user),
  created_at: timestamp
}
```

### Event Model
```javascript
{
  id: integer (primary key),
  title: string,
  description: string (optional),
  event_date: date,
  event_time: time (optional),
  end_date: date (optional),
  end_time: time (optional),
  location: string (optional),
  event_type: string - 'general' | 'meeting' | 'conference' | 'team_building',
  created_by: integer (foreign key to user),
  category: string (optional),
  priority: string - 'low' | 'medium' | 'high',
  is_recurring: boolean,
  repeat_type: string (optional) - 'daily' | 'weekly' | 'monthly' | 'yearly',
  repeat_days: string (optional) - Comma-separated days,
  repeat_end_date: date (optional),
  created_at: timestamp,
  updated_at: timestamp
}
```

### Sticky Note Model
```javascript
{
  id: integer (primary key),
  user_id: integer (foreign key),
  content: string,
  color: string - 'yellow' | 'red' | 'blue' | 'green' | 'pink',
  note_date: date,
  position: integer,
  created_at: timestamp,
  updated_at: timestamp
}
```

### Login Log Model
```javascript
{
  id: integer (primary key),
  userId: integer (foreign key),
  ipAddress: string (optional),
  userAgent: string (optional),
  loginTime: timestamp,
  logoutTime: timestamp (optional),
  sessionDuration: integer (seconds, optional)
}
```

---

## Error Handling

### Standard Error Response Format
```json
{
  "success": false,
  "message": "Error description",
  "errors": [
    {
      "field": "email",
      "message": "Valid email required"
    }
  ]
}
```

### Common HTTP Status Codes

| Code | Meaning |
|------|---------|
| 200  | OK - Request successful |
| 201  | Created - Resource created |
| 204  | No Content - Successful with no response body |
| 400  | Bad Request - Invalid parameters |
| 401  | Unauthorized - Authentication failed |
| 403  | Forbidden - Insufficient permissions |
| 404  | Not Found - Resource not found |
| 409  | Conflict - Resource already exists |
| 422  | Unprocessable Entity - Validation error |
| 500  | Internal Server Error - Server error |

### Common Error Responses

#### 401 Unauthorized
```json
{
  "success": false,
  "message": "Unauthorized - Invalid or missing token"
}
```

#### 403 Forbidden
```json
{
  "success": false,
  "message": "Forbidden - Insufficient permissions"
}
```

#### 404 Not Found
```json
{
  "success": false,
  "message": "Resource not found"
}
```

#### 422 Validation Error
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "Valid email required"
    },
    {
      "field": "password",
      "message": "Minimum 6 characters required"
    }
  ]
}
```

---

## Workflows

### 1. User Login & Authentication Flow

```
START
  ↓
POST /api/auth/login with credentials
  ↓
Validate email & password format
  ↓
Check if user exists in database
  ├─ No → Return 401 Unauthorized
  │
  └─ Yes → Verify password hash
      ├─ Mismatch → Return 401 Unauthorized
      │
      └─ Match → Generate JWT token
          ↓
          Return token & user data
          ↓
          Client stores token in Authorization header or cookie
          ↓
          Client can now access protected endpoints
          ↓
          END
```

### 2. Employee Project Assignment & Timer Flow

```
START
  ↓
HR/Admin assigns project to employee (via database)
  ↓
Employee views projects: GET /api/employee/my-projects
  ├─ Returns assigned projects
  │
Employee starts timer: POST /api/timer/start
  ├─ Creates timer session
  ├─ Records start_time
  │
Employee works on project...
  ├─ Every 15 minutes → POST /api/timer/batch-save
  │   └─ Updates session duration
  │
Employee stops timer: POST /api/timer/stop
  ├─ Records end_time
  ├─ Calculates total duration
  ├─ Saves session
  │
HR/Admin views employee hours: GET /api/timer/sessions
  ├─ Filters by employee (optional)
  ├─ Filters by date (optional)
  │
END
```

### 3. Meeting Scheduling Flow

```
START
  ↓
HR/Admin schedules meeting: POST /api/meetings
  ├─ Provide: title, date, startTime, endTime, participantIds
  │
System creates meeting record
  ├─ Sets status = "scheduled"
  │
Participants receive notification
  │
Meeting date arrives...
  │
HR/Admin updates status: PUT /api/meetings/:id/status
  ├─ Status: "in_progress"
  │
Meeting concludes
  │
HR/Admin updates status again: PUT /api/meetings/:id/status
  ├─ Status: "completed"
  │
System records meeting completion
  │
END
```

### 4. Employee Availability & Scheduling Flow

```
START
  ↓
Employee sets availability: POST /api/employee/availability
  ├─ Provide: date, startTime, endTime, slotType (FREE/BUSY)
  │
HR views employee availability: GET /api/employee/:employeeId/availability
  │
HR can schedule meetings considering availability
  │
Employee can update availability: PUT /api/employee/availability/:slotId
  │
Employee can delete availability: DELETE /api/employee/availability/:slotId
  │
END
```

### 5. Event Management Flow

```
START
  ↓
HR creates event: POST /api/events
  ├─ Provide: title, date, time, location, type, etc.
  │
System stores event in database
  │
All employees view events: GET /api/events
  │
Employees check nearest events: GET /api/events/nearest
  │
Employees filter by date range: GET /api/events/range
  │
HR updates event details: PUT /api/events/:id
  │
HR cancels event: DELETE /api/events/:id
  │
END
```

### 6. Sticky Notes Daily Workflow

```
START (Daily)
  ↓
Employee creates sticky note: POST /api/sticky-notes
  ├─ Content: Task or reminder
  ├─ Color: Visual organization
  ├─ Date: Today's date
  │
Employee views all notes: GET /api/sticky-notes
  │
Employee filters notes by date: GET /api/sticky-notes/by-date
  │
Employee filters by date range: GET /api/sticky-notes/by-range
  │
Employee filters by color: GET /api/sticky-notes/by-color
  │
Employee updates note: PUT /api/sticky-notes/:id
  │
Employee deletes note: DELETE /api/sticky-notes/:id
  │
END (Daily)
```

### 7. Admin User Management Flow

```
START
  ↓
Admin creates employee: POST /api/admin/users/employee
  ├─ Email, password, name required
  ├─ System generates unique userid
  │
Employee receives credentials
  │
Employee logs in: POST /api/auth/login
  │
Admin can view all users: GET /api/admin/users
  │
Admin can search users: GET /api/admin/users (with filters)
  │
Admin can toggle user status: PUT /api/admin/users/:id/toggle-active
  │
Admin can delete user: DELETE /api/admin/users/:id
  │
System logs all actions
  │
END
```

---

## API Usage Examples

### Example 1: Complete Login & Access Protected Endpoint

**Step 1: Login**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJqb2huQGV4YW1wbGUuY29tIiwibmFtZSI6IkpvaG4gRG9lIiwicm9sZSI6ImVtcGxveWVlIiwiaWF0IjoxNjE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c",
    "user": {
      "id": 1,
      "email": "john@example.com",
      "name": "John Doe",
      "role": "employee"
    }
  }
}
```

**Step 2: Access Protected Endpoint**
```bash
curl -X GET http://localhost:5000/api/employee/me \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJqb2huQGV4YW1wbGUuY29tIiwibmFtZSI6IkpvaG4gRG9lIiwicm9sZSI6ImVtcGxveWVlIiwiaWF0IjoxNjE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "userid": "EMP001",
    "email": "john@example.com",
    "name": "John Doe",
    "role": "employee",
    "department": "Engineering",
    "job_title": "Senior Developer"
  }
}
```

### Example 2: Create and Manage Sticky Notes

**Create Note**
```bash
curl -X POST http://localhost:5000/api/sticky-notes \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Complete project documentation",
    "note_date": "2026-04-24",
    "color": "yellow",
    "position": 1
  }'
```

**Get Notes by Date**
```bash
curl -X GET http://localhost:5000/api/sticky-notes/by-date?date=2026-04-24 \
  -H "Authorization: Bearer <token>"
```

**Update Note**
```bash
curl -X PUT http://localhost:5000/api/sticky-notes/1 \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Complete project documentation - HIGH PRIORITY",
    "color": "red"
  }'
```

### Example 3: Track Work Time

**Start Timer**
```bash
curl -X POST http://localhost:5000/api/timer/start \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "project_id": 1
  }'
```

**Get Today's Hours**
```bash
curl -X GET http://localhost:5000/api/timer/today \
  -H "Authorization: Bearer <token>"
```

**Stop Timer**
```bash
curl -X POST http://localhost:5000/api/timer/stop \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "session_id": 1
  }'
```

---

## Notes

- All timestamps are in ISO 8601 format with UTC timezone
- All IDs are positive integers
- Passwords are hashed using bcrypt (minimum 6 characters)
- JWT tokens expire after 24 hours
- Role names are case-insensitive in most endpoints
- All dates must be in YYYY-MM-DD format
- All times must be in HH:MM or HH:MM:SS format
- CORS is enabled for: `http://localhost:3000`, `http://localhost:3001`, `http://localhost:3002`
- Database: PostgreSQL with Prisma ORM

---

**Last Updated:** April 23, 2026  
**API Version:** 1.0.0
