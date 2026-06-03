const express = require("express");
const app = express();

// middleware
app.use(express.json());

// test route
app.get("/", (req, res) => {
  res.send("Backend is live on Render 🚀");
});

// example API route
app.get("/api", (req, res) => {
  res.json({
    message: "API working fine",
    status: "success"
  });
});

// Render port setup (VERY IMPORTANT)
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
