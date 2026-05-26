import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import authRoute from "./routes/auth.route.js";
import predictionRoute from "./routes/prediction.route.js";
import historyRoute from "./routes/history.route.js";
import errorHandler from "./middleware/error.middleware.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Enable CORS
app.use(
  cors({
    origin: true,
    credentials: true
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Serve static frontend files
app.use(express.static(path.join(__dirname, "../frontend")));

// Mounting API routes
app.use("/api/auth", authRoute);
app.use("/api/predict", predictionRoute);
app.use("/api/history", historyRoute);

// Fallback for non-API routes to serve the frontend homepage
app.get("*", (req, res, next) => {
  if (req.path.startsWith("/api")) {
    return next();
  }
  res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

// Register error handling middleware
app.use(errorHandler);

export default app;
