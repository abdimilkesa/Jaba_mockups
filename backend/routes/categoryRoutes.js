const express = require("express");
const protect = require("../middleware/authMiddleware");
const adminOnly = require("../middleware/adminMiddleware");
const controller = require("../controllers/categoryController");

const router = express.Router();
router.get("/", controller.getCategories);
router.get("/:id", controller.getCategory);
router.post("/", protect, adminOnly, controller.createCategory);
router.put("/:id", protect, adminOnly, controller.updateCategory);
router.delete("/:id", protect, adminOnly, controller.deleteCategory);

module.exports = router;
