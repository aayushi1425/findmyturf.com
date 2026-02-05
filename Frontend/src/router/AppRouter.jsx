import React from 'react';
import { Navigate, Outlet, Route, Routes, useLocation } from 'react-router-dom';

import Landing from '../pages/public/Landing.jsx';
import Turfs from '../pages/public/Turfs.jsx';
import TurfDetail from '../pages/public/TurfDetail.jsx';
import Login from '../pages/auth/Login.jsx';
import Register from '../pages/auth/Register.jsx';
import MyBookings from '../pages/user/MyBookings.jsx';
import BookingDetail from '../pages/user/BookingDetail.jsx';
import Dashboard from '../pages/owner/Dashboard.jsx';
import MyTurfs from '../pages/owner/MyTurfs.jsx';
import AddTurf from '../pages/owner/AddTurf.jsx';
import EditTurf from '../pages/owner/EditTurf.jsx';
import TurfBookings from '../pages/owner/TurfBookings.jsx';
import MyCourts from '../pages/owner/MyCourts.jsx';
import AddCourt from '../pages/owner/AddCourt.jsx';
import EditCourt from '../pages/owner/EditCourt.jsx';
import Header from '../components/layout/Header.jsx';
import Footer from '../components/layout/Footer.jsx';
import useAuth from '../hooks/useAuth.js';

const ProtectedRoute = ({ roles }) => {
  const { isAuthenticated, role } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }
  if (roles && !roles.includes(role)) {
    return <Navigate to="/" replace />;
  }
  return <Outlet />;
};

const Shell = () => (
  <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900">
    <Header />
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6">
      <Outlet />
    </main>
    <Footer />
  </div>
);

const AppRouter = () => (
  <Routes>
    <Route element={<Shell />}>
      <Route path="/" element={<Landing />} />
      <Route path="/turfs" element={<Turfs />} />
      <Route path="/turfs/:id" element={<TurfDetail />} />

      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route element={<ProtectedRoute roles={['USER', 'OWNER', 'ADMIN']} />}>
        <Route path="/user/bookings" element={<MyBookings />} />
        <Route path="/user/bookings/:id" element={<BookingDetail />} />
      </Route>

      <Route element={<ProtectedRoute roles={['OWNER', 'ADMIN']} />}>
        <Route path="/owner/dashboard" element={<Dashboard />} />
        <Route path="/owner/turfs" element={<MyTurfs />} />
        <Route path="/owner/turfs/add" element={<AddTurf />} />
        <Route path="/owner/turfs/:id/edit" element={<EditTurf />} />
        <Route path="/owner/bookings" element={<TurfBookings />} />
        <Route path="/owner/courts" element={<MyCourts />} />
        <Route path="/owner/courts/add" element={<AddCourt />} />
        <Route path="/owner/courts/:id/edit" element={<EditCourt />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Route>
  </Routes>
);

export default AppRouter;
