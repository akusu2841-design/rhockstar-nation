const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");

const app = express();

app.use(cors());
app.use(bodyParser.json());

const SECRET = "rhockstar_secret";

/* =========================
   ADMIN LOGIN
========================= */
app.post("/admin/login", (req, res) => {
  const { username, password } = req.body;

  if (username === "admin" && password === "1234") {
    const token = jwt.sign({ role: "admin" }, SECRET);
    return res.json({ token });
  }

  res.status(401).json({ message: "Wrong login" });
});

/* =========================
   ORDERS STORAGE (TEMP)
========================= */
let orders = [];

/* =========================
   CREATE ORDER
========================= */
app.post("/orders", (req, res) => {
  const order = {
    id: Date.now(),
    ...req.body,
    status: "Pending"
  };

  orders.push(order);
  res.json(order);
});

/* =========================
   VERIFY ADMIN
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
   GET ALL ORDERS (ADMIN ONLY)
========================= */
app.get("/orders", verifyAdmin, (req, res) => {
  res.json(orders);
});

/* =========================
   UPDATE ORDER STATUS
========================= */
app.put("/orders/:id", verifyAdmin, (req, res) => {
  const order = orders.find(o => o.id == req.params.id);

  if (!order) return res.status(404).json({ message: "Not found" });

  order.status = req.body.status;
  res.json(order);
});

/* =========================
   START SERVER
========================= */
app.listen(5000, () => {
  console.log("Server running on port 5000");
});
