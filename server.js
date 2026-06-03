const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const cors = require("cors");
require("dotenv").config();

const app = express();

// ================== MIDDLEWARE ==================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// ================== ENV CHECK ==================
if (!process.env.MONGO_URI) {
  console.error("MONGO_URI missing in .env");
  process.exit(1);
}

if (!process.env.JWT_SECRET) {
  console.error("JWT_SECRET missing in .env");
  process.exit(1);
}

// ================== DATABASE ==================
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => {
    console.error("MongoDB Error:", err);
    process.exit(1);
  });

// ================== ORDER MODEL ==================
const orderSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  service: {
    type: String,
    required: true
  },
  price: Number,
  description: String,
  status: {
    type: String,
    default: "pending"
  },
  date: {
    type: Date,
    default: Date.now
  }
});

const Order = mongoose.model("Order", orderSchema);

// ================== ADMIN ==================
const ADMIN_EMAIL = "admin@rhockstar.com";

// Generate this once and save it
const ADMIN_PASSWORD_HASH =
  "$2a$10$0B0jR7nYeD9Pt7G1nNwY5udO8jF2k0ZSMJx6m0gQYHj8N7M9oKj3S";

// ================== HOME ==================
app.get("/", (req, res) => {
  res.send("Rhockstar Nation API is live 🚀");
});

// ================== CREATE ORDER ==================
app.post("/order", async (req, res) => {
  try {
    const { name, phone, service } = req.body;

    if (!name || !phone || !service) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields"
      });
    }

    const order = new Order(req.body);
    await order.save();

    res.status(201).json({
      success: true,
      message: "Order placed successfully"
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
});

// ================== ADMIN LOGIN ==================
app.post("/admin/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (email !== ADMIN_EMAIL) {
      return res.status(401).json({
        message: "Invalid credentials"
      });
    }

    const valid = await bcrypt.compare(
      password,
      ADMIN_PASSWORD_HASH
    );

    if (!valid) {
      return res.status(401).json({
        message: "Invalid credentials"
      });
    }

    const token = jwt.sign(
      { email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ token });
  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
});

// ================== TOKEN MIDDLEWARE ==================
function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(403).json({
      message: "No token provided"
    });
  }

  const token = authHeader.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : authHeader;

  try {
    req.user = jwt.verify(
      token,
      process.env.JWT_SECRET
    );
    next();
  } catch (err) {
    return res.status(401).json({
      message: "Invalid token"
    });
  }
}

// ================== GET ORDERS ==================
app.get("/admin/orders", verifyToken, async (req, res) => {
  try {
    const orders = await Order.find().sort({
      date: -1
    });

    res.json(orders);
  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
});

// ================== START SERVER ==================
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
