from fastapi import FastAPI
from pydantic import BaseModel
from typing import Optional

from ai_logic import predict_risk, predict_fatigue
from nlp_model import predict_text

app = FastAPI(title="Nuraga AI Service")

class HazardInput(BaseModel):
    description: str
    location: Optional[str] = ""

class PredictionRequest(BaseModel):
    text: str

class FatigueInput(BaseModel):
    sleep_hours: float
    stress_level: float

@app.get("/")
def read_root():
    return {"message": "Nuraga AI Service is running"}

@app.post("/predict-risk")
def predict_risk_endpoint(hazard: HazardInput):
    return predict_risk(hazard.description, hazard.location)

@app.post("/predict-text")
def predict_text_endpoint(payload: PredictionRequest):
    return predict_text(payload.text)

@app.post("/predict-fatigue")
def predict_fatigue_endpoint(payload: FatigueInput):
    return predict_fatigue(payload.sleep_hours, payload.stress_level)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
