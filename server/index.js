const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();

/* MIDDLEWARE */
app.use(cors());
app.use(express.json());

/* DATABASE */
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log("Mongo Error:", err));

/* ROUTES */
app.use("/api", require("./routes/pasteRoutes"));

/* ROOT ROUTE (so / does not show Cannot GET /) */
app.get("/", (req, res) => {
  res.send("Pastebin API is running 🚀");
});

/* EXPORT FOR VERCEL */
module.exports = app;
