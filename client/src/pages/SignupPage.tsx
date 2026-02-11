import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

const SignupPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [program, setProgram] = useState("");
  const [favoriteTopic, setFavoriteTopic] = useState("");
  const [strongestSkill, setStrongestSkill] = useState("");
  const [error, setError] = useState("");
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    try {
      await signup({
        email,
        password,
        confirmPassword,
        firstName,
        lastName,
        address,
        city,
        phoneNumber,
        program,
        favoriteTopic,
        strongestSkill,
      });
      navigate("/student");
    } catch (err: any) {
      setError(err?.message || "Signup failed");
    }
  };

  return (
    <div style={{ 
      padding: "2rem", 
      maxWidth: 400, 
      margin: "auto" }}>
      <h1>Sign Up</h1>
      <form onSubmit={handleSubmit} style={{ display: "grid", gap: 10 }}>
        <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
        <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
        <input type="password" placeholder="Confirm Password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required />
        <input placeholder="First Name" value={firstName} onChange={e => setFirstName(e.target.value)} required />
        <input placeholder="Last Name" value={lastName} onChange={e => setLastName(e.target.value)} required />
        <input placeholder="Address" value={address} onChange={e => setAddress(e.target.value)} />
        <input placeholder="City" value={city} onChange={e => setCity(e.target.value)} />
        <input placeholder="Phone Number" value={phoneNumber} onChange={e => setPhoneNumber(e.target.value)} />
        <input placeholder="Program" value={program} onChange={e => setProgram(e.target.value)} />
        <input placeholder="Favorite Topic" value={favoriteTopic} onChange={e => setFavoriteTopic(e.target.value)} />
        <input placeholder="Strongest Skill" value={strongestSkill} onChange={e => setStrongestSkill(e.target.value)} />
        {error && <div style={{ color: "red" }}>{error}</div>}
        <button type="submit">Sign Up</button>
      </form>

      <div style={{ marginTop: "1rem", textAlign: "center" }}>
        <span>Already have an account? </span>
        <Link to="/login">Login here</Link>
      </div>
    </div>
  );
};

export default SignupPage;