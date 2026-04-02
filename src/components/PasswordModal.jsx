import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { ADMIN_PASSWORD } from "../context/AppContext";

export default function PasswordModal({ theme }) {
  const { state, dispatch } = useApp();
  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  const [showPw, setShowPw] = useState(false);

  if (!state.showPasswordModal) return null;

  const handleSubmit = () => {
    if (input === ADMIN_PASSWORD) {
      setInput("");
      setError("");
      dispatch({ type: "CONFIRM_ADMIN" });
    } else {
      setError("❌ Incorrect password.");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSubmit();
  };

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 300,
      display: "flex", alignItems: "center", justifyContent: "center",
      background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)", padding: "16px",
    }}>
      <div style={{
        background: theme.cardBg, borderRadius: "20px", padding: "32px",
        width: "100%", maxWidth: "400px", border: `1px solid ${theme.border}`,
        boxShadow: "0 24px 64px rgba(0,0,0,0.4)",
      }}>
        {/* Icon */}
        <div style={{ textAlign: "center", marginBottom: "20px" }}>
          <div style={{
            width: 64, height: 64, borderRadius: "18px",
            background: "linear-gradient(135deg,#ef4444,#dc2626)",
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            fontSize: "28px", marginBottom: "14px",
          }}>🔑</div>
          <h2 style={{ margin: 0, fontSize: "20px", fontWeight: 800, color: theme.text }}>Admin Access</h2>
          <p style={{ margin: "6px 0 0", fontSize: "13px", color: theme.sub }}>Enter the admin password to continue</p>
        </div>

        {/* Input */}
        <div style={{ position: "relative", marginBottom: "12px" }}>
          <input
            type={showPw ? "text" : "password"}
            value={input}
            onChange={(e) => { setInput(e.target.value); setError(""); }}
            onKeyDown={handleKeyDown}
            placeholder="Enter password..."
            autoFocus
            style={{
              width: "100%", padding: "12px 48px 12px 16px",
              borderRadius: "12px", border: `2px solid ${error ? "#ef4444" : theme.border}`,
              background: theme.dark ? "#0f1117" : "#f8fafc",
              color: theme.text, fontSize: "15px", outline: "none",
              boxSizing: "border-box", transition: "border-color 0.2s",
            }}
          />
          <button
            onClick={() => setShowPw(!showPw)}
            style={{
              position: "absolute", right: "14px", top: "50%", transform: "translateY(-50%)",
              background: "none", border: "none", cursor: "pointer", fontSize: "16px", color: theme.sub,
            }}>
            {showPw ? "🙈" : "👁"}
          </button>
        </div>

        {/* Error */}
        {error && (
          <div style={{ fontSize: "13px", color: "#ef4444", marginBottom: "12px", padding: "8px 12px", background: "rgba(239,68,68,0.1)", borderRadius: "8px" }}>
            {error}
          </div>
        )}

        {/* Hint */}
        <div style={{ fontSize: "12px", color: theme.sub, marginBottom: "20px", padding: "8px 12px", background: theme.dark ? "#0f1117" : "#f8fafc", borderRadius: "8px" }}></div>

        {/* Buttons */}
        <div style={{ display: "flex", gap: "12px" }}>
          <button
            onClick={() => { dispatch({ type: "CLOSE_PASSWORD_MODAL" }); setInput(""); setError(""); }}
            style={{
              flex: 1, padding: "12px", borderRadius: "12px",
              border: `1px solid ${theme.border}`, background: "transparent",
              color: theme.sub, cursor: "pointer", fontSize: "14px", fontWeight: 600,
            }}>Cancel</button>
          <button
            onClick={handleSubmit}
            style={{
              flex: 1, padding: "12px", borderRadius: "12px", border: "none",
              background: "linear-gradient(135deg,#ef4444,#dc2626)",
              color: "#fff", cursor: "pointer", fontSize: "14px", fontWeight: 700,
            }}>Unlock Admin</button>
        </div>
      </div>
    </div>
  );
}
