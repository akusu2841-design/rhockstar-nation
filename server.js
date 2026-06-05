const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// ===============================
// TEMP DATABASE (we will upgrade later)
// ===============================
let orders = [];
let news = [];

// ===============================
// ORDERS API
// ===============================

// GET ALL ORDERS
app.get("/api/orders", (req, res) => {
  res.json(orders);
});

// ADD ORDER
app.post("/api/orders/add", (req, res) => {
  const order = req.body;

  orders.push(order);

  res.json({
    message: "Order saved successfully",
    data: order
  });
});

// ===============================
// NEWS API
// ===============================

// GET NEWS
app.get("/api/news", (req, res) => {
  res.json(news);
});

// ADD NEWS
app.post("/api/news/add", (req, res) => {
  const item = req.body;

  news.push(item);

  res.json({
    message: "News added successfully",
    data: item
  });
});

// ===============================
// SERVER START
// ===============================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
