# 💬 Chattee - Realtime Chat Application

## 🚀 Overview

**Chattee** is a full-stack realtime chat application that enables users to communicate instantly, featuring functionalities similar to modern messaging platforms like Messenger or Discord.

The application is built with a scalable architecture using **Node.js, Socket.IO, React + Vite, and Cloudinary for media storage**, ensuring high performance and smooth realtime interactions. The backend is deployed on **Render**, while the frontend is hosted on **Vercel**, providing reliable and fast global access.

---

## ✨ Features

### 🔐 Authentication

* Register & Login with JWT
* Secure password hashing using bcrypt

---

### 💬 Messaging

* Realtime messaging with Socket.IO
* Direct (1-1) and Group conversations
* Message grouping (similar to Messenger)
* Message status: `delivered` / `seen`
* Emoji support 😊
* Infinite scroll (load older messages)

---

### 👥 Social Features

* 🔍 Search users
* 🤝 Send friend requests
* ✅ Accept friend requests
* ❌ Reject friend requests
* 📃 Manage friend list

---

### 👨‍👩‍👧 Group Features

* Create group conversations
* Support multiple participants
* Realtime updates for all members

---

### 🟢 Presence System

* Realtime online/offline status

---

### 📩 Notifications

* Unread message count per conversation

---

### 👤 User Profile

* Update profile (name, avatar, etc.)
* Display user information in conversations

---

### 🖼 Media Upload (Cloudinary)

* Upload and manage avatar images
* Store image URLs in database
* Fast delivery via CDN
* Optimized image loading


---

## 🏗️ Tech Stack

### 🖥 Backend (Server)

* **Node.js + Express**
* **MongoDB + Mongoose**
* **Socket.IO (Realtime)**
* **JWT Authentication**
* **bcrypt (password hashing)**
* **Cloudinary (image storge)**

---

### 🌐 Frontend (Client)

* **React 19**
* **Zustand (State Management)**
* **Axios**
* **Socket.IO Client**
* **TailwindCSS + shadcn**
* **React Hook Form + Zod (Form validation)**
* **Emoji Mart (Emoji picker)**

---

### 🌐 Deployment 

* **Backend -> Render**
* **Frontend -> Vercel**


---

## 📁 Project Structure (Simplified)

```
chattee/
│
├── backend/
│   ├── src/
│        ├── models/
|        ├── controllers/
|        ├── middlewares/
│        ├── routes/
│        ├── socket/
|        ├── configs/
|        ├── utils/
│        └── server.js
│
├── frontend/
│   ├── public/
│   ├── src/ 
│       ├── pages/
│       ├── hooks/
|       ├── components/
|       ├── libs/
|       ├── services/
|       ├── stores/
|       ├── types/
|       ├── App.tsx/
│       └── main.tsx
```

---

## 🧠 Architecture Overview

```text
Client (React + Zustand)
        │
        │ REST API (Axios)
        ▼
Backend (Express + MongoDB)
        │
        │ Realtime Events
        ▼
Socket.IO Server
```

---

## 🔄 Realtime Flow

1. User sends a message
2. Backend saves message to database
3. Server emits `"new-message"` via Socket.IO
4. Clients in the conversation receive the event
5. UI updates instantly (chat window + sidebar)

---


## ⚙️ Installation & Setup

### 1️⃣ Clone repository

```bash
git clone https://github.com/your-username/chattee.git
cd chattee
```

---

### 2️⃣ Setup Backend

```bash
cd backend
npm install
```

Create `.env` file:

```env
PORT=5001
DATABASE_CONNECTION_STRING=your_mongodb_uri
ACCESS_TOKEN_SECRET=your_secret
ACCESS_TOKEN_TTL=your_expires
REFRESH_TOKEN_TTL=your_expires
CLIENT_URL=http://localhost:5173
CLOUDINARY_CLOUD_NAME = your_cloudinary_cloud_name
CLOUDINARY_API_KEY = your_cloudinary_api_key
CLOUDINARY_API_SECRET = your_cloudinary_api_secret
MAIL_USER = your_mail_user
MAIL_PASSWORD = your_mail_password
```

Run server:

```bash
npm run dev
```

---

### 3️⃣ Setup Frontend

```bash
cd frontend
npm install
```
Create `.env.development` and `.env.production`  file:

`.env.development`
```env.devlopment
VITE_API_URL = your_api_url
VITE_SOCKET_URL = your_socket_url
```

`.env.production`
```env.production
VITE_API_URL = your_api_url
VITE_SOCKET_URL = your_socket_url
```
Run server:

```bash
npm run dev
```
---

## 📌 Key Concepts

* **Zustand store** for global state (messages, conversations, socket)
* **Room-based Socket.IO** (each conversation = 1 room)
* **Message grouping logic** (same sender + time window)
* **Pagination with cursor** for messages

---

## 🚧 Future Improvements

* ✍️ Typing indicator
* 👀 Seen by (avatars)
* 📎 File upload (images, videos)
* 🔔 Notifications
* 🌐 Deployment (Docker, CI/CD)

---

## 👨‍💻 Author

**Chien**

---

## ⭐️ License

This project is for learning and personal development purposes.
