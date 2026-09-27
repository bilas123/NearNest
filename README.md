# NearNest — Hyperlocal Circular E-Commerce Marketplace

A college lab project built with the MERN stack (MongoDB, Express, React, Node.js). NearNest enables neighbors and students in a local community to buy, rent, resell, and donate items within walking distance.

---

## 🛠️ Tech Stack

- **Frontend:** React, Vite, Tailwind CSS, Lucide Icons
- **Backend:** Node.js, Express.js
- **Database:** MongoDB & Mongoose
- **Styling:** Tailwind CSS

---

## 🚀 How to Run the Project Locally (For Teammates)

### 1. Clone the Repository
```bash
git clone <repository-url>
cd Ecommerce_college
```

### 2. Backend Setup
1. Open a terminal and navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Install backend dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file inside the `backend` folder (copy from `.env.example`):
   ```bash
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   ```
4. Start the backend development server:
   ```bash
   node server.js
   ```
   Server will run on `http://localhost:5000` (Health check: `http://localhost:5000/api/health`).

### 3. Frontend Setup
1. Open a second terminal window and navigate to the frontend folder:
   ```bash
   cd frontend
   ```
2. Install frontend dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
4. Open the local URL shown in your terminal (usually `http://localhost:5173`) in your browser.

---

## 👥 Team
Built with ❤️ for College E-Commerce Lab.
