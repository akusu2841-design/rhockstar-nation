
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");

const app = express();
app.use(cors({ origin: "*" }));
app.use(bodyParser.json());

const SECRET = "rhockstar_secret";

/* =========================
   ADMIN LOGIN
========================= */
app.post("/admin/login", (req, res) => {
  const { username, password } = req.body;

  if (username === "admin" && password === "1234") {
    const token = jwt.sign({ role: "admin" }, SECRET, { expiresIn: "2h" });

    return res.json({ token });
  }

  return res.status(401).json({ message: "Invalid credentials" });
});

/* =========================
   ORDERS STORAGE
========================= */
let orders = [];

/* =========================
   CREATE ORDER
========================= */
app.post("/orders", (req, res) => {
  const newOrder = {
    id: Date.now(),
    ...req.body,
    status: "Pending"
  };

  orders.push(newOrder);

  res.json(newOrder);
});

/* =========================
   AUTH MIDDLEWARE
========================= */
function verifyAdmin(req, res, next) {
  const token = req.headers.authorization;

  if (!token) return res.status(403).json({ message: "No token" });

  try {
    jwt.verify(token, SECRET);
    next();
  } catch {
    res.status(403).json({ message: "Invalid token" });
  }
}

/* =========================
   GET ALL ORDERS (ADMIN)
========================= */
app.get("/orders", verifyAdmin, (req, res) => {
  res.json(orders);
});

/* =========================
   UPDATE ORDER STATUS
========================= */
app.put("/orders/:id", verifyAdmin, (req, res) => {
  const order = orders.find(o => o.id == req.params.id);

  if (!order) {
    return res.status(404).json({ message: "Not found" });
  }

  order.status = req.body.status;

  res.json(order);
});

/* =========================
   START SERVER
========================= */
app.listen(5000, () => {
  console.log("Server running on port 5000");
});
