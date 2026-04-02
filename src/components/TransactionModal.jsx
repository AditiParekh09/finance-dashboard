import React, { useState, useEffect } from "react";
import { categories } from "../data/mockData";

export default function TransactionModal({ open, onClose, onSave, editData, theme }) {
  const [form, setForm] = useState({ description: "", amount: "", category: "Food", type: "expense", date: new Date().toISOString().split("T")[0] });

  useEffect(() => {
    if (editData) setForm({ ...editData, amount: String(editData.amount) });
    else setForm({ description: "", amount: "", category: "Food", type: "expense", date: new Date().toISOString().split("T")[0] });
  }, [editData, open]);

  if (!open) return null;

  const handleSubmit = () => {
    if (!form.description || !form.amount) return;
    onSave({ ...form, amount: parseFloat(form.amount) });
    onClose();
  };

  const inputStyle = {
    width: "100%", padding: "10px 14px", borderRadius: "10px", border: `1px solid ${theme.border}`,
    background: theme.dark ? "#0f1117" : "#f8fafc", color: theme.text, fontSize: "14px",
    outline: "none", boxSizing: "border-box",
  };

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.5)", padding: "16px" }}>
      <div style={{ background: theme.cardBg, borderRadius: "20px", padding: "28px", width: "100%", maxWidth: "440px", border: `1px solid ${theme.border}` }}>
        <h2 style={{ margin: "0 0 20px", fontSize: "18px", fontWeight: 700, color: theme.text }}>{editData ? "Edit Transaction" : "Add Transaction"}</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          <div>
            <label style={{ fontSize: "12px", color: theme.sub, fontWeight: 600, marginBottom: "6px", display: "block" }}>Description</label>
            <input style={inputStyle} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="e.g. Grocery Store" />
          </div>
          <div>
            <label style={{ fontSize: "12px", color: theme.sub, fontWeight: 600, marginBottom: "6px", display: "block" }}>Amount (₹)</label>
            <input style={inputStyle} type="number" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} placeholder="0.00" min="0" />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
            <div>
              <label style={{ fontSize: "12px", color: theme.sub, fontWeight: 600, marginBottom: "6px", display: "block" }}>Type</label>
              <select style={inputStyle} value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize: "12px", color: theme.sub, fontWeight: 600, marginBottom: "6px", display: "block" }}>Category</label>
              <select style={inputStyle} value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                {categories.filter(c => c !== "Income").map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label style={{ fontSize: "12px", color: theme.sub, fontWeight: 600, marginBottom: "6px", display: "block" }}>Date</label>
            <input style={inputStyle} type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} />
          </div>
        </div>
        <div style={{ display: "flex", gap: "12px", marginTop: "24px" }}>
          <button onClick={onClose} style={{ flex: 1, padding: "12px", borderRadius: "10px", border: `1px solid ${theme.border}`, background: "transparent", color: theme.sub, cursor: "pointer", fontSize: "14px", fontWeight: 600 }}>Cancel</button>
          <button onClick={handleSubmit} style={{ flex: 1, padding: "12px", borderRadius: "10px", border: "none", background: "linear-gradient(135deg,#6366f1,#8b5cf6)", color: "#fff", cursor: "pointer", fontSize: "14px", fontWeight: 600 }}>
            {editData ? "Save Changes" : "Add Transaction"}
          </button>
        </div>
      </div>
    </div>
  );
}
