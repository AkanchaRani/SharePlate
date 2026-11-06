import { useState } from 'react';
import { Link } from 'react-router-dom';
import Logo from '../components/Logo.jsx';

function Home() {
  // The hero photo lives at client/public/images/hero.jpg.
  // If the file cannot be loaded, the big logo is shown in its place instead.
  const [heroPhotoLoaded, setHeroPhotoLoaded] = useState(true);

  return (
    <>
      {/* The hero introduces the project and gives donors and receivers clear next steps. */}
      <section className="hero">
        <div className="hero-panel">
          <p className="hero-eyebrow">A local food-sharing board</p>
          {heroPhotoLoaded && <Logo size={64} />}
          <p className="hero-tagline">Save Food. Share Hope.</p>
          <h1 className="hero-message">
            <span>Good food </span><span>deserves a </span><span>second chance.</span>
          </h1>
          <p className="hero-description">
            Bridging the gap between surplus food and empty plates.
          </p>
          <div className="hero-buttons">
            <Link to="/donations/new" className="button button-accent">
              Donate Food
            </Link>
            <Link to="/donations" className="button button-light">
              Find Available Food
            </Link>
          </div>
        </div>

        <div className="hero-visual">
          {heroPhotoLoaded ? (
            <img
              className="hero-photo"
              src="/images/hero.jpg"
              alt="Volunteers preparing food parcels to share with their community"
              onError={() => setHeroPhotoLoaded(false)}
            />
          ) : (
            <div className="hero-mark">
              <Logo size={260} />
            </div>
          )}
        </div>
      </section>

      <section id="impact" className="quote-band" aria-label="SharePlate promise">
        <div className="container quote-band-inner">
          <p className="section-kicker">The SharePlate promise</p>
          <p className="quote-line">Waste less. Share more. Care always.</p>
        </div>
      </section>

      <section id="how-it-works" className="section how-section">
        <div className="container">
          <div className="how-heading">
            <p className="section-kicker">Simple, timely, local</p>
            <h2>Three Steps. One Meaningful Impact.</h2>
            <p>Share surplus food, connect with a receiver, and help it reach the right hands.</p>
          </div>
          <div className="how-steps">
            <article className="how-step">
              <span className="step-number">01</span>
              <h3>Share</h3>
              <p>Have extra food? Make it available for someone who needs it.</p>
            </article>
            <article className="how-step">
              <span className="step-number">02</span>
              <h3>Connect</h3>
              <p>Connect with nearby NGOs and food receivers through clear pickup details.</p>
            </article>
            <article className="how-step">
              <span className="step-number">03</span>
              <h3>Rescue</h3>
              <p>Complete the pickup and give good food a second chance.</p>
            </article>
          </div>
        </div>
      </section>

      <section id="why-shareplate" className="section why-section">
        <div className="container">
          <div className="how-heading">
            <p className="section-kicker">Why SharePlate</p>
            <h2>More Than Food. It’s About Humanity.</h2>
          </div>
          <div className="why-grid">
            <article>
              <span className="step-number">01</span>
              <h3>Reduce food waste</h3>
              <p>Save perfectly good food from going to waste.</p>
            </article>
            <article>
              <span className="step-number">02</span>
              <h3>Spread kindness</h3>
              <p>A little generosity can make a big difference.</p>
            </article>
            <article>
              <span className="step-number">03</span>
              <h3>Build stronger communities</h3>
              <p>Together, good food can reach the right hands.</p>
            </article>
          </div>
        </div>
      </section>

      <section id="start-sharing" className="final-cta">
        <div className="container final-cta-inner">
          <div>
            <p className="section-kicker">A little can go a long way</p>
            <h2>Have more than you need? Someone needs what you have.</h2>
            <p>Join SharePlate in giving surplus food a purpose, one contribution at a time.</p>
          </div>
          <Link to="/donations/new" className="button button-accent">Start Sharing Today</Link>
        </div>
      </section>
    </>
  );
}

export default Home;
