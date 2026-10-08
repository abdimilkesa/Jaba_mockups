const multer = require("multer");
const path = require("path");
const fs = require("fs");

const uploadDir = path.join(__dirname, "../uploads");
fs.mkdirSync(uploadDir, { recursive: true });

const imageExtensions = [".jpg", ".jpeg", ".png", ".webp"];
const downloadExtensions = [".psd", ".zip", ".rar", ".ai", ".indd", ".sketch", ".fig"];

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, uniqueName);
  }
});

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (file.fieldname === "previewImage" && imageExtensions.includes(ext)) return cb(null, true);
  if (file.fieldname === "downloadFile" && downloadExtensions.includes(ext)) return cb(null, true);
  cb(new Error(`Invalid file type for ${file.fieldname}.`));
};

module.exports = multer({
  storage,
  fileFilter,
  limits: { fileSize: 500 * 1024 * 1024 }
});
