from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
import joblib
import pandas as pd
import os

app = FastAPI(title="Smart Home Energy API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

BASE = os.path.join(os.path.dirname(__file__), "model", "models")

washer_reg = joblib.load(f"{BASE}/washer_regression.pkl")
washer_cls = joblib.load(f"{BASE}/washer_classifier.pkl")
fridge_reg = joblib.load(f"{BASE}/fridge_regression.pkl")
fridge_cls = joblib.load(f"{BASE}/fridge_classifier.pkl")
metadata   = joblib.load(f"{BASE}/metadata.pkl")

LABELS = metadata["labels"]

class WasherInput(BaseModel):
    load_kg:           float = Field(..., ge=0.5, le=10.0)
    temp_celsius:      float = Field(..., ge=20,  le=95)
    spin_rpm:          float = Field(..., ge=600, le=1600)
    wash_duration_min: float = Field(..., ge=15,  le=150)

class FridgeInput(BaseModel):
    door_opens_per_day: float = Field(..., ge=1,  le=60)
    ambient_temp_c:     float = Field(..., ge=10, le=45)
    fridge_temp_set_c:  float = Field(..., ge=1,  le=10)
    age_years:          float = Field(..., ge=0,  le=20)

def washer_tips(data: WasherInput, label: int):
    tips = []
    if data.temp_celsius >= 60:
        tips.append("💧 Lower wash temp to 30–40°C — saves up to 60% energy.")
    if data.load_kg < 3.0:
        tips.append("👕 Wait for a full load — small loads waste water & electricity.")
    if data.spin_rpm >= 1400:
        tips.append("🔄 Lower spin speed to 1000–1200 RPM for most fabrics.")
    if data.wash_duration_min > 90:
        tips.append("⏱ Use a shorter eco cycle for lightly soiled clothes.")
    if label == 2:
        tips.append("⚡ Your settings are wasteful — try eco mode.")
    if not tips:
        tips.append("✅ Great! Your washing machine usage is already efficient.")
    return tips

def fridge_tips(data: FridgeInput, label: int):
    tips = []
    if data.door_opens_per_day > 20:
        tips.append("🚪 Reduce door openings — plan before you open.")
    if data.ambient_temp_c > 30:
        tips.append("🌡 Keep fridge away from heat sources like ovens.")
    if data.fridge_temp_set_c < 3:
        tips.append("❄️ Set fridge to 3–5°C — colder than needed wastes energy.")
    if data.age_years > 10:
        tips.append("🔋 Old fridges use 40% more energy — consider upgrading.")
    if label == 2:
        tips.append("⚡ Your fridge is consuming too much — check door seals.")
    if not tips:
        tips.append("✅ Your fridge usage looks efficient. Keep it up!")
    return tips

@app.get("/")
def root():
    return {"message": "Smart Home Energy API is running 🚀"}

@app.post("/predict/washer")
def predict_washer(data: WasherInput):
    features = pd.DataFrame([{
        "load_kg":           data.load_kg,
        "temp_celsius":      data.temp_celsius,
        "spin_rpm":          data.spin_rpm,
        "wash_duration_min": data.wash_duration_min
    }])
    energy_kwh = round(float(washer_reg.predict(features)[0]), 3)
    label_id   = int(washer_cls.predict(features)[0])

    return {
        "appliance":    "Washing Machine",
        "energy_kwh":   energy_kwh,
        "usage_label":  LABELS[label_id],
        "label_id":     label_id,
        "cost_inr":     round(energy_kwh * 8, 2),
        "water_liters": round(data.load_kg * 13, 1),
        "tips":         washer_tips(data, label_id)
    }

@app.post("/predict/fridge")
def predict_fridge(data: FridgeInput):
    features = pd.DataFrame([{
        "door_opens_per_day": data.door_opens_per_day,
        "ambient_temp_c":     data.ambient_temp_c,
        "fridge_temp_set_c":  data.fridge_temp_set_c,
        "age_years":          data.age_years
    }])
    energy_kwh = round(float(fridge_reg.predict(features)[0]), 3)
    label_id   = int(fridge_cls.predict(features)[0])

    return {
        "appliance":        "Refrigerator",
        "energy_kwh_day":   energy_kwh,
        "monthly_kwh":      round(energy_kwh * 30, 2),
        "usage_label":      LABELS[label_id],
        "label_id":         label_id,
        "monthly_cost_inr": round(energy_kwh * 8 * 30, 2),
        "tips":             fridge_tips(data, label_id)
    }

@app.get("/health")
def health():
    return {"status": "ok", "models_loaded": True}