import { useState } from "react"
import axios from "axios"

const API = "https://smart-home-energy-rnim.onrender.com"

const Field = ({ label, unit, value, onChange, min, max, step = 1 }) => (
  <div style={{ marginBottom: 20 }}>
    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
      <label style={{ fontSize: 14, color: "#cbd5e1" }}>{label}</label>
      <span style={{ fontSize: 14, color: "#38bdf8", fontWeight: 600 }}>{value} {unit}</span>
    </div>
    <input type="range" min={min} max={max} step={step} value={value}
      onChange={e => onChange(Number(e.target.value))}
      style={{ width: "100%", accentColor: "#38bdf8", cursor: "pointer" }} />
    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#475569", marginTop: 2 }}>
      <span>{min} {unit}</span><span>{max} {unit}</span>
    </div>
  </div>
)

export default function FridgeForm({ setResult, setLoading }) {
  const [form, setForm] = useState({
    door_opens_per_day: 15, ambient_temp_c: 28, fridge_temp_set_c: 4, age_years: 3
  })

  const set = (key) => (val) => setForm(f => ({ ...f, [key]: val }))

  const handleSubmit = async () => {
    setLoading(true)
    setResult(null)
    try {
      const { data } = await axios.post(`${API}/predict/fridge`, form)
      setResult(data)
    } catch {
      alert("API error — make sure FastAPI is running!")
    }
    setLoading(false)
  }

  return (
    <div>
      <h2 style={{ marginBottom: 24, color: "#f1f5f9", fontSize: 18 }}>❄️ Refrigerator Settings</h2>
      <Field label="Door Opens Per Day" unit="times" value={form.door_opens_per_day} onChange={set("door_opens_per_day")} min={1} max={60} />
      <Field label="Room Temperature" unit="°C" value={form.ambient_temp_c} onChange={set("ambient_temp_c")} min={10} max={45} />
      <Field label="Fridge Set Temperature" unit="°C" value={form.fridge_temp_set_c} onChange={set("fridge_temp_set_c")} min={1} max={10} />
      <Field label="Fridge Age" unit="yrs" value={form.age_years} onChange={set("age_years")} min={0} max={20} />
      <button onClick={handleSubmit} style={{
        width: "100%", padding: "14px 0", marginTop: 8,
        background: "#38bdf8", color: "#0f172a", border: "none",
        borderRadius: 10, fontWeight: 700, fontSize: 16, cursor: "pointer"
      }}>
        ⚡ Predict Energy Usage
      </button>
    </div>
  )
}