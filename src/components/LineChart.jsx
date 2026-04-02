import React, { useState } from "react";
import { formatCurrency } from "../utils/helpers";

export default function LineChart({ data, theme }) {
  const [hoveredIdx, setHoveredIdx] = useState(null);
  const W = 500, H = 160;
  const pad = { top: 20, right: 20, bottom: 30, left: 60 };
  const innerW = W - pad.left - pad.right;
  const innerH = H - pad.top - pad.bottom;
  const minVal = Math.min(...data.map((d) => d.balance)) * 0.9;
  const maxVal = Math.max(...data.map((d) => d.balance)) * 1.05;

  const px = (i) => pad.left + (i / (data.length - 1)) * innerW;
  const py = (v) => pad.top + innerH - ((v - minVal) / (maxVal - minVal)) * innerH;

  const points = data.map((d, i) => ({ x: px(i), y: py(d.balance), ...d }));
  const pathD = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
  const areaD = `${pathD} L ${points[points.length - 1].x} ${pad.top + innerH} L ${pad.left} ${pad.top + innerH} Z`;

  return (
    <div style={{ background: theme.cardBg, border: `1px solid ${theme.border}`, borderRadius: "16px", padding: "22px", boxShadow: theme.dark ? "0 4px 24px rgba(0,0,0,0.3)" : "0 2px 12px rgba(0,0,0,0.06)" }}>
      <div style={{ marginBottom: "16px" }}>
        <h3 style={{ margin: 0, fontSize: "15px", fontWeight: 700, color: theme.text }}>Balance Trend</h3>
        <p style={{ margin: "4px 0 0", fontSize: "12px", color: theme.sub }}>Monthly net balance over time</p>
      </div>
      <div style={{ overflowX: "auto" }}>
        <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ display: "block", minWidth: "300px" }}>
          <defs>
            <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#6366f1" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
            </linearGradient>
          </defs>
          {/* Grid */}
          {[0, 0.25, 0.5, 0.75, 1].map((f) => {
            const y = pad.top + innerH * f;
            const val = maxVal - f * (maxVal - minVal);
            return (
              <g key={f}>
                <line x1={pad.left} y1={y} x2={W - pad.right} y2={y} stroke={theme.dark ? "#2d3148" : "#f1f5f9"} strokeWidth={1} />
                <text x={pad.left - 6} y={y + 4} textAnchor="end" fontSize={10} fill={theme.sub}>
                  {val >= 1000 ? `${(val / 1000).toFixed(0)}k` : val.toFixed(0)}
                </text>
              </g>
            );
          })}
          {/* Area */}
          <path d={areaD} fill="url(#lineGrad)" />
          {/* Line */}
          <path d={pathD} fill="none" stroke="#6366f1" strokeWidth={2.5} strokeLinejoin="round" strokeLinecap="round" />
          {/* Points */}
          {points.map((p, i) => (
            <g key={i}>
              <circle cx={p.x} cy={p.y} r={hoveredIdx === i ? 6 : 4} fill={hoveredIdx === i ? "#fff" : "#6366f1"} stroke="#6366f1" strokeWidth={2}
                style={{ cursor: "pointer", transition: "r 0.2s" }}
                onMouseEnter={() => setHoveredIdx(i)} onMouseLeave={() => setHoveredIdx(null)}
              />
              {/* Month label */}
              <text x={p.x} y={H - 8} textAnchor="middle" fontSize={10} fill={theme.sub}>{p.month}</text>
              {/* Tooltip */}
              {hoveredIdx === i && (
                <g>
                  <rect x={p.x - 55} y={p.y - 36} width={110} height={24} rx={6} fill={theme.dark ? "#1a1d2e" : "#1e293b"} />
                  <text x={p.x} y={p.y - 20} textAnchor="middle" fontSize={11} fill="#fff">{formatCurrency(p.balance)}</text>
                </g>
              )}
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
}
