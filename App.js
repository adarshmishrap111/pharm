const express = require("express");
const app = express();

// Force HTTPS (for Render)
app.use((req, res, next) => {
  if (req.headers["x-forwarded-proto"] !== "https") {
    return res.redirect("https://" + req.headers.host + req.url);
  }
  next();
});

// Redirect root domain (non-www) to www
app.use((req, res, next) => {
  if (req.hostname === "pharmidahealthcare.com") {
    return res.redirect(301, "https://www.pharmidahealthcare.com" + req.url);
  }
  next();
});

// ✅ Your existing code below (routes, static files, etc.)
app.use(express.static("public")); // Example for frontend
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

// Port setup for Render
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));