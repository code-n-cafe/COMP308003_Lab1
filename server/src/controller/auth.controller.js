import jwt from "jsonwebtoken";
import Student from "../model/Student.js";

export const login = async (req, res) => {
  const { username, studentNumber, password } = req.body;

  // Guardrails: make config issues obvious
  if (!process.env.JWT_SECRET) {
    return res.status(500).json({
      success: false,
      error: "JWT_SECRET is not configured on the server"
    });
  }

  // hardcoded admin login
  if (username === "admin" && password === "123456") {
    const token = jwt.sign(
      { sub: "admin", role: "admin" },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    return res.json({ success: true, token, user: { id: "admin", role: "admin" } });
  }

  // Student login
  const student = await Student.findOne({ studentNumber }).select("+password");
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
    user: { id: student._id.toString(), role: "student", studentNumber: student.studentNumber }
  });
};