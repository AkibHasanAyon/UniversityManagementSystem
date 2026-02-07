# University Management System - Backend Specification

## 1. Project Overview
This document outlines the backend requirements for the University Management System (UMS). The system is a web-based application designed to manage students, faculty, courses, and academic records.

### Core Users
1.  **Admin**: Full access. Manages users (Student, Faculty), courses, assignments, and views all records.
2.  **Faculty**: Manages their assigned courses, views enrolled students, and submits/updates grades.
3.  **Student**: Views their profile, course enrollments, current grades, and academic history.

## 2. Architecture & Technology
*   **Framework**: Django (Python)
*   **Database**: PostgreSQL / SQLite (for dev)
*   **Authentication**: JWT (Simple JWT) with Django Rest Framework (DRF)

## 3. Django App Structure & Models
The backend will be organized into modular Django apps to ensure separation of concerns and maintainability.

### A. App: `users`
Handles authentication and user profiles.

**Models:**
1.  **`User` (Inherits `AbstractUser`)**
    *   *Purpose*: Custom user model to support role-based authentication.
    *   *Fields*:
        *   `email` (EmailField, unique, acts as USERNAME_FIELD)
        *   `role` (CharChoice: 'admin', 'faculty', 'student')
        *   `is_active`, `is_staff`, `date_joined` (Inherited)

2.  **`Student`**
    *   *Purpose*: Extended profile for students.
    *   *Fields*:
        *   `user` (OneToOneField -> User)
        *   `student_id` (CharField, unique, e.g., 'STU-2024-001')
        *   `department` (ForeignKey -> university.Department)
        *   `date_of_birth` (DateField)
        *   `blood_group` (CharField, optional)
    *   *Methods*:
        *   `current_semester()`: Returns the calculated current semester based on enrollment history.

3.  **`Faculty`**
    *   *Purpose*: Extended profile for faculty members.
    *   *Fields*:
        *   `user` (OneToOneField -> User)
        *   `faculty_id` (CharField, unique, e.g., 'FAC-001')
        *   `department` (ForeignKey -> university.Department)
        *   `designation` (CharField, e.g., 'Professor', 'Lecturer')
        *   `joining_date` (DateField)

### B. App: `university`
Manages structural entities of the university.

**Models:**
1.  **`Department`**
    *   *Fields*: `name`, `code` (unique), `description`.
    *   *OOP*: Encapsulates department-related logic.

2.  **`Semester`**
    *   *Fields*: `name` (e.g., 'Spring 2024'), `start_date`, `end_date`, `is_active` (Boolean).

3.  **`Classroom`**
    *   *Fields*: `room_number`, `building`, `capacity`.

### C. App: `academic`
Handles courses, enrollments, and grading.

**Models:**
1.  **`Course`**
    *   *Fields*:
        *   `code` (CharField, unique, e.g., 'CS101')
        *   `name` (CharField)
        *   `department` (ForeignKey -> university.Department)
        *   `credits` (IntegerField)
        *   `description` (TextField)

2.  **`ClassSchedule`**
    *   *Purpose*: Represents a specific offering of a course in a semester.
    *   *Fields*:
        *   `course` (ForeignKey -> Course)
        *   `semester` (ForeignKey -> university.Semester)
        *   `faculty` (ForeignKey -> users.Faculty)
        *   `classroom` (ForeignKey -> university.Classroom)
        *   `days_of_week` (JSONField/CharField, e.g., "Mon,Wed")
        *   `start_time`, `end_time` (TimeField)
    *   *Meta*: UniqueConstraint(course, semester, faculty).

3.  **`Enrollment`**
    *   *Purpose*: Links a student to a ClassSchedule.
    *   *Fields*:
        *   `student` (ForeignKey -> users.Student)
        *   `schedule` (ForeignKey -> ClassSchedule)
        *   `enrolled_at` (DateTimeField)
        *   `status` (Choice: 'Enrolled', 'Dropped', 'Completed')

4.  **`Grade`**
    *   *Fields*:
        *   `enrollment` (OneToOneField -> Enrollment)
        *   `grade` (CharField, e.g., 'A+', 'B')
        *   `gpa` (DecimalField)
        *   `comments` (TextField)
        *   `graded_by` (ForeignKey -> users.Faculty)

5.  **`Attendance`** (Optional/Future)
    *   *Fields*: `enrollment`, `date`, `status` (Present/Absent).

## 4. Key Workflows (Detailed)

### 4.1. Authentication & Authorization
1.  **Login**: User posts credentials to `/api/auth/login/`. System returns `access` and `refresh` JWTs.
2.  **Token Refresh**: Frontend silently refreshes token via `/api/auth/refresh/` before `access` token expires.
3.  **Role Check**: Backend permissions (`IsAdmin`, `IsFaculty`, `IsStudent`) restrict access to specific endpoints.

### 4.2. Admin System Setup (Prerequisite Flow)
1.  **Create Departments**: Admin sets up "Computer Science", "BBA", etc.
2.  **Create Classrooms**: Admin registers physical rooms (e.g., "Main Bldg - 101").
3.  **Create Semester**: Admin creates "Spring 2024" and marks it `is_active=True`.
4.  **Create Users**: Admin registers Faculty and Students, assigning them to Departments.

### 4.3. Class Scheduling (Admin)
1.  **Create Course**: Admin defines "CS101 - Intro to CS".
2.  **Create Schedule**: Admin offers CS101 in Spring 2024.
    *   Selects **Faculty** (Time conflict check performed).
    *   Selects **Classroom** (Availability check performed).
    *   Sets **Days** ("Mon, Wed") and **Times** ("10:00 - 11:30").

### 4.4. Student Enrollment
1.  **View Offerings**: Student requests `/api/academic/schedule/?semester=current`.
2.  **Enroll**: Student POSTs to `/api/academic/enroll/` with `schedule_id`.
    *   *Backend Check*: Is student already enrolled? Are generic seats available (optional logic)?
3.  **View Status**: enrollment status is `Enrolled`.

### 4.5. Grading Process (Faculty)
1.  **Fetches Students**: Faculty GETs `/api/academic/enrollments/?schedule_id=123`.
2.  **Submits Grade**: Faculty POSTs/PUTs to `/api/academic/grades/`.
    *   Payload: `{ "enrollment_id": 45, "grade": "A", "score": 95, "comments": "Excellent" }`.
3.  **Calculation**: Backend calculates GPA points (e.g., A=4.0) and stores it.

---

## 5. Comprehensive API Endpoints

### Authentication
| Method | Endpoint | Description | Payload |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/login/` | Obtain JWT Pair | `{email, password}` |
| `POST` | `/api/auth/refresh/` | Refresh Access Token | `{refresh}` |

### Users (Management)
| Method | Endpoint | Description | Payload |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/users/users/` | List all users (Admin only) | - |
| `POST` | `/api/users/users/` | Create User (Admin only) | `{email, password, role, ...}` |
| `GET` | `/api/users/students/` | List Students | Filters: `?department=`, `?id=` |
| `POST` | `/api/users/students/` | Create Student Profile | `{user_id, student_id, dept_id, ...}` |
| `GET` | `/api/users/faculty/` | List Faculty | Filters: `?department=` |
| `POST` | `/api/users/faculty/` | Create Faculty Profile | `{user_id, faculty_id, dept_id, ...}` |

### University Structure
| Method | Endpoint | Description | Payload |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/university/departments/` | List Departments | - |
| `POST` | `/api/university/departments/` | Create Department (Admin) | `{name, code}` |
| `GET` | `/api/university/semesters/` | List Semesters | - |
| `POST` | `/api/university/semesters/` | Create Semester (Admin) | `{name, start_date, end_date}` |
| `GET` | `/api/university/classrooms/` | List Classrooms | - |
| `POST` | `/api/university/classrooms/` | Create Classroom (Admin) | `{room_number, building}` |

### Academic & Coursework
| Method | Endpoint | Description | Payload |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/academic/courses/` | List Courses Catalog | Filters: `?dept=` |
| `POST` | `/api/academic/courses/` | Create Course (Admin) | `{name, code, credits, dept_id}` |
| `GET` | `/api/academic/schedules/` | List Active Classes | Filters: `?semester=`, `?faculty=` |
| `POST` | `/api/academic/schedules/` | Assign Course to Semester | `{course_id, semester_id, faculty_id...}` |

### Enrollment & Grading
| Method | Endpoint | Description | Payload |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/academic/enrollments/` | List Enrollments | Filters: `?student=`, `?schedule=` |
| `POST` | `/api/academic/enrollments/` | Enroll Student | `{student_id, schedule_id}` |
| `DELETE`| `/api/academic/enrollments/:id/`| Drop Course | - |
| `GET` | `/api/academic/grades/` | View Grades | Filters: `?student=` |
| `POST` | `/api/academic/grades/` | Submit Grade (Faculty) | `{enrollment_id, grade, score}` |
| `GET` | `/api/academic/attendance/` | View Attendance | Filters: `?enrollment=` |
| `POST` | `/api/academic/attendance/` | Mark Attendance | `{enrollment_id, date, status}` |

## 6. Implementation Roadmap
1.  **Setup**: Initialize Django project, configure Database & REST Framework.
2.  **Users App**: Implement Custom User, Student, Faculty models.
3.  **University App**: Implement Department, Semester.
4.  **Academic App**: Implement Course, ClassSchedule, Enrollment, Grade.
5.  **API**: Create Serializers and ViewSets for all models.
