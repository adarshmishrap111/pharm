Pharm - Deployment Guide

This document explains how to run Pharm locally with Docker and deploy to common cloud providers.

Local (Docker)

1. Build and start:

   docker-compose up --build -d

2. Check logs:

   docker-compose logs -f web

3. Visit: http://localhost:3000

Notes:
- Make sure environment variables are set for Razorpay and email if you need payment/email features.
- The SQLite file and uploads are mounted as volumes in `docker-compose.yml`.

Deploy to Render (static service + web service)

1. Create a new Web Service on Render.
2. Connect your GitHub repo and specify the root folder (if needed).
3. Set the Start Command: `node server.js` and the port to `3000`.
4. Add environment variables (RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET, EMAIL_USER, EMAIL_PASS, JWT_SECRET, ADMIN_PASSWORD).

Deploy to DigitalOcean App Platform

1. Create a new App, connect repo, choose the `web` service.
2. Use the Dockerfile or Node build, set command `node server.js` and port 3000.
3. Add environment variables as above.

Security

- For production, use a real DB (Postgres) and secure environment variables. Do not commit secrets to the repo.
- Use HTTPS and proper CORS configuration for production.
