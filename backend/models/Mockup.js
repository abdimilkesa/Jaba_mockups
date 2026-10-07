const mongoose = require("mongoose");

const mockupSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },

    previewImage: {
      type: String,
      required: true,
    },

    downloadFile: {
      type: String,
      required: true,
    },

    tags: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

const Mockup = mongoose.model("Mockup", mockupSchema);

module.exports = Mockup;