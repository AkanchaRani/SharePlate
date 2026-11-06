// models/Donation.js
// The Mongoose model: describes what one donation looks like in MongoDB.
const mongoose = require('mongoose');

// The only categories the app accepts (also used by the validation middleware).
const CATEGORIES = ['Cooked Meal', 'Fresh Produce', 'Packaged Food', 'Bakery', 'Other'];

const donationSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    donorName: { type: String, required: true, trim: true },
    category: { type: String, required: true, enum: CATEGORIES },
    quantity: { type: String, required: true, trim: true }, // example: "20 meal boxes"
    pickupLocation: { type: String, required: true, trim: true },
    pickupDeadline: { type: Date, required: true },
    // We store ONLY the generated file name (for example "a1b2.jpg"), never a full path.
    imageFilename: { type: String, default: '' },
  },
  { timestamps: true } // Mongoose adds createdAt and updatedAt for us
);

const Donation = mongoose.model('Donation', donationSchema);

module.exports = Donation;
module.exports.CATEGORIES = CATEGORIES;
