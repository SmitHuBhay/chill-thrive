# Chill Thrive - Premium Wellness Platform

A production-ready Full Stack Web Application built for wellness therapy bookings. This project features a robust MVC architecture, role-based authentication (User/Admin), a dynamic Content Management System (CMS), and a booking management system with discount logic.

## 🚀 Features

### Public & User Features
* **Authentication:** Secure Login & Registration (Hashed passwords).
* **Booking System:** Users can book Ice Baths, Saunas, etc., and view their **Booking History**.
* **Dynamic Content:** Blogs and Services are fetched dynamically from the database.
* **Discount Logic:** "Sale" badges and price calculations appear automatically when discounts are active.
* **Feedback System:** Users can leave ratings and reviews.

### Admin Dashboard (CMS)
* **Secure Access:** Protected route (`/admin`) requiring separate authentication.
* **Service Management:** Create, Edit, Delete services. Set prices and **Percentage Discounts** that auto-calculate.
* **Booking Management:** Approve or Cancel customer booking requests.
* **Blog Management:** Write and publish articles for the "Awareness" page.
* **Site Configuration:** Edit the website's Hero Text, Founder's Story, and Contact Info directly from the dashboard without touching code.

## 🛠 Tech Stack

* **Backend:** Node.js, Express.js
* **Database:** MongoDB, Mongoose (ODM)
* **Frontend:** EJS (Templating), TailwindCSS (Styling)
* **Auth & Security:** bcryptjs, express-session, dotenv
* **Utilities:** method-override (for PUT/DELETE requests), express-ejs-layouts

---

## ⚙️ Installation & Setup

Follow these steps to get the project running on your local machine.

### 1. Prerequisites
* [Node.js](https://nodejs.org/) installed.
* [MongoDB](https://www.mongodb.com/try/download/community) installed and running locally.

### 2. Clone & Install
```bash
# Navigate to project folder
cd chill-thrive

# Install dependencies
npm install
# for temporary data
npm run seed
# for running the website
npm run dev

### 3. Environment Configuration (.env)
Create a file named `.env` in the root directory and populate it with your specific credentials:

```env
PORT=3007
MONGO_URI=mongodb://127.0.0.1:27017/chillThrive
SESSION_SECRET=your_random_secret_string_here
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your_app_specific_password_here
