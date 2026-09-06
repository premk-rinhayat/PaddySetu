import os
import joblib
import pandas as pd
import numpy as np
import uvicorn
import threading
from datetime import datetime, timedelta
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from xgboost import XGBRegressor

# 1. Model Training
DATASET_FILE = 'crop_procurement_ml_dataset.csv'
df = pd.read_csv(DATASET_FILE)
df['crop_code'] = df['crop_type'].map({'Wheat': 0, 'Paddy': 1, 'Maize': 2}).fillna(0)

X = df[['crop_code', 'quantity_quintal', 'farmers_ahead', 'active_counters', 'is_peak_season', 'day_of_week']]
y = df['total_wait_time_mins']

ai_model = XGBRegressor(n_estimators=100, learning_rate=0.05, max_depth=4, random_state=42)
ai_model.fit(X, y)
print("✅ AI Model successfully trained and ready in memory!")

# 2. FastAPI Setup
app = FastAPI(title="SmartProcure AI Engine")

class ProcurementRequest(BaseModel):
    token_id: str
    crop_type: str
    quantity_quintal: float
    farmers_ahead: int
    active_counters: int = 2
    travel_distance_km: float

@app.post("/api/predict-eta")
def predict_eta(data: ProcurementRequest):
    crop_code = {'Wheat': 0, 'Paddy': 1, 'Maize': 2}.get(data.crop_type, 0)
    input_data = np.array([[crop_code, data.quantity_quintal, data.farmers_ahead, data.active_counters, 1, 1]])
    
    predicted_wait_mins = float(max(1.0, round(ai_model.predict(input_data)[0], 1)))
    travel_mins = int(data.travel_distance_km * 2.4) + 5 if data.travel_distance_km > 0 else 10
    
    now = datetime.now()
    expected_turn = (now + timedelta(minutes=int(predicted_wait_mins))).strftime("%I:%M %p")
    
    lead_time = travel_mins + 10
    departure_offset = max(0, predicted_wait_mins - lead_time)
    departure_time = (now + timedelta(minutes=int(departure_offset))).strftime("%I:%M %p")

    return {
        "token_id": data.token_id,
        "predicted_wait_mins": predicted_wait_mins,
        "expected_turn_time": expected_turn,
        "travel_time_mins": travel_mins,
        "recommended_departure_time": departure_time,
        "status": "Success"
    }

# 3. Background Thread Start (Fixes Jupyter asyncio Error)
def run_server():
    uvicorn.run(app, host="127.0.0.1", port=8001, log_level="info")

# Start server in background thread so Jupyter loop isn't blocked
server_thread = threading.Thread(target=run_server, daemon=True)
server_thread.start()

print("🚀 FastAPI Server background me start ho gaya hai!")
print("👉 Test link open karein: http://127.0.0.1:8000/docs")

import requests

# Correct Endpoint URL (port 8001 + /api/predict-eta)
url = "http://127.0.0.1:8001/api/predict-eta"

data = {
    "token_id": "TKN-101",
    "crop_type": "Wheat",
    "quantity_quintal": 40.0,
    "farmers_ahead": 5,
    "active_counters": 2,
    "travel_distance_km": 12.5
}

response = requests.post(url, json=data)
print(response.json())