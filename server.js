const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());

// ================== DATABASE ==================
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB connected"))
.catch(err => console.log(err));

// ================== ORDER MODEL ==================
const orderSchema = new mongoose.Schema({
  name: String,
  phone: String,
  service: String,
  price: Number,
  description: String,
  status: { type: String, default: "pending" },
  date: { type: Date, default: Date.now }
});

const Order = mongoose.model("Order", orderSchema);

// ================== ADMIN SETUP ==================
const ADMIN_EMAIL = "admin@rhockstar.com";
const ADMIN_PASSWORD_HASH = bcrypt.hashSync("brue199$", 10);

// ================== HOME ==================
app.get("/", (req, res) => {
  res.send("Rhockstar Nation API is live 🚀");
});

// ================== CREATE ORDER ==================
app.post("/order", async (req, res) => {
  try {
    const order = new Order(req.body);
    await order.save();

    res.json({
      success: true,
      message: "Order placed successfully"
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ================== ADMIN LOGIN ==================
app.post("/admin/login", (req, res) => {
  const { email, password } = req.body;

  if (email !== ADMIN_EMAIL) {
    return res.status(401).json({ message: "Invalid email" });
  }

  const valid = bcrypt.compareSync(password, ADMIN_PASSWORD_HASH);

  if (!valid) {
    return res.status(401).json({ message: "Invalid password" });
  }

  const token = jwt.sign(
    { email },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  res.json({ token });
});

// ================== TOKEN MIDDLEWARE ==================
function verifyToken(req, res, next) {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(403).json({ message: "No token provided" });
  }

  try {
    jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
}

// ================== ADMIN GET ORDERS ==================
app.get("/admin/orders", verifyToken, async (req, res) => {
  const orders = await Order.find().sort({ date: -1 });
  res.json(orders);
});

// ================== START SERVER ==================
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
