# 🚀 Complete Setup Guide - Pharmida Healthcare

## ✅ What's New (Just Added!)

### 1. **User Authentication System** 🔐
- User registration with password encryption
- Secure login with JWT tokens
- Session management
- Password hashing with bcrypt

### 2. **Payment Gateway Integration** 💳
- Razorpay integration (Cards/UPI/Net Banking)
- Cash on Delivery (COD) option
- Payment verification
- Transaction history

### 3. **Email Notifications** 📧
- Welcome emails on registration
- Order confirmation emails
- Prescription upload confirmations
- Customizable email templates

---

## 📦 Installation

### Step 1: Install Dependencies
```powershell
npm install
```

**New packages installed:**
- `razorpay` - Payment gateway
- `bcryptjs` - Password hashing
- `jsonwebtoken` - JWT authentication
- `nodemailer` - Email sending

---

## 🔧 Configuration

### Step 2: Setup Environment Variables

1. **Copy the example file:**
```powershell
copy .env.example .env
```

2. **Edit `.env` file with your credentials:**

```env
# Server
PORT=3000
ADMIN_PASSWORD=your-secure-admin-password

# JWT Secret (Change this!)
JWT_SECRET=change-this-to-random-long-string-in-production

# Razorpay Keys
RAZORPAY_KEY_ID=rzp_test_your_key_id
RAZORPAY_KEY_SECRET=your_key_secret

# Gmail SMTP
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-gmail-app-password
```

---

## 🔑 Getting API Keys

### Razorpay Setup (For Payments)

1. **Sign up at Razorpay:**
   - Visit: https://razorpay.com
   - Click "Sign Up" (Free for testing)

2. **Get Test Keys:**
   - Dashboard > Settings > API Keys
   - Click "Generate Test Keys"
   - Copy `Key ID` and `Key Secret`

3. **Add to `.env`:**
   ```env
   RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxx
   RAZORPAY_KEY_SECRET=your_secret_key
   ```

4. **Test Mode:**
   - Use test cards provided by Razorpay
   - No real money charged
   - Card: 4111 1111 1111 1111
   - CVV: Any 3 digits
   - Expiry: Any future date

---

### Gmail SMTP Setup (For Emails)

#### Method 1: App Password (Recommended)

1. **Enable 2-Step Verification:**
   - Go to: https://myaccount.google.com/security
   - Enable "2-Step Verification"

2. **Create App Password:**
   - Visit: https://myaccount.google.com/apppasswords
   - Select app: "Mail"
   - Select device: "Other" (name it "Pharmida")
   - Click "Generate"
   - Copy the 16-character password

3. **Add to `.env`:**
   ```env
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=abcd efgh ijkl mnop
   ```

#### Method 2: Less Secure Apps (Not Recommended)

1. Enable "Less secure app access" in Gmail settings
2. Use your regular Gmail password

**Note:** Gmail may block less secure apps. Use App Password instead.

---

## 🎯 Running the Server

### Step 3: Start Server

```powershell
npm start
```

**You should see:**
```
Server listening on http://localhost:3000
✅ User Authentication: Enabled
✅ Payment Gateway: Razorpay
✅ Email Notifications: Configured

⚠️  Remember to set environment variables:
   - RAZORPAY_KEY_ID
   - RAZORPAY_KEY_SECRET
   - EMAIL_USER
   - EMAIL_PASS
   - JWT_SECRET
```

---

## 🧪 Testing

### Test User Authentication:

1. **Register:**
   - Visit: http://localhost:3000/register.html
   - Create account with email & password
   - Check welcome email

2. **Login:**
   - Visit: http://localhost:3000/login.html
   - Login with credentials
   - Redirects to homepage

### Test Payment Gateway:

1. **Add items to cart**
2. **Go to checkout**
3. **Select payment method:**
   - **Razorpay:** Opens payment modal
   - **COD:** Direct order placement

4. **Test Razorpay Payment:**
   - Use test card: `4111 1111 1111 1111`
   - CVV: `123`
   - Expiry: Any future date
   - Payment succeeds → Order placed

### Test Email Notifications:

1. **Register new user** → Welcome email sent
2. **Place order** → Order confirmation email sent

---

## 📁 New Files Created

```
├── register.html              # User registration page
├── login.html                 # User login page
├── payment.html               # Payment gateway page
├── payment-success.html       # Payment success page
├── .env.example               # Environment variables template
├── .gitignore                 # Git ignore rules
└── SETUP-GUIDE.md            # This file
```

---

## 🗄️ New Database Tables

```sql
-- Users table
CREATE TABLE users (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  password TEXT NOT NULL,  -- Hashed with bcrypt
  createdAt TEXT
);

-- Payments table
CREATE TABLE payments (
  id INTEGER PRIMARY KEY,
  orderId INTEGER,
  razorpayOrderId TEXT,
  razorpayPaymentId TEXT,
  amount REAL,
  status TEXT,
  method TEXT,  -- 'razorpay' or 'cod'
  createdAt TEXT
);
```

---

## 🔒 Security Features

### Password Security:
- ✅ Passwords hashed with bcrypt (10 rounds)
- ✅ Never stored in plain text
- ✅ Secure comparison

### JWT Authentication:
- ✅ Tokens expire in 7 days
- ✅ HttpOnly cookies
- ✅ Secure secret key

### Payment Security:
- ✅ Signature verification
- ✅ HTTPS required in production
- ✅ PCI DSS compliant (via Razorpay)

### Email Security:
- ✅ App passwords (not regular password)
- ✅ Encrypted connection (TLS)
- ✅ No sensitive data in emails

---

## 🚀 API Endpoints (New)

### User Authentication:

```
POST /api/user/register
Body: { name, email, phone, password }
Response: { ok: true, user }

POST /api/user/login
Body: { email, password }
Response: { ok: true, user, token }

POST /api/user/logout
Response: { ok: true }

GET /api/user/me
Response: { ok: true, user }
```

### Payment:

```
POST /api/payment/create-order
Body: { amount, cartId }
Response: { ok: true, orderId, key, amount, currency }

POST /api/payment/verify
Body: { razorpay_order_id, razorpay_payment_id, razorpay_signature, cartId }
Response: { ok: true, orderId, paymentId }

GET /api/payments (Admin only)
Response: { ok: true, payments[] }
```

---

## 📊 Statistics (Updated)

```
Total APIs: 29 (+6 new)
Database Tables: 10 (+2 new)
Frontend Pages: 16 (+3 new)
Security Features: 12 (+6 new)

NEW Features:
✅ User Registration & Login
✅ JWT Authentication
✅ Password Encryption
✅ Razorpay Payment Gateway
✅ COD Payment Option
✅ Email Notifications
✅ Payment Verification
✅ Transaction History
```

---

## ⚙️ Production Deployment

### Before Going Live:

1. **Change all secrets:**
   ```env
   JWT_SECRET=<generate-random-64-char-string>
   ADMIN_PASSWORD=<strong-password>
   ```

2. **Use live Razorpay keys:**
   - Get from Dashboard > Settings > API Keys
   - Switch to "Live Mode"
   - Update `.env`

3. **Enable HTTPS:**
   - Use SSL certificate
   - Redirect HTTP to HTTPS

4. **Database backup:**
   - Schedule regular backups
   - Use cloud storage

5. **Environment variables:**
   - Set on hosting platform
   - Don't commit `.env` to git

---

## 🐛 Troubleshooting

### Payment Not Working?

1. **Check Razorpay keys:**
   ```powershell
   # Verify in .env file
   notepad .env
   ```

2. **Test mode enabled:**
   - Use test keys for testing
   - Use live keys for production

3. **Check browser console:**
   - F12 > Console tab
   - Look for errors

### Emails Not Sending?

1. **Check Gmail settings:**
   - 2-Step Verification enabled?
   - App Password generated?

2. **Check credentials:**
   ```powershell
   notepad .env
   # Verify EMAIL_USER and EMAIL_PASS
   ```

3. **Test email manually:**
   ```javascript
   // In server console
   sendEmail('test@example.com', 'Test', '<p>Test email</p>')
   ```

### Login Not Working?

1. **Check JWT_SECRET in `.env`**
2. **Clear browser cookies**
3. **Try incognito mode**
4. **Check server console for errors**

---

## 📞 Support

### Documentation:
- `README-COMPLETE.md` - Full documentation
- `QUICK-START.md` - Quick start guide
- `ADMIN-CHECKLIST.md` - Admin management
- `FEATURES-COMPLETED.md` - Feature list
- `FUTURE-ENHANCEMENTS.md` - Upcoming features

### Test APIs:
```powershell
npm test
```

### Check Logs:
- Server console (PowerShell window)
- Browser console (F12)

---

## ✅ Verification Checklist

Before considering setup complete:

- [ ] Dependencies installed (`npm install`)
- [ ] `.env` file created and configured
- [ ] Razorpay test keys added
- [ ] Gmail SMTP configured
- [ ] Server starts without errors
- [ ] User registration works
- [ ] User login works
- [ ] Payment gateway opens
- [ ] Test payment succeeds
- [ ] Email received (welcome/order)
- [ ] Admin dashboard accessible
- [ ] All features tested

---

## 🎉 You're All Set!

Your complete pharmacy e-commerce platform is ready with:
- ✅ User authentication
- ✅ Payment gateway (Razorpay + COD)
- ✅ Email notifications
- ✅ Order management
- ✅ Prescription uploads
- ✅ Ambulance booking
- ✅ Doctor appointments
- ✅ Admin dashboard

**Happy managing!** 💪🚀

For questions or issues, check the documentation files or server logs.
