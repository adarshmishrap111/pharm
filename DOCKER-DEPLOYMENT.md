# 🐳 Pharmida - Docker Deployment Guide

## 🚀 Quick Docker Deployment

### 1. Build Docker Image
```bash
docker build -t pharmida-app .
```

### 2. Run Container
```bash
docker run -d \
  --name pharmida \
  -p 3000:3000 \
  -e NODE_ENV=production \
  -e ADMIN_PASSWORD=your-secure-password \
  -e JWT_SECRET=your-jwt-secret-key \
  pharmida-app
```

### 3. Run with Environment File
```bash
# Create .env.production file first
docker run -d \
  --name pharmida \
  -p 3000:3000 \
  --env-file .env.production \
  pharmida-app
```

## 🌐 Cloud Deployment Options

### Railway.app
1. Connect your GitHub repository
2. Railway auto-detects Dockerfile
3. Set environment variables in dashboard
4. Deploy automatically

### Render.com
1. Connect GitHub repository
2. Choose "Docker" as environment
3. Set build command: `docker build -t app .`
4. Set start command: `docker run -p $PORT:3000 app`

### Digital Ocean App Platform
1. Upload repository
2. Select Dockerfile build method
3. Configure environment variables
4. Deploy

### Google Cloud Run
```bash
# Build and push to Container Registry
gcloud builds submit --tag gcr.io/PROJECT-ID/pharmida

# Deploy to Cloud Run
gcloud run deploy --image gcr.io/PROJECT-ID/pharmida --platform managed
```

## 🔧 Environment Variables (Required)

### Essential Variables:
```env
NODE_ENV=production
PORT=3000
ADMIN_PASSWORD=your-super-secure-admin-password
JWT_SECRET=your-very-long-jwt-secret-key-min-32-chars
```

### Optional Variables:
```env
# Payment Gateway (Razorpay)
RAZORPAY_KEY_ID=rzp_live_xxxxxxxxxx
RAZORPAY_KEY_SECRET=your_razorpay_secret

# Email Notifications
EMAIL_USER=noreply@yourdomain.com
EMAIL_PASS=your_app_specific_password

# Database (SQLite auto-created)
DB_PATH=./data.sqlite
```

## 📁 Docker Image Contents

```
/app/
├── server.js              # Main server file
├── package.json           # Dependencies
├── frontend/              # Static files served by Express
│   ├── index.html         # Customer homepage
│   ├── admin-dashboard.html # Protected admin panel
│   ├── product-upload.html  # Protected product management
│   └── assets/            # Images, CSS, uploads
└── data.sqlite            # SQLite database (auto-created)
```

## 🔒 Security Features

- ✅ Admin pages protected by JWT authentication
- ✅ Environment variables for sensitive data
- ✅ Docker secrets support
- ✅ HTTPS ready (configure reverse proxy)
- ✅ SQLite database with file permissions

## 🧪 Local Testing

### Test Docker Build:
```bash
# Build image
docker build -t pharmida-test .

# Run container locally
docker run -p 3000:3000 \
  -e ADMIN_PASSWORD=admin123 \
  -e JWT_SECRET=test-secret-key-for-development \
  pharmida-test

# Test the application
curl http://localhost:3000
```

### Health Check:
```bash
# Check if container is healthy
docker ps
docker logs pharmida
```

## 📊 Performance Optimization

### Multi-stage Build (Optional):
```dockerfile
# Build stage
FROM node:18-alpine AS builder
WORKDIR /app
COPY backend/package*.json ./
RUN npm ci --only=production

# Production stage
FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY backend/ .
COPY frontend/ ./frontend/
CMD ["npm", "start"]
```

## 🔄 CI/CD Pipeline

### GitHub Actions Example:
```yaml
name: Deploy to Production
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to Railway
        uses: railway-app/railway@v1
        with:
          token: ${{ secrets.RAILWAY_TOKEN }}
```

## 🐛 Troubleshooting

### Common Issues:

1. **Port Binding Error:**
   ```bash
   # Check if port 3000 is in use
   docker ps
   docker stop existing-container
   ```

2. **Environment Variables Missing:**
   ```bash
   # Check container environment
   docker exec -it pharmida env
   ```

3. **Database Permission Issues:**
   ```bash
   # Check file permissions
   docker exec -it pharmida ls -la data.sqlite
   ```

4. **Build Failures:**
   ```bash
   # Clean build (no cache)
   docker build --no-cache -t pharmida-app .
   ```

## 📈 Monitoring

### Container Logs:
```bash
# View real-time logs
docker logs -f pharmida

# View last 100 lines
docker logs --tail 100 pharmida
```

### Resource Usage:
```bash
# Monitor resource usage
docker stats pharmida
```

## 🔧 Production Checklist

- [ ] Set strong `ADMIN_PASSWORD`
- [ ] Generate secure `JWT_SECRET` (32+ characters)
- [ ] Configure payment gateway credentials
- [ ] Set up email notifications
- [ ] Configure reverse proxy (Nginx) for HTTPS
- [ ] Set up database backups
- [ ] Monitor container health
- [ ] Configure log rotation

**🎉 Your Pharmida app is now ready for Docker deployment!**