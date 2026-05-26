import express from "express";
import {
  handleSignup,
  handleLogin,
  handleLogout,
  handleGetMe
} from "../controllers/auth.controller.js";
import protectRoute from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/signup", handleSignup);
router.post("/login", handleLogin);
router.post("/logout", handleLogout);
router.get("/me", protectRoute, handleGetMe);

export default router;
