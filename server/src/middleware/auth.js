import jwt from "jsonwebtoken";

export function requireAuth(req, res, next) {
  const header = req.headers.authorization; // "Bearer <token>"
  if (!header?.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      error: "Missing Authorization header"
    });
  }

  const token = header.slice("Bearer ".length);

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    // payload already contains sub, role, etc.
    req.user = payload;

    return next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      error: "Invalid or expired token"
    });
  }
}
