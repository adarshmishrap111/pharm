# Pharmida Healthcare - Complete E-commerce Platform

## 🏥 Overview
Pharmida Healthcare is a full-stack e-commerce pharmacy platform with admin dashboard, prescription management, ambulance booking, and doctor consultation features.

## 🚀 Features

### Customer Features:
- 🛒 **Product Browsing & Shopping Cart**
- 💳 **Checkout System**
- 👤 **User Profile Management**
- 📤 **Prescription Upload**
- 🤖 **AI Prescription Scanning**
- 🚑 **Emergency Ambulance Booking**
- 👨‍⚕️ **Doctor Appointment Booking**

### Admin Features:
- 📊 **Complete Admin Dashboard**
- 📦 **Product Management (Add/Edit/Delete)**
- 📋 **Order Management**
- 👥 **User Profile Viewing**
- 💊 **Prescription Review & Status Updates**
- 🚑 **Ambulance Request Management**
- 🩺 **Doctor Appointment Management**

## 📁 Project Structure
```
Pharm/
├── server.js              # Backend server
├── package.json           # Dependencies
├── data.sqlite           # SQLite database
├── index.html            # Homepage
├── cart.html             # Shopping cart
├── checkout.html         # Checkout page
├── profile.html          # User profile
├── upload-prescription.html    # Prescription upload
├── scan-prescription.html      # AI prescription scanner
├── call-ambulance.html         # Ambulance booking
├── doctor-on-call.html         # Doctor appointments
├── admin-login.html            # Admin login
├── admin.html                  # Product management
├── admin-dashboard.html        # Complete admin dashboard
├── admin-edit.html            # Product editing
├── product-upload.html        # Product upload form
└── style.css                  # Styles
```

## 🛠️ Installation & Setup

### Requirements:
- Node.js 14+ and npm

### Quick Start (PowerShell):

```powershell
cd "C:\Users\Admin\OneDrive\Desktop\Pharm"
npm install
npm start
```

The server will run on **http://localhost:3000**

### Default Admin Credentials:
- **Password:** `admin123`
- Change via environment variable: `ADMIN_PASSWORD=your_password`

## 📡 API Endpoints

### Products
- `GET /api/products` - List all products
- `POST /api/products` - Add product (Admin only)
- `PUT /api/products/:id` - Update product (Admin only)
- `DELETE /api/products/:id` - Delete product (Admin only)

### Cart & Orders
- `POST /api/cart` - Save cart
- `GET /api/cart/:id` - Get cart
- `POST /api/checkout` - Place order
- `GET /api/orders` - Get all orders (Admin only)

### User Profiles
- `POST /api/profile` - Create/Update profile
- `GET /api/profile/:email` - Get profile by email
- `GET /api/profiles` - Get all profiles (Admin only)

### Prescriptions
- `POST /api/prescriptions` - Upload prescription
- `POST /api/prescriptions/scan` - AI scan prescription
- `GET /api/prescriptions` - Get all prescriptions (Admin only)
- `PUT /api/prescriptions/:id` - Update prescription status (Admin only)

### Ambulance Requests
- `POST /api/ambulance` - Request ambulance
- `GET /api/ambulance` - Get all requests (Admin only)
- `PUT /api/ambulance/:id` - Update request status (Admin only)

### Doctor Appointments
- `POST /api/doctor` - Book appointment
- `GET /api/doctor` - Get all appointments (Admin only)
- `PUT /api/doctor/:id` - Update appointment status (Admin only)

### Admin Authentication
- `POST /api/login` - Admin login
- `POST /api/logout` - Admin logout
- `GET /api/session` - Check session

## 🎯 How to Use

### For Customers:
1. Visit **http://localhost:3000**
2. Browse products and add to cart
3. Upload prescriptions or use AI scanner
4. Book ambulance/doctor if needed
5. Checkout and place orders

### For Admin:
1. Visit **http://localhost:3000/admin-login.html**
2. Login with password: `admin123`
3. Manage products at `/admin.html`
4. View complete dashboard at `/admin-dashboard.html`
5. Monitor orders, prescriptions, appointments, etc.

## 📊 Database Tables
- **products** - Product catalog
- **orders** - Customer orders
- **carts** - Shopping carts
- **profiles** - User profiles
- **prescriptions** - Uploaded prescriptions
- **ambulance_requests** - Ambulance bookings
- **doctor_appointments** - Doctor consultations
- **sessions** - Admin sessions

## 🔒 Security Features
- Admin authentication with HttpOnly cookies
- Rate limiting on login endpoint
- File upload validation (size & type)
- Session expiry management
- Input sanitization

## 📱 Contact
- **Email:** support@pharmidahealthcare.com
- **Phone:** 7304022366, 7900082808

## 👨‍💻 Developer
Developed by **Saurabh Mishra**

## 📝 License
MIT License

---

**Note:** This is a complete backend system. All frontend forms are connected to backend APIs and data is stored in SQLite database. Use the admin dashboard to manage everything!
