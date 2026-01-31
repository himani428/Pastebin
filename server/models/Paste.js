const mongoose = require("mongoose");

const pasteSchema = new mongoose.Schema({
  pasteId: String,
  content: String,
  expiresAt: Date,
  maxViews: Number,
  views: { type: Number, default: 0 }
});

module.exports = mongoose.model("Paste", pasteSchema);
