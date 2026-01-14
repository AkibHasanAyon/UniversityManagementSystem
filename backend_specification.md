# University Management System - Backend Specification

## 1. Project Overview
This document outlines the backend requirements for the University Management System (UMS). The system is a web-based application designed to manage students, faculty, courses, and academic records.

### Core Users
1.  **Admin**: Full access. Manages users (Student, Faculty), courses, assignments, and views all records.
2.  **Faculty**: Manages their assigned courses, views enrolled students, and submits/updates grades.
3.  **Student**: Views their profile, course enrollments, current grades, and academic history.

## 2. Architecture & Technology Recommendations
*   **Server**: Node.js (Express) or Python (Django/FastAPI).
*   **Database**: Relational Database (PostgreSQL or MySQL) recommended due to the structured nature of academic data (Users, Courses, Grades, Relationships).
*   **Authentication**: JWT (JSON Web Tokens) for stateless, secure API authentication.

## 3. Database Schema Design (Proposed)

### A. Users & Auth
**Table: `users`**
*   `id` (PK, UUID/Integer)
*   `email` (Unique, String)
*   `password_hash` (String)
*   `role` (Enum: 'admin', 'faculty', 'student')
*   `is_active` (Boolean)
*   `created_at`, `updated_at`

### B. Profiles
**Table: `students`**
*   `id` (PK)
*   `user_id` (FK -> users.id)
*   `internal_id` (String, e.g., 'STU001')
*   `name` (String)
*   `major` (String)
*   `year` (Enum: '1st', '2nd', '3rd', '4th')
*   `gpa` (Decimal, calculated/cached)

**Table: `faculty`**
*   `id` (PK)
*   `user_id` (FK -> users.id)
*   `internal_id` (String, e.g., 'FAC001')
*   `name` (String)
*   `department` (String)
*   `specialization` (String)
*   `join_date` (Date)

### C. Academics
**Table: `courses`**
*   `id` (PK)
*   `code` (String, e.g., 'CS301')
*   `name` (String)
*   `department` (String)
*   `credits` (Integer)
*   `semester` (String)
*   `description` (Text)
*   `schedule_time` (String)
*   `location` (String)

**Table: `faculty_assignments`** (Linking Faculty to Courses)
*   `id` (PK)
*   `faculty_id` (FK -> faculty.id)
*   `course_id` (FK -> courses.id)
*   `semester` (String)

**Table: `enrollments`** (Linking Students to Courses)
*   `id` (PK)
*   `student_id` (FK -> students.id)
*   `course_id` (FK -> courses.id)
*   `semester` (String)
*   `status` (Enum: 'Active', 'Completed', 'Dropped')

**Table: `grades`**
*   `id` (PK)
*   `enrollment_id` (FK -> enrollments.id)
*   `grade` (String, e.g., 'A', 'B+')
*   `score` (Decimal, optional)

## 4. Workflows

### 4.1. Onboarding (Admin)
1.  **Admin** creates a new Student/Faculty via the "Manage" pages.
2.  **Input**: Name, Email, Dept/Major, *Temporary Password*.
3.  **Backend Action**: 
    *   Create `User` entry with `email` and hashed `tempPassword`.
    *   Create Profile (`Reference` to `User`).
4.  **Result**: User can log in with the temporary password.

### 4.2. Forgot Password
1.  **User** clicks "Forgot Password" on Login page.
2.  **Input**: Email.
3.  **Backend Action**:
    *   Verify email exists.
    *   Generate a reset token (JWT or Random String).
    *   Send email with reset link (simulated for now, real email service needed like SendGrid/Nodemailer).

### 4.3. Course Management
1.  **Admin** creates a Course.
2.  **Admin** assigns Faculty to the Course (`POST /api/assignments`).
3.  **Admin** enrolls Students (implied via admin dashboards, currently needs API support).

### 4.4. Grading
1.  **Faculty** views "My Assigned Courses".
2.  **Faculty** selects a course -> "View Students".
3.  **Backend**: Fetches `enrollments` for that `course_id`.
4.  **Faculty** submits/updates grade.
5.  **Backend**: Updates `grades` table.

## 5. API Endpoints

### Authentication
*   `POST /api/auth/login` - Returns JWT token + User Info (Role, Name).
*   `POST /api/auth/forgot-password` - Initiates password reset.
*   `POST /api/auth/reset-password` - Consumes token and sets new password.

### Admin
*   `GET /api/admin/stats` - Dashboard overview stats (total users, courses).
*   `GET /api/students` - List all students (paginated, searchable).
*   `POST /api/students` - Create new student (Atomic: User + Student Profile).
*   `PUT /api/students/:id` - Update student details.
*   `DELETE /api/students/:id` - Deactivate/Delete student.
*   `GET /api/faculty` - List all faculty.
*   `POST /api/faculty` - Create new faculty.
*   `PUT /api/faculty/:id` - Update faculty.
*   `DELETE /api/faculty/:id` - Remove faculty.
*   `GET /api/courses` - List courses.
*   `POST /api/courses` - Create course.
*   `POST /api/assignments` - Assign faculty to course.
*   `GET /api/records` - Full academic records (all grades).

### Faculty
*   `GET /api/faculty/my-courses` - Courses assigned to logged-in faculty.
*   `GET /api/faculty/courses/:courseId/students` - Students enrolled in a specific course.
*   `POST /api/faculty/grades` - Submit/Update a grade for a student in a course.

### Student
*   `GET /api/student/profile` - My profile info.
*   `GET /api/student/enrollments` - My current courses.
*   `GET /api/student/grades` - My grades for current semester.
*   `GET /api/student/history` - Historical academic record (transcript).

## 6. Frontend Integration Notes
*   **Handling Auth**: Frontend should store JWT in `localStorage` or `HttpOnly Cookie`.
*   **Role-Based Access**: The frontend already handles redirecting to `/admin`, `/faculty`, or `/student` dashboards based on role. Middleware on backend must protect API routes by role (e.g., Student cannot call `POST /api/grades`).
*   **Search/Filter**: Backend should implement query params for search (e.g., `/api/students?search=rahman`) to handle large datasets efficiently.
