const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const tenantRoutes = require("./routes/tenantRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

// 🔥 BODY PARSER — ONLY ONCE, WITH LIMIT
app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ extended: true, limit: "20mb" }));

app.use(cors());
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);

// Routes
app.get("/", (req, res) => {
  res.send("PG Management Backend Running ✅");
});

app.use("/api/pg-owner", require("./routes/pgOwnerRoutes"));
app.use("/api/pg", require("./routes/pgRoutes"));
app.use("/api/tenants", tenantRoutes);
app.use("/api/rooms", require("./routes/roomRoutes"));
app.use("/api/payments", require("./routes/paymentRoutes"));


// MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected");
    app.listen(PORT, () =>
      console.log(`Server running on port ${PORT}`)
    );
  })
  .catch((err) => console.error("MongoDB Error:", err));
