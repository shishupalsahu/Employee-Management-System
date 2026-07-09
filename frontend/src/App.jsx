import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './pages/Login';

// Temporary placeholder components jab tak hum agle steps me dashboards nahi bana lete
const AdminDashboardPlaceholder = () => (
  <div className="flex items-center justify-center min-h-screen bg-slate-900 text-white">
    <h1 className="text-3xl font-bold">Admin Dashboard Coming Soon... 🛠️</h1>
  </div>
);

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
          {/* Default Route: Redirect to Login */}
          <Route path="/" element={<Navigate to="/login" />} />
          
          {/* Login Page Route */}
          <Route path="/login" element={<Login />} />
          
          {/* Dashboard Routes (Placeholders for now) */}
          <Route path="/admin-dashboard" element={<AdminDashboardPlaceholder />} />
          <Route path="/employee-dashboard" element={<EmployeeDashboardPlaceholder />} />
          
          {/* Catch-all route for 404 pages */}
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;