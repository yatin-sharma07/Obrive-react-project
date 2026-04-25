# Tasks Management API Documentation

## Overview
The Tasks Management system allows project creators to assign tasks to team members and enables team members to view and update tasks assigned to them.

## Access Control Rules
- **Task Creator**: Can create, update, and delete their own tasks. Can see all tasks they created.
- **Assigned Team Member**: Can view and update tasks assigned to them.
- **Visibility**: Users can only see tasks that they created OR are assigned to.

## API Endpoints

### 1. Create Task
**POST** `/api/tasks/:projectId`

**Authentication**: Required (Bearer Token)

**Description**: Create a new task for a project. Only users assigned to the project can create tasks.

**Path Parameters**:
- `projectId` (number) - The project ID

**Request Body**:
```json
{
  "title": "string (required)",
  "description": "string (optional)",
  "deadline": "ISO 8601 date string (optional)",
  "status": "string (optional, default: 'pending')",
  "assigned_to": "number (optional, user ID)"
}
```

**Response (201)**:
```json
{
  "success": true,
  "message": "Task created successfully",
  "data": {
    "id": 1,
    "project_id": 1,
    "task_number": "TASK-1",
    "title": "Setup Database",
    "description": "Configure PostgreSQL database",
    "deadline": "2026-05-01",
    "status": "pending",
    "assigned_to": 5,
    "created_by": 3,
    "created_at": "2026-04-25T10:00:00Z",
    "updated_at": "2026-04-25T10:00:00Z",
    "assigned_user": {
      "id": 5,
      "name": "Jane Smith",
      "email": "jane@example.com"
    },
    "creator": {
      "id": 3,
      "name": "John Doe",
      "email": "john@example.com"
    }
  }
}
```

---

### 2. Get Tasks by Project
**GET** `/api/tasks/project/:projectId`

**Authentication**: Required (Bearer Token)

**Description**: Get all tasks in a project where the user is either the creator or assigned person.

**Path Parameters**:
- `projectId` (number) - The project ID

**Query Parameters**: None

**Response (200)**:
```json
{
  "success": true,
  "message": "Project tasks retrieved",
  "data": [
    {
      "id": 1,
      "project_id": 1,
      "task_number": "TASK-1",
      "title": "Setup Database",
      "description": "Configure PostgreSQL database",
      "deadline": "2026-05-01",
      "status": "in-progress",
      "assigned_to": 5,
      "created_by": 3,
      "created_at": "2026-04-25T10:00:00Z",
      "updated_at": "2026-04-25T11:30:00Z",
      "assigned_user": {
        "id": 5,
        "name": "Jane Smith",
        "email": "jane@example.com"
      },
      "creator": {
        "id": 3,
        "name": "John Doe",
        "email": "john@example.com"
      }
    }
  ]
}
```

---

### 3. Get Task by ID
**GET** `/api/tasks/:taskId`

**Authentication**: Required (Bearer Token)

**Description**: Get details of a specific task. User must be the creator or assigned person.

**Path Parameters**:
- `taskId` (number) - The task ID

**Response (200)**:
```json
{
  "success": true,
  "message": "Task details retrieved",
  "data": {
    "id": 1,
    "project_id": 1,
    "task_number": "TASK-1",
    "title": "Setup Database",
    "description": "Configure PostgreSQL database",
    "deadline": "2026-05-01",
    "status": "in-progress",
    "assigned_to": 5,
    "created_by": 3,
    "created_at": "2026-04-25T10:00:00Z",
    "updated_at": "2026-04-25T11:30:00Z",
    "assigned_user": {
      "id": 5,
      "name": "Jane Smith",
      "email": "jane@example.com"
    },
    "creator": {
      "id": 3,
      "name": "John Doe",
      "email": "john@example.com"
    },
    "projects": {
      "id": 1,
      "name": "Website Redesign"
    }
  }
}
```

**Error (403)**:
```json
{
  "success": false,
  "message": "You do not have permission to view this task"
}
```

---

### 4. Update Task
**PUT** `/api/tasks/:taskId`

**Authentication**: Required (Bearer Token)

**Description**: Update a task. Only the creator or assigned person can update the task.

**Path Parameters**:
- `taskId` (number) - The task ID

**Request Body** (all fields optional):
```json
{
  "title": "string",
  "description": "string",
  "deadline": "ISO 8601 date string",
  "status": "string",
  "assigned_to": "number (user ID)"
}
```

**Response (200)**:
```json
{
  "success": true,
  "message": "Task updated successfully",
  "data": {
    "id": 1,
    "project_id": 1,
    "task_number": "TASK-1",
    "title": "Setup PostgreSQL Database",
    "description": "Configure PostgreSQL database with proper indexes",
    "deadline": "2026-05-10",
    "status": "completed",
    "assigned_to": 5,
    "created_by": 3,
    "created_at": "2026-04-25T10:00:00Z",
    "updated_at": "2026-04-25T14:30:00Z",
    "assigned_user": {
      "id": 5,
      "name": "Jane Smith",
      "email": "jane@example.com"
    },
    "creator": {
      "id": 3,
      "name": "John Doe",
      "email": "john@example.com"
    }
  }
}
```

---

### 5. Delete Task
**DELETE** `/api/tasks/:taskId`

**Authentication**: Required (Bearer Token)

**Description**: Delete a task. Only the task creator can delete it.

**Path Parameters**:
- `taskId` (number) - The task ID

**Response (200)**:
```json
{
  "success": true,
  "message": "Task deleted successfully",
  "data": null
}
```

**Error (403)**:
```json
{
  "success": false,
  "message": "Only the task creator can delete this task"
}
```

---

### 6. Get My Tasks
**GET** `/api/tasks/my-tasks`

**Authentication**: Required (Bearer Token)

**Description**: Get all tasks assigned to or created by the current user across all projects.

**Response (200)**:
```json
{
  "success": true,
  "message": "User tasks retrieved",
  "data": [
    {
      "id": 1,
      "project_id": 1,
      "task_number": "TASK-1",
      "title": "Setup Database",
      "description": "Configure PostgreSQL database",
      "deadline": "2026-05-01",
      "status": "in-progress",
      "assigned_to": 5,
      "created_by": 3,
      "created_at": "2026-04-25T10:00:00Z",
      "updated_at": "2026-04-25T11:30:00Z",
      "assigned_user": {
        "id": 5,
        "name": "Jane Smith",
        "email": "jane@example.com"
      },
      "creator": {
        "id": 3,
        "name": "John Doe",
        "email": "john@example.com"
      },
      "projects": {
        "id": 1,
        "name": "Website Redesign"
      }
    }
  ]
}
```

---

### 7. Get Project Team Members
**GET** `/api/tasks/project/:projectId/team`

**Authentication**: Required (Bearer Token)

**Description**: Get all team members of a project (for assigning tasks).

**Path Parameters**:
- `projectId` (number) - The project ID

**Response (200)**:
```json
{
  "success": true,
  "message": "Project team members retrieved",
  "data": [
    {
      "id": 3,
      "name": "John Doe",
      "email": "john@example.com",
      "job_title": "Frontend Developer"
    },
    {
      "id": 5,
      "name": "Jane Smith",
      "email": "jane@example.com",
      "job_title": "Backend Developer"
    }
  ]
}
```

---

### 8. Get User Projects with Tasks
**GET** `/api/projects/user/projects`

**Authentication**: Required (Bearer Token)

**Description**: Get all projects the user is assigned to, including tasks they created or are assigned to.

**Response (200)**:
```json
{
  "success": true,
  "message": "User projects retrieved",
  "data": [
    {
      "id": 1,
      "name": "Website Redesign",
      "description": "Redesign company website",
      "priority": "high",
      "created_at": "2026-04-20T10:00:00Z",
      "estimate": null,
      "spent_time": null,
      "assigner_name": "Admin User",
      "team_members": [
        {
          "id": 3,
          "name": "John Doe"
        },
        {
          "id": 5,
          "name": "Jane Smith"
        }
      ],
      "tasks": [
        {
          "id": 1,
          "project_id": 1,
          "task_number": "TASK-1",
          "title": "Setup Database",
          "description": "Configure PostgreSQL database",
          "deadline": "2026-05-01",
          "status": "in-progress",
          "assigned_to": 5,
          "created_by": 3,
          "created_at": "2026-04-25T10:00:00Z",
          "updated_at": "2026-04-25T11:30:00Z",
          "assigned_to_name": "Jane Smith",
          "created_by_name": "John Doe"
        }
      ]
    }
  ]
}
```

---

## Status Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request |
| 403 | Forbidden (No Permission) |
| 404 | Not Found |
| 500 | Server Error |

---

## Task Status Values
- `pending` - Task not started
- `in-progress` - Task is being worked on
- `completed` - Task finished
- `on-hold` - Task paused
- `cancelled` - Task cancelled

---

## Error Responses

### Unauthorized Access
```json
{
  "success": false,
  "message": "You do not have permission to access this resource"
}
```

### Not Found
```json
{
  "success": false,
  "message": "Task not found"
}
```

### User Not in Project
```json
{
  "success": false,
  "message": "You are not assigned to this project"
}
```

---

## Usage Examples

### Example 1: Create a Task
```bash
curl -X POST http://localhost:5000/api/tasks/1 \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Implement Login Page",
    "description": "Create login UI with authentication",
    "deadline": "2026-05-10",
    "status": "pending",
    "assigned_to": 5
  }'
```

### Example 2: Update Task Status
```bash
curl -X PUT http://localhost:5000/api/tasks/1 \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "completed"
  }'
```

### Example 3: Get All My Tasks
```bash
curl http://localhost:5000/api/tasks/my-tasks \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Example 4: Get Project Team
```bash
curl http://localhost:5000/api/tasks/project/1/team \
  -H "Authorization: Bearer YOUR_TOKEN"
```
