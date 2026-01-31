const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI);

app.use("/api", require("./routes/pasteRoutes"));

app.get("/p/:id", async (req, res) => {
  res.redirect(`/api/html/${req.params.id}`);
});

app.listen(process.env.PORT, () =>
  console.log("Server running")
);
