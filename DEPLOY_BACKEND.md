# Deploying Pharm Backend

This guide shows how to deploy the `Pharm` backend (Express + SQLite + Firebase optional) to Render (recommended) or any Node hosting provider.

## Required environment variables
Set these in your hosting provider's dashboard (do not commit `.env` to git):

- ADMIN_PASSWORD (e.g. strong password for admin panel)
- JWT_SECRET (random string for JWT signing)
- RAZORPAY_KEY_ID
- RAZORPAY_KEY_SECRET
- EMAIL_USER
- EMAIL_PASS
- FIREBASE_ADMIN_JSON (optional) — use one-line JSON of your service account if using Firebase Admin
- FIREBASE_STORAGE_BUCKET (if using Firebase Storage)
- PORT (optional, Render sets this automatically)

## Quick Deploy on Render
1. Create a Render account and connect your GitHub repo.
2. Create a new Web Service and choose your `main` branch.
3. Environment:
   - Environment: `Node`
   - Build Command: `npm install`
   - Start Command: `node server.js` (or `npm start`)
4. Add the environment variables listed above in the Render dashboard.
5. Deploy. Render will build and start the service.

Notes:
- Render exposes your app on HTTPS; server includes a redirect to force HTTPS.
- The app writes uploads to the local filesystem under `assets/uploads`. For persistent uploads across instances use a cloud storage (Firebase Storage / S3) and set `FIREBASE_ADMIN_JSON` and `FIREBASE_STORAGE_BUCKET`.

## Local testing (PowerShell)
Copy `.env.example` to `.env` and fill credentials.

```powershell
# from project root (PowerShell)
copy .env.example .env
npm install
npm start
# Then open http://localhost:3000/api/health
```

## Troubleshooting
- If email sending fails, ensure `EMAIL_USER` and `EMAIL_PASS` are correct and Gmail app password is used.
- If Razorpay fails, verify keys and your account settings.
- If Firebase Admin fails to initialize, either provide `FIREBASE_ADMIN_JSON` or place `firebase-adminsdk.json` in repo (not recommended for production).

If you want, I can:
- Prepare a Render `render.yaml` with env var placeholders.
- Add automatic upload to Firebase Storage (requires code changes).
- Deploy the backend to Render for you (I can provide the exact steps/commands to run locally to push to GitHub and connect to Render).

