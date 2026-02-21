# React Frontend Conversion

This project is a ReactJS implementation of the University Management System.

## Project Structure

```
react-frontend/
├── src/
│   ├── assets/            # Static assets (images, logos)
│   ├── components/        # Reusable UI components
│   │   ├── admin/         # Admin-specific components (e.g., ManageStudents)
│   │   ├── AdminDashboard.jsx
│   │   ├── FacultyDashboard.jsx
│   │   └── LoginPage.jsx
│   ├── styles/            # CSS files (Simple & Clean)
│   │   ├── Dashboard.css
│   │   ├── LoginPage.css
│   │   └── ManageStudents.css
│   ├── App.jsx            # Main Application Logic (Routing/Auth State)
│   ├── index.css          # Global Styles & Color Variables
│   └── main.jsx           # Entry Point
└── package.json           # Dependencies
```

## How to Run Locally

1. Open a terminal in the `react-frontend` folder:
   ```bash
   cd react-frontend
   ```

2. Install dependencies (if you haven't already):
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser at the URL shown (usually `http://localhost:5173`).

