import { BrowserRouter, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/ui/ProtectedRoute";
import Dashboard from "./pages/DashBoard";
import HealthInfo from "./pages/HealthInfo";
import Home from "./pages/Home";
import Login from "./pages/Login";
import MyAppointments from "./pages/MyAppointments";
import Staff from "./pages/Staff";
import BookAppointment from "./pages/student/BookAppointment";

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Home />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/book-appointment"
          element={
            <ProtectedRoute>
              <BookAppointment />
            </ProtectedRoute>
          }
        />
        <Route
          path="/appointments"
          element={
            <ProtectedRoute>
              <MyAppointments />
            </ProtectedRoute>
          }
        />
        <Route
          path="/staff"
          element={
            <ProtectedRoute>
              <Staff />
            </ProtectedRoute>
          }
        />
        <Route
          path="/info"
          element={
            <ProtectedRoute>
              <HealthInfo />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
