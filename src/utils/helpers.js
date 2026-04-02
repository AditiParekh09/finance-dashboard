export const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(amount);

export const formatDate = (dateStr) =>
  new Date(dateStr).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });

export const getCategoryColor = (category) => {
  const colors = {
    Income: "#10b981",
    Food: "#f59e0b",
    Shopping: "#8b5cf6",
    Utilities: "#3b82f6",
    Health: "#ef4444",
    Transport: "#06b6d4",
    Entertainment: "#ec4899",
    Housing: "#f97316",
    Education: "#14b8a6",
  };
  return colors[category] || "#6b7280";
};

export const getFilteredTransactions = (transactions, filters, sortConfig) => {
  let filtered = [...transactions];
  if (filters.type !== "all") filtered = filtered.filter((t) => t.type === filters.type);
  if (filters.category !== "all") filtered = filtered.filter((t) => t.category === filters.category);
  if (filters.search)
    filtered = filtered.filter(
      (t) =>
        t.description.toLowerCase().includes(filters.search.toLowerCase()) ||
        t.category.toLowerCase().includes(filters.search.toLowerCase())
    );
  filtered.sort((a, b) => {
    let valA = a[sortConfig.key];
    let valB = b[sortConfig.key];
    if (sortConfig.key === "date") { valA = new Date(valA); valB = new Date(valB); }
    if (valA < valB) return sortConfig.direction === "asc" ? -1 : 1;
    if (valA > valB) return sortConfig.direction === "asc" ? 1 : -1;
    return 0;
  });
  return filtered;
};
