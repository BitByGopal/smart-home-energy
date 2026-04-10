import { useState } from "react"
import axios from "axios"

const API = "http://127.0.0.1:8000"

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

export default function WasherForm({ setResult, setLoading }) {
  const [form, setForm] = useState({
    load_kg: 4, temp_celsius: 40, spin_rpm: 1000, wash_duration_min: 60
  })

  const set = (key) => (val) => setForm(f => ({ ...f, [key]: val }))

  const handleSubmit = async () => {
    setLoading(true)
    setResult(null)
    try {
      const { data } = await axios.post(`${API}/predict/washer`, form)
      setResult(data)
    } catch {
      alert("API error — make sure FastAPI is running!")
    }
    setLoading(false)
  }

  return (
    <div>
      <h2 style={{ marginBottom: 24, color: "#f1f5f9", fontSize: 18 }}>🫧 Washing Machine Settings</h2>
      <Field label="Load Size" unit="kg" value={form.load_kg} onChange={set("load_kg")} min={1} max={10} step={0.5} />
      <Field label="Wash Temperature" unit="°C" value={form.temp_celsius} onChange={set("temp_celsius")} min={20} max={95} step={10} />
      <Field label="Spin Speed" unit="RPM" value={form.spin_rpm} onChange={set("spin_rpm")} min={600} max={1600} step={200} />
      <Field label="Wash Duration" unit="min" value={form.wash_duration_min} onChange={set("wash_duration_min")} min={15} max={150} step={5} />
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