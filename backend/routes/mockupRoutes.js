const express = require("express");
const protect = require("../middleware/authMiddleware");
const adminOnly = require("../middleware/adminMiddleware");
const upload = require("../middleware/uploadMiddleware");
const controller = require("../controllers/mockupController");

const router = express.Router();
const uploadFields = upload.fields([
  { name: "previewImage", maxCount: 1 },
  { name: "downloadFile", maxCount: 1 }
]);

router.get("/", controller.getMockups);
router.get("/:id/download", controller.downloadMockup);
router.get("/:id", controller.getMockup);
router.post("/", protect, adminOnly, uploadFields, controller.createMockup);
router.put("/:id", protect, adminOnly, uploadFields, controller.updateMockup);
router.delete("/:id", protect, adminOnly, controller.deleteMockup);

module.exports = router;
