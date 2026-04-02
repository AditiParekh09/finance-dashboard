# Finance Dashboard UI

A modern, responsive Finance Dashboard built to help users track, analyze, and understand their financial activity through intuitive visualizations and clean UI.

Live Demo: https://finance-dashboard-xi-three.vercel.app/
GitHub Repository: https://github.com/AditiParekh09/finance-dashboard

---

## Overview

This project simulates a real-world financial dashboard where users can monitor their balance, explore transactions, and gain insights into their spending behavior.

The focus of this project is on:

* Clean and intuitive UI/UX
* Component-based architecture
* Efficient state management
* Data visualization

---

## Features

### Dashboard Overview

* Summary cards for:

  * Total Balance
  * Income
  * Expenses
* Time-based visualization (balance trends)
* Category-wise spending breakdown

---

### Transactions Management

* View all transactions with:

  * Date
  * Amount
  * Category
  * Type (Income / Expense)

* Functionalities:

  * Search
  * Filtering
  * Sorting

---

### Role-Based UI (Simulated)

* Viewer Role

  * Can only view data

* Admin Role

  * Can add or edit transactions

* Role switching implemented using UI controls

---

### Insights Section

* Highest spending category
* Monthly comparison
* Basic financial observations

---

## Tech Stack

* Frontend: React.js (JSX)
* Build Tool: Vite
* Styling: CSS
* State Management: React Context API

---

## Project Structure

```
src/
│── components/
│   ├── Sidebar.jsx
│   ├── Topbar.jsx
│   ├── OverviewTab.jsx
│   ├── TransactionsTab.jsx
│   ├── InsightsTab.jsx
│   ├── PasswordModal.jsx
│
│── context/
│   ├── AppContext.jsx
│
│── pages/
│   ├── Dashboard.jsx
│
│── App.jsx
│── main.jsx
```

---

## Setup & Installation

1. Clone the repository:

```
git clone https://github.com/AditiParekh09/finance-dashboard.git
```

2. Navigate to the project:

```
cd finance-dashboard
```

3. Install dependencies:

```
npm install
```

4. Run the development server:

```
npm run dev
```

---

## Responsiveness

* Fully responsive across:

  * Desktop
  * Tablet
  * Mobile

---

## Approach

* Designed reusable and modular components
* Managed global state using Context API
* Used mock/static data to simulate real-world scenarios
* Focused on simplicity, clarity, and usability

---

## Limitations

* No backend integration (frontend-only project)
* Data is not persisted permanently

---

## Future Improvements

* Local storage / backend integration
* Dark mode support
* Export transactions (CSV/JSON)
* Advanced analytics and filtering
* Animations for better UX

---

## Submission Note

This project was developed as part of a Frontend Developer Internship Assignment to demonstrate:

* UI/UX design skills
* State management
* Component structuring
* Problem-solving approach

---

## Author

Aditi Parekh

---
