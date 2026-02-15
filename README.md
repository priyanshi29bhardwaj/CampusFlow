# 🚀 CampusFlow  
### Smart Campus Event & Venue Management System  

CampusFlow is a full-stack web application designed to streamline university club event management, venue booking, approval workflows, and student registrations.

It eliminates manual paperwork, prevents scheduling conflicts, and introduces a centralized digital system for efficient campus coordination.

---

## 🎯 Problem Statement

Universities face challenges managing multiple clubs, events, and venue bookings. Manual approvals, email-based coordination, and spreadsheet tracking lead to:

- Scheduling conflicts  
- Poor communication  
- Slow approvals  
- Inefficient resource utilization  

---

## 💡 Existing System

- Manual approval through emails, Google Forms, and physical paperwork  
- Decentralized communication between clubs and administration  
- No automated venue clash detection  
- No real-time booking updates  

---

## ✨ Innovation

CampusFlow introduces:

- Automated venue clash detection to prevent scheduling conflicts in real time  
- Centralized admin approval dashboard for faster and transparent decision-making  
- Role-based access control (Student / Club Owner / Admin)  
- Real-time booking status updates  
- Digital proposal management eliminating paperwork  
- Integrated analytics and notifications for better coordination  

---

## 🏗️ System Architecture

### 🔹 Backend
- Node.js
- Express.js
- PostgreSQL
- JWT Authentication
- Role-Based Access Control
- Nodemailer (Email Notifications)

### 🔹 Frontend
- Next.js (React)
- TailwindCSS
- Dashboard UI
- Admin Panel
- Booking Forms
- Analytics Page

---

## 🔐 User Roles

### 👨‍🎓 Student
- View events
- Register for events
- Make payments
- Receive email confirmation

### 👩‍💼 Club Owner
- Create events
- View registrations
- Book venues
- Track booking status
- Receive admin approval updates

### 🏢 Admin
- Approve / Reject venue booking requests
- Add remarks
- Monitor analytics
- Manage system operations

---

## 🔥 Core Features

### 🎟️ Event Management
- Event creation with capacity limit
- Poster URL support
- Registration fee support
- Payment tracking
- View event registrations

### 🏟️ Venue Booking System
- Real-time clash detection
- Capacity validation
- Booking request system
- Approval workflow (Pending / Approved / Rejected)
- Admin remarks support

### 📧 Email Notifications
- Registration confirmation email
- Venue approval/rejection email
- Payment confirmation email

### 📊 Analytics Dashboard
- Booking statistics
- Event participation metrics
- System performance insights

---

## 📸 Screenshots

### 🏟️ Venue Booking
<img width="2934" height="1642" alt="image" src="https://github.com/user-attachments/assets/9f2b6888-bf3e-4484-8f75-4e74111a6093" />
<img width="1880" height="1116" alt="image" src="https://github.com/user-attachments/assets/dcd6e1be-4a00-46f3-8325-ba2abdcb1d5f" />

### 🧾 Admin Manage Booking Requests
<img width="2892" height="1598" alt="image" src="https://github.com/user-attachments/assets/dfdfae28-8c4b-4664-9eee-4737d6d43b86" />

### 👥 View Event Registrations
<img width="2754" height="978" alt="image" src="https://github.com/user-attachments/assets/f3843f34-f54c-4cb6-9e26-a3221f2b4b4c" />

### 📧 Email Confirmation
<img width="1284" height="2778" alt="image" src="https://github.com/user-attachments/assets/ae93ae26-0e7c-42a3-af7a-73d65dd5ee2e" />

### 📊 Analytics Dashboard
<img width="2940" height="1912" alt="image" src="https://github.com/user-attachments/assets/4c0e282b-6194-4e56-8592-4fcb85fc8b8a" />
<img width="2940" height="1912" alt="image" src="https://github.com/user-attachments/assets/5b58c2b5-ffdd-49d1-b4fc-4d66f709df9d" />


---

## ⚙️ Installation Guide

### 1️⃣ Clone Repository
```bash
git clone https://github.com/priyanshi29bhardwaj/CampusFlow.git
cd CampusFlow
```

### 2️⃣ Backend Setup
```bash
cd campusflow-backend
npm install
```

Create `.env` file:

```
DATABASE_URL=postgresql://username:password@localhost:5432/campusflow
JWT_SECRET=your_secret_key
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

Run backend:

```
npm run dev
```

---

### 3️⃣ Frontend Setup
```bash
cd codefin
npm install
npm run dev
```

Open:

```
http://localhost:3000
```

---

## 🗂️ Database Structure (Core Tables)

- users
- clubs
- events
- event_registrations
- venues
- venue_bookings

---

## 🎓 Academic Details

**Project Name:** CampusFlow  
**Course:** B.Tech CSE  
**University:** Manipal University Jaipur  
**Guide:** Girish Sharma  
**Developer:** Priyanshi Bhardwaj  
**Enrollment ID:** 23FE10CSE00229  

---

## 🚀 Future Improvements

- QR Code check-in system  
- Live booking calendar visualization  
- Automated report generation  
- Deployment on cloud (Vercel + Render)  
- SMS notification integration  

---

## 📌 GitHub Repository

🔗 https://github.com/priyanshi29bhardwaj/CampusFlow

---

## 📜 License

This project is developed for academic purposes under Manipal University Jaipur.

---

✨ CampusFlow — Making Campus Event Management Smart & Seamless.

