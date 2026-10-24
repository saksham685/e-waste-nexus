import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { LandingPage } from './pages/LandingPage';
import { UserDashboard } from './pages/UserDashboard';
import { PartnerDashboard } from './pages/PartnerDashboard';
import { RecyclerDashboard } from './pages/RecyclerDashboard';
import { EprDashboard } from './pages/EprDashboard';
import { AdminDashboard } from './pages/AdminDashboard';
import { CentersPage } from './pages/CentersPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';

const AppContent: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<string>('landing');
  const { user } = useAuth();

  const handleNavigate = (tab: string) => {
    setCurrentTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-nexus-dark text-slate-100 relative">
      <Navbar currentTab={currentTab} onNavigate={handleNavigate} />

      <main className="flex-1">
        {currentTab === 'landing' && <LandingPage onNavigate={handleNavigate} />}
        {currentTab === 'pickups' && <UserDashboard />}
        {currentTab === 'partner' && <PartnerDashboard />}
        {currentTab === 'recycler' && <RecyclerDashboard />}
        {currentTab === 'epr' && <EprDashboard />}
        {currentTab === 'admin' && <AdminDashboard />}
        {currentTab === 'centers' && <CentersPage onSchedulePickup={() => handleNavigate('pickups')} />}
        {currentTab === 'analytics' && <AnalyticsPage />}
        {currentTab === 'login' && <LoginPage onNavigate={handleNavigate} />}
        {currentTab === 'register' && <RegisterPage onNavigate={handleNavigate} />}
      </main>

      <Footer onNavigate={handleNavigate} />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;
