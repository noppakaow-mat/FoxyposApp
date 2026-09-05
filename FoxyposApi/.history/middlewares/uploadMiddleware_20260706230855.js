const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      Date.now() + "-" + file.originalname
    );
  },
});

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname);

  if (ext !== ".xlsx" && ext !== ".xls") {
    return cb(new Error("Only Excel files allowed"));
  }

  cb(null, true);
};

const upload = multer({ storage, fileFilter });

module.exports = upload;