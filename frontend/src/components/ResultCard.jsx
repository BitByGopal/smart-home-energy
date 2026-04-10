import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts"

const LABEL_COLORS = { Efficient: "#22c55e", Normal: "#f59e0b", Wasteful: "#ef4444" }

export default function ResultCard({ result, type }) {
  const isWasher = type === "washer"

  const chartData = isWasher ? [
    { name: "Your Usage", value: result.energy_kwh },
    { name: "Efficient", value: 0.8 },
    { name: "Average", value: 1.4 },
  ] : [
    { name: "Your Usage", value: result.energy_kwh_day },
    { name: "Efficient", value: 0.9 },
    { name: "Average", value: 1.5 },
  ]

  const labelColor = LABEL_COLORS[result.usage_label] || "#38bdf8"

  return (
    <div style={{ background: "#1e293b", borderRadius: 16, padding: 28 }}>

      {/* Label badge */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
        <span style={{
          background: labelColor + "22", color: labelColor,
          padding: "6px 16px", borderRadius: 20, fontWeight: 700, fontSize: 14,
          border: `1px solid ${labelColor}44`
        }}>
          {result.usage_label}
        </span>
        <span style={{ color: "#94a3b8", fontSize: 14 }}>{result.appliance}</span>
      </div>

      {/* Stats grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 16, marginBottom: 28 }}>
        {isWasher ? <>
          <StatBox label="Energy Used" value={`${result.energy_kwh} kWh`} />
          <StatBox label="Est. Cost" value={`₹${result.cost_inr}`} />
          <StatBox label="Water Used" value={`${result.water_liters} L`} />
        </> : <>
          <StatBox label="Daily Energy" value={`${result.energy_kwh_day} kWh`} />
          <StatBox label="Monthly Energy" value={`${result.monthly_kwh} kWh`} />
          <StatBox label="Monthly Cost" value={`₹${result.monthly_cost_inr}`} />
        </>}
      </div>

      {/* Chart */}
      <div style={{ marginBottom: 28 }}>
        <p style={{ fontSize: 13, color: "#64748b", marginBottom: 12 }}>Energy comparison (kWh)</p>
        <ResponsiveContainer width="100%" height={160}>
          <BarChart data={chartData} barSize={40}>
            <XAxis dataKey="name" tick={{ fill: "#94a3b8", fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ background: "#0f172a", border: "none", borderRadius: 8, color: "#e2e8f0" }} />
            <Bar dataKey="value" radius={[6, 6, 0, 0]}>
              {chartData.map((_, i) => (
                <Cell key={i} fill={i === 0 ? labelColor : i === 1 ? "#22c55e" : "#475569"} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Tips */}
      <div>
        <p style={{ fontSize: 14, fontWeight: 600, color: "#f1f5f9", marginBottom: 12 }}>💡 Saving Tips</p>
        {result.tips.map((tip, i) => (
          <div key={i} style={{
            background: "#0f172a", borderRadius: 8, padding: "10px 14px",
            marginBottom: 8, fontSize: 14, color: "#cbd5e1", lineHeight: 1.5
          }}>
            {tip}
          </div>
        ))}
      </div>

    </div>
  )
}

function StatBox({ label, value }) {
  return (
    <div style={{ background: "#0f172a", borderRadius: 10, padding: "14px 16px" }}>
      <p style={{ fontSize: 12, color: "#64748b", marginBottom: 4 }}>{label}</p>
      <p style={{ fontSize: 18, fontWeight: 700, color: "#38bdf8" }}>{value}</p>
    </div>
  )
}