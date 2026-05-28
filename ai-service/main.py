from fastapi import FastAPI
from pydantic import BaseModel
import random

app = FastAPI(title="Nuraga AI Service")

class HazardInput(BaseModel):
    description: str
    location: str

@app.get("/")
def read_root():
    return {"message": "Nuraga AI Service is running"}

@app.post("/predict-risk")
def predict_risk(hazard: HazardInput):
    # Mock AI Logic: In a real scenario, this would use a trained model
    keywords = {
        "fire": "Extreme",
        "smoke": "High",
        "leak": "High",
        "slippery": "Medium",
        "cable": "High",
        "broken": "Medium"
    }
    
    desc_lower = hazard.description.lower()
    predicted_risk = "Low"
    
    for key, val in keywords.items():
        if key in desc_lower:
            predicted_risk = val
            break
            
    confidence = round(random.uniform(0.7, 0.95), 2)
    
    return {
        "predicted_risk": predicted_risk,
        "confidence": confidence,
        "recommendation": f"Immediate inspection strongly advised for {hazard.location}."
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
