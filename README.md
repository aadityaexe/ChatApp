
# 💬 ChatApp

A full-stack real-time chat application built with the **MERN** stack — **MongoDB**, **Express.js**, **React.js**, and **Node.js** — designed to deliver a fast, secure, and modern messaging experience. The app enables users to send and receive messages instantly, create groups, share images, and manage conversations. Powered by **Socket.IO**, it provides a responsive and dynamic messaging interface.

> 📌 WebRTC-based video calling is not yet implemented — planned for a future update.

---

## 📸 Preview

| Login Page               | Chat UI                  | Group Chat               |
| ------------------------ | ------------------------ | ------------------------ |
| *(Add screenshots here)* | *(Add screenshots here)* | *(Add screenshots here)* |

---

## ✨ Features

### ✅ Core Functionality

* 🔐 **User Authentication** using **JWT**
* 🔒 **Password hashing** with **Bcrypt**
* 💬 **Real-time Chat** using **Socket.IO**
* 👥 **Private and Group Chat**
* 📷 **Image Uploads** using **Multer**
* 📥 **Media Preview in Chat UI**
* 🕒 **Chat History** with MongoDB Persistence

### 📈 Upcoming Features

* 🎥 **Video/Voice Calling with WebRTC**
* 🛎️ **Push Notifications**
* 🔔 **Read Receipts and Typing Indicators**
* 📌 **Message Pinning, Editing, and Deletion**
* 🔎 **Chat Search Functionality**
* 🧪 **Unit & Integration Testing**

---

## 🧰 Tech Stack

| Layer              | Technologies                                                               |
| ------------------ | -------------------------------------------------------------------------- |
| **Frontend**       | React.js, Tailwind CSS, React Router, React Icons, Axios, Socket.IO-Client |
| **Backend**        | Node.js, Express.js, MongoDB, Mongoose, Multer, JWT, Bcrypt, Socket.IO     |
| **Database**       | MongoDB (NoSQL, document-oriented)                                         |
| **Authentication** | JWT (Access Token), Bcrypt (Password Hashing)                              |
| **Deployment**     | Render / Vercel *(setup instructions below)*                               |

---

## 🔧 Installation & Setup

### 📁 Step 1: Clone the Repository

```bash
git clone https://github.com/aadityaexe/ChatApp.git
cd ChatApp
```

---

### ⚙️ Step 2: Backend Setup

```bash
cd Backend
npm install
```

#### Create a `.env` file

```env
PORT=5000
MONGO_URI=your_mongo_connection_uri
JWT_SECRET=your_jwt_secret
```

#### Start Backend Server

```bash
npm run server
```

> The server will start at `http://localhost:5000`.

---

### 🖼️ Step 3: Frontend Setup

```bash
cd ../Frontend
npm install
```

#### Start Frontend

```bash
npm start
```

> The React app will run at `http://localhost:3000`.

---

## 📂 Project Structure

```
ChatApp/
├── Backend/
│   ├── config/         # DB connection
│   ├── controllers/    # Route logic
│   ├── middleware/     # Auth middlewares
│   ├── models/         # Mongoose models
│   ├── routes/         # API routes
│   ├── uploads/        # Uploaded media
│   └── server.js       # App entry point
├── Frontend/
│   ├── src/
│   │   ├── assets/     # Images, icons
│   │   ├── components/ # Reusable UI components
│   │   ├── context/    # User context
│   │   ├── pages/      # App pages (Login, Chat)
│   │   └── App.js      # App root
└── README.md
```

---

## 🔐 Authentication

* Passwords hashed with `bcrypt`
* JWT tokens issued on login and stored in localStorage
* Protected routes using middleware
* User context maintained globally in frontend

---

## 🔌 WebSocket Integration

Implemented using **Socket.IO** on both server and client:

* Join chat rooms
* Send/receive messages instantly
* Live updates for new messages
* Future scope for online indicators and typing notifications

---

## 📤 File Uploads

* Users can send and receive images (JPG, PNG, etc.)
* Uploaded images are stored in `Backend/uploads/`
* File preview shown inline in chat

---

## 📦 API Endpoints (Sample)

| Method | Endpoint             | Description                   |
| ------ | -------------------- | ----------------------------- |
| POST   | `/api/user/register` | Register a new user           |
| POST   | `/api/user/login`    | Login and receive JWT         |
| GET    | `/api/chat/:id`      | Fetch all messages for a chat |
| POST   | `/api/message/`      | Send a message                |
| POST   | `/api/chat/group`    | Create a new group chat       |

---

## 🌍 Deployment

### Option 1: Deploy on **Render** (Backend)

* Create a new Web Service on [Render](https://render.com/)
* Connect your GitHub repo
* Add environment variables from `.env`
* Set start command as:

```bash
npm run server
```

### Option 2: Deploy on **Vercel** (Frontend)

* Push the `Frontend` folder to a separate GitHub repo (or subtree split)
* Import it on [vercel.com](https://vercel.com/)
* Set build command: `npm run build`
* Set output directory: `build`

---

## 👨‍💻 Contribution Guide

Contributions are welcome! Follow these steps:

1. Fork this repo
2. Create a new branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m "Add your message"`
4. Push to your branch: `git push origin feature/your-feature`
5. Open a Pull Request 🚀

---

## 🙋‍♂️ Author

**Aditya Kumar**

* GitHub: [@aadityaexe](https://github.com/aadityaexe)
* LinkedIn: [*(Add your link)*](https://www.linkedin.com/in/aditya-kumar-1187a0265/)
* Twitter: [*(Optional)*](https://x.com/Aadityakumar_01)

---

## 📄 License

This project is licensed under the **MIT License**.

---

## 🌟 Show Your Support

If you like this project, please consider ⭐ starring the repo!

