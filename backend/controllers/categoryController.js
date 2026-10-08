const Category = require("../models/Category");
const Mockup = require("../models/Mockup");

const getCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: "Failed to get categories", error: error.message });
  }
};

const getCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ message: "Category not found" });
    res.json(category);
  } catch (error) {
    res.status(400).json({ message: "Invalid category ID" });
  }
};

const createCategory = async (req, res) => {
  try {
    const { name, description, image } = req.body;
    if (!name?.trim()) return res.status(400).json({ message: "Category name is required" });
    const category = await Category.create({ name: name.trim(), description, image });
    res.status(201).json(category);
  } catch (error) {
    if (error.code === 11000) return res.status(409).json({ message: "Category already exists" });
    res.status(500).json({ message: "Failed to create category", error: error.message });
  }
};

const updateCategory = async (req, res) => {
  try {
    const { name, description, image } = req.body;
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ message: "Category not found" });
    if (name !== undefined) category.name = name.trim();
    if (description !== undefined) category.description = description;
    if (image !== undefined) category.image = image;
    await category.save();
    res.json(category);
  } catch (error) {
    if (error.code === 11000) return res.status(409).json({ message: "Category name already exists" });
    res.status(400).json({ message: "Failed to update category", error: error.message });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ message: "Category not found" });
    const mockupCount = await Mockup.countDocuments({ category: category._id });
    if (mockupCount > 0) {
      return res.status(409).json({ message: "Cannot delete a category that contains mockups", mockupCount });
    }
    await category.deleteOne();
    res.json({ message: "Category deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: "Failed to delete category", error: error.message });
  }
};

module.exports = { getCategories, getCategory, createCategory, updateCategory, deleteCategory };
