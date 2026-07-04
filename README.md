# Human Resource Management System (HRMS)

A modern **Human Resource Management System (HRMS)** built using the PostgreSQL, Express.js, React.js, Node.js. The application helps organizations efficiently manage employees, attendance, leave requests, payroll, and user profiles through separate Admin and Employee portals.

---

## 🚀 Features

### Authentication

* User Signup
* Secure Login
* JWT Authentication
* Password Encryption using bcrypt
* Role-Based Access (Admin & Employee)

### Admin Module

* Admin Dashboard
* Employee Management
* Attendance Monitoring
* Leave Approval
* Payroll Management
* Profile Management

### Employee Module

* Employee Dashboard
* View & Update Profile
* Mark Attendance
* Apply for Leave
* View Leave Status
* View Payroll Details

---

## 🛠️ Tech Stack

### Frontend

* React.js
* Tailwind CSS
* React Router DOM
* Axios

### Backend

* Node.js
* Express.js

### Database

* PostgreSQL

### Authentication

* JWT (JSON Web Token)
* bcrypt

---

## 📂 Project Structure

```text
HRMS/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── public/
│   └── package.json
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── server.js
│   └── package.json
│
└── README.md
```

---

## ⚙️ Installation

### Clone the Repository

```bash
git clone <repository-url>
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

### Backend Setup

```bash
cd backend
npm install
npm run dev
```

---

## 🗄️ Database Setup

1. Install PostgreSQL.
2. Create a new database.
3. Update the `.env` file with your PostgreSQL credentials.
4. Create the required tables:

   * Users
   * Attendance
   * LeaveRequests
   * Payroll

---

## 🔑 Environment Variables

Create a `.env` file in the backend folder.

```env
PORT=5000

DATABASE_URL=your_postgresql_connection_string

JWT_SECRET=your_secret_key
```

---

## 📌 API Endpoints

### Authentication

* POST `/api/auth/signup`
* POST `/api/auth/login`

### Profile

* GET `/api/profile`
* PUT `/api/profile`

### Attendance

* POST `/api/attendance/check-in`
* POST `/api/attendance/check-out`
* GET `/api/attendance`

### Leave

* POST `/api/leave`
* GET `/api/leave`
* PATCH `/api/leave/:id`

### Payroll

* GET `/api/payroll`

---

## 🎯 Future Enhancements

* Email Notifications
* Salary Slip PDF Generation
* Employee Performance Tracking
* Analytics Dashboard
* Calendar Integration
* File Uploads
* Multi-Department Support

---

## 👥 Team Members

* **Backend & Database:** PostgreSQL, Express.js, Authentication, APIs
* **Frontend & UI:** React.js, Tailwind CSS, API Integration

---

## 📄 License

This project was developed for educational and hackathon purposes.
