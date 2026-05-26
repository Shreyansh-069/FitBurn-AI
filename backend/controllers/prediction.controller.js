import axios from "axios";
import Prediction from "../models/prediction.model.js";

export const handleCreatePrediction = async (req, res, next) => {
  try {
    const {
      gender,
      age,
      height,
      weight,
      duration,
      heart_rate,
      body_temp
    } = req.body;

    // Validate inputs
    if (
      gender === undefined ||
      age === undefined ||
      height === undefined ||
      weight === undefined ||
      duration === undefined ||
      heart_rate === undefined ||
      body_temp === undefined
    ) {
      return res.status(400).json({ error: "All prediction inputs are required" });
    }

    // Map inputs to FASTAPI payload format
    const payload = {
      gender: Number(gender),
      age: Number(age),
      height: Number(height),
      weight: Number(weight),
      duration: Number(duration),
      heart_rate: Number(heart_rate),
      body_temp: Number(body_temp)
    };

    const mlServiceUrl = process.env.ML_SERVICE_URL || "http://localhost:8000";

    const response = await axios.post(
      `${mlServiceUrl}/predict`,
      payload
    );

    const predictedCalories = response.data.predicted_calories;

    // Save prediction to MongoDB
    const prediction = await Prediction.create({
      userId: req.user._id,
      gender: payload.gender,
      age: payload.age,
      height: payload.height,
      weight: payload.weight,
      duration: payload.duration,
      heartRate: payload.heart_rate,
      bodyTemp: payload.body_temp,
      predictedCalories
    });

    return res.status(200).json({
      predictedCalories: prediction.predictedCalories
    });
  } catch (error) {
    console.error(`Prediction Controller Error: ${error.message}`);
    const status = error.response?.status || 500;
    const errorMsg = error.response?.data?.detail || error.message || "Error calling prediction service";
    return res.status(status).json({ error: errorMsg });
  }
};
