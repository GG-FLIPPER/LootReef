import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import LandingAlt from './pages/LandingAlt';
import Advertise from './pages/Advertise';
import AdminSponsors from './pages/AdminSponsors';
import SearchApp from './components/SearchApp';
import ResetPassword from './components/ResetPassword';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/landing-alt" element={<LandingAlt />} />
      <Route path="/advertise" element={<Advertise />} />
      <Route path="/admin/sponsors" element={<AdminSponsors />} />
      <Route path="/app" element={<SearchApp />} />
      <Route path="/reset-password" element={<ResetPassword />} />
    </Routes>
  );
}

export default App;

