import { Routes, Route } from "react-router-dom";
import AuthPage from "./pages/Auth/AuthPage";
export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<AuthPage />} />
    </Routes>
  );
}
