import { useState } from "react"
import WasherForm from "./components/WasherForm"
import FridgeForm from "./components/FridgeForm"
import ResultCard from "./components/ResultCard"

export default function App() {
  const [activeTab, setActiveTab] = useState("washer")
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "32px 16px" }}>

      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: 32 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: "#38bdf8" }}>
          ⚡ Smart Home Energy Advisor
        </h1>
        <p style={{ color: "#94a3b8", marginTop: 8 }}>
          ML-powered energy prediction for your home appliances
        </p>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 12, marginBottom: 28 }}>
        {["washer", "fridge"].map(tab => (
          <button key={tab} onClick={() => { setActiveTab(tab); setResult(null) }}
            style={{
              flex: 1, padding: "12px 0", borderRadius: 10, border: "none",
              cursor: "pointer", fontWeight: 600, fontSize: 15, transition: "all 0.2s",
              background: activeTab === tab ? "#38bdf8" : "#1e293b",
              color: activeTab === tab ? "#0f172a" : "#94a3b8"
            }}>
            {tab === "washer" ? "🫧 Washing Machine" : "❄️ Refrigerator"}
          </button>
        ))}
      </div>

      {/* Form */}
      <div style={{ background: "#1e293b", borderRadius: 16, padding: 28, marginBottom: 24 }}>
        {activeTab === "washer"
          ? <WasherForm setResult={setResult} setLoading={setLoading} />
          : <FridgeForm setResult={setResult} setLoading={setLoading} />}
      </div>

      {/* Result */}
      {loading && (
        <div style={{ textAlign: "center", color: "#38bdf8", padding: 24 }}>
          Analyzing... ⚡
        </div>
      )}
      {result && !loading && <ResultCard result={result} type={activeTab} />}

    </div>
  )
}