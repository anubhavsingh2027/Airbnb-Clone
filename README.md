# 🏡 Airbnb Clone

A functional **Airbnb-style property rental platform** built with full-stack web technologies.
It includes account management, property listings, booking system, and a responsive user interface — all designed to mimic the core Airbnb user experience.

---

## 🔗 Live Demo

https://airbnb-clone-1u1y.onrender.com/

### 🖼️ Preview

<p align="center">
  <img src="https://todo-app-jade-six-65.vercel.app/airbnbImg.png" alt="Airbnb Clone Preview" width="800" />
</p>

---

## ✨ Key Features

| Feature | Description |
|--------|-------------|
| 🔐 **User Authentication** | Secure sign up, login, and session-based authentication |
| 🏠 **Property Listings** | Add, edit, and manage stays with images & amenities |
| 🔎 **Search & Filters** | Search by location, guests, pricing, and more |
| 📅 **Booking System** | Book stays, track reservations, and avoid overlaps |
| ⭐ **Ratings & Reviews** | Guests can leave feedback for stays |
| 📱 **Responsive UI** | Fully usable on desktop and mobile devices |

---

## 🛠️ Tech Stack

| Layer | Technologies Used |
|------|-------------------|
| **Frontend** | HTML, CSS, JavaScript |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB (Atlas) |
| **Authentication** | Session-based Auth |
| **Media Storage** | Cloud storage via MongoDB Atlas |
| **Deployment** | Render |

---

## 📂 Project Structure

Airbnb-Clone/
├─ public/ # Static frontend assets (HTML, CSS, JS)
├─ views/ # UI templates
├─ models/ # MongoDB models
├─ routes/ # App routes
├─ controllers/ # Logic / server functions
├─ config/ # DB & session config
├─ server.js # Server entry point
└─ README.md

yaml
Copy code

---

## 🚀 Running the Project Locally

```bash
# Clone the repository
git clone <repo-url>
cd airbnb-clone

# Install dependencies
npm install

# Set up environment variables (.env)
MONGO_URL=your_database_url
SESSION_SECRET=your_secret_key

# Start the server
npm start
Server runs at:

arduino
Copy code
http://localhost:3000
🎯 Purpose of the Project
Practice full-stack application development

Understand real-world booking & scheduling logic

Learn data modeling and authentication patterns

Improve UI/UX and component interaction

📌 Future Enhancements
🧭 Map-based location view (Leaflet / Mapbox integration)

🧾 Payment gateway integration

✉️ Email notifications for bookings