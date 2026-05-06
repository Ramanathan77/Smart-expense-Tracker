# Spendora - Run Instructions

This guide provides the necessary steps to run both the Spring Boot backend and the React/Vite frontend for the Spendora Smart Expense Tracker.

## Prerequisites

- Java 17+
- Node.js 18+
- Maven (or use the provided Maven wrapper)

## Running the Backend (Spring Boot)

1. Open a terminal and navigate to the root directory of the project (`Smart-Expense-Tracker`).
2. Run the application using the Maven Wrapper:

   **On Windows:**
   ```cmd
   .\mvnw.cmd spring-boot:run
   ```

   **On macOS/Linux:**
   ```bash
   ./mvnw spring-boot:run
   ```

3. The backend API will start on `http://localhost:8080`.

## Running the Frontend (React + Vite)

1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd spendora-frontend
   ```

2. Install dependencies (if you haven't already):
   ```bash
   npm install
   ```

3. Start the Vite development server:
   ```bash
   npm run dev
   ```

4. The frontend will be accessible at `http://localhost:5173`.
