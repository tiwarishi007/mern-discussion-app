# DiscussHub — MERN Discussion Platform

A full-stack discussion platform where users can post problems, browse discussions, comment, and mark issues as solved.

## 🚀 Tech Stack

- **Frontend:** React 19, React Router v7, Vite, Axios
- **Backend:** Node.js, Express 5, Mongoose
- **Database:** MongoDB
- **Auth:** JWT (stored in HTTP-only cookies)
- **Styling:** Inline React styles (no extra CSS framework needed)

---

## 📁 Project Structure

```
mern-discussion-app/
├── client/               # React frontend (Vite)
│   └── src/
│       ├── context/      # AuthContext (global auth state)
│       ├── components/   # Navbar, Footer, LeftPart, RightPart, etc.
│       ├── pages/        # Home, Login, Signup, Dashboard, Profile, Settings
│       └── utils/        # Axios instance
└── server/               # Express backend
    └── src/
        ├── config/       # DB connection, env config
        ├── controllers/  # auth, discussion, profile
        ├── middleware/   # JWT auth middleware
        ├── models/       # User, Problem (with comments)
        ├── routes/       # auth, discussion, profile routes
        └── utils/        # generateToken
```

---

## ⚙️ Setup & Installation

### Prerequisites
- Node.js v18+
- MongoDB (local or Atlas)

---

### 1. Clone the repo

```bash
git clone https://github.com/YOUR_USERNAME/mern-discussion-app.git
cd mern-discussion-app
```

---

### 2. Backend Setup

```bash
cd server
npm install
```

Create your `.env` file:

```bash
cp .env.example .env
```

Edit `.env`:

```env
PORT=9999
MONGO_URI=mongodb://127.0.0.1:27017/discussion-app
SECRET_KEY=your_strong_random_secret_key
```

Start the server:

```bash
npm run dev        # development (nodemon)
npm start          # production
```

Server runs at: `http://localhost:9999`

---

### 3. Frontend Setup

```bash
cd client
npm install
npm run dev
```

Client runs at: `http://localhost:5173`

---

## 🔌 API Endpoints

### Auth — `/api/auth`
| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | `/register` | ❌ | Register new user |
| POST | `/login` | ❌ | Login |
| POST | `/logout` | ❌ | Logout (clears cookie) |
| GET | `/check` | ✅ | Verify auth token |

### Discussion — `/api/discussion`
| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| GET | `/getProblem` | ❌ | Get all discussions |
| POST | `/createProblem` | ✅ | Create new discussion |
| DELETE | `/delete/:id` | ✅ | Delete your discussion |
| PATCH | `/solve/:id` | ✅ | Toggle solved status |
| POST | `/addComment/:id` | ✅ | Add a comment |

### Profile — `/api`
| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| GET | `/profile` | ✅ | Get user profile + problems |
| PUT | `/profile/update-password` | ✅ | Change password |

---

## ✨ Features

- **Authentication** — Register, login, logout with JWT cookies
- **Private Routes** — Dashboard, Profile, Settings require login
- **Global Auth State** — `AuthContext` avoids redundant API calls
- **Discussions** — Create, browse, and delete your own problems
- **Comments** — Add comments to any discussion (logged in users)
- **Solved Status** — Problem owners can mark discussions as solved/open
- **Search & Filter** — Search by keyword, filter by All / Open / Solved
- **Profile Page** — Shows stats (posts, solved, comments received) + all your discussions
- **Settings Page** — View account info, change password, sign out, danger zone
- **Responsive Navbar** — Shows correct links based on auth state

---

## 🛡️ Security Notes

- Passwords hashed with `bcryptjs` (10 salt rounds)
- JWT stored in HTTP-only cookie (not accessible via JS)
- Protected routes verify token on every request
- Delete and solve endpoints verify ownership before acting

---

## 🌱 Environment Variables

| Variable | Description |
|----------|-------------|
| `PORT` | Server port (default: 9999) |
| `MONGO_URI` | MongoDB connection string |
| `SECRET_KEY` | JWT signing secret (keep this strong & private) |

---

## 📦 Deployment Tips

- Add `NODE_ENV=production` to your server env
- Use MongoDB Atlas for cloud database
- Deploy server to Railway / Render / Heroku
- Deploy client to Vercel / Netlify (set `VITE_API_URL` if needed)
- Update CORS origin in `server/src/app.js` to your production frontend URL

---

## 📄 License

MIT — free to use and modify.
