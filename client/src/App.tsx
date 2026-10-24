import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CyberBackground3D } from './components/CyberBackground3D';
import { AuthGate } from './components/AuthGate';
import { PageTransition3D } from './components/PageTransition3D';
import { VoiceCompanion } from './components/VoiceCompanion';
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
  const { user, loading } = useAuth();

  const handleNavigate = (tab: string) => {
    setCurrentTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Loading state while verifying session token
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-nexus-dark text-slate-300">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin" />
          <span className="font-mono text-xs text-emerald-400 uppercase tracking-widest animate-pulse">
            Establishing 3D Neural Link...
          </span>
        </div>
      </div>
    );
  }

  // MANDATORY SECURITY GATE:
  // If user is not authenticated, the platform is 100% locked
  if (!user) {
    return (
      <div className="min-h-screen bg-nexus-dark text-slate-100 relative overflow-hidden flex flex-col justify-center">
        <CyberBackground3D />
        <AuthGate onAuthorized={() => handleNavigate('landing')} />
      </div>
    );
  }

  // FULL UNLOCKED PLATFORM WITH 3D TAB TRANSITIONS & VOICE COMPANION
  return (
    <div className="min-h-screen flex flex-col bg-nexus-dark/95 text-slate-100 relative">
      <CyberBackground3D />
      <Navbar currentTab={currentTab} onNavigate={handleNavigate} />

      <main className="flex-1 relative z-10">
        <PageTransition3D currentTab={currentTab}>
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
        </PageTransition3D>
      </main>

      {/* Floating 3D AI Voice Companion (Speech Narration & Voice Command Control) */}
      <VoiceCompanion currentTab={currentTab} onNavigate={handleNavigate} />

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
