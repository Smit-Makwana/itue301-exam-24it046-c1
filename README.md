# 🎟️ EventHub — Ticket Booking System

> **ITUE301 Advanced Web Development Frameworks — Set F**
> Roll No: 24IT046 | Batch: C1 | AY 2026–27

---

## 📋 Project Overview

EventHub is a full-stack ticket booking platform built with:
- **Frontend**: React (Vite) + React Router + Axios
- **Backend**: Node.js + Express.js
- **Database**: MongoDB + Mongoose

---

## 🗂️ Project Structure

```
itue301-exam-24it046-c1/
├── backend/
│   ├── config/db.js          # MongoDB connection
│   ├── controllers/          # Business logic
│   │   ├── authController.js
│   │   ├── eventController.js
│   │   └── ticketController.js
│   ├── middleware/
│   │   └── authMiddleware.js  # JWT protect middleware
│   ├── models/
│   │   ├── User.js            # Mongoose User schema
│   │   ├── Event.js           # Mongoose Event schema
│   │   └── Ticket.js          # Mongoose Ticket schema
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── eventRoutes.js
│   │   └── ticketRoutes.js
│   ├── .env.example
│   ├── package.json
│   └── server.js              # Entry point
├── frontend/
│   ├── src/
│   │   ├── api/axios.js       # Axios instance with interceptors
│   │   ├── components/        # Navbar, EventCard, ProtectedRoute
│   │   ├── context/           # AuthContext (React Context)
│   │   ├── pages/             # All page components
│   │   ├── App.jsx            # Router setup
│   │   ├── main.jsx
│   │   └── index.css          # Global design system
│   ├── .env.example
│   └── package.json
├── .env.example
├── .gitignore
└── README.md
```

---

## 🚀 Setup & Run Instructions

### Prerequisites
- Node.js v18+
- MongoDB Atlas account (or local MongoDB)

### 1. Clone the repository
```bash
git clone https://github.com/Smit-Makwana/itue301-exam-24it046-c1.git
cd itue301-exam-24it046-c1
```

### 2. Backend Setup
```bash
cd backend
cp .env.example .env
# Edit .env with your MongoDB URI
npm install
npm start
# Server starts on http://localhost:5000
```

### 3. Frontend Setup
```bash
cd frontend
cp .env.example .env
npm install
npm run dev
# App starts on http://localhost:5173
```

---

## 🔌 API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/auth/register` | Register new user |
| POST | `/api/v1/auth/login` | Login user |
| GET | `/api/v1/auth/profile` | Get current user (🔒) |

### Events
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/events` | Get all events |
| GET | `/api/v1/events/:id` | Get single event |
| POST | `/api/v1/events` | Create event (🔒) |
| PUT | `/api/v1/events/:id` | Update event (🔒) |
| DELETE | `/api/v1/events/:id` | Delete event (🔒) |

### Tickets
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/tickets` | Book ticket (🔒) |
| GET | `/api/v1/tickets/my` | Get my tickets (🔒) |
| DELETE | `/api/v1/tickets/:id` | Cancel ticket (🔒) |

🔒 = Requires `Authorization: Bearer <token>` header

---

## 🗄️ MongoDB Setup

1. Go to [MongoDB Atlas](https://cloud.mongodb.com)
2. Create a free cluster
3. Create a database user
4. Whitelist your IP (or use `0.0.0.0/0`)
5. Copy the connection string into `backend/.env`:
   ```
   MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/eventhub
   ```

---

## ✅ Task Coverage

| Task | Description | Status |
|------|-------------|--------|
| Task 1 | React UI: Events listing page with event cards | ✅ |
| Task 2 | React State & Props: EventCard component + search/filter | ✅ |
| Task 3 | Backend API: Express routes for events & tickets | ✅ |
| Task 4 | MongoDB/Mongoose: User, Event, Ticket schemas with validation | ✅ |
| Task 5 | Full Integration: JWT auth + ticket booking with populate | ✅ |

---

## 🧪 Validation Demonstration

The API returns meaningful error (not raw Mongoose error) when:
- Booking more tickets than available → `400: Not enough seats available. Only X seat(s) left.`
- Registering with existing email → `400: User already exists with this email`
- Missing required fields → `400: [Validation message]`

---

*Built by Smit Makwana (24IT046) · CSPIT, CHARUSAT · ITUE301 Exam 2026*