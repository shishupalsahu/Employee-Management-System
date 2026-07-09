import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import EmployeeDashboard from './pages/EmployeeDashboard';

// 1. Guard Component to protect pages based on authentication and roles
const ProtectedRoute = ({ children, allowedRole }) => {
    const { user, loading } = useContext(AuthContext);

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400 font-medium">
                Loading session environment...
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRole && user.role !== allowedRole) {
        return <Navigate to={user.role === 'admin' ? '/admin-dashboard' : '/employee-dashboard'} replace />;
    }

    return children;
};

// 2. Separate Routing Component jahan AuthContext perfectly accessible ho
const AppRoutes = () => {
    const { user } = useContext(AuthContext);

    return (
        <Router>
            <Routes>
                {/* Auth Gateway */}
                <Route 
                    path="/login" 
                    element={!user ? <Login /> : <Navigate to={user.role === 'admin' ? '/admin-dashboard' : '/employee-dashboard'} replace />} 
                />

                {/* Admin Ecosystem */}
                <Route 
                    path="/admin-dashboard" 
                    element={
                        <ProtectedRoute allowedRole="admin">
                            <AdminDashboard />
                        </ProtectedRoute>
                    } 
                />

                {/* Employee Ecosystem */}
                <Route 
                    path="/employee-dashboard" 
                    element={
                        <ProtectedRoute allowedRole="employee">
                            <EmployeeDashboard />
                        </ProtectedRoute>
                    } 
                />

                {/* Catch-all Fallback Route */}
                <Route 
                    path="*" 
                    element={<Navigate to="/login" replace />} 
                />
            </Routes>
        </Router>
    );
};

// 3. Main App export jo Provider ko top par rakhta hai aur error prevent karta hai
function App() {
    return (
        <AuthProvider>
            <AppRoutes />
        </AuthProvider>
    );
}

export default App;