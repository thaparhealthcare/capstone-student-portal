import { BrowserRouter, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/ui/ProtectedRoute";
import Dashboard from "./pages/DashBoard";
import HealthInfo from "./pages/HealthInfo";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Staff from "./pages/Staff";
import BookAppointment from "./pages/student/BookAppointment";
import StudentAppointments from "./pages/student/StudentAppointments";

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
              <StudentAppointments />
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
