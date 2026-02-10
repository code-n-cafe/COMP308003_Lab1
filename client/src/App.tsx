import React, { type JSX } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Header from "./components/header";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import StudentDashboard from "./pages/StudentDashboard";
import AdminDashboard from "./pages/AdminDashboard";

function PrivateRoute({ element }: { element: JSX.Element }) {
  const { user } = useAuth();
  return user ? element : <Navigate to="/login" />;
}

function AdminRoute({ element }: { element: JSX.Element }) {
  const { user } = useAuth();
  return user?.role === "admin" ? element : <Navigate to="/student" />;
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/student" element={<PrivateRoute element={<StudentDashboard />} />} />
          <Route path="/admin" element={<AdminRoute element={<AdminDashboard />} />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;