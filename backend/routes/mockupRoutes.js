const protect = require("../middleware/authMiddleware");
const adminOnly = require("../middleware/adminMiddleware");
const express = require("express");
const Mockup = require("../models/Mockup");
const upload = require("../middleware/uploadMiddleware");
const router = express.Router();

// GET all mockups
router.get("/", async (req, res) => {
  try {
    const mockups = await Mockup.find().populate("category");

    res.status(200).json(mockups);
  } catch (error) {
    res.status(500).json({
      message: "Failed to get mockups",
      error: error.message,
    });
  }
});

// POST a new mockup
router.post(
  "/",
  protect,
  adminOnly,
  upload.fields([
    { name: "previewImage", maxCount: 1 },
    { name: "downloadFile", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const { title, description, category, previewImage, downloadFile, tags } =
        req.body;

      const mockup = await Mockup.create({
        title,
        description,
        category,
        previewImage,
        downloadFile,
        tags,
      });

      res.status(201).json(mockup);
    } catch (error) {
      res.status(500).json({
        message: "Failed to create mockup",
        error: error.message,
      });
    }
  }
);

module.exports = router;
