import React, { useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { LandingPage } from './pages/landing/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/dashboard/DashboardPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { ContactPage } from './pages/ContactPage';
import { TermsPage } from './pages/TermsPage';
import { GetStartedPage } from './pages/get-started/GetStartedPage';
import { LoadingScreen } from './components/ui/LoadingScreen';

const App: React.FC = () => {
  const [initialLoading, setInitialLoading] = useState(true);
  const navigate = useNavigate();

  return (
    <>
      {initialLoading && <LoadingScreen onComplete={() => setInitialLoading(false)} />}
      <Routes>
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/get-started" element={<GetStartedPage />} />
        <Route path="/login" element={<LoginPage onLogin={() => navigate('/dashboard')} onBack={() => navigate('/')} />} />
        <Route path="/dashboard" element={<DashboardPage onLogout={() => navigate('/')} />} />
        <Route path="*" element={<LandingPage onLoginClick={() => navigate('/login')} />} />
      </Routes>
    </>
  );
};

export default App;
