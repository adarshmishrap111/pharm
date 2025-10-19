# 🚀 Pharmida Backend API

Complete Node.js backend for Pharmida Healthcare Platform with authentication, payment processing, and prescription management.

## ✨ Features

- 🔐 **Admin Authentication** - JWT-based secure login
- 💊 **Product Management** - CRUD operations for medicines
- 📋 **Prescription System** - Upload, scan, and approve prescriptions
- 💳 **Payment Gateway** - Razorpay integration
- 📧 **Email Notifications** - Order confirmations and updates
- 🗄️ **SQLite Database** - Local data storage
- 📱 **RESTful APIs** - Clean and documented endpoints
- 🔄 **CORS Enabled** - Frontend integration ready

## 🛠️ Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** SQLite3
- **Authentication:** JWT
- **File Upload:** Multer
- **Payment:** Razorpay
- **Email:** Nodemailer
- **Environment:** dotenv

## 🚀 Quick Start

### Installation
```bash
npm install
```

### Environment Setup
Create `.env` file:
```env
NODE_ENV=development
PORT=3000
JWT_SECRET=your-jwt-secret-key
RAZORPAY_KEY_ID=your-razorpay-key
RAZORPAY_KEY_SECRET=your-razorpay-secret
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-email-password
DB_PATH=./data.sqlite
```

### Start Server
```bash
npm start
```

Server runs on: http://localhost:3000

## 📋 API Endpoints

### Authentication
- `POST /api/admin/login` - Admin login
- `GET /api/admin/verify` - Verify admin token
- `POST /api/admin/logout` - Admin logout

### Products
- `GET /api/products` - Get all products
- `POST /api/products` - Create new product (Admin only)
- `PUT /api/products/:id` - Update product (Admin only)
- `DELETE /api/products/:id` - Delete product (Admin only)

### Prescriptions
- `GET /api/prescriptions` - Get all prescriptions (Admin only)
- `POST /api/prescriptions/upload` - Upload prescription
- `PUT /api/prescriptions/:id/approve` - Approve prescription (Admin only)

### Orders
- `GET /api/orders` - Get all orders (Admin only)
- `POST /api/orders` - Create new order
- `PUT /api/orders/:id/status` - Update order status (Admin only)

### Payments
- `POST /api/payment/create` - Create Razorpay order
- `POST /api/payment/verify` - Verify payment

## 🗂️ Project Structure

```
backend/
├── server.js              # Main server file
├── package.json           # Dependencies
├── .env.example          # Environment template
├── data.sqlite           # SQLite database
├── categories-api.js     # Product categories
├── test-backend.js       # API testing
└── uploads/              # File uploads directory
```

## 🔧 Configuration

### Database Schema
SQLite tables auto-created on startup:
- `products` - Medicine inventory
- `prescriptions` - Uploaded prescriptions
- `orders` - Customer orders
- `users` - User accounts
- `admins` - Admin accounts

### Admin Credentials
Default admin login:
- **Username:** admin
- **Password:** admin123

## 📊 Features Details

### Product Management
- Add/Edit/Delete medicines
- Image upload support
- Category management
- Price and discount handling
- Stock management

### Prescription System
- File upload (PDF, images)
- Admin approval workflow
- Status tracking
- Email notifications

### Payment Processing
- Razorpay integration
- Order creation
- Payment verification
- Transaction logging

### Security
- JWT authentication
- Admin-only routes protection
- Input validation
- File upload security
- CORS configuration

## 🚀 Deployment

### Render.com
```bash
npm install
npm start
```

### Railway.app
```bash
npm install
npm start
```

### Environment Variables (Production)
Set these in your hosting platform:
- `NODE_ENV=production`
- `JWT_SECRET=strong-secret-key`
- `RAZORPAY_KEY_ID=rzp_live_xxxxx`
- `RAZORPAY_KEY_SECRET=xxxxx`
- `EMAIL_USER=notifications@yourdomain.com`
- `EMAIL_PASS=app-specific-password`

## 🧪 Testing

Run backend tests:
```bash
node test-backend.js
```

Test all endpoints:
```bash
npm test
```

## 📝 API Documentation

### Example Requests

#### Create Product
```bash
curl -X POST http://localhost:3000/api/products \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "productName=Paracetamol" \
  -F "price=50" \
  -F "description=Pain reliever" \
  -F "productImage=@image.jpg"
```

#### Upload Prescription
```bash
curl -X POST http://localhost:3000/api/prescriptions/upload \
  -F "prescription=@prescription.pdf" \
  -F "patientName=John Doe" \
  -F "contactNumber=9876543210"
```

## 🔐 Security Features

- JWT token authentication
- Admin route protection
- File upload validation
- SQL injection prevention
- XSS protection
- Rate limiting ready

## 📧 Email Notifications

Automatic emails for:
- Order confirmations
- Prescription approvals
- Order status updates
- Payment confirmations

## 🌐 CORS Configuration

Frontend domains allowed:
- localhost (development)
- Your production domain
- Configurable via environment

## ⚠️ Important Notes

1. **Firebase Admin SDK** - Optional, remove if not needed
2. **Email Configuration** - Use app-specific passwords
3. **Database** - SQLite for development, consider PostgreSQL for production
4. **File Uploads** - Stored locally, consider cloud storage for production
5. **Environment Variables** - Never commit `.env` file

## 🆘 Troubleshooting

### Common Issues

1. **Port already in use**
   ```bash
   taskkill /F /PID [process-id]
   ```

2. **Database locked**
   ```bash
   rm data.sqlite
   npm start
   ```

3. **JWT secret missing**
   - Check `.env` file
   - Set `JWT_SECRET` variable

## 📄 License

MIT License - Feel free to use for commercial projects.

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request

---

**🎉 Ready for production deployment!**

For support: [Create an issue](https://github.com/adarshmishrap111/Pharmida-backend/issues)