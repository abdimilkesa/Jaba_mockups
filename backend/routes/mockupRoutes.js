
const protect = require("../middleware/authMiddleware");
const adminOnly = require("../middleware/adminMiddleware");
const express = require("express");
const path = require("path");

const Mockup = require("../models/Mockup");
const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

// ==========================================
// GET ALL MOCKUPS
// ==========================================
router.get("/", async (req, res) => {
  try {
    const mockups = await Mockup.find().populate("category");

    const updatedMockups = mockups.map((mockup) => {
      const mockupObject = mockup.toObject();

      return {
        ...mockupObject,

        previewImage: mockupObject.previewImage
          ? `${req.protocol}://${req.get("host")}/uploads/${path.basename(
              mockupObject.previewImage
            )}`
          : null,

        downloadFile: mockupObject.downloadFile
          ? `${req.protocol}://${req.get("host")}/uploads/${path.basename(
              mockupObject.downloadFile
            )}`
          : null,
      };
    });

    res.status(200).json(updatedMockups);
  } catch (error) {
    res.status(500).json({
      message: "Failed to get mockups",
      error: error.message,
    });
  }
});

// ==========================================
// DOWNLOAD MOCKUP FILE
// ==========================================
router.get("/:id/download", async (req, res) => {
  try {
    const mockup = await Mockup.findById(req.params.id);

    if (!mockup) {
      return res.status(404).json({
        message: "Mockup not found",
      });
    }

    if (!mockup.downloadFile) {
      return res.status(404).json({
        message: "Download file not found",
      });
    }

    // Get only the filename
    const fileName = path.basename(mockup.downloadFile);

    // Build the actual server file path
    const filePath = path.join(__dirname, "../uploads", fileName);

    res.download(filePath, fileName, (error) => {
      if (error) {
        console.error("Download error:", error);

        if (!res.headersSent) {
          res.status(500).json({
            message: "Failed to download mockup",
          });
        }
      }
    });
  } catch (error) {
    console.error("Download route error:", error);

    res.status(500).json({
      message: "Failed to download mockup",
      error: error.message,
    });
  }
});

// ==========================================
// GET SINGLE MOCKUP
// ==========================================
router.get("/:id", async (req, res) => {
  try {
    const mockup = await Mockup.findById(req.params.id).populate("category");

    if (!mockup) {
      return res.status(404).json({
        message: "Mockup not found",
      });
    }

    const mockupObject = mockup.toObject();

    const updatedMockup = {
      ...mockupObject,

      previewImage: mockupObject.previewImage
        ? `${req.protocol}://${req.get("host")}/uploads/${path.basename(
            mockupObject.previewImage
          )}`
        : null,

      downloadFile: mockupObject.downloadFile
        ? `${req.protocol}://${req.get("host")}/uploads/${path.basename(
            mockupObject.downloadFile
          )}`
        : null,
    };

    res.status(200).json(updatedMockup);
  } catch (error) {
    res.status(500).json({
      message: "Failed to get mockup",
      error: error.message,
    });
  }
});

// ==========================================
// CREATE NEW MOCKUP
// ==========================================
router.post(
  "/",
  protect,
  adminOnly,
  upload.fields([
    {
      name: "previewImage",
      maxCount: 1,
    },
    {
      name: "downloadFile",
      maxCount: 1,
    },
  ]),
  async (req, res) => {
    try {
      const {
        title,
        description,
        category,
        tags,
      } = req.body;

      const previewImage = req.files?.previewImage?.[0];
      const downloadFile = req.files?.downloadFile?.[0];

      // Check preview image
      if (!previewImage) {
        return res.status(400).json({
          message: "Preview image is required",
        });
      }

      // Check download file
      if (!downloadFile) {
        return res.status(400).json({
          message: "Download file is required",
        });
      }

      // Create mockup
      const mockup = await Mockup.create({
        title,
        description,
        category,

        // IMPORTANT:
        // Store only filenames in MongoDB
        previewImage: previewImage.filename,
        downloadFile: downloadFile.filename,

        tags,
      });

      res.status(201).json(mockup);
    } catch (error) {
      console.error("Create mockup error:", error);

      res.status(500).json({
        message: "Failed to create mockup",
        error: error.message,
      });
    }
  }
);

module.exports = router;
