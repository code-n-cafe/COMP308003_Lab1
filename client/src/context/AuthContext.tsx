import React, { createContext, useContext, useState } from "react";

interface User {
  id: string;
  email?: string;
  role: "student" | "admin";
  token: string;
  studentNumber?: string;
}

interface SignupPayload {
  email: string;
  password: string;
  confirmPassword: string;
  firstName?: string;
  lastName?: string;
  address?: string;
  city?: string;
  phoneNumber?: string;
  program?: string;
  favoriteTopic?: string;
  strongestSkill?: string;
}

interface AuthContextType {
  user: User | null;
  login: (identifier: string, password: string) => Promise<User>; // identifier = email or studentNumber
  signup: (payload: SignupPayload) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });

  async function login(identifier: string, password: string) {
    if (!identifier || !password) throw new Error("Student number/email and password required");

    const isEmail = identifier.includes("@");
    const payload = identifier === "admin"
      ? { username: identifier, password }
      : isEmail
        ? { email: identifier.toLowerCase().trim(), password }
        : { studentNumber: identifier.trim(), password };

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const text = await res.text();
      let errBody: any = null;
      try { errBody = JSON.parse(text); } catch { errBody = { message: text }; }
      const message = errBody?.error || errBody?.message || text || "Login failed";
      throw new Error(message);
    }

    const data = await res.json();
    const loggedUser: User = data.user
      ? { ...data.user, token: data.token }
      : { id: data.sub || "", token: data.token, role: "student" };

    setUser(loggedUser);
    localStorage.setItem("user", JSON.stringify(loggedUser));

    return loggedUser;
  }

  async function signup(payload: SignupPayload) {
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const text = await res.text();
      let errBody: any = null;
      try { errBody = JSON.parse(text); } catch { errBody = { message: text }; }
      const message = errBody?.error || errBody?.message || text || "Signup failed";
      throw new Error(message);
    }
    const data = await res.json();
    const newUser: User = data.user
      ? { ...data.user, token: data.token }
      : { id: data.sub || "", token: data.token, role: "student" };
    setUser(newUser);
    localStorage.setItem("user", JSON.stringify(newUser));
  }

  function logout() {
    setUser(null);
    localStorage.removeItem("user");
  }

  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext)!;