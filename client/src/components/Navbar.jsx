import { Link, NavLink } from 'react-router-dom';
import Logo from './Logo.jsx';

function Navbar() {
  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link to="/" className="brand" aria-label="SharePlate home">
          <Logo size={34} />
          <span>SharePlate</span>
        </Link>
        <nav className="main-nav" aria-label="Main navigation">
          <NavLink to="/" end>
            Home
          </NavLink>
          <NavLink to="/donations" end>
            Browse Food
          </NavLink>
          <NavLink to="/donations/new" className="nav-donate">
            Donate Food
          </NavLink>
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
