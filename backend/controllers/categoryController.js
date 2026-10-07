const Category = require("../models/Category");

// Get all categories
const getCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 });

    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({
      message: "Failed to get categories",
      error: error.message,
    });
  }
};

// Create a new category
const createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;

    const category = await Category.create({
      name,
      description,
    });

    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({
      message: "Failed to create category",
      error: error.message,
    });
  }
};

module.exports = {
  getCategories,
  createCategory,
};