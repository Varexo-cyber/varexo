import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { LanguageProvider } from './contexts/LanguageContext';
import { mockAuth } from './services/mockAuth';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import OverOns from './pages/OverOns';
import Diensten from './pages/Diensten';
import Portfolio from './pages/Portfolio';
import Prijzen from './pages/Prijzen';
import Werkwijze from './pages/Werkwijze';
import Contact from './pages/Contact';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import AdminDashboard from './pages/Admin';
import PrivacyPolicy from './pages/PrivacyPolicy';
import AlgemeneVoorwaarden from './pages/AlgemeneVoorwaarden';
import CookiePolicy from './pages/CookiePolicy';
import WhatsAppButton from './components/WhatsAppButton';
import PromoBanner from './components/PromoBanner';
import HelpWidget from './components/HelpWidget';

function App() {
  const [, setUser] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const unsubscribe = mockAuth.onAuthChanged((currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-500 mx-auto"></div>
          <p className="mt-4 text-gray-400">Laden...</p>
        </div>
      </div>
    );
  }

  return (
    <HelmetProvider>
    <LanguageProvider>
    <Router>
      <div className="min-h-screen bg-dark-900">
        <Header />
        <PromoBanner />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/over-ons" element={<OverOns />} />
            <Route path="/diensten" element={<Diensten />} />
            <Route path="/portfolio" element={<Portfolio />} />
            <Route path="/prijzen" element={<Prijzen />} />
            <Route path="/werkwijze" element={<Werkwijze />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/algemene-voorwaarden" element={<AlgemeneVoorwaarden />} />
            <Route path="/cookie-policy" element={<CookiePolicy />} />
          </Routes>
        </main>
        <Footer />
        <HelpWidget />
        <WhatsAppButton />
      </div>
    </Router>
    </LanguageProvider>
    </HelmetProvider>
  );
}

export default App;
