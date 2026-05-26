import express from "express";
import { handleGetHistory, handleDeleteHistory } from "../controllers/history.controller.js";
import protectRoute from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", protectRoute, handleGetHistory);
router.delete("/:id", protectRoute, handleDeleteHistory);

export default router;
