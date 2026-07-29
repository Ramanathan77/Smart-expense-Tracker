# 💰 Smart Expense Tracker

A modern, full-stack personal finance and expense tracking web application designed to help users efficiently manage budgets, categorize spending, and monitor financial health with secure authentication and built-in AI insights.

🔗 **Live Demo:** [Smart Expense Tracker Live](https://smart-expense-tracker-bice-omega.vercel.app)

---

## 🚀 Features

* **AI Financial Assistant:** Integrated with the **Gemini API** to automatically analyze transaction history, detect spending patterns, and provide personalized financial suggestions.
* **User Authentication & Management:** Secure sign-up and login workflows with robust backend security.
* **Expense & Income Logging:** Add, categorize, edit, and delete daily financial transactions.
* **Interactive Dashboard:** Gain insights into spending habits with clean visual summaries.
* **RESTful API Backend:** Powered by Spring Boot with secure CORS configurations and database connectivity.
* **Responsive Frontend:** Built with React and modern CSS for a seamless desktop and mobile experience.

---

## 🛠️ Tech Stack

* **Frontend:** JavaScript, React, CSS, HTML
* **Backend:** Java, Spring Boot, Spring Security, Gemini API SDK
* **Database & Storage:** Relational Database (configured via schema scripts)
* **Deployment:** Vercel (Frontend) / Cloud-hosted backend services

---

## 📁 Repository Structure

```text
├── backend/               # Spring Boot backend source code
├── docs/                  # Project documentation and assets
├── spendora-frontend/     # React frontend application
├── DEPLOYMENT.md          # Deployment and hosting guidelines
├── PROJECT_OVERVIEW.md    # High-level architecture and flow description
├── schema.txt             # Database schema configuration
└── seed.js                # Database seeding scripts

```

---

## ⚙️ Getting Started & Local Setup

Follow these steps to set up the project locally for development and testing.

### Prerequisites

* **Node.js** (v16+) and `npm`
* **Java Development Kit (JDK 17+)**
* **Maven** (for building the Spring Boot backend)
* **Gemini API Key** (for AI assistant features)

### 1. Clone the Repository

```bash
git clone [https://github.com/Ramanathan77/Smart-expense-Tracker.git](https://github.com/Ramanathan77/Smart-expense-Tracker.git)
cd Smart-expense-Tracker

```

### 2. Configure Environment Variables

Ensure you configure your backend properties or environment files to include your Gemini API key for the AI assistant module to function correctly.

### 3. Run the Backend (Spring Boot)

Navigate to the backend directory and run the application using Maven:

```bash
cd backend
mvn spring-boot:run

```

### 4. Run the Frontend (React)

Open a new terminal window, navigate to the frontend directory, install dependencies, and start the development server:

```bash
cd spendora-frontend
npm install
npm start

```

---

## 🚢 Deployment

Detailed configurations for hosting and environment variables can be found in the [DEPLOYMENT.md](https://www.google.com/search?q=DEPLOYMENT.md) file. The frontend is optimized for deployment via platforms like Vercel.

---

## 📄 License

This project is open-source and available under the [MIT License](https://www.google.com/search?q=LICENSE).

```

```
