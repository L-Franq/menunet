require("dotenv").config();
const crypto = require("crypto");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

const uploadDir = process.env.PERSISTENT_DISK_PATH || path.join(__dirname, "../uploads");
if(!fs.existsSync(uploadDir)){
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const hash = crypto.randomBytes(6).toString("hex");
    const fileName = `${hash}-${file.originalname}`;
    cb(null, fileName);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedMimes = ["image/jpeg", "image/pjpeg", "image/png", "image/gif"];
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Apenas imagens sao permitidas. tipo de arquivo invalido!"));
  }
};

const uploads = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 },
});

module.exports = { uploads };
