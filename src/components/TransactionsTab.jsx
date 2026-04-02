import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { formatCurrency, formatDate, getCategoryColor, getFilteredTransactions } from "../utils/helpers";
import { categories } from "../data/mockData";
import TransactionModal from "./TransactionModal";

export default function TransactionsTab({ theme }) {
  const { state, dispatch } = useApp();
  const [modalOpen, setModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const filtered = getFilteredTransactions(state.transactions, state.filters, state.sortConfig);
  const isAdmin = state.role === "admin";

  const handleSort = (key) => {
    dispatch({ type: "SET_SORT", payload: { key, direction: state.sortConfig.key === key && state.sortConfig.direction === "asc" ? "desc" : "asc" } });
  };

  const sortIcon = (key) => {
    if (state.sortConfig.key !== key) return " ↕";
    return state.sortConfig.direction === "asc" ? " ↑" : " ↓";
  };

  const handleSave = (data) => {
    if (editData) dispatch({ type: "EDIT_TRANSACTION", payload: data });
    else dispatch({ type: "ADD_TRANSACTION", payload: data });
  };

  const exportCSV = () => {
    const header = "Date,Description,Category,Type,Amount\n";
    const rows = filtered.map(t => `${t.date},${t.description},${t.category},${t.type},${t.amount}`).join("\n");
    const blob = new Blob([header + rows], { type: "text/csv" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "transactions.csv"; a.click();
  };

  const inputStyle = {
    padding: "9px 14px", borderRadius: "10px", border: `1px solid ${theme.border}`,
    background: theme.cardBg, color: theme.text, fontSize: "13px", outline: "none",
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      {/* Filter bar */}
      <div style={{ background: theme.cardBg, border: `1px solid ${theme.border}`, borderRadius: "16px", padding: "18px 22px" }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", alignItems: "center" }}>
          <input style={{ ...inputStyle, flex: "1 1 180px" }} placeholder="🔍 Search transactions..."
            value={state.filters.search} onChange={e => dispatch({ type: "SET_FILTER", payload: { search: e.target.value } })} />
          <select style={{ ...inputStyle, flex: "0 1 140px" }} value={state.filters.type} onChange={e => dispatch({ type: "SET_FILTER", payload: { type: e.target.value } })}>
            <option value="all">All Types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
          <select style={{ ...inputStyle, flex: "0 1 160px" }} value={state.filters.category} onChange={e => dispatch({ type: "SET_FILTER", payload: { category: e.target.value } })}>
            <option value="all">All Categories</option>
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <div style={{ marginLeft: "auto", display: "flex", gap: "10px" }}>
            <button onClick={exportCSV} style={{ padding: "9px 16px", borderRadius: "10px", border: `1px solid ${theme.border}`, background: "transparent", color: theme.sub, cursor: "pointer", fontSize: "13px", fontWeight: 500 }}>
              ⬇ Export CSV
            </button>
            {isAdmin && (
              <button onClick={() => { setEditData(null); setModalOpen(true); }}
                style={{ padding: "9px 18px", borderRadius: "10px", border: "none", background: "linear-gradient(135deg,#6366f1,#8b5cf6)", color: "#fff", cursor: "pointer", fontSize: "13px", fontWeight: 600 }}>
                + Add Transaction
              </button>
            )}
          </div>
        </div>
        <div style={{ marginTop: "10px", fontSize: "12px", color: theme.sub }}>
          Showing <strong style={{ color: theme.text }}>{filtered.length}</strong> of {state.transactions.length} transactions
          {!isAdmin && <span style={{ marginLeft: "12px", color: "#f59e0b" }}>👁 Viewer mode — read only</span>}
        </div>
      </div>

      {/* Table */}
      <div style={{ background: theme.cardBg, border: `1px solid ${theme.border}`, borderRadius: "16px", overflow: "hidden", boxShadow: theme.dark ? "0 4px 24px rgba(0,0,0,0.3)" : "0 2px 12px rgba(0,0,0,0.06)" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: theme.dark ? "#0f1117" : "#f8fafc" }}>
                {[{ label: "Date", key: "date" }, { label: "Description", key: "description" }, { label: "Category", key: "category" }, { label: "Type", key: "type" }, { label: "Amount", key: "amount" }].map(col => (
                  <th key={col.key} onClick={() => handleSort(col.key)}
                    style={{ padding: "12px 18px", textAlign: "left", fontSize: "12px", fontWeight: 700, color: theme.sub, textTransform: "uppercase", letterSpacing: "0.5px", cursor: "pointer", whiteSpace: "nowrap", borderBottom: `1px solid ${theme.border}` }}>
                    {col.label}{sortIcon(col.key)}
                  </th>
                ))}
                {isAdmin && <th style={{ padding: "12px 18px", fontSize: "12px", fontWeight: 700, color: theme.sub, textTransform: "uppercase", letterSpacing: "0.5px", borderBottom: `1px solid ${theme.border}` }}>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={isAdmin ? 6 : 5} style={{ textAlign: "center", padding: "48px", color: theme.sub }}>
                  <div style={{ fontSize: "48px", marginBottom: "12px" }}>🔍</div>
                  No transactions found
                </td></tr>
              ) : filtered.map((t, i) => (
                <tr key={t.id} style={{ borderBottom: `1px solid ${theme.border}`, transition: "background 0.15s" }}
                  onMouseEnter={e => e.currentTarget.style.background = theme.dark ? "#2d3148" : "#f8fafc"}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                  <td style={{ padding: "13px 18px", fontSize: "13px", color: theme.sub, whiteSpace: "nowrap" }}>{formatDate(t.date)}</td>
                  <td style={{ padding: "13px 18px", fontSize: "13px", fontWeight: 600, color: theme.text }}>{t.description}</td>
                  <td style={{ padding: "13px 18px" }}>
                    <span style={{ padding: "3px 10px", borderRadius: "20px", fontSize: "11px", fontWeight: 600, background: getCategoryColor(t.category) + "20", color: getCategoryColor(t.category) }}>{t.category}</span>
                  </td>
                  <td style={{ padding: "13px 18px" }}>
                    <span style={{ padding: "3px 10px", borderRadius: "20px", fontSize: "11px", fontWeight: 600, background: t.type === "income" ? "rgba(16,185,129,0.1)" : "rgba(239,68,68,0.1)", color: t.type === "income" ? "#10b981" : "#ef4444" }}>
                      {t.type === "income" ? "↑ Income" : "↓ Expense"}
                    </span>
                  </td>
                  <td style={{ padding: "13px 18px", fontWeight: 700, fontSize: "14px", color: t.type === "income" ? "#10b981" : "#ef4444", whiteSpace: "nowrap" }}>
                    {t.type === "income" ? "+" : "-"}{formatCurrency(t.amount)}
                  </td>
                  {isAdmin && (
                    <td style={{ padding: "13px 18px" }}>
                      <div style={{ display: "flex", gap: "8px" }}>
                        <button onClick={() => { setEditData(t); setModalOpen(true); }}
                          style={{ padding: "5px 12px", borderRadius: "8px", border: `1px solid ${theme.border}`, background: "transparent", color: theme.sub, cursor: "pointer", fontSize: "12px" }}>Edit</button>
                        <button onClick={() => setConfirmDelete(t.id)}
                          style={{ padding: "5px 12px", borderRadius: "8px", border: "none", background: "rgba(239,68,68,0.1)", color: "#ef4444", cursor: "pointer", fontSize: "12px" }}>Del</button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete confirm */}
      {confirmDelete && (
        <div style={{ position: "fixed", inset: 0, zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.5)" }}>
          <div style={{ background: theme.cardBg, borderRadius: "16px", padding: "28px", maxWidth: "360px", border: `1px solid ${theme.border}` }}>
            <h3 style={{ margin: "0 0 8px", color: theme.text }}>Delete Transaction?</h3>
            <p style={{ margin: "0 0 20px", color: theme.sub, fontSize: "14px" }}>This action cannot be undone.</p>
            <div style={{ display: "flex", gap: "12px" }}>
              <button onClick={() => setConfirmDelete(null)} style={{ flex: 1, padding: "10px", borderRadius: "10px", border: `1px solid ${theme.border}`, background: "transparent", color: theme.sub, cursor: "pointer" }}>Cancel</button>
              <button onClick={() => { dispatch({ type: "DELETE_TRANSACTION", payload: confirmDelete }); setConfirmDelete(null); }}
                style={{ flex: 1, padding: "10px", borderRadius: "10px", border: "none", background: "#ef4444", color: "#fff", cursor: "pointer", fontWeight: 600 }}>Delete</button>
            </div>
          </div>
        </div>
      )}

      <TransactionModal open={modalOpen} onClose={() => setModalOpen(false)} onSave={handleSave} editData={editData} theme={theme} />
    </div>
  );
}
