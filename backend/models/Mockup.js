const mongoose = require("mongoose");

const mockupSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 150 },
    description: { type: String, trim: true, maxlength: 2000 },
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
    previewImage: { type: String, required: true },
    downloadFile: { type: String, required: true },
    tags: { type: [String], default: [] },
    downloads: { type: Number, default: 0 },
    featured: { type: Boolean, default: false }
  },
  { timestamps: true }
);

mockupSchema.index({ title: "text", description: "text", tags: "text" });
mockupSchema.index({ category: 1, createdAt: -1 });

module.exports = mongoose.model("Mockup", mockupSchema);
