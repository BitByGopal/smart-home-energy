# ⚡ Smart Home Energy Advisor

ML-powered energy prediction for home appliances using React + FastAPI + Scikit-learn.

🔴 Live Demo: https://smart-home-energy-8b8to0e8r-golla-gopals-projects.vercel.app/
🔗 API Docs: https://smart-home-energy-rnim.onrender.com/

## Features
- Predicts energy consumption for Washing Machine & Refrigerator
- ML models: Linear Regression + Decision Tree Classifier
- Personalized saving tips based on usage pattern
- Energy comparison chart (Your Usage vs Efficient vs Average)
- Cost estimation in ₹ (Indian electricity rates)

## Tech Stack
| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, Recharts |
| Backend | FastAPI, Python |
| ML | Scikit-learn, Pandas, NumPy |
| Deployment | Vercel (frontend), Render (backend) |

## Run Locally
```bash
# Backend
cd backend
pip install -r requirements.txt
python model/train.py
uvicorn main:app --reload

# Frontend
cd frontend
npm install
npm run dev
```

## ML Models
- **Regression**: Predicts exact energy (kWh) — MAE ~0.04 kWh
- **Classifier**: Labels usage as Efficient / Normal / Wasteful
