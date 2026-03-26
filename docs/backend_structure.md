# Backend (Spring Boot) Structure

This document explains what every Java file in the `src/main/java/com/example/demo/` directory does.

## 1. Application Entry Point
- **`DemoApplication.java`**: The main starting point of the application. It boots up the entire Spring Boot server and embedded Tomcat.

## 2. Controllers (`controller/`)
Controllers handle incoming HTTP API requests from the frontend and send back responses.
- **`AuthController.java`**: Handles `/api/auth/login` and `/api/auth/signup` requests for user authentication.
- **`TransactionController.java`**: Handles creating, reading, updating, and deleting income and expense transactions.
- **`InsightController.java`**: Handles fetching summarized data for the analytics/charts page on the frontend.

## 3. Entities (`entity/`)
Entities map Java classes directly to tables in your MySQL database.
- **`User.java`**: Defines the "users" table structure (id, email, password, etc.).
- **`Transaction.java`**: Defines the "transactions" table structure (amount, category, date, etc.).

## 4. Repositories (`repository/`)
Repositories act as the bridge between the Entities and the Database. They provide built-in methods like `save()`, `findAll()`, and `findById()` without writing raw SQL.
- **`UserRepository.java`**: To query and save users to the database.
- **`TransactionRepository.java`**: To query and save transactions to the database.

## 5. Security (`security/`)
Classes responsible for protecting the APIs and ensuring only logged-in users can access their data.
- **`SecurityConfig.java`**: Sets the global rules for who can access what (e.g., login API is public, /api/transactions requires authentication).
- **`JwtUtil.java`**: Generates and checks the validity of JWT (JSON Web Tokens) which are like digital ID cards given to users upon logging in.
- **`JwtFilter.java`**: Intercepts every single API call to verify if the user's JWT token is valid before letting the request pass.
- **`CustomUserDetailsService.java`**: Helper class that fetches a user's details from the database during the login process to verify their password.

## 6. Components (`components/`)
- **`DatabaseSeeder.java`**: Automatically populates the database with some initial sample data or admin users when you first run the app.
