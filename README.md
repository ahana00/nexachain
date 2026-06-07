# Nexachain AI – MERN Investment & Referral Platform

Complete solution for the **MERN Stack Developer Technical Assessment**.

## 📦 Stack
- **MongoDB** + Mongoose
- **Express.js** REST API
- **Node.js** with JWT auth, bcrypt, node-cron
- **React (Vite)** dashboard with Recharts + Axios + React Router

---

## 🗂 Project Structure
```
nexachain/
├── backend/
│   ├── config/db.js
│   ├── models/        # User, Investment, Referral, RoiHistory
│   ├── controllers/   # auth, investment, dashboard, referral
│   ├── routes/        # /api/auth /api/investments /api/dashboard /api/referrals
│   ├── middleware/    # auth.js (JWT)
│   ├── services/      # roiService.js, referralService.js
│   ├── jobs/          # roiCron.js (node-cron, idempotent)
│   ├── utils/         # generateReferralCode.js
│   ├── server.js
│   └── .env.example
└── frontend/
    ├── src/
    │   ├── api/axios.js
    │   ├── context/AuthContext.jsx
    │   ├── components/  (Sidebar, Card, ReferralTree, ProtectedRoute)
    │   ├── pages/       (Login, Register, Dashboard, Investments, Roi, Referrals)
    │   └── App.jsx
    └── package.json
```

---

## ⚙️ Setup

### Backend
```bash
cd backend
npm install
cp .env.example .env       # fill MONGO_URI + JWT_SECRET
npm run dev                # nodemon server.js  → http://localhost:5000
```

### Frontend
```bash
cd frontend
npm install
npm run dev                # vite → http://localhost:5173
```

### Environment Variables (`backend/.env`)
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/nexachain
JWT_SECRET=supersecretkey
JWT_EXPIRES=7d
LEVEL_PERCENTAGES=10,5,3,2,1   # % per referral level
```

---

## 🔌 API Documentation

Base URL: `http://localhost:5000/api`
Auth: `Authorization: Bearer <token>`

### Auth
| Method | Endpoint | Body |
|---|---|---|
| POST | `/auth/register` | `{ fullName, email, mobile, password, referralCode? }` |
| POST | `/auth/login` | `{ email, password }` |

**Sample register response**
```json
{
  "token": "eyJhbGciOi...",
  "user": { "_id": "...", "fullName": "John", "referralCode": "JOHN9X2A", "walletBalance": 0 }
}
```

### Investment
| Method | Endpoint | Body |
|---|---|---|
| POST | `/investments` | `{ amount, planName, durationDays, dailyRoiPercent }` |
| GET  | `/investments` | – |

### Dashboard
| Method | Endpoint |
|---|---|
| GET | `/dashboard` → `{ totalInvestments, totalRoiEarned, totalLevelIncome, walletBalance }` |

### Referrals
| Method | Endpoint |
|---|---|
| GET | `/referrals/direct` |
| GET | `/referrals/tree`   (nested up to 5 levels) |
| GET | `/referrals/income` |

---

## 🧠 Business Logic

### Daily ROI (`services/roiService.js`)
For each active investment:
`roiAmount = investment.amount * dailyRoiPercent / 100`
- Insert into `RoiHistory` with **unique index** `(investmentId, dateKey)` → idempotent.
- `$inc` user's `walletBalance` and `totalRoiEarned`.
- Mark investment `Completed` when `endDate` reached.

### Level / Referral Income (`services/referralService.js`)
- Triggered after each ROI credit (or new investment, configurable).
- Walks `referredBy` chain up to 5 levels using `LEVEL_PERCENTAGES`.
- Inserts `Referral` records and `$inc`s upline `walletBalance` + `totalLevelIncome`.

### Cron (`jobs/roiCron.js`)
```js
cron.schedule('0 0 * * *', runDailyRoi);   // 12:00 AM daily
```
Idempotency is enforced **at the DB layer** via a compound unique index, so even concurrent runs cannot double-credit.

---

## 🧪 Postman Collection
A ready-to-import collection lives at `backend/postman_collection.json`.

---

## 📋 Assumptions
1. Referral tree depth capped at **5 levels**.
2. Level percentages configurable via env (`LEVEL_PERCENTAGES`).
3. ROI is credited only for investments where `status = Active` and `today <= endDate`.
4. Wallet is internal balance only (no withdrawal logic in scope).
5. Passwords hashed with bcrypt (10 rounds).
6. JWT lifetime 7 days.

---

## ✅ Evaluation Checklist
- [x] Mongoose models with proper refs + indexes
- [x] JWT-secured REST API
- [x] Daily ROI + multi-level referral business logic
- [x] React dashboard with cards, tables, recharts, nested referral tree
- [x] node-cron scheduler with idempotency safeguard
- [x] README + Postman collection
