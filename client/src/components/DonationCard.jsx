import { Link } from 'react-router-dom';
import { getImageUrl } from '../services/donationApi.js';

// Shows ONE donation. The edit link and delete button belong to the REST demo (PUT and DELETE).
function DonationCard({ donation, onDelete }) {
  const deadlineText = new Date(donation.pickupDeadline).toLocaleString('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });

  return (
    <article className="donation-card">
      {/* The image is shown only if the donor uploaded one */}
      {donation.imageFilename && (
        <img className="donation-photo" src={getImageUrl(donation.imageFilename)} alt={donation.title} />
      )}

      <div className="donation-body">
        <p className="donation-category">{donation.category}</p>
        <h3>{donation.title}</h3>

        <dl className="donation-details">
          <dt>Donor</dt>
          <dd>{donation.donorName}</dd>
          <dt>Quantity</dt>
          <dd>{donation.quantity}</dd>
          <dt>Pickup at</dt>
          <dd>{donation.pickupLocation}</dd>
          <dt>Pickup by</dt>
          <dd>{deadlineText}</dd>
        </dl>

        <div className="card-actions">
          <Link to={'/donations/' + donation._id + '/edit'} className="button button-small button-outline">
            Edit
          </Link>
          <button type="button" className="button button-small button-danger" onClick={() => onDelete(donation)}>
            Delete
          </button>
        </div>
      </div>
    </article>
  );
}

export default DonationCard;
