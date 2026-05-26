import os
import pickle
import numpy as np
import xgboost
import sklearn
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

app = FastAPI(title="Calorie Prediction Service")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Model path
MODEL_PATH = os.path.join(os.path.dirname(__file__), "Trained_model.sav")
model = None

@app.on_event("startup")
def load_model():
    global model
    try:
        with open(MODEL_PATH, "rb") as f:
            model = pickle.load(f)
        print("Model loaded successfully.")
    except Exception as e:
        print(f"Error loading model: {e}")

class PredictionRequest(BaseModel):
    gender: int = Field(..., description="Gender encoding: male = 0, female = 1")
    age: float
    height: float
    weight: float
    duration: float
    heart_rate: float
    body_temp: float

class PredictionResponse(BaseModel):
    predicted_calories: float

@app.post("/predict", response_model=PredictionResponse)
def predict(data: PredictionRequest):
    global model
    if model is None:
        raise HTTPException(status_code=503, detail="Model not loaded on startup")
    
    try:
        # Features in EXACT order expected by model:
        # Gender, Age, Height, Weight, Duration, Heart_Rate, Body_Temp
        features = [
            data.gender,
            data.age,
            data.height,
            data.weight,
            data.duration,
            data.heart_rate,
            data.body_temp
        ]
        
        # Convert to numpy array and reshape
        features_arr = np.array(features).reshape(1, -1)
        
        # Predict using model
        prediction = model.predict(features_arr)
        
        # Get float prediction value
        predicted_val = float(prediction[0])
        
        # Round prediction to 2 decimals
        predicted_val = round(predicted_val, 2)
        
        return PredictionResponse(predicted_calories=predicted_val)
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")

@app.get("/health")
def health():
    return {"status": "healthy", "model_loaded": model is not None}
