const express = require("express");
const Saree = require("../models/Saree");
const admin = require("../middleware/adminAuth");
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const router = express.Router();

// upload saree (base64 image)
router.post("/", async (req, res) => {
  const upload = await cloudinary.uploader.upload(req.body.image);
  const saree = await Saree.create({ imageUrl: upload.secure_url });
  res.json(saree);
});

// get all
router.get("/", async (req, res) => {
  res.json(await Saree.find());
});

// like saree (UI unchanged)
router.post("/:id/like", async (req, res) => {
  const today = new Date().toISOString().split("T")[0];
  await Saree.findByIdAndUpdate(req.params.id, {
    $inc: { likes: 1, [`dailyLikes.${today}`]: 1 }
  });
  res.json({ success: true });
});

// ranking
router.get("/ranking", async (req, res) => {
  res.json(await Saree.find().sort({ likes: -1 }));
});

// daily analytics
router.get("/analytics/daily", async (req, res) => {
  const date = req.query.date;
  const sarees = await Saree.find();

  res.json(
    sarees.map(s => ({
      imageUrl: s.imageUrl,
      likes: s.dailyLikes.get(date) || 0
    }))
  );
});

// admin reset
router.post("/reset", admin, async (req, res) => {
  await Saree.updateMany({}, { likes: 0, dailyLikes: {} });
  res.json({ message: "Reset done" });
});

// admin delete
router.delete("/:id", admin, async (req, res) => {
  await Saree.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

module.exports = router;
