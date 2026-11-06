import { Link } from 'react-router-dom';

// Shown by the "*" route in App.jsx when the address does not match any page.
function NotFound() {
  return (
    <section className="section not-found-page">
      <div className="container not-found-layout">
        <div className="not-found-number" aria-hidden="true">404</div>
        <div className="not-found-copy">
          <p className="section-kicker">Wrong turn?</p>
          <h1>This page isn’t on the menu.</h1>
          <p>The address may be old, or the page may have moved. Let’s get you back to SharePlate.</p>
          <Link to="/" className="button button-accent">
            Back to Home
          </Link>
        </div>
      </div>
    </section>
  );
}

export default NotFound;
