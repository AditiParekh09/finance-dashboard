import React from "react";
import { useApp } from "../context/AppContext";

export default function Topbar({ onMenuClick, theme, isDesktop }) {
  const { state, dispatch } = useApp();

  const tabTitles = {
    dashboard:    "Dashboard Overview",
    transactions: "Transactions",
    insights:     "Insights & Analytics",
  };
  const tabSubs = {
    dashboard:    "Your financial summary at a glance",
    transactions: "All your income & expense records",
    insights:     "Patterns & spending analysis",
  };

  return (
    <header style={{
      background: theme.cardBg,
      borderBottom: `1px solid ${theme.border}`,
      padding: "16px 24px",
      display: "flex", alignItems: "center", justifyContent: "space-between",
      flexShrink: 0,          /* never let header shrink */
      transition: "background 0.3s, border-color 0.3s",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
        {/* Hamburger — mobile only */}
        {!isDesktop && (
          <button onClick={onMenuClick} style={{
            background: "none", border: "none", cursor: "pointer",
            color: theme.text, fontSize: "22px", padding: "4px", lineHeight: 1,
          }}>☰</button>
        )}
        <div>
          <h1 style={{ fontSize: "20px", fontWeight: 700, color: theme.text }}>{tabTitles[state.activeTab]}</h1>
          <p style={{ fontSize: "13px", color: theme.sub, marginTop: "2px" }}>{tabSubs[state.activeTab]}</p>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        {/* Dark mode toggle */}
        <button onClick={() => dispatch({ type: "TOGGLE_DARK" })} style={{
          background: state.darkMode ? "#2d3148" : "#f1f5f9",
          border: "none", borderRadius: "10px",
          padding: "8px 14px", cursor: "pointer",
          fontSize: "16px", color: theme.text,
        }}>
          {state.darkMode ? "☀️" : "🌙"}
        </button>

        {/* Role badge */}
        <div style={{
          padding: "6px 14px", borderRadius: "20px", fontSize: "12px", fontWeight: 700,
          background: state.role === "admin" ? "rgba(239,68,68,0.1)" : "rgba(99,102,241,0.1)",
          color: state.role === "admin" ? "#ef4444" : "#6366f1",
          textTransform: "uppercase", letterSpacing: "0.5px",
          whiteSpace: "nowrap",
        }}>
          {state.role === "admin" ? "🔑 Admin" : "👁 Viewer"}
        </div>
      </div>
    </header>
  );
}
