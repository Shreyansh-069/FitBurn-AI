import express from "express";
import { handleCreatePrediction } from "../controllers/prediction.controller.js";
import protectRoute from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", protectRoute, handleCreatePrediction);

export default router;
