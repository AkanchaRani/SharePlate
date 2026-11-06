// routes/donationRoutes.js
// ROUTING (backend) - Express Router.
// This file only maps  METHOD + URL  ->  middleware  ->  controller function.
// It is mounted at /api/donations in server.js, so "/" here means /api/donations.
const express = require('express');
const router = express.Router();

const {
  getAllDonations,
  getDonationById,
  createDonation,
  updateDonation,
  deleteDonation,
} = require('../controllers/donationController');
const { uploadImage } = require('../middleware/upload');
const validateDonation = require('../middleware/validateDonation');

router.get('/', getAllDonations); //            GET    /api/donations
router.get('/:id', getDonationById); //         GET    /api/donations/:id
router.post('/', uploadImage, validateDonation, createDonation); // POST   (Multer first, then validation, then controller)
router.put('/:id', validateDonation, updateDonation); //          PUT    /api/donations/:id
router.delete('/:id', deleteDonation); //       DELETE /api/donations/:id

module.exports = router;
