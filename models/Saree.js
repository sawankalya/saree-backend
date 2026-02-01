const mongoose = require("mongoose");

const SareeSchema = new mongoose.Schema({
  imageUrl: String,
  likes: { type: Number, default: 0 },
  dailyLikes: {
    type: Map,
    of: Number,
    default: {}
  }
});

module.exports = mongoose.model("Saree", SareeSchema);
