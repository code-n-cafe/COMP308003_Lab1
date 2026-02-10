import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

const LoginPage: React.FC = () => {
  const [studentNumber, setStudentNumber] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const loggedUser = await login(studentNumber, password);
      if (loggedUser?.role === "admin") navigate("/admin");
      else navigate("/student");
    } catch (err: any) {
      setError(err?.message || "Invalid credentials");
    }
  };

  return (
    <div style={{ padding: "2rem", maxWidth: 400, margin: "auto" }}>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "1rem" }}>
          <label>Student Number / Username:</label>
          <input
            type="text"
            value={studentNumber}
            onChange={e => setStudentNumber(e.target.value)}
            required
            style={{ width: "100%" }}
            placeholder="e.g. S123456789 or admin"
          />
        </div>
        <div style={{ marginBottom: "1rem" }}>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            style={{ width: "100%" }}
          />
        </div>
        {error && <div style={{ color: "red", marginBottom: "1rem" }}>{error}</div>}
        <button type="submit" style={{ width: "100%" }}>Login</button>
      </form>
      <div style={{ marginTop: "1rem", textAlign: "center" }}>
        <span>Don't have an account? </span>
        <Link to="/signup">Sign up</Link>
      </div>
    </div>
  );
};

export default LoginPage;