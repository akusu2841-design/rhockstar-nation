const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// ===============================
// PORTFOLIO DATA
// ===============================
let portfolio = {
  web: [],
  marketing: [],
  design: [],
  business: []
};

// ===============================
// ADMIN LOGIN (SIMPLE)
// ===============================
app.post("/api/admin/login", (req, res) => {
  const { username, password } = req.body;

  if (username === "admin" && password === "1234") {
    return res.json({ token: "rhockstar_admin_token" });
  }

  return res.status(401).json({ message: "Invalid login" });
});

// ===============================
// GET PORTFOLIO
// ===============================
app.get("/api/portfolio/:type", (req, res) => {
  const type = req.params.type;

  if (!portfolio[type]) {
    return res.status(400).json({ error: "Invalid category" });
  }

  res.json(portfolio[type]);
});

// ===============================
// ADD PORTFOLIO (ADMIN)
// ===============================
app.post("/api/portfolio/add", (req, res) => {
  const { category, imageUrl } = req.body;

  if (!portfolio[category]) {
    return res.status(400).json({ error: "Invalid category" });
  }

  portfolio[category].push(imageUrl);

  res.json({ message: "Added successfully" });
});

// ===============================
// ORDERS
// ===============================
let orders = [];

app.post("/api/orders/add", (req, res) => {
  orders.push(req.body);
  res.json({ message: "Order received" });
});

app.get("/api/orders", (req, res) => {
  res.json(orders);
});

// ===============================
app.listen(5000, () => {
  console.log("Server running on port 5000");
});
