import React from 'react';
import { SessionSelector } from './components/SessionSelector';
import { DashboardLayout } from './components/DashboardLayout';
import { useRaceData } from './hooks/useRaceData';

const App: React.FC = () => {
  // Initialize data fetching hook
  useRaceData();

  return (
    <div className="h-full bg-background text-neutral-100 flex flex-col font-sans selection:bg-primary selection:text-white overflow-hidden">
      <SessionSelector />
      <main className="flex-1 relative overflow-hidden">
        <DashboardLayout />
      </main>
      <footer className="h-8 shrink-0 border-t border-border bg-surface text-[10px] text-muted flex items-center justify-center uppercase tracking-widest">
        Unofficial fan project. Not affiliated with Formula 1 companies. Data via OpenF1.
      </footer>
    </div>
  );
};

export default App;
