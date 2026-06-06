const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");

const app = express();

app.use(cors());
app.use(bodyParser.json());

const SECRET = "rhockstar_secret";

/* ADMIN LOGIN */
app.post("/admin/login", (req, res) => {
  const { username, password } = req.body;

  if (username === "admin@rhockstar.com" && password === "brue199$") {
    const token = jwt.sign(
      { role: "admin" },
      SECRET,
      { expiresIn: "24h" }
    );

    return res.json({ token });
  }

  res.status(401).json({
    message: "Wrong login"
  });
});

/* ORDERS */
let orders = [];

/* CREATE ORDER */
app.post("/orders", (req, res) => {

  const order = {
    id: Date.now(),
    name: req.body.name,
    phone: req.body.phone,
    service: req.body.service,
    details: req.body.details,
    status: "Pending"
  };

  orders.push(order);

  res.json(order);
});

/* VERIFY ADMIN */
function verifyAdmin(req, res, next) {

  const token =
    req.headers.authorization;

  if (!token) {
    return res.status(403).json({
      message: "No token"
    });
  }

  try {
    jwt.verify(token, SECRET);
    next();
  } catch {
    res.status(403).json({
      message: "Invalid token"
    });
  }

}

/* GET ORDERS */
app.get(
  "/orders",
  verifyAdmin,
  (req, res) => {
    res.json(orders);
  }
);

/* UPDATE ORDER */
app.put(
  "/orders/:id",
  verifyAdmin,
  (req, res) => {

    const order =
      orders.find(
        o => o.id == req.params.id
      );

    if (!order) {
      return res.status(404).json({
        message: "Not found"
      });
    }

    order.status =
      req.body.status;

    res.json(order);
  }
);

const PORT =
  process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `Server running on ${PORT}`
  );
});
