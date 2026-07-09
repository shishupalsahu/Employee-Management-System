import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard'; // <-- 1. Import Admin Dashboard

// Temporary placeholder jab tak hum Employee Dashboard nahi bana lete
const EmployeeDashboardPlaceholder = () => (
  <div className="flex items-center justify-center min-h-screen bg-slate-900 text-white">
    <h1 className="text-3xl font-bold">Employee Dashboard Coming Soon... 🛠️</h1>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Default Route */}
          <Route path="/" element={<Navigate to="/login" />} />
          
          {/* Login Page */}
          <Route path="/login" element={<Login />} />
          
          {/* Admin Dashboard Real Route */}
          <Route path="/admin-dashboard" element={<AdminDashboard />} /> {/* <-- 2. Real Component Linked */}
          
          {/* Employee Dashboard (Placeholder for now) */}
          <Route path="/employee-dashboard" element={<EmployeeDashboardPlaceholder />} />
          
          {/* Catch-all route */}
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;