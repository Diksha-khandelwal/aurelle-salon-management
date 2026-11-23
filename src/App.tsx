import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { ScissorsTransition } from './components/common/ScissorsTransition';
import { HomeScreen } from './pages/HomeScreen';
import { JoinQueueScreen } from './pages/JoinQueueScreen';
import { StatusTrackerScreen } from './pages/StatusTrackerScreen';
import { ReceptionDashboardScreen } from './pages/ReceptionDashboardScreen';
import { BarberWorkstationScreen } from './pages/BarberWorkstationScreen';
import { WallDisplayScreen } from './pages/WallDisplayScreen';
import { AdminSettingsScreen } from './pages/AdminSettingsScreen';
import { TestSuiteScreen } from './pages/TestSuiteScreen';

// Layout wrapper providing proper top offset below fixed header
const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const isHome = location.pathname === '/';
  const isDisplay = location.pathname === '/display';

  return (
    <div className={`flex-1 flex flex-col ${!isHome && !isDisplay ? 'pt-24 sm:pt-28' : ''}`}>
      {children}
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <LanguageProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-[#FBF9F5] flex flex-col font-sans selection:bg-[#C5A880]/30 selection:text-[#162E25]">
          <Header />
          <MainLayout>
            <ScissorsTransition>
              <Routes>
                {/* Customer Views */}
                <Route path="/" element={<HomeScreen />} />
                <Route path="/join" element={<JoinQueueScreen />} />
                <Route path="/status/:id" element={<StatusTrackerScreen />} />

                {/* Operations & Staff Views */}
                <Route path="/reception" element={<ReceptionDashboardScreen />} />
                <Route path="/barber/:slug" element={<BarberWorkstationScreen />} />
                <Route path="/display" element={<WallDisplayScreen />} />
                <Route path="/admin" element={<AdminSettingsScreen />} />

                {/* 15-Point Diagnostics & Test Runner */}
                <Route path="/test-suite" element={<TestSuiteScreen />} />

                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </ScissorsTransition>
          </MainLayout>
          <Footer />
        </div>
      </BrowserRouter>
    </LanguageProvider>
  );
};

export default App;
