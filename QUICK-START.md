# 🚀 Pharmida Healthcare - Quick Start Guide

## Step 1: Install Dependencies

```powershell
npm install
```

## Step 2: Start Server

```powershell
npm start
```

Server chalu ho jayegi on **http://localhost:3000**

## Step 3: Access Website

### Customer Side:
- **Homepage:** http://localhost:3000
- **Cart:** http://localhost:3000/cart.html
- **Profile:** http://localhost:3000/profile.html
- **Upload Prescription:** http://localhost:3000/upload-prescription.html
- **AI Scan:** http://localhost:3000/scan-prescription.html
- **Ambulance:** http://localhost:3000/call-ambulance.html
- **Doctor:** http://localhost:3000/doctor-on-call.html

### Admin Side:
- **Login:** http://localhost:3000/admin-login.html
  - Password: `admin123`
- **Product Manager:** http://localhost:3000/admin.html
- **Dashboard:** http://localhost:3000/admin-dashboard.html

## Step 4: Test Backend APIs

```powershell
node test-backend.js
```

## 📊 Admin Dashboard Features

Login karke aap yeh sab dekh aur manage kar sakte ho:

1. **Orders** - Saare customer orders
2. **User Profiles** - User details
3. **Prescriptions** - Uploaded prescriptions with AI scan results
4. **Ambulance Requests** - Emergency calls tracking
5. **Doctor Appointments** - Consultation bookings
6. **Products** - Add/Edit/Delete products

## 🎯 Admin Tasks

### Product Add Karna:
1. Admin login karo
2. Admin panel me jao
3. Form fill karo (Name, Price, Image, Description)
4. Submit karo
5. Product homepage pe dikhega

### Data Manage Karna:
1. Dashboard open karo: `/admin-dashboard.html`
2. Tabs switch karke data dekho
3. Status update karo (Complete/Pending)
4. Real-time data refresh hota hai

## 🗃️ Database Location

All data SQLite me store hota hai:
- **File:** `data.sqlite`
- **Location:** Project root folder

## 🔧 Troubleshooting

### Server nahi chal rahi?
```powershell
# Port 3000 already use me ho sakta hai
# Check running processes
netstat -ano | findstr :3000

# Ya phir .env file me PORT change karo
```

### Database error aa raha?
```powershell
# Delete old database and restart
del data.sqlite
npm start
```

### Admin login nahi ho raha?
- Default password: `admin123`
- Clear browser cookies
- Try incognito mode

## 📱 Test Kaise Kare?

### 1. Customer Flow:
- Homepage pe products dekho
- Add to cart karo
- Checkout karo
- Profile banao
- Prescription upload karo

### 2. Admin Flow:
- Login karo
- Dashboard check karo
- Products add karo
- Orders dekho
- Prescriptions approve karo

## 🎉 Ho Gaya!

Ab aapka complete e-commerce pharmacy platform ready hai! 

Koi problem aaye to:
1. Console check karo (browser + server)
2. Network tab me API calls dekho
3. Database file check karo

---

**Happy Managing!** 💪
