import jwt from "jsonwebtoken";

export default function authAdmin(req, res, next) {

  const token = req.headers.authorization;

  if (!token) return res.status(401).json({ msg: "No token" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== "admin")
      return res.status(403).json({ msg: "Admins only" });

    next();

  } catch {
    res.status(401).json({ msg: "Invalid token" });
  }
}