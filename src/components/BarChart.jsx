import React, { useState } from "react";
import { formatCurrency } from "../utils/helpers";

export default function BarChart({ data, theme }) {
  const [tooltip, setTooltip] = useState(null);
  const maxVal = Math.max(...data.map((d) => Math.max(d.income, d.expenses)));
  const chartH = 180;
  const barW = 28;
  const gap = 12;
  const groupW = barW * 2 + gap + 20;
  const svgW = data.length * groupW + 40;

  return (
    <div style={{ background: theme.cardBg, border: `1px solid ${theme.border}`, borderRadius: "16px", padding: "22px", boxShadow: theme.dark ? "0 4px 24px rgba(0,0,0,0.3)" : "0 2px 12px rgba(0,0,0,0.06)" }}>
      <div style={{ marginBottom: "16px" }}>
        <h3 style={{ margin: 0, fontSize: "15px", fontWeight: 700, color: theme.text }}>Monthly Overview</h3>
        <p style={{ margin: "4px 0 0", fontSize: "12px", color: theme.sub }}>Income vs Expenses comparison</p>
      </div>
      <div style={{ display: "flex", gap: "16px", marginBottom: "12px" }}>
        {[{ color: "#6366f1", label: "Income" }, { color: "#ef4444", label: "Expenses" }].map(l => (
          <div key={l.label} style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", color: theme.sub }}>
            <div style={{ width: 10, height: 10, borderRadius: "3px", background: l.color }} />
            {l.label}
          </div>
        ))}
      </div>
      <div style={{ overflowX: "auto" }}>
        <svg width={svgW} height={chartH + 30} style={{ display: "block" }}>
          {/* Grid lines */}
          {[0.25, 0.5, 0.75, 1].map((f) => (
            <line key={f} x1={20} y1={chartH * (1 - f)} x2={svgW} y2={chartH * (1 - f)}
              stroke={theme.dark ? "#2d3148" : "#f1f5f9"} strokeWidth={1} />
          ))}
          {data.map((d, i) => {
            const x = 20 + i * groupW;
            const incH = (d.income / maxVal) * chartH;
            const expH = (d.expenses / maxVal) * chartH;
            return (
              <g key={d.month}>
                {/* Income bar */}
                <rect x={x} y={chartH - incH} width={barW} height={incH} rx={5} fill="#6366f1"
                  style={{ cursor: "pointer", transition: "opacity 0.2s" }}
                  onMouseEnter={() => setTooltip({ x: x + barW / 2, y: chartH - incH, text: `Income: ${formatCurrency(d.income)}` })}
                  onMouseLeave={() => setTooltip(null)}
                />
                {/* Expense bar */}
                <rect x={x + barW + gap} y={chartH - expH} width={barW} height={expH} rx={5} fill="#ef4444"
                  style={{ cursor: "pointer" }}
                  onMouseEnter={() => setTooltip({ x: x + barW + gap + barW / 2, y: chartH - expH, text: `Expenses: ${formatCurrency(d.expenses)}` })}
                  onMouseLeave={() => setTooltip(null)}
                />
                {/* Month label */}
                <text x={x + barW + gap / 2} y={chartH + 18} textAnchor="middle" fontSize={11} fill={theme.sub}>{d.month}</text>
              </g>
            );
          })}
          {/* Tooltip */}
          {tooltip && (
            <g>
              <rect x={tooltip.x - 60} y={tooltip.y - 28} width={120} height={22} rx={6} fill={theme.dark ? "#1a1d2e" : "#1e293b"} />
              <text x={tooltip.x} y={tooltip.y - 12} textAnchor="middle" fontSize={11} fill="#fff">{tooltip.text}</text>
            </g>
          )}
        </svg>
      </div>
    </div>
  );
}
