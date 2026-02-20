import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Header } from './components/Header';
import { DashboardHero } from './components/DashboardHero';
import { StatsGrid } from './components/StatsGrid';
import { ActivityFeed } from './components/ActivityFeed';
import { QuestionsChart } from './components/QuestionsChart';
import { AccountSettings } from './components/AccountSettings';
import { LoginPage } from './components/LoginPage';
import { LandingPage } from './components/LandingPage';
import { PrivacyPage } from './components/PrivacyPage';
import { GetStartedPage } from './components/GetStartedPage';
import { Tab, TimeRange } from './types';
import { Reveal } from './components/ui/Reveal';
import { LoadingScreen } from './components/LoadingScreen';

type ViewState = 'landing' | 'login' | 'dashboard';

const App: React.FC = () => {
  const [initialLoading, setInitialLoading] = useState(true);
  const [view, setView] = useState<ViewState>('landing');
  const [activeTab, setActiveTab] = useState<Tab>(Tab.AGENT);
  const [timeRange, setTimeRange] = useState<TimeRange>('1d');

  const renderLandingView = () => {
    if (view === 'landing') {
      return <LandingPage onLoginClick={() => setView('login')} />;
    }

    if (view === 'login') {
      return <LoginPage onLogin={() => setView('dashboard')} onBack={() => setView('landing')} />;
    }

    return (
      <div className="min-h-screen bg-zinc-900 text-zinc-100 relative selection:bg-orange-500/30">
        {/* Background Grid Texture */}
        <div className="fixed inset-0 grid-bg opacity-[0.03] pointer-events-none z-0"></div>

        <Header
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onLogout={() => setView('landing')}
        />

        <main className="relative z-10 pb-24">
          {activeTab === Tab.AGENT ? (
            <React.Fragment key={timeRange}>
              <DashboardHero timeRange={timeRange} setTimeRange={setTimeRange} />

              <div className="max-w-7xl mx-auto px-4 md:px-12">
                {/* Main Dashboard Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-10">

                  {/* Section 1: Stats Grid - Spans full width */}
                  <div className="lg:col-span-12">
                    <StatsGrid />
                  </div>

                  <div className="lg:col-span-12 h-4 md:h-8 hidden lg:block"></div> {/* Visual Spacer */}

                  {/* Section 2: Activity Feed */}
                  <div className="lg:col-span-7 flex flex-col">
                    <Reveal delay={0.2} className="h-full">
                      <ActivityFeed />
                    </Reveal>
                  </div>

                  {/* Section 3: Questions */}
                  <div className="lg:col-span-5 flex flex-col">
                    <Reveal delay={0.4} className="h-full">
                      <QuestionsChart />
                    </Reveal>
                  </div>

                </div>
              </div>
            </React.Fragment>
          ) : (
            <AccountSettings />
          )}
        </main>

        {/* Sticky Footer / Status Bar */}
        <div className="fixed bottom-0 left-0 right-0 bg-zinc-950/90 backdrop-blur border-t border-zinc-800 py-2 px-6 flex justify-between items-center z-40 text-[10px] md:text-xs font-mono text-zinc-600 uppercase tracking-widest">
          <div>Task Rig v2.4.1</div>
          <div className="flex gap-6">
            <span className="hidden md:inline">Mem: 42%</span>
            <span className="hidden md:inline">Net: Secure</span>
            <span className="text-emerald-500 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              Connected
            </span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      {initialLoading && <LoadingScreen onComplete={() => setInitialLoading(false)} />}
      <Routes>
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/get-started" element={<GetStartedPage />} />
        <Route path="*" element={renderLandingView()} />
      </Routes>
    </>
  );
};

export default App;