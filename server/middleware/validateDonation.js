// middleware/validateDonation.js
// MIDDLEWARE 2 - Validation.
// Checks the required fields BEFORE the controller runs.
// For POST this runs after Multer, because Multer is what fills req.body for multipart forms.
const { CATEGORIES } = require('../models/Donation');
const { deleteUploadedFile } = require('./upload');

const REQUIRED_FIELDS = ['title', 'donorName', 'category', 'quantity', 'pickupLocation', 'pickupDeadline'];

function validateDonation(req, res, next) {
  const errors = [];

  // 1. Every required field must be present and not just spaces.
  for (const field of REQUIRED_FIELDS) {
    const value = req.body[field];
    if (value === undefined || String(value).trim() === '') {
      errors.push(field + ' is required');
    }
  }

  // 2. Category must be one of the allowed values.
  if (req.body.category && !CATEGORIES.includes(req.body.category)) {
    errors.push('category must be one of: ' + CATEGORIES.join(', '));
  }

  // 3. Pickup deadline must be a real date.
  if (req.body.pickupDeadline && isNaN(new Date(req.body.pickupDeadline).getTime())) {
    errors.push('pickupDeadline must be a valid date');
  }

  if (errors.length > 0) {
    // The image was already saved by Multer, so remove it. Otherwise it would be left behind.
    if (req.file) {
      deleteUploadedFile(req.file.filename);
    }
    return res.status(400).json({ success: false, message: 'Please fix the form errors.', errors: errors });
  }

  next();
}

module.exports = validateDonation;
