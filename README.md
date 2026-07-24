# ⭐ Rating System - Full Stack Web Application

A full-stack web application that allows users to submit ratings for registered stores.  
The system supports multiple user roles with different functionalities based on their access level.

This project was developed as part of the **Full Stack Intern Coding Challenge**.

---

# 🚀 Tech Stack

## Frontend
- React.js
- HTML
- CSS

## Backend
- NestJS

## Database
- MySQL

---

# 👥 User Roles

The application supports three types of users:

## 1. System Administrator

Features:
- Login to admin dashboard
- View total users, stores and ratings
- Add new users, stores and administrators
- View user and store listings
- Filter users and stores
- View user details
- Manage platform data

---

## 2. Normal User

Features:
- User registration and login
- View all registered stores
- Search stores by name and address
- Submit ratings from 1 to 5
- Modify submitted ratings
- Update password
- Logout

---

## 3. Store Owner

Features:
- Login to store dashboard
- View ratings received for their store
- View users who submitted ratings
- View average store rating
- Update password
- Logout

---

# 📁 Project Structure
Rating_System/

│
├── Backend/
│ ├── src/
│ │ ├── admin/
│ │ ├── user/
│ │ ├── store/
│ │ ├── database.ts
│ │ ├── app.module.ts
│ │ └── main.ts
│ │
│ └── package.json
│
├── frontend/
│ ├── src/
│ │ ├── pages/
│ │ │ ├── Login.js
│ │ │ ├── AdminDashboard.js
│ │ │ ├── NormalUserDashboard.js
│ │ │ └── StoreUserDashboard.js
│ │ │
│ │ ├── services/
│ │ │ └── api.js
│ │ │
│ │ └── App.js
│ │
│ └── package.json
│
└── README.md


Backend Setup

Navigate to backend:

cd Backend

Install dependencies:

npm install

Configure MySQL database connection.

Start backend server:

npm run start

Backend will run on:

http://localhost:3000
Frontend Setup

Open another terminal:

cd frontend

Install dependencies:

npm install

Start React application:

npm start

Frontend will run on:

http://localhost:3000
