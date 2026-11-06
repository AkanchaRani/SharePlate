// services/donationApi.js
// All calls from React to the Express REST API are kept in this one file.
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Full web address of an uploaded image (served by Express at /uploads).
export function getImageUrl(imageFilename) {
  return API_URL + '/uploads/' + imageFilename;
}

// Sends the request, reads the JSON reply, and throws a readable error if something failed.
async function sendRequest(path, options) {
  let response;
  try {
    response = await fetch(API_URL + '/api/donations' + path, options);
  } catch {
    throw new Error('Cannot reach the SharePlate server. Start it with "npm start" in the server folder.');
  }

  const result = await response.json();

  if (!response.ok) {
    // result.errors holds the list from the validation middleware
    const details = result.errors ? ' ' + result.errors.join('. ') + '.' : '';
    throw new Error(result.message + details);
  }
  return result;
}

// GET /api/donations
export function getDonations() {
  return sendRequest('', { method: 'GET' });
}

// GET /api/donations/:id
export function getDonation(id) {
  return sendRequest('/' + id, { method: 'GET' });
}

// POST /api/donations  (formData because the request can contain an image file)
// Do not set Content-Type here: the browser adds it, including the multipart boundary.
export function createDonation(formData) {
  return sendRequest('', { method: 'POST', body: formData });
}

// PUT /api/donations/:id  (plain JSON)
export function updateDonation(id, donationData) {
  return sendRequest('/' + id, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(donationData),
  });
}

// DELETE /api/donations/:id
export function deleteDonation(id) {
  return sendRequest('/' + id, { method: 'DELETE' });
}
