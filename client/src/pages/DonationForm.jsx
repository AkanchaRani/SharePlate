import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { getDonation, createDonation, updateDonation, getImageUrl } from '../services/donationApi.js';

const CATEGORIES = ['Cooked Meal', 'Fresh Produce', 'Packaged Food', 'Bakery', 'Other'];

const EMPTY_FORM = {
  title: '',
  donorName: '',
  category: 'Cooked Meal',
  quantity: '',
  pickupLocation: '',
  pickupDeadline: '',
};

// An ISO date from the database -> the "2026-11-05T18:30" text a datetime-local input needs.
function toInputValue(isoDate) {
  const date = new Date(isoDate);
  const localTime = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return localTime.toISOString().slice(0, 16);
}

// One page used for both: Add (POST) and Edit (PUT).
function DonationForm() {
  const { id } = useParams(); // id exists only on /donations/:id/edit
  const isEditing = Boolean(id);
  const navigate = useNavigate();

  const [formData, setFormData] = useState(EMPTY_FORM);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState('');
  const [currentImage, setCurrentImage] = useState('');
  const [isLoading, setIsLoading] = useState(isEditing);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (!imageFile) {
      return undefined;
    }
    const reader = new FileReader();
    reader.onload = () => setImagePreviewUrl(reader.result);
    reader.readAsDataURL(imageFile);
    return () => reader.abort();
  }, [imageFile]);

  // Edit mode: load the existing donation (GET /api/donations/:id) to fill the form.
  useEffect(() => {
    if (!id) return;
    async function loadDonation() {
      try {
        const result = await getDonation(id);
        const donation = result.data;
        setFormData({
          title: donation.title,
          donorName: donation.donorName,
          category: donation.category,
          quantity: donation.quantity,
          pickupLocation: donation.pickupLocation,
          pickupDeadline: toInputValue(donation.pickupDeadline),
        });
        setCurrentImage(donation.imageFilename);
      } catch (error) {
        setErrorMessage(error.message);
      } finally {
        setIsLoading(false);
      }
    }
    loadDonation();
  }, [id]);

  // Update one field in formData whenever the user types.
  function handleChange(event) {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  }

  async function handleSubmit(event) {
    event.preventDefault(); // stop the browser from reloading the page
    setErrorMessage('');
    setIsSaving(true);

    // The browser's local time is converted to a standard date string for the API.
    const deadlineIso = formData.pickupDeadline ? new Date(formData.pickupDeadline).toISOString() : '';

    try {
      if (isEditing) {
        // PUT sends JSON
        await updateDonation(id, { ...formData, pickupDeadline: deadlineIso });
      } else {
        // POST sends multipart/form-data so the image file can travel with the text
        const body = new FormData();
        body.append('title', formData.title);
        body.append('donorName', formData.donorName);
        body.append('category', formData.category);
        body.append('quantity', formData.quantity);
        body.append('pickupLocation', formData.pickupLocation);
        body.append('pickupDeadline', deadlineIso);
        if (imageFile) {
          body.append('image', imageFile); // field name must be "image"
        }
        await createDonation(body);
      }
      navigate('/donations', {
        state: { notice: isEditing ? 'Your donation listing has been updated.' : 'Your food donation has been added.' },
      }); // return to the list, where the saved data is shown
    } catch (error) {
      setErrorMessage(error.message);
      setIsSaving(false);
    }
  }

  if (isLoading) {
    return (
      <section className="section">
        <div className="container form-container">
          <p>Loading donation...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="section donate-page">
      <div className="container donation-form-layout">
        <aside className="donate-intro">
          <p className="section-kicker">A little food can go a long way</p>
          <h1>{isEditing ? 'Update your listing.' : 'Help good food reach people.'}</h1>
          <p className="donate-intro-copy">
            {isEditing
              ? 'Keep the pickup information current so people know what to expect.'
              : 'Add a few clear details so someone nearby can collect the food in time.'}
          </p>
          <div className="donate-guidance">
            <p><span>01</span> Describe the food and quantity</p>
            <p><span>02</span> Add a pickup place and deadline</p>
            <p><span>03</span> Include a photo if you have one</p>
          </div>
          <p className="donate-aside-note">Please list food that is safe to collect and share.</p>
        </aside>

        <div className="form-panel">
          <div className="form-panel-heading">
            <p className="section-kicker">Donation details</p>
            <h2>{isEditing ? 'Edit the details' : 'What are you sharing?'}</h2>
            <p>{isEditing ? 'Make your changes, then save the listing.' : 'Fields marked as required must be filled in.'}</p>
          </div>

          {errorMessage && (
            <p className="message message-error" role="alert">
              {errorMessage}
            </p>
          )}

          <form onSubmit={handleSubmit} className="donation-form">
          <label htmlFor="title">Food title <span className="required-mark">*</span></label>
          <input id="title" name="title" type="text" value={formData.title} onChange={handleChange} required />

          <label htmlFor="donorName">Donor name <span className="required-mark">*</span></label>
          <input
            id="donorName"
            name="donorName"
            type="text"
            value={formData.donorName}
            onChange={handleChange}
            required
          />

          <label htmlFor="category">Category <span className="required-mark">*</span></label>
          <select id="category" name="category" value={formData.category} onChange={handleChange} required>
            {CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>

          <label htmlFor="quantity">Quantity <span className="required-mark">*</span></label>
          <input
            id="quantity"
            name="quantity"
            type="text"
            placeholder="for example: 20 meal boxes"
            value={formData.quantity}
            onChange={handleChange}
            required
          />

          <label htmlFor="pickupLocation">Pickup location <span className="required-mark">*</span></label>
          <input
            id="pickupLocation"
            name="pickupLocation"
            type="text"
            placeholder="For example: Main gate, Block A"
            value={formData.pickupLocation}
            onChange={handleChange}
            required
          />

          <label htmlFor="pickupDeadline">Pickup deadline <span className="required-mark">*</span></label>
          <input
            id="pickupDeadline"
            name="pickupDeadline"
            type="datetime-local"
            value={formData.pickupDeadline}
            onChange={handleChange}
            required
          />
          <p className="field-hint">Choose the latest time someone can collect the food.</p>

          {/* The image can be chosen when adding. It is not changed when editing. */}
          {isEditing ? (
            currentImage && (
              <div className="current-image">
                <p>Current photo (a photo cannot be changed while editing):</p>
                <img src={getImageUrl(currentImage)} alt="Current donation" />
              </div>
            )
          ) : (
            <>
              <label htmlFor="image">Photo (optional)</label>
              <input
                id="image"
                name="image"
                type="file"
                accept=".jpg,.jpeg,.png,.webp"
                onChange={(event) => {
                  setImagePreviewUrl('');
                  setImageFile(event.target.files[0] || null);
                }}
              />
              {imagePreviewUrl && (
                <div className="upload-preview">
                  <img src={imagePreviewUrl} alt="Preview of the selected donation food" />
                  <span>Photo preview</span>
                </div>
              )}
              <p className="field-hint">JPG, PNG or WebP, up to 5 MB.</p>
            </>
          )}

          <div className="form-buttons">
            <button type="submit" className="button button-primary" disabled={isSaving}>
              {isSaving ? 'Saving...' : isEditing ? 'Save changes' : 'Add donation'}
            </button>
            <Link to="/donations" className="button button-outline">
              Cancel
            </Link>
          </div>
          </form>
        </div>
      </div>
    </section>
  );
}

export default DonationForm;
