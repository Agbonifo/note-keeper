# 📝 Note Keeper Web App

A full-stack personal note-keeping and chat application built with **React**, **Node.js**, **Express**, **MongoDB**, and **Socket.IO**. The app supports user authentication, email verification and password reset via email link (Brevo), real-time chat messaging, and automated clean-up of expired tokens and inactive users.

---

## 🔧 Features

- 🔐 **User Authentication**
  - Create account, sign in, and logout
  - Password reset with secure email link via Brevo

- 🧠 **Note Management**
  - Create, edit, and delete personal notes
  - Auto-save and clean UI

- 💬 **Chat Functionality**
  - Real-time messaging with read/delivered indicators
  - Socket.IO integration
  - Message persistence with MongoDB
  - Auto-cleanup for messages exceeding 1000 entries

- 📧 **Email Service**
  - Integrated with Brevo SMTP for email verification and password resets
  - Secure token generation and expiration

- 🧹 **Cron Jobs**
  - Daily clean-up of:
    - Unverified users past email verification expiry
    - Expired password reset tokens

- 🎨 **Responsive UI**
  - Built with Material UI

---

## 🛠️ Tech Stack

| Frontend          | Backend          | Database | Others                   |
|-------------------|------------------|----------|--------------------------|
| React.js          | Node.js/Express  | MongoDB  | Socket.IO, Brevo, Cron   |
| React Router Dom  | JWT for Auth     | Mongoose | dotenv, nodemailer       |
| Vite              | Bcrypt           |          |                          |
| Material UI       |                  |          |                          |

---

## 🚀 Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/Agbonifo/note-keeper.git
cd note_keeper
```

### 2. Install dependencies

```bash
cd server
npm install

cd client
npm install
```

### 3. Configure environment variables

Create a `.env` file in the `server/` directory with the following:

```env
# General
PORT=3000
VITE_PORT=5173

# Frontend <-> Backend
VITE_API_URL=your_backend_url  # ✅ Your backend url
CLIENT_URL=yourfrontend_url     # ✅ GitHub Pages URL for CORS

# MongoDB
MONGO_URI=your_mongo_uri

# Auth Tokens
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_refresh_token_secret
JWT_EXPIRE=30d
COOKIE_EXPIRE=30d

# Email Config
EMAIL_HOST=smtp-relay.brevo.com
EMAIL_PORT=587
EMAIL_USERNAME=your_brevo_email
EMAIL_PASSWORD=your_brevo_password
EMAIL_FROM=Note Keeper App <noreply@agbonifo.notekeeperapp.com>

# Env Mode
NODE_ENV=production

# CORS Config
CORS_ORIGIN=your_frontend_url_origin

```

### 4. Start the app

```bash
# Start server
cd server
nodemon server.js or node server.js

# Start client
cd client
npm run dev
```

---

## 🔒 Security Notes

- Passwords are hashed using `bcrypt`.
- JWT tokens are securely signed and stored.
- Password reset tokens are hashed and expire automatically.
- Sensitive tokens are auto-cleared by scheduled cron jobs.

---

## 📬 Contact

Have feedback or want to contribute? Reach out via agbonifodaniel2@gmail.com or create an issue.

---

## 📄 License

MIT License – © 2025 Daniel Agbonifo

