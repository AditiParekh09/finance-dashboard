import React from "react";
import { useApp } from "../context/AppContext";

const navItems = [
  { id: "dashboard",    label: "Overview",     icon: "⊞" },
  { id: "transactions", label: "Transactions", icon: "⇄" },
  { id: "insights",     label: "Insights",     icon: "◎" },
];

export default function Sidebar({ open, onClose, theme, isDesktop, sidebarWidth }) {
  const { state, dispatch } = useApp();

  return (
    <>
      {/* Mobile backdrop */}
      {!isDesktop && open && (
        <div
          onClick={onClose}
          style={{
            position: "fixed", inset: 0,
            background: "rgba(0,0,0,0.5)",
            zIndex: 99,
          }}
        />
      )}

      <aside style={{
        /* On desktop: normal in-flow grid cell (no position:fixed needed).
           On mobile: fixed overlay that slides in/out. */
        ...(isDesktop ? {
          position: "relative",
          width: "100%",
          height: "100vh",
        } : {
          position: "fixed",
          top: 0, left: 0, bottom: 0,
          width: `${sidebarWidth}px`,
          transform: open ? "translateX(0)" : "translateX(-100%)",
          transition: "transform 0.3s ease",
          zIndex: 100,
        }),
        background: theme.cardBg,
        borderRight: `1px solid ${theme.border}`,
        display: "flex",
        flexDirection: "column",
        padding: "24px 16px",
        overflowY: "auto",
        transition: "background 0.3s, border-color 0.3s, transform 0.3s ease",
        boxSizing: "border-box",
      }}>

        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "32px", padding: "0 8px" }}>
          <div style={{
            width: 38, height: 38, borderRadius: "10px",
            background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "20px", color: "#fff", fontWeight: 800, flexShrink: 0,
          }}>₹</div>
          <div>
            <div style={{ fontWeight: 700, fontSize: "16px", color: theme.text }}>FinTrack</div>
            <div style={{ fontSize: "11px", color: theme.sub }}>Smart Finance</div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1 }}>
          {navItems.map((item) => {
            const active = state.activeTab === item.id;
            return (
              <button key={item.id}
                onClick={() => {
                  dispatch({ type: "SET_TAB", payload: item.id });
                  if (!isDesktop) onClose();
                }}
                style={{
                  width: "100%", display: "flex", alignItems: "center", gap: "12px",
                  padding: "12px 14px", borderRadius: "10px", border: "none",
                  cursor: "pointer",
                  background: active ? "linear-gradient(135deg,#6366f1,#8b5cf6)" : "transparent",
                  color: active ? "#fff" : theme.sub,
                  fontWeight: active ? 700 : 400,
                  fontSize: "14px", marginBottom: "4px",
                  textAlign: "left", fontFamily: "inherit",
                }}>
                <span style={{ fontSize: "18px", lineHeight: 1 }}>{item.icon}</span>
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Role switcher */}
        <div style={{
          padding: "16px", borderRadius: "12px",
          background: theme.dark ? "#0f1117" : "#f8fafc",
          border: `1px solid ${theme.border}`,
        }}>
          <div style={{ fontSize: "11px", color: theme.sub, marginBottom: "8px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px" }}>
            Active Role
          </div>
          <div style={{ display: "flex", gap: "6px" }}>
            {["viewer", "admin"].map((r) => (
              <button key={r}
                onClick={() => dispatch({ type: "SET_ROLE", payload: r })}
                style={{
                  flex: 1, padding: "8px", borderRadius: "8px", border: "none",
                  cursor: "pointer", fontSize: "12px", fontWeight: 600,
                  background: state.role === r ? (r === "admin" ? "#ef4444" : "#6366f1") : "transparent",
                  color: state.role === r ? "#fff" : theme.sub,
                  fontFamily: "inherit",
                }}>
                {r === "admin" ? "🔑 Admin" : "👁 Viewer"}
              </button>
            ))}
          </div>
          <div style={{ fontSize: "11px", color: theme.sub, marginTop: "8px", lineHeight: "1.5" }}>
            {state.role === "admin" ? "Full access: add, edit, delete" : "Read-only access to all data"}
          </div>
        </div>
      </aside>
    </>
  );
}
