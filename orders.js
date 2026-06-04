const express = require("express");
const router = express.Router();

// temporary storage (replace with DB later)
let orders = [];

// CREATE ORDER
router.post("/add", (req, res) => {
  const order = {
    id: Date.now(),
    ...req.body,
    date: new Date().toLocaleString()
  };

  orders.push(order);

  res.json({
    message: "Order saved",
    order
  });
});

// GET ALL ORDERS (ADMIN)
router.get("/", (req, res) => {
  res.json(orders);
});

module.exports = router;
