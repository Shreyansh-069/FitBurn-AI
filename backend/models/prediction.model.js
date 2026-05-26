import mongoose from "mongoose";

const predictionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    gender: {
      type: Number,
      required: true
    },
    age: {
      type: Number,
      required: true
    },
    height: {
      type: Number,
      required: true
    },
    weight: {
      type: Number,
      required: true
    },
    duration: {
      type: Number,
      required: true
    },
    heartRate: {
      type: Number,
      required: true
    },
    bodyTemp: {
      type: Number,
      required: true
    },
    predictedCalories: {
      type: Number,
      required: true
    }
  },
  {
    timestamps: true
  }
);

const Prediction = mongoose.model("Prediction", predictionSchema);
export default Prediction;
