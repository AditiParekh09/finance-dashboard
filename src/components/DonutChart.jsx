import React, { useState } from "react";
import { getCategoryColor, formatCurrency } from "../utils/helpers";

function polarToCartesian(cx, cy, r, angle) {
  const rad = ((angle - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function arcPath(cx, cy, r, startAngle, endAngle) {
  const s = polarToCartesian(cx, cy, r, startAngle);
  const e = polarToCartesian(cx, cy, r, endAngle);
  const large = endAngle - startAngle > 180 ? 1 : 0;
  return `M ${s.x} ${s.y} A ${r} ${r} 0 ${large} 1 ${e.x} ${e.y}`;
}

export default function DonutChart({ data, theme }) {
  const [hovered, setHovered] = useState(null);
  const total = data.reduce((s, d) => s + d.value, 0);
  const cx = 90, cy = 90, r = 70, inner = 42;
  let cumulative = 0;

  const slices = data.map((d) => {
    const start = (cumulative / total) * 360;
    cumulative += d.value;
    const end = (cumulative / total) * 360;
    return { ...d, start, end };
  });

  return (
    <div style={{ background: theme.cardBg, border: `1px solid ${theme.border}`, borderRadius: "16px", padding: "22px", boxShadow: theme.dark ? "0 4px 24px rgba(0,0,0,0.3)" : "0 2px 12px rgba(0,0,0,0.06)" }}>
      <div style={{ marginBottom: "16px" }}>
        <h3 style={{ margin: 0, fontSize: "15px", fontWeight: 700, color: theme.text }}>Spending Breakdown</h3>
        <p style={{ margin: "4px 0 0", fontSize: "12px", color: theme.sub }}>By category (all time)</p>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "20px", flexWrap: "wrap" }}>
        <div style={{ position: "relative", flexShrink: 0 }}>
          <svg width={180} height={180}>
            {slices.map((s, i) => (
              <path key={i}
                d={arcPath(cx, cy, r, s.start, s.end)}
                fill="none" stroke={getCategoryColor(s.name)} strokeWidth={hovered === i ? 22 : 16}
                strokeLinecap="butt" style={{ cursor: "pointer", transition: "stroke-width 0.2s" }}
                onMouseEnter={() => setHovered(i)} onMouseLeave={() => setHovered(null)}
              />
            ))}
            {/* Center circle */}
            <circle cx={cx} cy={cy} r={inner} fill={theme.cardBg} />
            <text x={cx} y={cy - 6} textAnchor="middle" fontSize={11} fill={theme.sub}>Total</text>
            <text x={cx} y={cy + 10} textAnchor="middle" fontSize={13} fontWeight={700} fill={theme.text}>
              {hovered !== null ? `${Math.round((slices[hovered].value / total) * 100)}%` : `${data.length}`}
            </text>
            <text x={cx} y={cy + 24} textAnchor="middle" fontSize={10} fill={theme.sub}>
              {hovered !== null ? slices[hovered].name : "categories"}
            </text>
          </svg>
        </div>
        {/* Legend */}
        <div style={{ flex: 1, minWidth: "120px" }}>
          {data.slice(0, 6).map((d, i) => (
            <div key={d.name} onMouseEnter={() => setHovered(i)} onMouseLeave={() => setHovered(null)}
              style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "5px 8px", borderRadius: "8px", cursor: "pointer", background: hovered === i ? (theme.dark ? "#2d3148" : "#f8fafc") : "transparent", transition: "background 0.2s", marginBottom: "2px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: getCategoryColor(d.name) }} />
                <span style={{ fontSize: "12px", color: theme.sub }}>{d.name}</span>
              </div>
              <span style={{ fontSize: "12px", fontWeight: 600, color: theme.text }}>{formatCurrency(d.value)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
