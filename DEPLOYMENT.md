# Spendora Deployment Guide (Render, Vercel & Aiven MySQL)

Follow this guide step-by-step to host the Spendora fullstack application online for free.

---

## Step 1: Choose Your Database Hosting Option (Free)

Choose one of the two options below to configure your database:

### Option A: In-Memory H2 Database (Easiest, Zero Setup)
If you want to quickly test the live app online without creating a separate database account:
- You can **skip Step 1** entirely!
- The backend will automatically fall back to an in-memory H2 database.
- *Note: Any data added will reset if the Render backend container spins down (which happens after inactivity on Render's free tier).*

### Option B: Dedicated MySQL Database (via Aiven - Recommended for Persistence)
If you want your transactions and users to persist permanently for free:
1. Sign up for a free account at [Aiven.io](https://aiven.io).
2. Create a new service:
   - **Service Type:** MySQL
   - **Cloud Provider:** Select any free region (e.g., AWS or GCP free tier regions).
   - **Plan:** Free tier (1 CPU, 1 GB RAM, 5 GB storage).
3. Once the database is running, copy the database connection details from your Aiven Console:
   - **Host** (e.g., `mysql-xxxxx.aivencloud.com`)
   - **Port** (e.g., `12345`)
   - **User** (usually `avnadmin`)
   - **Password**
   - **Database Name** (default is `defaultdb` or you can create one named `spendora` in the Aiven Dashboard).

---

## Step 2: Deploy the Spring Boot Backend (via Render)

1. Sign up/log in at [Render.com](https://render.com).
2. Click **New +** and select **Web Service**.
3. Connect your GitHub repository (`Smart-expense-Tracker`).
4. Configure the Web Service details:
   - **Name:** `spendora-backend`
   - **Region:** Choose the region closest to you.
   - **Branch:** `main`
   - **Root Directory:** Edit this and set to `backend`.
   - **Runtime:** Select **Docker** (Recommended, since we added a `Dockerfile` to the repository) or **Java**.
     - **If using Docker:** You do not need to specify a build command or start command. Render will build using the `Dockerfile` automatically!
     - **If using Java:**
       - **Build Command:** `mvn clean package -DskipTests`
       - **Start Command:** `java -jar target/demo-0.0.1-SNAPSHOT.jar`
   - **Instance Type:** Free
5. Scroll down to the **Environment Variables** section and add the following keys:
   - **Required for all options**:
     - `GEMINI_API_KEY`: `<YOUR_GEMINI_API_KEY>` (needed for the AI Chat features to work online).
     - `JWT_SECRET`: A long secure custom string (e.g. `your_own_super_long_custom_cryptographic_secret_key_here`) for securing authentication tokens.
     - `ALLOWED_ORIGINS`: `https://your-spendora-frontend.vercel.app` (You will get this URL in the next step when you deploy to Vercel. You can update this on Render after deploying to Vercel).
   - **Additional Keys required ONLY if using Option B (Aiven MySQL)**:
     - `SPRING_DATASOURCE_URL`: `jdbc:mysql://<AIVEN_HOST>:<AIVEN_PORT>/<DATABASE_NAME>?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true`
     - `SPRING_DATASOURCE_USERNAME`: `<AIVEN_USER>`
     - `SPRING_DATASOURCE_PASSWORD`: `<AIVEN_PASSWORD>`
     - `SPRING_DATASOURCE_DRIVER_CLASS_NAME`: `com.mysql.cj.jdbc.Driver`
     - `SPRING_JPA_PROPERTIES_HIBERNATE_DIALECT`: `org.hibernate.dialect.MySQLDialect`
     - `SPRING_JPA_HIBERNATE_DDL_AUTO`: `update`
6. Click **Deploy Web Service**. Render will compile and start the Java Spring Boot service. Once deployed, note down your backend's `.onrender.com` URL (e.g., `https://spendora-backend.onrender.com`).

---

## Step 3: Deploy the React Frontend (via Vercel)

1. Sign up/log in at [Vercel.com](https://vercel.com).
2. Click **Add New** -> **Project**.
3. Connect the same GitHub repository (`Smart-expense-Tracker`).
4. Configure the project:
   - **Root Directory:** Edit this and select the `spendora-frontend` folder.
   - **Framework Preset:** Vite (automatically detected).
5. Open the **Environment Variables** accordion and add:
   - **Key:** `VITE_API_URL`
   - **Value:** `https://your-spendora-backend.onrender.com/api` (Replace with your actual Render URL).
6. Click **Deploy**. Vercel will build and launch your frontend. Once completed, you will receive a production deployment domain (e.g., `https://your-spendora-frontend.vercel.app`).
7. **Important:** Go back to your **Render Console** for the backend, edit the `ALLOWED_ORIGINS` environment variable, change it to your new Vercel frontend URL, and click save. Render will redeploy the backend with CORS access permitted for your frontend!

---

## Step 4: Link Your Deployed App on GitHub

Once both the frontend and backend are hosted, make it easy for visitors to check it out:

1. Go to your GitHub repository page (`Ramanathan77/Smart-expense-Tracker`).
2. Click the gear icon next to **About** (top right on the repository home page).
3. In the **Website** field, paste your Vercel frontend URL (e.g., `https://your-spendora-frontend.vercel.app`).
4. Add a short description (e.g., *"Premium Smart Expense Tracker built with Spring Boot, React, and Gemini AI"*).
5. Save the changes. The link will now appear at the top of your repository page for everyone to see!
