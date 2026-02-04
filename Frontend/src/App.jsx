import { Routes, Route } from "react-router-dom";
import TurfDetail from "./pages/SingleTurf";
import TurfPage from "./pages/Turfs";
import Login from "./pages/auth/login";
import Register from "./pages/auth/register";
import LandingPage from "./pages/LandingPage";
import { ToastContainer } from 'react-toastify';
import BookingDetail from "./pages/BookingDetail";
import MyBookings from "./pages/Mybooking";
import AddCourt from "./pages/owner/AddCourt";
import MyCourts from "./pages/owner/MyCourts";
import MyTurfs from "./pages/owner/MyTurfs";
import EditCourt from "./pages/owner/EditCourt";
import AddTurf from "./pages/owner/AddTurf";
import EditTurf from "./pages/owner/EditTurf";
import OwnerTurfBookings from "./pages/owner/OwnerTurfBookings";
import Header from "./components/Header";

export default function App() {
    return (
        <div>
            <Header />
            <ToastContainer />
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                <Route path="/" element={<LandingPage />} />
                <Route path="turfs" element={<TurfPage />} />
                <Route path="/turf/:id" element={<TurfDetail />} />

                <Route path="/booking/:id" element={<BookingDetail />} />
                <Route path="/my-bookings" element={<MyBookings />} />
                <Route path="/owner/turfs" element={<MyTurfs />} />
                <Route path="/owner">
                    <Route path="turfs" element={<MyTurfs />} />
                    <Route path="add-turf" element={<AddTurf />} />
                    <Route path="turf/:turfId/edit" element={<EditTurf />} />
                    <Route path="turf/:turfId/bookings" element={<OwnerTurfBookings />} />
                    <Route path="turf/:turfId/courts/add" element={<AddCourt />} />
                    <Route path="turf/:turfId/courts" element={<MyCourts />} />
                    <Route path="court/:courtId/edit" element={<EditCourt />} />
                </Route>
            </Routes>
        </div>
    )

}