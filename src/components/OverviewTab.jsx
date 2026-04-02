import React from "react";
import { useApp } from "../context/AppContext";
import SummaryCard from "./SummaryCard";
import BarChart from "./BarChart";
import DonutChart from "./DonutChart";
import LineChart from "./LineChart";
import { formatCurrency, getCategoryColor } from "../utils/helpers";
import { monthlyData } from "../data/mockData";

export default function OverviewTab({ theme }) {
  const { state } = useApp();

  const totalIncome = state.transactions.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0);
  const totalExpenses = state.transactions.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0);
  const balance = totalIncome - totalExpenses;

  // Category spending
  const categorySpend = {};
  state.transactions.filter((t) => t.type === "expense").forEach((t) => {
    categorySpend[t.category] = (categorySpend[t.category] || 0) + t.amount;
  });
  const categoryData = Object.entries(categorySpend)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);

  const recentTx = [...state.transactions].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Summary cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px" }}>
        <SummaryCard title="Total Balance" value={formatCurrency(balance)} sub="Net across all time" icon="💰" accent="#6366f1" theme={theme} />
        <SummaryCard title="Total Income" value={formatCurrency(totalIncome)} sub={`${state.transactions.filter(t => t.type === "income").length} transactions`} icon="📈" accent="#10b981" theme={theme} />
        <SummaryCard title="Total Expenses" value={formatCurrency(totalExpenses)} sub={`${state.transactions.filter(t => t.type === "expense").length} transactions`} icon="📉" accent="#ef4444" theme={theme} />
        <SummaryCard title="Savings Rate" value={`${Math.round((balance / totalIncome) * 100)}%`} sub="Income saved" icon="🏦" accent="#f59e0b" theme={theme} />
      </div>

      {/* Charts row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "16px" }}>
        <LineChart data={monthlyData} theme={theme} />
        <BarChart data={monthlyData} theme={theme} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "16px" }}>
        <DonutChart data={categoryData} theme={theme} />

        {/* Recent transactions */}
        <div style={{ background: theme.cardBg, border: `1px solid ${theme.border}`, borderRadius: "16px", padding: "22px", boxShadow: theme.dark ? "0 4px 24px rgba(0,0,0,0.3)" : "0 2px 12px rgba(0,0,0,0.06)" }}>
          <h3 style={{ margin: "0 0 16px", fontSize: "15px", fontWeight: 700, color: theme.text }}>Recent Transactions</h3>
          {recentTx.map((t) => (
            <div key={t.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 0", borderBottom: `1px solid ${theme.border}` }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div style={{ width: 36, height: 36, borderRadius: "10px", background: getCategoryColor(t.category) + "20", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px" }}>
                  {t.type === "income" ? "💵" : "💸"}
                </div>
                <div>
                  <div style={{ fontSize: "13px", fontWeight: 600, color: theme.text }}>{t.description}</div>
                  <div style={{ fontSize: "11px", color: theme.sub }}>{t.category} • {t.date}</div>
                </div>
              </div>
              <span style={{ fontWeight: 700, fontSize: "14px", color: t.type === "income" ? "#10b981" : "#ef4444" }}>
                {t.type === "income" ? "+" : "-"}{formatCurrency(t.amount)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
