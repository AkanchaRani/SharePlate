// middleware/upload.js
// MIDDLEWARE 3 - File upload using Multer.
// Accepts ONE optional image in the form field named "image".
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

const UPLOAD_FOLDER = path.join(__dirname, '..', 'uploads');
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

// Allowed types. The file extension we save comes from THIS table,
// not from the name the user sent, so the user cannot choose the saved name or path.
const ALLOWED_TYPES = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
};
const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp'];

// Where and how to save the file.
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, UPLOAD_FOLDER);
  },
  filename: (req, file, callback) => {
    // Safe unique name: random id + extension chosen by us.
    const uniqueName = crypto.randomUUID() + ALLOWED_TYPES[file.mimetype];
    callback(null, uniqueName);
  },
});

// Decide whether a file is allowed. Called before the file is saved.
function fileFilter(req, file, callback) {
  const extension = path.extname(file.originalname).toLowerCase();
  const typeIsAllowed = ALLOWED_TYPES[file.mimetype] !== undefined;
  const extensionIsAllowed = ALLOWED_EXTENSIONS.includes(extension);

  if (typeIsAllowed && extensionIsAllowed) {
    callback(null, true);
  } else {
    const error = new Error('Unsupported file type. Please upload a JPG, JPEG, PNG or WebP image.');
    error.statusCode = 400;
    callback(error); // goes to the central error handler
  }
}

// upload.single("image") = accept one file from the field called "image".
const uploadImage = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: MAX_FILE_SIZE },
}).single('image');

// Helper: delete a saved image. path.basename() removes any folder parts,
// so only a file inside the uploads folder can ever be deleted.
function deleteUploadedFile(filename) {
  if (!filename) return;
  const safeName = path.basename(filename);
  fs.unlink(path.join(UPLOAD_FOLDER, safeName), () => {
    // If the file is already gone, we simply ignore the error.
  });
}

module.exports = { uploadImage, deleteUploadedFile, UPLOAD_FOLDER };
