const path = require("path");
const fs = require("fs");
const mongoose = require("mongoose");
const Mockup = require("../models/Mockup");
const Category = require("../models/Category");

const uploadDir = path.join(__dirname, "../uploads");

const publicFileUrl = (req, filename) =>
  filename ? `${req.protocol}://${req.get("host")}/uploads/${path.basename(filename)}` : null;

const serialize = (req, mockup) => {
  const item = mockup.toObject ? mockup.toObject() : mockup;
  return {
    ...item,
    previewImage: publicFileUrl(req, item.previewImage),
    downloadFile: publicFileUrl(req, item.downloadFile)
  };
};

const parseTags = (tags) => {
  if (Array.isArray(tags)) return tags.map(String).map(t => t.trim()).filter(Boolean);
  if (typeof tags === "string") return tags.split(",").map(t => t.trim()).filter(Boolean);
  return [];
};

const removeFile = (filename) => {
  if (!filename) return;
  const filePath = path.join(uploadDir, path.basename(filename));
  if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
};

const getMockups = async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit) || 12, 1), 50);
    const skip = (page - 1) * limit;
    const { q, category, featured, tag } = req.query;

    const filter = {};
    if (q?.trim()) {
      filter.$text = { $search: q.trim() };
    }
    if (category) {
      if (mongoose.Types.ObjectId.isValid(category)) filter.category = category;
      else {
        const foundCategory = await Category.findOne({ slug: category.toLowerCase() });
        if (!foundCategory) return res.json({ data: [], pagination: { page, limit, total: 0, pages: 0 } });
        filter.category = foundCategory._id;
      }
    }
    if (featured === "true") filter.featured = true;
    if (tag?.trim()) filter.tags = tag.trim();

    const [mockups, total] = await Promise.all([
      Mockup.find(filter).populate("category", "name slug description").sort({ createdAt: -1 }).skip(skip).limit(limit),
      Mockup.countDocuments(filter)
    ]);

    res.json({
      data: mockups.map(mockup => serialize(req, mockup)),
      pagination: { page, limit, total, pages: Math.ceil(total / limit) }
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to get mockups", error: error.message });
  }
};

const getMockup = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) return res.status(400).json({ message: "Invalid mockup ID" });
    const mockup = await Mockup.findById(req.params.id).populate("category");
    if (!mockup) return res.status(404).json({ message: "Mockup not found" });
    res.json(serialize(req, mockup));
  } catch (error) {
    res.status(500).json({ message: "Failed to get mockup", error: error.message });
  }
};

const createMockup = async (req, res) => {
  const previewImage = req.files?.previewImage?.[0];
  const downloadFile = req.files?.downloadFile?.[0];
  try {
    const { title, description, category, featured } = req.body;
    if (!title?.trim() || !category) {
      removeFile(previewImage?.filename); removeFile(downloadFile?.filename);
      return res.status(400).json({ message: "Title and category are required" });
    }
    if (!previewImage || !downloadFile) {
      removeFile(previewImage?.filename); removeFile(downloadFile?.filename);
      return res.status(400).json({ message: "Preview image and download file are required" });
    }
    if (!mongoose.Types.ObjectId.isValid(category) || !(await Category.exists({ _id: category }))) {
      removeFile(previewImage.filename); removeFile(downloadFile.filename);
      return res.status(400).json({ message: "Valid category is required" });
    }

    const mockup = await Mockup.create({
      title: title.trim(), description, category,
      previewImage: previewImage.filename,
      downloadFile: downloadFile.filename,
      tags: parseTags(req.body.tags),
      featured: featured === "true" || featured === true
    });
    res.status(201).json(serialize(req, mockup));
  } catch (error) {
    removeFile(previewImage?.filename); removeFile(downloadFile?.filename);
    res.status(500).json({ message: "Failed to create mockup", error: error.message });
  }
};

const updateMockup = async (req, res) => {
  const newPreview = req.files?.previewImage?.[0];
  const newDownload = req.files?.downloadFile?.[0];
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) return res.status(400).json({ message: "Invalid mockup ID" });
    const mockup = await Mockup.findById(req.params.id);
    if (!mockup) {
      removeFile(newPreview?.filename); removeFile(newDownload?.filename);
      return res.status(404).json({ message: "Mockup not found" });
    }

    const { title, description, category, featured } = req.body;
    if (title !== undefined) mockup.title = title.trim();
    if (description !== undefined) mockup.description = description;
    if (featured !== undefined) mockup.featured = featured === "true" || featured === true;
    if (req.body.tags !== undefined) mockup.tags = parseTags(req.body.tags);
    if (category !== undefined) {
      if (!mongoose.Types.ObjectId.isValid(category) || !(await Category.exists({ _id: category }))) {
        removeFile(newPreview?.filename); removeFile(newDownload?.filename);
        return res.status(400).json({ message: "Invalid category" });
      }
      mockup.category = category;
    }
    if (newPreview) { const old = mockup.previewImage; mockup.previewImage = newPreview.filename; removeFile(old); }
    if (newDownload) { const old = mockup.downloadFile; mockup.downloadFile = newDownload.filename; removeFile(old); }

    await mockup.save();
    res.json(serialize(req, await Mockup.findById(mockup._id).populate("category")));
  } catch (error) {
    removeFile(newPreview?.filename); removeFile(newDownload?.filename);
    res.status(500).json({ message: "Failed to update mockup", error: error.message });
  }
};

const deleteMockup = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) return res.status(400).json({ message: "Invalid mockup ID" });
    const mockup = await Mockup.findById(req.params.id);
    if (!mockup) return res.status(404).json({ message: "Mockup not found" });
    removeFile(mockup.previewImage); removeFile(mockup.downloadFile);
    await mockup.deleteOne();
    res.json({ message: "Mockup deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete mockup", error: error.message });
  }
};

const downloadMockup = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) return res.status(400).json({ message: "Invalid mockup ID" });
    const mockup = await Mockup.findById(req.params.id);
    if (!mockup) return res.status(404).json({ message: "Mockup not found" });
    const fileName = path.basename(mockup.downloadFile || "");
    const filePath = path.join(uploadDir, fileName);
    if (!fileName || !fs.existsSync(filePath)) return res.status(404).json({ message: "Download file not found on server" });
    await Mockup.updateOne({ _id: mockup._id }, { $inc: { downloads: 1 } });
    res.download(filePath, fileName);
  } catch (error) {
    res.status(500).json({ message: "Failed to download mockup", error: error.message });
  }
};

module.exports = { getMockups, getMockup, createMockup, updateMockup, deleteMockup, downloadMockup };
