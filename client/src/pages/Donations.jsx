import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import DonationCard from '../components/DonationCard.jsx';
import { getDonations, deleteDonation } from '../services/donationApi.js';

function Donations() {
  const location = useLocation();
  const [donations, setDonations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [searchText, setSearchText] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All categories');
  const [sortBy, setSortBy] = useState('newest');

  const categories = ['Cooked Meal', 'Fresh Produce', 'Packaged Food', 'Bakery', 'Other'];
  const visibleDonations = donations
    .filter((donation) => {
      const searchValue = [donation.title, donation.quantity, donation.pickupLocation, donation.donorName]
        .join(' ')
        .toLowerCase();
      const matchesText = searchValue.includes(searchText.trim().toLowerCase());
      const matchesCategory = categoryFilter === 'All categories' || donation.category === categoryFilter;
      return matchesText && matchesCategory;
    })
    .sort((first, second) => {
      if (sortBy === 'deadline') {
        return new Date(first.pickupDeadline) - new Date(second.pickupDeadline);
      }
      return new Date(second.createdAt) - new Date(first.createdAt);
    });

  // Runs once when the page opens: GET /api/donations
  useEffect(() => {
    async function loadDonations() {
      try {
        const result = await getDonations();
        setDonations(result.data);
      } catch (error) {
        setErrorMessage(error.message);
      } finally {
        setIsLoading(false);
      }
    }
    loadDonations();
  }, []);

  // DELETE /api/donations/:id, then remove the card from the screen
  async function handleDelete(donation) {
    const confirmed = window.confirm('Delete "' + donation.title + '"? This cannot be undone.');
    if (!confirmed) return;

    try {
      await deleteDonation(donation._id);
      setDonations(donations.filter((item) => item._id !== donation._id));
    } catch (error) {
      setErrorMessage(error.message);
    }
  }

  return (
    <section className="section browse-page">
      <div className="container">
        <div className="browse-banner">
          <div>
            <p className="section-kicker">SharePlate community board</p>
            <h1>Food can find a new table.</h1>
            <p>Browse surplus food shared nearby and check when and where it can be collected.</p>
          </div>
          <Link to="/donations/new" className="button button-accent">
            Share food
          </Link>
        </div>

        {location.state?.notice && (
          <p className="message message-success" role="status">{location.state.notice}</p>
        )}

        <div className="listing-heading">
          <div>
            <p className="section-kicker">Available now</p>
            <h2>Food listings</h2>
          </div>
          {!isLoading && !errorMessage && (
            <span className="listing-count">{visibleDonations.length} of {donations.length} shared</span>
          )}
        </div>

        {!isLoading && !errorMessage && (
          <div className="listing-tools" aria-label="Filter food listings">
            <label className="search-control">
              <span>Search food or location</span>
              <input
                type="search"
                value={searchText}
                onChange={(event) => setSearchText(event.target.value)}
                placeholder="Try ‘vegetables’ or ‘library’"
              />
            </label>
            <label>
              <span>Category</span>
              <select value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value)}>
                <option>All categories</option>
                {categories.map((category) => <option key={category}>{category}</option>)}
              </select>
            </label>
            <label>
              <span>Sort by</span>
              <select value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
                <option value="newest">Newest</option>
                <option value="deadline">Pickup deadline</option>
              </select>
            </label>
          </div>
        )}

        {isLoading && <p>Loading donations...</p>}

        {errorMessage && (
          <p className="message message-error" role="alert">
            {errorMessage}
          </p>
        )}

        {!isLoading && !errorMessage && donations.length === 0 && (
          <div className="browse-empty">
            <div className="empty-plate" aria-hidden="true"><span>+</span></div>
            <div className="browse-empty-copy">
              <h3>Nothing on the table yet</h3>
              <p>When someone shares surplus food, the details will show up here for the community.</p>
            </div>
            <Link to="/donations/new" className="button button-primary">
              Add the first listing
            </Link>
          </div>
        )}

        {!isLoading && !errorMessage && donations.length > 0 && visibleDonations.length === 0 && (
          <div className="browse-empty browse-empty-filtered">
            <div className="browse-empty-copy">
              <h3>No matching food found</h3>
              <p>Try another search or choose a different category.</p>
            </div>
          </div>
        )}

        <div className="donation-grid">
          {visibleDonations.map((donation) => (
            <DonationCard key={donation._id} donation={donation} onDelete={handleDelete} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default Donations;
