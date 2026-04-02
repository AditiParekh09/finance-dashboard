import React, { useState, useEffect } from "react";
import { useApp } from "../context/AppContext";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import OverviewTab from "../components/OverviewTab";
import TransactionsTab from "../components/TransactionsTab";
import InsightsTab from "../components/InsightsTab";
import PasswordModal from "../components/PasswordModal";

const SIDEBAR_WIDTH = 260;

export default function Dashboard() {
  const { state } = useApp();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 768);

  useEffect(() => {
    const handler = () => setIsDesktop(window.innerWidth >= 768);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);

  const theme = {
    bg:      state.darkMode ? "#0f1117" : "#f4f6fb",
    cardBg:  state.darkMode ? "#1a1d2e" : "#ffffff",
    text:    state.darkMode ? "#e2e8f0" : "#1e293b",
    sub:     state.darkMode ? "#94a3b8" : "#64748b",
    border:  state.darkMode ? "#2d3148" : "#e2e8f0",
    dark:    state.darkMode,
  };

  return (
    /*
     * Outer shell: full viewport, no scroll on its own.
     * We use a CSS grid with two columns:
     *   - col 1 = sidebar (fixed width, only on desktop)
     *   - col 2 = everything else
     * On mobile both collapse to a single column.
     */
    <div style={{
      display: "grid",
      gridTemplateColumns: isDesktop ? `${SIDEBAR_WIDTH}px 1fr` : "1fr",
      gridTemplateRows: "100vh",
      background: theme.bg,
      color: theme.text,
      fontFamily: "'Plus Jakarta Sans','Segoe UI',sans-serif",
      overflow: "hidden",        /* no outer scroll */
      transition: "background 0.3s, color 0.3s",
    }}>

      {/* ── SIDEBAR (scrolls internally if needed) ── */}
      {isDesktop && (
        <Sidebar
          open={true}
          onClose={() => {}}
          theme={theme}
          isDesktop={isDesktop}
          sidebarWidth={SIDEBAR_WIDTH}
        />
      )}

      {/* Mobile sidebar (overlay) */}
      {!isDesktop && (
        <Sidebar
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          theme={theme}
          isDesktop={false}
          sidebarWidth={SIDEBAR_WIDTH}
        />
      )}

      {/* ── MAIN COLUMN (topbar + scrollable page content) ── */}
      <div style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        overflow: "hidden",       /* clip, let inner main scroll */
        minWidth: 0,
      }}>
        <Topbar
          onMenuClick={() => setSidebarOpen(true)}
          theme={theme}
          isDesktop={isDesktop}
        />

        {/* scrollable content area */}
        <main style={{
          flex: 1,
          overflowY: "auto",
          overflowX: "hidden",
          padding: "28px",
          background: theme.bg,
          transition: "background 0.3s",
        }}>
          {state.activeTab === "dashboard"    && <OverviewTab    theme={theme} />}
          {state.activeTab === "transactions" && <TransactionsTab theme={theme} />}
          {state.activeTab === "insights"     && <InsightsTab     theme={theme} />}
        </main>
      </div>

      {/* Password modal sits above everything */}
      <PasswordModal theme={theme} />
    </div>
  );
}
