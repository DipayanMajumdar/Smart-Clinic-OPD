# 🏥 Smart Clinic OPD

**The Future of Smart Healthcare**

Smart Clinic OPD is a modern, full-stack web application designed to digitize the outpatient department (OPD) experience. It eliminates physical overcrowding by allowing patients to book tokens remotely and track their queue status in real-time, while providing doctors and staff with efficient management tools.

## 🎥 Project Demo
[![Watch the Video](https://img.youtube.com/vi/AYKn1Gob09M/maxresdefault.jpg)](https://youtu.be/AYKn1Gob09M)

> *Click the image above to watch the full walkthrough.*

---
## 🚀 The Problem It Solves

Traditional clinics suffer from chaotic waiting rooms, lack of transparency, and manual paperwork.
* **For Patients:** Eliminates long wait times and risk of infection from overcrowding.
* **For Doctors:** Streamlines patient management and enables instant E-Prescriptions.
* **For Administration:** Provides a synchronized ecosystem for reception, doctors, and waiting areas.

## ✨ Key Features

### 📱 Patient Portal
* **Remote Booking:** Patients can generate a token from home without an app download.
* **Live Queue Tracker:** Real-time updates on "Now Serving" and estimated wait time.
* **Responsive Design:** Optimized for mobile experience.

### 🩺 Doctor Dashboard
* **One-Click Calling:** Instantly updates the queue and waiting room display.
* **E-Prescription Pad:** Keyboard-first interface to generate and print prescriptions quickly.
* **Queue Management:** Mark patients as "Skipped" or recall them later.

### 📺 Live Waiting Room TV
* **Auto-Refreshing Display:** Polls the server every 5 seconds for real-time status.
* **Visual Hierarchy:** Large, high-contrast display for the clinic lobby.
* **Missed Patient Alert:** Displays list of skipped patients to reduce disputes.

### 🖥️ Admin & Reception
* **Secure Login:** Protected dashboard for hospital staff.
* **Walk-in Registration:** Fast data entry for patients arriving physically.
* **Central Control:** Quick access to all hospital modules.

## 🛠️ Tech Stack

* **Frontend:** HTML5, CSS3 (Custom Glassmorphism), JavaScript (Vanilla)
* **Backend:** Node.js, Express.js
* **Database:** MongoDB (Atlas) & Mongoose
* **Tools:** SweetAlert2 (UI Alerts), FontAwesome (Icons)

## ⚙️ Installation & Setup

Follow these steps to run the project locally.

### 1. Clone the Repository
```bash
git clone [https://github.com/your-username/smart-clinic-opd.git](https://github.com/your-username/smart-clinic-opd.git)
cd smart-clinic-opd

```

### 2. Install Dependencies

```bash
npm install

```

### 3. Configure Environment Variables

Create a `.env` file in the root directory and add your credentials:

```env
PORT=3000
MONGO_URI=your_mongodb_connection_string
ADMIN_USER=admin
ADMIN_PASS=12345

```

### 4. Run the Server

```bash
npm run dev

```

The server will start at `http://localhost:3000`.

## 📖 Usage Guide

1. **Home Page:** Visit `http://localhost:3000` to see the landing page.
2. **Patient Booking:** Go to the "Patient Portal" to book a test token.
3. **Staff Access:** Click "Staff Login" and use the credentials set in your `.env` file.
4. **Doctor View:** From the Admin Dashboard, open "Doctor's Cabin" to manage the queue.
5. **Live Display:** Open "Waiting Room TV" on a separate screen/tab to simulate the hospital display.

## 📂 Project Structure

```
smart-clinic-opd/
├── models/             # Mongoose Database Schemas
├── public/             # Static Frontend Files
│   ├── css/            # Modular Styles (landing.css, style.css)
│   ├── js/             # Client-side Logic
│   ├── images/         # Assets
│   └── *.html          # HTML Views
├── .env                # Environment Variables (Not uploaded)
├── server.js           # Main Express Server
└── package.json        # Dependencies & Scripts

```

## 🤝 Contributing

Contributions are welcome! Please fork the repository and create a pull request for any feature enhancements or bug fixes.

## 📄 License

This project is licensed under the **MIT License**.
