//File that return a middleware that can upload images and also handle FormData type of req.body from frontend
function setUpUpload(path) {
  const multer = require("multer");
  const crypto = require("crypto");

  const fileStorageEngine = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, path);
    },
    filename: (req, file, cb) => {
      const token = crypto.randomBytes(15).toString("hex");
      cb(null, `${Date.now()}${token}${file.originalname}`);
    },
  });

  const upload = multer({ storage: fileStorageEngine });
  return upload;
}

module.exports = setUpUpload;
