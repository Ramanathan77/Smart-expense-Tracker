# 🌟 Spendora: Premium Smart Expense Tracker

**An Enterprise-Grade Full-Stack Application natively written in React.js and Java Spring Boot.**

Spendora elegantly solves personal finance tracking with dynamic visual analytics and deep insights, built over a robust Spring Boot + MySQL foundation!

## 📦 Project Architecture
This project is distinctly split down the middle with an isolated microservice topology.

### 1. `spendora-frontend/` (The View Layer)
Vite-powered React application leveraging cutting-edge UI paradigms.
- **Glassmorphism:** Translates heavy financial data into a clean, floating dashboard structure.
- **Responsive:** Fluidly reorganizes UI across desktops down to an intuitive mobile bottom-navigation.
- **Visuals:** Integrates `recharts` for 60fps dynamic pie-chart generation and SVG metric scaling.
- **Network:** Communicates uniquely to the `api` endpoints via authenticated `Bearer` JWT tokens embedded via `api.js` interceptors.

### 2. `src/main/java/com/example/demo` (The Business Layer)
The backbone of the application running on **Java 21 Spring Boot**, replacing the obsolete Node.js layer. 
- **Spring Data JPA (`repository/`)**: Automates high-speed querying directly into XAMPP MySQL dynamically using heavily typed entities (`User.java`, `Transaction.java`).
- **Spring Security (`security/`)**: Hardened stateless JWT protection mechanism. `JwtFilter` processes and signs cryptographic `HS512` payload hashes blocking unauthorized API pings immediately.
- **RESTful Endpoints (`controller/`)**: Completely mirrors the required JSON schema formats (Login, Register, Dashboard, Search, Bulk Upload).
- **Auto-Seeder (`components/DatabaseSeeder`)**: Implements `CommandLineRunner` to immediately verify and populate a rich demo account layout upon every boot.

## 🛠 Features Matrix
- **Data Protection:** BCrypt salted Hash encryption ensures zero raw-password leaks in the DBMS.
- **Multi-wallet Architecture:** Route your transactions distinctly among Cash, Bank Accounts, or Credit Cards.
- **Data Analytics:** "Budget vs Actual" visualizers intuitively guide users across customized thresholds dynamically generated locally!
- **Instant CSV Parsing:** Instantly construct massive expense logs via Bulk mapping API controllers!
- **Granular Log Search:** Trim hundreds of transactions instantly down to targeted date ranges via native Javascript epoch comparisons.

## 💻 Running the Project
**Requirements:** Java 17+, Maven (`mvnw`), Node.js, and an active local MySQL (e.g., XAMPP on 3306).

**Step 1. Database:** Create a blank schema `spendora`.
**Step 2. Backend:** Run `.\mvnw spring-boot:run` from the root layer. It will map to Port 8081.
**Step 3. Frontend:** Navigate inside `spendora-frontend/` and run `npm run dev`. Navigate your web browser to `http://localhost:5173`.
