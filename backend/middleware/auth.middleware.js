import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

const protectRoute = async (req, res, next) => {
  try {
    const token =
      req.cookies.UID ||
      req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        error: "Unauthorized: No token provided"
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({
        error: "Unauthorized: User not found"
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error(`authMiddleware Error: ${error.message}`);
    return res.status(401).json({
      error: "Unauthorized: Invalid token"
    });
  }
};

export default protectRoute;
