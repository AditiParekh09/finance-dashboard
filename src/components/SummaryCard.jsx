import React from "react";

export default function SummaryCard({ title, value, sub, icon, accent, theme }) {
  return (
    <div style={{
      background: theme.cardBg, border: `1px solid ${theme.border}`,
      borderRadius: "16px", padding: "22px", display: "flex", flexDirection: "column",
      gap: "12px", transition: "transform 0.2s, box-shadow 0.2s",
      boxShadow: theme.dark ? "0 4px 24px rgba(0,0,0,0.3)" : "0 2px 12px rgba(0,0,0,0.06)",
      cursor: "default", position: "relative", overflow: "hidden",
    }}
    onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = theme.dark ? "0 8px 32px rgba(0,0,0,0.5)" : "0 8px 28px rgba(0,0,0,0.12)"; }}
    onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = theme.dark ? "0 4px 24px rgba(0,0,0,0.3)" : "0 2px 12px rgba(0,0,0,0.06)"; }}
    >
      {/* Accent bar */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "3px", background: accent, borderRadius: "16px 16px 0 0" }} />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <span style={{ fontSize: "13px", color: theme.sub, fontWeight: 500 }}>{title}</span>
        <div style={{ width: 38, height: 38, borderRadius: "10px", background: accent + "20", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px" }}>{icon}</div>
      </div>
      <div style={{ fontSize: "26px", fontWeight: 800, color: theme.text, letterSpacing: "-0.5px" }}>{value}</div>
      {sub && <div style={{ fontSize: "12px", color: theme.sub }}>{sub}</div>}
    </div>
  );
}
