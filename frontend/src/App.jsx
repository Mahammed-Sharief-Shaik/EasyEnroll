import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { Toaster } from 'react-hot-toast';

import Navbar from './components/layout/Navbar';
import DashboardLayout from './components/layout/DashboardLayout';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import StudentDashboard from './pages/StudentDashboard';
import AdminDashboard from './pages/AdminDashboard';
import ProtectedRoute from './components/common/ProtectedRoute';

import CourseDetails from './pages/CourseDetails';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="min-h-screen flex flex-col bg-bg transition-colors duration-300 text-text-main">
            <Routes>
              {/* Public Routes with Top Navbar */}
              <Route path="/" element={<><Navbar /><div className="mt-16"><Home /></div></>} />
              <Route path="/login" element={<><Navbar /><div className="mt-16"><Login /></div></>} />
              <Route path="/register" element={<><Navbar /><div className="mt-16"><Register /></div></>} />
              
              {/* Protected Routes with Sidebar Layout */}
              <Route 
                path="/course/:id" 
                element={
                  <ProtectedRoute>
                    <DashboardLayout>
                      <CourseDetails />
                    </DashboardLayout>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/student/dashboard" 
                element={
                  <ProtectedRoute allowedRoles={['student']}>
                    <DashboardLayout>
                      <StudentDashboard />
                    </DashboardLayout>
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/admin/dashboard" 
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <DashboardLayout>
                      <AdminDashboard />
                    </DashboardLayout>
                  </ProtectedRoute>
                } 
              />
            </Routes>
          </div>
          <Toaster position="top-right" toastOptions={{ 
            style: { background: 'var(--color-surface)', color: 'var(--color-text-main)', border: '1px solid var(--color-border)' } 
          }} />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
