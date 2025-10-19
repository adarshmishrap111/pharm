# 📋 Admin Checklist - Data Management Guide

## 🔐 Login Process
- [ ] Open: http://localhost:3000/admin-login.html
- [ ] Enter password: `admin123`
- [ ] Click "Sign in"
- [ ] Redirects to admin panel

---

## 📦 Product Management

### From `/admin.html`:
- [ ] **Add New Product**
  - Fill: Name, Price, Image, Description, Discount
  - Click "Add Product"
  - Product appears on homepage instantly

- [ ] **Edit Product**
  - Click "Edit" button on any product
  - Redirects to `/admin-edit.html?id=X`
  - Change details and save
  - Updates everywhere automatically

- [ ] **Delete Product**
  - Click "Delete" button
  - Confirms and removes product
  - Homepage updates instantly

---

## 📊 Dashboard Overview (`/admin-dashboard.html`)

### Statistics Cards (Top):
- [ ] **Total Orders** - Count of all orders placed
- [ ] **Total Prescriptions** - Uploaded prescriptions count
- [ ] **Total Ambulance** - Emergency requests count
- [ ] **Total Doctor** - Appointment bookings count

---

## 📑 Tab-wise Management

### 1️⃣ Orders Tab
**View all customer orders:**
- [ ] Order ID
- [ ] Cart ID
- [ ] Total amount (₹)
- [ ] Number of items
- [ ] Order date & time

**Actions:**
- View order details
- No status update needed (auto-completed)

---

### 2️⃣ User Profiles Tab
**View customer information:**
- [ ] Profile ID
- [ ] Customer name
- [ ] Email address
- [ ] Phone number
- [ ] Full address
- [ ] Registration date

**Use Case:**
- Contact customers
- Verify addresses
- Customer support

---

### 3️⃣ Prescriptions Tab
**Manage prescription uploads:**
- [ ] Prescription ID
- [ ] File link (click to view)
- [ ] Status badge (pending/completed/scanned)
- [ ] Notes (customer/AI data)
- [ ] Upload date

**Actions:**
- [ ] Click "View File" to see prescription
- [ ] Click "Complete" to mark as processed
- [ ] Check AI scan results in notes

**Workflow:**
1. Customer uploads prescription
2. You review the file
3. Mark as "completed" after verification
4. Customer gets notification (future feature)

---

### 4️⃣ Ambulance Requests Tab
**Track emergency bookings:**
- [ ] Request ID
- [ ] Patient name
- [ ] Contact phone
- [ ] Emergency address
- [ ] Emergency type (heart attack/accident/etc)
- [ ] Status (pending/completed)
- [ ] Request time

**Actions:**
- [ ] Click "Complete" after ambulance dispatched
- [ ] Call the phone number for confirmation
- [ ] Update status for tracking

**Priority:**
🚨 **Handle these ASAP - Life-threatening emergencies!**

---

### 5️⃣ Doctor Appointments Tab
**Manage consultations:**
- [ ] Appointment ID
- [ ] Patient name
- [ ] Contact phone
- [ ] Health issue/symptoms
- [ ] Preferred time slot
- [ ] Status (pending/completed)
- [ ] Booking time

**Actions:**
- [ ] Call patient at preferred time
- [ ] Mark "Complete" after consultation
- [ ] Follow up if needed

---

## ⚡ Quick Actions

### Daily Tasks:
1. [ ] Check ambulance requests (highest priority)
2. [ ] Review new prescriptions
3. [ ] Confirm doctor appointments
4. [ ] Process pending orders
5. [ ] Reply to customer profiles if needed

### Weekly Tasks:
1. [ ] Add new products
2. [ ] Update product prices/discounts
3. [ ] Remove out-of-stock items
4. [ ] Review total statistics

---

## 🔄 Auto-Refresh
- Dashboard refreshes **every 30 seconds**
- No need to manually reload
- Real-time data updates

---

## 📞 When to Call Customers?

### Emergency (Call Immediately):
- 🚑 **Ambulance requests** - Within 2 minutes
- 🚨 **Critical health issues** - ASAP

### Important (Call within 1 hour):
- 👨‍⚕️ **Doctor appointments** - At preferred time
- 💊 **Prescription issues** - If unclear/incomplete

### Normal (Call within 24 hours):
- 📦 **Order confirmations** - Optional
- 👤 **Profile updates** - If verification needed

---

## 🎯 Status Management

### Status Types:
1. **pending** - Newly created, needs action
2. **completed** - Processed and done
3. **scanned** - AI has processed (prescriptions only)

### How to Update:
- Click "Complete" button on any row
- Status changes from "pending" to "completed"
- Table updates automatically

---

## 🗃️ Data Storage

All data is saved in:
- **File:** `data.sqlite`
- **Location:** Project root folder
- **Backup:** Copy this file regularly for safety

---

## 🔒 Security Tips

1. [ ] Change default password after first login
2. [ ] Don't share admin credentials
3. [ ] Always logout after use
4. [ ] Keep server secure (firewall, etc)
5. [ ] Regular database backups

---

## 💡 Pro Tips

### Efficiency:
- Keep dashboard open in one tab
- Use Ctrl+Click to open files in new tab
- Set browser to auto-refresh if needed
- Use Excel/Sheets for bulk analysis (export feature coming soon)

### Customer Service:
- Always call back ambulance requests
- Respond to prescriptions within 24h
- Confirm doctor appointments 1 hour before
- Keep notes for follow-ups

---

## 🆘 Troubleshooting

### Dashboard not loading?
1. Check if server is running
2. Verify you're logged in
3. Clear browser cache
4. Try incognito mode

### Data not updating?
1. Wait 30 seconds for auto-refresh
2. Manually refresh page (F5)
3. Check server console for errors
4. Verify database file exists

### Can't mark as complete?
1. Ensure you're logged in as admin
2. Check session hasn't expired
3. Re-login if needed

---

## 📞 Support

If you need help:
- Check server console for errors
- Review `README-COMPLETE.md`
- Check `FEATURES-COMPLETED.md` for features
- Test APIs with `npm test`

---

## ✅ End of Day Checklist

Before closing:
- [ ] All ambulance requests marked complete
- [ ] All prescriptions reviewed
- [ ] All doctor appointments confirmed
- [ ] New products added if needed
- [ ] Dashboard checked for pending items
- [ ] Logout from admin panel
- [ ] Server stopped (if shutting down)

---

**Happy Managing!** 🎉

Your complete pharmacy management system is ready to use!
