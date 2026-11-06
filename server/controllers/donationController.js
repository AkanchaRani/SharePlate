// controllers/donationController.js
// CONTROLLER - the functions that do the real work with the database.
// The route file only decides WHICH function runs. These functions decide WHAT happens.
// Every function: talk to the model -> send a JSON response. Errors go to next(error).
const Donation = require('../models/Donation');
const { deleteUploadedFile } = require('../middleware/upload');

// Take only the fields we allow from req.body (ignores anything extra).
function pickDonationFields(body) {
  return {
    title: body.title,
    donorName: body.donorName,
    category: body.category,
    quantity: body.quantity,
    pickupLocation: body.pickupLocation,
    pickupDeadline: body.pickupDeadline,
  };
}

// GET /api/donations  - list all donations, newest first
async function getAllDonations(req, res, next) {
  try {
    const donations = await Donation.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: donations.length, data: donations });
  } catch (error) {
    next(error);
  }
}

// GET /api/donations/:id  - one donation
async function getDonationById(req, res, next) {
  try {
    const donation = await Donation.findById(req.params.id);
    if (!donation) {
      return res.status(404).json({ success: false, message: 'Donation not found.' });
    }
    res.status(200).json({ success: true, data: donation });
  } catch (error) {
    next(error);
  }
}

// POST /api/donations  - create a donation (multipart/form-data, optional "image")
async function createDonation(req, res, next) {
  try {
    const donationData = pickDonationFields(req.body);

    // req.file exists only if Multer saved an image. We keep just its generated name.
    if (req.file) {
      donationData.imageFilename = req.file.filename;
    }

    const newDonation = await Donation.create(donationData);
    res.status(201).json({ success: true, message: 'Donation added.', data: newDonation });
  } catch (error) {
    // Saving failed, so do not leave an orphan image on disk.
    if (req.file) {
      deleteUploadedFile(req.file.filename);
    }
    next(error);
  }
}

// PUT /api/donations/:id  - update the text fields (JSON body)
async function updateDonation(req, res, next) {
  try {
    const updatedDonation = await Donation.findByIdAndUpdate(req.params.id, pickDonationFields(req.body), {
      new: true, // return the updated record
      runValidators: true, // apply schema rules to the update too
    });
    if (!updatedDonation) {
      return res.status(404).json({ success: false, message: 'Donation not found.' });
    }
    res.status(200).json({ success: true, message: 'Donation updated.', data: updatedDonation });
  } catch (error) {
    next(error);
  }
}

// DELETE /api/donations/:id  - remove the record and its image file
async function deleteDonation(req, res, next) {
  try {
    const deletedDonation = await Donation.findByIdAndDelete(req.params.id);
    if (!deletedDonation) {
      return res.status(404).json({ success: false, message: 'Donation not found.' });
    }
    deleteUploadedFile(deletedDonation.imageFilename);
    res.status(200).json({ success: true, message: 'Donation deleted.' });
  } catch (error) {
    next(error);
  }
}

module.exports = { getAllDonations, getDonationById, createDonation, updateDonation, deleteDonation };
