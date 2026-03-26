# Frontend (React) Structure

This document explains the files in your `spendora-frontend/src/` folder.

## 1. Root Files
- **`main.jsx`**: The main entry point of the React app. It hooks the React code to the HTML `index.html` file.
- **`App.jsx`**: Sets up all the routing/navigation (e.g., typing `/dashboard` goes to the Dashboard page).
- **`App.css`**: Holds all the global CSS styles, variables, fonts, and base styling for the neon-glassmorphism theme.

## 2. Pages (`pages/`)
These are the full screens that the user navigates between.
- **`Auth.jsx`**: The sleek Login and Signup page that the user sees first.
- **`Dashboard.jsx`**: The main summary page showing total balance, income, and quick stats.
- **`Transactions.jsx`**: A page dedicated strictly to viewing the entire history of expenses and incomes in a list or table.
- **`Insights.jsx`**: The analytics page where charts and visual data summaries are displayed.
- **`Account.jsx`**: The user settings and profile management page.

## 3. Components (`components/`)
Reusable, small pieces of the UI that build up the pages.
- **`Card.jsx`**: The glassmorphism card container used to wrap content beautifully across all pages.
- **`Button.jsx`**: A standardized, reusable button component so all buttons look uniform.
- **`ErrorBoundary.jsx`**: A wrapper that catches any JavaScript errors in components so that the app shows a fallback UI instead of a completely white crashed screen.

## 4. Services (`services/`)
- **`api.js`**: Contains Axios functions that connect directly to your Spring Boot backend controllers (e.g., `loginUser()`, `getTransactions()`). It acts as the bridge that sends data back and forth from the browser to your Java server.

## 5. Context / State Management (`context/`)
- **`CurrencyContext.jsx`**: A global state manager. It remembers what currency the user has selected (like USD or INR) and shares that preference across the entire app so you don't have to keep passing it down to every component individually.
