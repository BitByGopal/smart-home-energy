import numpy as np
import pandas as pd
from sklearn.linear_model import LinearRegression
from sklearn.tree import DecisionTreeClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error, accuracy_score
import joblib
import os

np.random.seed(42)
N = 1000

# ── WASHING MACHINE DATA ──────────────────────────────
load_kg        = np.random.uniform(1.0, 8.0, N)
temp_celsius   = np.random.choice([30, 40, 60, 90], N)
spin_rpm       = np.random.choice([800, 1000, 1200, 1400], N)
wash_duration  = np.random.uniform(30, 120, N)

washer_energy = (
    0.15 * load_kg +
    0.008 * temp_celsius +
    0.0002 * spin_rpm +
    0.005 * wash_duration +
    np.random.normal(0, 0.05, N)
)
washer_energy = np.clip(washer_energy, 0.3, 3.5)

def label_washer(e):
    if e < 0.9:   return 0  # efficient
    elif e < 1.8: return 1  # normal
    else:         return 2  # wasteful

washer_label = np.array([label_washer(e) for e in washer_energy])

washer_df = pd.DataFrame({
    "load_kg": load_kg,
    "temp_celsius": temp_celsius,
    "spin_rpm": spin_rpm,
    "wash_duration_min": wash_duration,
    "energy_kwh": washer_energy,
    "usage_label": washer_label
})

# ── FRIDGE DATA ───────────────────────────────────────
door_opens      = np.random.randint(5, 40, N).astype(float)
ambient_temp    = np.random.uniform(18, 38, N)
fridge_temp_set = np.random.uniform(2, 8, N)
age_years       = np.random.uniform(0, 15, N)

fridge_energy = (
    0.04 * door_opens +
    0.015 * ambient_temp +
    0.02 * (8 - fridge_temp_set) +
    0.01 * age_years +
    0.5 +
    np.random.normal(0, 0.05, N)
)
fridge_energy = np.clip(fridge_energy, 0.4, 3.0)

def label_fridge(e):
    if e < 1.0:   return 0
    elif e < 1.8: return 1
    else:         return 2

fridge_label = np.array([label_fridge(e) for e in fridge_energy])

fridge_df = pd.DataFrame({
    "door_opens_per_day": door_opens,
    "ambient_temp_c": ambient_temp,
    "fridge_temp_set_c": fridge_temp_set,
    "age_years": age_years,
    "energy_kwh_per_day": fridge_energy,
    "usage_label": fridge_label
})

# ── TRAIN MODELS ──────────────────────────────────────
WASHER_FEATURES = ["load_kg", "temp_celsius", "spin_rpm", "wash_duration_min"]
FRIDGE_FEATURES = ["door_opens_per_day", "ambient_temp_c", "fridge_temp_set_c", "age_years"]

X_w = washer_df[WASHER_FEATURES]
washer_reg = LinearRegression()
washer_reg.fit(X_w, washer_df["energy_kwh"])

washer_cls = DecisionTreeClassifier(max_depth=5, random_state=42)
washer_cls.fit(X_w, washer_df["usage_label"])

X_f = fridge_df[FRIDGE_FEATURES]
fridge_reg = LinearRegression()
fridge_reg.fit(X_f, fridge_df["energy_kwh_per_day"])

fridge_cls = DecisionTreeClassifier(max_depth=5, random_state=42)
fridge_cls.fit(X_f, fridge_df["usage_label"])

# ── SAVE MODELS ───────────────────────────────────────
os.makedirs("models", exist_ok=True)

joblib.dump(washer_reg, "models/washer_regression.pkl")
joblib.dump(washer_cls, "models/washer_classifier.pkl")
joblib.dump(fridge_reg, "models/fridge_regression.pkl")
joblib.dump(fridge_cls, "models/fridge_classifier.pkl")
joblib.dump({
    "washer_features": WASHER_FEATURES,
    "fridge_features": FRIDGE_FEATURES,
    "labels": {0: "Efficient", 1: "Normal", 2: "Wasteful"}
}, "models/metadata.pkl")

print("✅ All models saved to models/")
print("   washer_regression.pkl")
print("   washer_classifier.pkl")
print("   fridge_regression.pkl")
print("   fridge_classifier.pkl")
print("   metadata.pkl")