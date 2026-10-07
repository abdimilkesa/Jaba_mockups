const express = require("express");

const {
  getCategories,
  createCategory,
} = require("../controllers/categoryController");

const router = express.Router();

// GET all categories
router.get("/", getCategories);

// POST create a category
router.post("/", createCategory);

module.exports = router;
