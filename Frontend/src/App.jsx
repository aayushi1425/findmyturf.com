import { Routes, Route } from "react-router-dom";
import TurfDetail from "./pages/SingleTurf";
import TurfPage from "./pages/Turfs";
import AuthPage from "./pages/Auth/AuthPage";
import LandingPage from "./pages/LandingPage";
import BookingDetail from "./pages/BookingDetail";
import MyBookings from "./pages/Mybooking";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/turf/:id" element={<TurfDetail />} />
      <Route path="/turfs" element={<TurfPage />} />
      <Route path="/login" element={<AuthPage />} />
      <Route path="/booking/:id" element={<BookingDetail />} />
      <Route path="/my-bookings" element={<MyBookings />} />
    </Routes>
  );
}
