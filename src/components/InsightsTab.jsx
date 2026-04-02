import React from "react";
import { useApp } from "../context/AppContext";
import { formatCurrency, getCategoryColor } from "../utils/helpers";
import { monthlyData } from "../data/mockData";

export default function InsightsTab({ theme }) {
  const { state } = useApp();

  const expenses = state.transactions.filter(t => t.type === "expense");
  const totalExpenses = expenses.reduce((s, t) => s + t.amount, 0);

  // Top categories
  const catMap = {};
  expenses.forEach(t => { catMap[t.category] = (catMap[t.category] || 0) + t.amount; });
  const sortedCats = Object.entries(catMap).sort((a, b) => b[1] - a[1]);

  // Monthly breakdown
  const monthlyExpByCategory = {};
  state.transactions.forEach(t => {
    const m = t.date.slice(0, 7);
    if (!monthlyExpByCategory[m]) monthlyExpByCategory[m] = { income: 0, expenses: 0 };
    if (t.type === "income") monthlyExpByCategory[m].income += t.amount;
    else monthlyExpByCategory[m].expenses += t.amount;
  });

  // Biggest single expense
  const biggestExpense = expenses.reduce((max, t) => t.amount > (max?.amount || 0) ? t : max, null);

  // Avg monthly spend
  const months = Object.keys(monthlyExpByCategory).length;
  const avgMonthlyExpense = months ? totalExpenses / months : 0;

  // Cards
  const insightCards = [
    {
      title: "Top Spending Category",
      value: sortedCats[0]?.[0] || "N/A",
      sub: sortedCats[0] ? `${formatCurrency(sortedCats[0][1])} total — ${Math.round((sortedCats[0][1] / totalExpenses) * 100)}% of all expenses` : "",
      icon: "🏆", accent: getCategoryColor(sortedCats[0]?.[0]),
    },
    {
      title: "Largest Single Expense",
      value: biggestExpense ? formatCurrency(biggestExpense.amount) : "N/A",
      sub: biggestExpense ? `${biggestExpense.description} on ${biggestExpense.date}` : "",
      icon: "⚡", accent: "#ef4444",
    },
    {
      title: "Avg Monthly Expenses",
      value: formatCurrency(avgMonthlyExpense),
      sub: `Across ${months} months of data`,
      icon: "📊", accent: "#f59e0b",
    },
    {
      title: "Best Month (Lowest Spend)",
      value: (() => {
        const best = Object.entries(monthlyExpByCategory).reduce((min, [k, v]) => v.expenses < (min[1]?.expenses ?? Infinity) ? [k, v] : min, ["", null]);
        return best[0] ? best[0] : "N/A";
      })(),
      sub: "Month with least expenditure",
      icon: "🌟", accent: "#10b981",
    },
  ];

  const cardStyle = (accent) => ({
    background: theme.cardBg, border: `1px solid ${theme.border}`, borderRadius: "16px",
    padding: "22px", position: "relative", overflow: "hidden",
    boxShadow: theme.dark ? "0 4px 24px rgba(0,0,0,0.3)" : "0 2px 12px rgba(0,0,0,0.06)",
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Insight cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px" }}>
        {insightCards.map(c => (
          <div key={c.title} style={cardStyle(c.accent)}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "3px", background: c.accent }} />
            <div style={{ fontSize: "28px", marginBottom: "12px" }}>{c.icon}</div>
            <div style={{ fontSize: "12px", color: theme.sub, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "6px" }}>{c.title}</div>
            <div style={{ fontSize: "22px", fontWeight: 800, color: theme.text, marginBottom: "6px" }}>{c.value}</div>
            <div style={{ fontSize: "12px", color: theme.sub, lineHeight: "1.4" }}>{c.sub}</div>
          </div>
        ))}
      </div>

      {/* Category breakdown bar */}
      <div style={{ background: theme.cardBg, border: `1px solid ${theme.border}`, borderRadius: "16px", padding: "24px", boxShadow: theme.dark ? "0 4px 24px rgba(0,0,0,0.3)" : "0 2px 12px rgba(0,0,0,0.06)" }}>
        <h3 style={{ margin: "0 0 20px", fontSize: "15px", fontWeight: 700, color: theme.text }}>Category Spending Breakdown</h3>
        {sortedCats.map(([cat, amt]) => {
          const pct = (amt / totalExpenses) * 100;
          return (
            <div key={cat} style={{ marginBottom: "14px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <div style={{ width: 10, height: 10, borderRadius: "50%", background: getCategoryColor(cat) }} />
                  <span style={{ fontSize: "13px", color: theme.text, fontWeight: 500 }}>{cat}</span>
                </div>
                <div style={{ fontSize: "13px", fontWeight: 700, color: theme.text }}>
                  {formatCurrency(amt)} <span style={{ color: theme.sub, fontWeight: 400 }}>({pct.toFixed(1)}%)</span>
                </div>
              </div>
              <div style={{ height: "8px", borderRadius: "10px", background: theme.dark ? "#2d3148" : "#f1f5f9", overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${pct}%`, background: getCategoryColor(cat), borderRadius: "10px", transition: "width 0.6s ease" }} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Monthly comparison */}
      <div style={{ background: theme.cardBg, border: `1px solid ${theme.border}`, borderRadius: "16px", padding: "24px", boxShadow: theme.dark ? "0 4px 24px rgba(0,0,0,0.3)" : "0 2px 12px rgba(0,0,0,0.06)" }}>
        <h3 style={{ margin: "0 0 6px", fontSize: "15px", fontWeight: 700, color: theme.text }}>Monthly Comparison</h3>
        <p style={{ margin: "0 0 20px", fontSize: "12px", color: theme.sub }}>How each month compares in income, expenses, and savings</p>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "500px" }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${theme.border}` }}>
                {["Month", "Income", "Expenses", "Savings", "Savings Rate"].map(h => (
                  <th key={h} style={{ padding: "10px 16px", textAlign: "left", fontSize: "11px", fontWeight: 700, color: theme.sub, textTransform: "uppercase", letterSpacing: "0.5px" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {monthlyData.map((m, i) => {
                const savings = m.income - m.expenses;
                const rate = Math.round((savings / m.income) * 100);
                const prev = monthlyData[i - 1];
                const expChange = prev ? ((m.expenses - prev.expenses) / prev.expenses * 100).toFixed(1) : null;
                return (
                  <tr key={m.month} style={{ borderBottom: `1px solid ${theme.border}` }}
                    onMouseEnter={e => e.currentTarget.style.background = theme.dark ? "#2d3148" : "#f8fafc"}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                    <td style={{ padding: "13px 16px", fontWeight: 700, color: theme.text, fontSize: "14px" }}>{m.month} 2024</td>
                    <td style={{ padding: "13px 16px", color: "#10b981", fontWeight: 600, fontSize: "14px" }}>{formatCurrency(m.income)}</td>
                    <td style={{ padding: "13px 16px", fontSize: "14px" }}>
                      <div style={{ color: "#ef4444", fontWeight: 600 }}>{formatCurrency(m.expenses)}</div>
                      {expChange !== null && (
                        <div style={{ fontSize: "11px", color: parseFloat(expChange) > 0 ? "#ef4444" : "#10b981" }}>
                          {parseFloat(expChange) > 0 ? "▲" : "▼"} {Math.abs(expChange)}% vs prev
                        </div>
                      )}
                    </td>
                    <td style={{ padding: "13px 16px", color: savings > 0 ? "#10b981" : "#ef4444", fontWeight: 700, fontSize: "14px" }}>{formatCurrency(savings)}</td>
                    <td style={{ padding: "13px 16px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <div style={{ flex: 1, height: "6px", borderRadius: "10px", background: theme.dark ? "#2d3148" : "#f1f5f9", overflow: "hidden", minWidth: "60px" }}>
                          <div style={{ height: "100%", width: `${Math.max(0, rate)}%`, background: rate > 40 ? "#10b981" : rate > 20 ? "#f59e0b" : "#ef4444", borderRadius: "10px" }} />
                        </div>
                        <span style={{ fontSize: "12px", fontWeight: 700, color: theme.text }}>{rate}%</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
