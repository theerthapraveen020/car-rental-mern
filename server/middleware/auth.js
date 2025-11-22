import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const Protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ success: false, message: "Not authorized, no token" });
    }

    const token = authHeader.split(" ")[1]; 
    const decoded = jwt.verify(token, process.env.JWT_SECRET); 

    if (!decoded || !decoded.id) {
      return res.status(401).json({ success: false, message: "Invalid token" });
    }

    req.user = await User.findById(decoded.id).select("-password");

    if (!req.user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    next();
  } catch (error) {
    console.error("Auth error:", error.message);
    res.status(401).json({ success: false, message: "Not authorized" });
  }
};

 