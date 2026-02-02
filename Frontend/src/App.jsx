import { Routes, Route } from "react-router-dom";
import TurfDetail from "./pages/SingleTurf";
import TurfPage from "./pages/Turfs"

export default function App() {
  return (
    <Routes>
      <Route path="/turf/:id" element={<TurfDetail />} />
      <Route path="/turfs" element={<TurfPage />} />
      <Route path="/login" element={<AuthPage />} />
    </Routes>
  );
}
