# Project Overview: How it all connects

Welcome to the documentation for **Smart Expense Tracker (Spendora)**!

This system is built as a complete **Fullstack Application**:
1. **Frontend**: Built with React (Vite). Located in `/spendora-frontend/`.
2. **Backend**: Built with Java Spring Boot. Located in `src/main/java...`.
3. **Database**: MySQL (running via XAMPP).

## How Data Flows
1. Suppose you click "Add Expense" on the React **`Dashboard.jsx`**.
2. React calls a function inside **`services/api.js`** which sends a POST request over the network.
3. Your Java backend gets this request inside **`TransactionController.java`**.
4. The controller tells **`TransactionRepository.java`** to save this new expense into MySQL as a **`Transaction.java`** entity.
5. The database responds with "Success", the backend replies back across the network to React, and your dashboard updates the balance on screen dynamically.

*Check `backend_structure.md` and `frontend_structure.md` in this directory for detailed explanations of every single file.*
