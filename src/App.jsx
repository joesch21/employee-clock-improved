import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './lib/auth';
import { ToastProvider } from './lib/toast';

import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Roster from './pages/Roster';
import Timesheet from './pages/Timesheet';
import Swaps from './pages/Swaps';
import About from './pages/About';

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/roster" element={<Roster />} />
          <Route path="/timesheet" element={<Timesheet />} />
          <Route path="/swaps" element={<Swaps />} />
          <Route path="/about" element={<About />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </ToastProvider>
    </AuthProvider>
  );
}