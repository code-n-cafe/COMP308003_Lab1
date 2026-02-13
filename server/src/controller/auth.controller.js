import jwt from "jsonwebtoken";
import Student from "../model/Student.js";

export const login = async (req, res) => {
  try {
    const { username, studentNumber, email, password } = req.body;

    // hardcoded admin login
    if (username === "admin" && password === "123456") {
      const token = jwt.sign(
        { sub: "admin", role: "admin" },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );
      return res.json({ success: true, token, user: { id: "admin", role: "admin" } });
    }

    if (!password || (!studentNumber && !email)) {
      return res.status(400).json({ success: false, error: "Provide studentNumber or email and password" });
    }

    const query = studentNumber ? { studentNumber } : { email: email.toLowerCase().trim() };
    const student = await Student.findOne(query).select("+password");
    if (!student) return res.status(401).json({ success: false, error: "Invalid credentials" });

    const ok = await student.comparePassword(password);
    if (!ok) return res.status(401).json({ success: false, error: "Invalid credentials" });

    const token = jwt.sign(
      { sub: student._id.toString(), role: "student", studentNumber: student.studentNumber },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    return res.json({
      success: true,
      token,
      user: { id: student._id.toString(), email: student.email, role: "student", studentNumber: student.studentNumber }
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ success: false, error: "Login failed" });
  }
};

// Signup - create student and return token + basic user info
export const signup = async (req, res) => {
  try {
    const {
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
      strongestSkill
    } = req.body;

    if (!email || !password || !confirmPassword || !firstName || !lastName) {
      return res.status(400).json({ success: false, error: "Email, password, confirmPassword, firstName and lastName required" });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ success: false, error: "Passwords do not match" });
    }

    const exists = await Student.findOne({ email });
    if (exists) return res.status(409).json({ success: false, error: "Email already registered" });

    const studentNumber = `S${Date.now().toString().slice(-9)}`;

    const student = await Student.create({
      studentNumber,
      email,
      password,
      firstName,
      lastName,
      address,
      city,
      phoneNumber,
      program,
      favoriteTopic,
      strongestSkill
    });

    const token = jwt.sign(
      { sub: student._id.toString(), role: "student", studentNumber: student.studentNumber },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    return res.status(201).json({
      success: true,
      token,
      user: { id: student._id.toString(), email: student.email, role: "student", studentNumber: student.studentNumber }
    });
  } catch (err) {
    console.error("Signup error:", err);
    return res.status(500).json({ success: false, error: "Signup failed" });
  }
};