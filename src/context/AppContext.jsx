import React, { createContext, useContext, useReducer } from "react";
import { transactions as initialTransactions } from "../data/mockData";

const AppContext = createContext();

const initialState = {
  transactions: initialTransactions,
  role: "viewer",
  filters: { type: "all", category: "all", search: "" },
  sortConfig: { key: "date", direction: "desc" },
  darkMode: false,
  activeTab: "dashboard",
  showPasswordModal: false,
};

const ADMIN_PASSWORD = "zorvyn123"; // 🔐 Admin password

function reducer(state, action) {
  switch (action.type) {
    case "SET_ROLE":
      // If switching to admin, show password modal instead
      if (action.payload === "admin") return { ...state, showPasswordModal: true };
      return { ...state, role: "viewer", showPasswordModal: false };
    case "CONFIRM_ADMIN":
      return { ...state, role: "admin", showPasswordModal: false };
    case "CLOSE_PASSWORD_MODAL":
      return { ...state, showPasswordModal: false };
    case "SET_FILTER":
      return { ...state, filters: { ...state.filters, ...action.payload } };
    case "SET_SORT":
      return { ...state, sortConfig: action.payload };
    case "TOGGLE_DARK":
      return { ...state, darkMode: !state.darkMode };
    case "SET_TAB":
      return { ...state, activeTab: action.payload };
    case "ADD_TRANSACTION":
      return { ...state, transactions: [{ ...action.payload, id: Date.now() }, ...state.transactions] };
    case "EDIT_TRANSACTION":
      return { ...state, transactions: state.transactions.map((t) => t.id === action.payload.id ? action.payload : t) };
    case "DELETE_TRANSACTION":
      return { ...state, transactions: state.transactions.filter((t) => t.id !== action.payload) };
    default:
      return state;
  }
}

export { ADMIN_PASSWORD };

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
