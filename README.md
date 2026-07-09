# 🚀 Employee Management System (EMS) - Enterprise Suite

An advanced, full-stack enterprise-grade application designed to optimize corporate workspace operations, manage human resource registries, streamline task distribution pipelines, and process compensation matrices effortlessly. Powered by the robust MERN ecosystem.

---

## ✨ Premium Core Features

### 🔐 1. Gateway Security & Session Architecture
* **Role-Based Routing Matrix:** Strict client-side route protection restricting cross-portal breaches.
* **JWT Access Pipelines:** Secured state preservation through JSON Web Tokens stored locally with custom authorization middlewares.

### 📋 2. Automated Task Distribution Desk
* **Admin Control Panel:** Deploy corporate targets directly to dynamic rosters, specifying clear deadline targets and core priority flags.
* **Employee Workspace:** Reactive boards for employees to visualize pending targets and status updates seamlessly.

### ⏳ 3. Leaves & Time-off Management Engine
* **Contextual Application Forms:** Employees can request sick or casual leave with reasons and custom date ranges.
* **One-Click Authorization:** Real-time update streams for admins to accept or deny leave rows instantly.

### 🔔 4. Live Notification & Activity Feed
* **Context Triggers:** Instant server-generated notifications whenever a task is assigned, leave is requested, or application status updates.
* **Unread State Tracker:** Dynamic top-header glowing badge component keeping workflows updated.

### 💸 5. Financial Compensation & Payroll Desk
* **Custom Structure Grid:** Interactive admin modal calculates house rent allowance (HRA), other bonuses, and statutory tax deductions.
* **Corporate Invoice Viewer:** Immersive printable payslip module for employees with native browser window printing integration.

---

## 🛠️ Technology Stack Built Upon

* **Frontend Architecture:** React.js, Tailwind CSS, Lucide Icons, React Router DOM (v6)
* **Backend Pipeline:** Node.js, Express.js, JSON Web Tokens (JWT), BCrypt.js
* **Database Ledger:** MongoDB, Mongoose ODM

---

## 🏗️ Project Architecture Layout

```text
Employee-Management-System/
├── backend/
│   ├── config/             # Database connection setup
│   ├── controllers/        # Logical controllers (Tasks, Leaves, Salary)
│   ├── middleware/         # Security & Role guards
│   ├── models/             # Mongoose Data Schemas (User, Task, Leave, Notification, Salary)
│   ├── routes/             # Secured Endpoint routing 
│   └── server.js           # Server application initialization
└── frontend/
    ├── src/
    │   ├── components/     # Reusable components (Sidebar, NotificationBell)
    │   ├── context/        # Global Auth State Management
    │   ├── pages/          # Full Page Ecosystems (Login, Admin, Employee)
    │   └── App.jsx         # Root layout context wrappers


 ## 🚀 Local Installation & Configuration
 ### 1. Repository Setup

git clone [https://github.com/shishupalsahu/Employee-Management-System](https://github.com/shishupalsahu/Employee-Management-System)
cd Employee-Management-System

### 2. Backend Initialization
Navigate into the backend repository layer, install standard modules, and establish your .env environmental workspace.

`Bash`
cd backend
npm install

### Create a .env file inside the backend directory:

PORT=5000
MONGO_URI=mongodb://localhost:27015/ems_database
JWT_SECRET=your_super_complex_jwt_secret_key_here

### Fire up the backend live server environment:
`Bash`
npm run dev

### 3. Frontend Initialization
Launch a new terminal instance to execute the client UI ecosystem:

`Bash`
cd frontend
npm install
npm run dev


