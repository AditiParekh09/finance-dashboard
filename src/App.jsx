import React from "react";
import { AppProvider } from "./context/AppContext";
import Dashboard from "./pages/Dashboard";
import "./index.css";

export default function App() {
  return (
    <AppProvider>
      <Dashboard />
    </AppProvider>
  );
}
