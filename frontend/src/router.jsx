import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Matches from "./pages/Matches";
import Room from "./pages/Room";
import Todo from "./pages/Todo";
import Profile from "./pages/Profile";
import ProtectedRoute from "./components/ProtectedRoute";

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/matches" element={<ProtectedRoute><Matches /></ProtectedRoute>} />
      <Route path="/room" element={<ProtectedRoute><Room /></ProtectedRoute>} />
      <Route path="/todo" element={<ProtectedRoute><Todo /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
    </Routes>
  );
}
