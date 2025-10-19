# Pharm - Full Stack Pharmacy Application

## 📁 Project Structure

```
Pharm/
├── backend/                 # Backend Server (Express.js + SQLite)
│   ├── server.js           # Main server file
│   ├── test-backend.js     # Backend tests
│   ├── package.json        # Backend dependencies
│   ├── firebase-config.js  # Firebase configuration
│   ├── firebase-adminsdk.json # Firebase service account
│   ├── categories-api.js   # Categories API
│   ├── products.json      # Product data
│   ├── data.sqlite        # SQLite database
│   ├── .env               # Environment variables
│   ├── .env.example       # Environment variables template
│   └── node_modules/      # Backend dependencies
│
├── frontend/               # Frontend (HTML/CSS/JS)
│   ├── index.html         # Main homepage
│   ├── login.html         # User login
│   ├── register.html      # User registration
│   ├── cart.html          # Shopping cart
│   ├── checkout.html      # Checkout page
│   ├── admin-login.html   # Admin login
│   ├── admin-dashboard.html # Admin dashboard
│   ├── admin-edit.html    # Admin edit products
│   ├── super-admin.html   # Super admin panel
│   ├── style.css          # Main stylesheet
│   ├── user-menu.css      # User menu styles
│   ├── App.js             # Main frontend JS
│   ├── super-admin.js     # Super admin JS
│   ├── user-menu.js       # User menu JS
│   ├── package.json       # Frontend dependencies
│   ├── assets/            # Static assets
│   │   └── uploads/       # Product images
│   └── translations/      # Multi-language support
│       ├── en.json        # English
│       ├── hi.json        # Hindi
│       ├── bn.json        # Bengali
│       ├── mr.json        # Marathi
│       ├── ta.json        # Tamil
│       └── te.json        # Telugu
│
├── package.json            # Root package.json (workspace management)
├── start-and-test.ps1     # PowerShell startup script
├── README.md              # This file
└── docs/                  # Documentation files
    ├── SETUP-GUIDE.md
    ├── FEATURES-COMPLETED.md
    └── ...
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm

### Installation

1. **Install all dependencies:**
   ```bash
   npm run install:all
   ```

2. **Or install separately:**
   ```bash
   # Backend only
   npm run install:backend
   
   # Frontend only  
   npm run install:frontend
   ```

### Running the Application

#### Option 1: Run Both (Recommended)
```bash
# Development mode (with hot reload)
npm run dev

# Production mode
npm start
```

#### Option 2: Run Separately
```bash
# Backend only (runs on port 3000)
npm run start:backend

# Frontend only (serves static files on port 3001)
npm run start:frontend
```

#### Option 3: PowerShell Script (Windows)
```powershell
.\start-and-test.ps1
```

## 🌐 Application URLs

- **Homepage**: http://localhost:3000
- **Admin Login**: http://localhost:3000/admin-login.html
- **Admin Dashboard**: http://localhost:3000/admin-dashboard.html
- **Super Admin**: http://localhost:3000/super-admin.html

## 🔑 Default Credentials

- **Admin Password**: `admin123`
- **Super Admin**: Configure via environment variables

## 📝 Available Scripts

### Root Level
- `npm run install:all` - Install all dependencies
- `npm start` - Start both frontend and backend
- `npm run dev` - Start both in development mode
- `npm run start:backend` - Start backend only
- `npm run start:frontend` - Start frontend only
- `npm run test:backend` - Run backend tests

### Backend (cd backend)
- `npm start` - Start Express server
- `npm run dev` - Start with nodemon (auto-restart)
- `npm test` - Run backend tests

### Frontend (cd frontend)
- `npm start` - Serve static files
- `npm run dev` - Serve in development mode

## 🔧 Configuration

### Backend Environment Variables
Create `backend/.env` file:
```env
PORT=3000
JWT_SECRET=your-super-secret-jwt-key
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_secret
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

### Firebase Configuration
Place your Firebase service account key in `backend/firebase-adminsdk.json`

## 📦 Tech Stack

### Backend
- **Express.js** - Web framework
- **SQLite** - Database
- **Firebase Admin** - Authentication & Storage
- **Razorpay** - Payment processing
- **Nodemailer** - Email notifications
- **bcryptjs** - Password hashing
- **JWT** - Authentication tokens

### Frontend
- **HTML5/CSS3** - Structure & Styling
- **Vanilla JavaScript** - Interactivity
- **Responsive Design** - Mobile-friendly
- **Multi-language Support** - i18n

## 🎯 Features

✅ **User Management**
- User registration/login
- Profile management
- Order history

✅ **Product Management**
- Product catalog
- Categories
- Search & filtering
- Admin product CRUD

✅ **Shopping Cart**
- Add/remove items
- Quantity management
- Checkout process

✅ **Payment Integration**
- Razorpay integration
- Payment verification
- Order confirmation

✅ **Admin Panel**
- Product management
- Order management
- User management
- Dashboard analytics

✅ **Multi-language Support**
- English, Hindi, Bengali, Marathi, Tamil, Telugu

✅ **Additional Features**
- Prescription upload
- Doctor on call
- Ambulance service
- Order tracking

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- CORS protection
- Input validation
- File upload security

## 📱 Mobile Responsive

The application is fully responsive and works on:
- Desktop browsers
- Tablets
- Mobile devices

## 🐛 Development

### Backend Development
```bash
cd backend
npm run dev  # Starts with nodemon for auto-restart
```

### Frontend Development
Since it's static HTML/CSS/JS, any changes are reflected immediately.

### Testing
```bash
npm run test:backend  # Run backend tests
```

## 📖 Documentation

Detailed documentation available in:
- `SETUP-GUIDE.md` - Complete setup instructions
- `FEATURES-COMPLETED.md` - Feature checklist
- `ADMIN-CHECKLIST.md` - Admin functionality
- `API-DOCUMENTATION.md` - API endpoints

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details