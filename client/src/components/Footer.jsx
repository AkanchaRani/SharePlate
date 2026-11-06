import Logo from './Logo.jsx';

function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <div className="footer-brand">
          <Logo size={28} />
          <span>Saving food. Sharing smiles. Building hope.</span>
        </div>
        <p>Built by Akancha Rani</p>
      </div>
    </footer>
  );
}

export default Footer;
