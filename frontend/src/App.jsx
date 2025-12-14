import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Admin from "./pages/Admin";

import PrivateRoute from "./components/PrivateRoute";
import RequireRole from "./components/RequireRole";

import Navbar from "./components/hero/Navbar";
import Hero from "./components/hero/Hero";
import About from "./components/hero/About";

import "./index.css";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Navbar />

        <Routes>
          <Route path="/" element={<Hero />} />
          <Route path="/about" element={<About />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />

          {/* Protected user route */}
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            }
          />

          {/* Admin-only route */}
          <Route
            path="/admin"
            element={
              <PrivateRoute>
                <RequireRole role="admin">
                  <Admin />
                </RequireRole>
              </PrivateRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
