// App.jsx
// ROUTING (frontend) - React Router.
// All page routes of the website are listed here in one place.
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import Home from './pages/Home.jsx';
import Donations from './pages/Donations.jsx';
import DonationForm from './pages/DonationForm.jsx';
import NotFound from './pages/NotFound.jsx';

function App() {
  return (
    <>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/donations" element={<Donations />} />
          {/* The same form page is used for adding and for editing */}
          <Route path="/donations/new" element={<DonationForm />} />
          <Route path="/donations/:id/edit" element={<DonationForm />} />
          {/* "*" matches any other address = 404 page */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}

export default App;
