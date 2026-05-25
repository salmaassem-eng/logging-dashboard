import React, { useContext } from 'react';
import { AppContext, AppProvider } from './context/AppContext';
import Navbar from './components/Common/Navbar';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import AppDetails from './pages/AppDetails';

function AppContent() {
  const { developer, selectedAppId } = useContext(AppContext);

  // If the developer is not authenticated, show the Login/Register page
  if (!developer) {
    return <Login />;
  }

  return (
    <div className="min-h-screen bg-dark-bg text-slate-100 flex flex-col selection:bg-brand-500/30 selection:text-white">
      {/* Navigation Header */}
      <Navbar />
      
      {/* Main Workspace Router */}
      <main className="flex-grow pb-16">
        {selectedAppId ? (
          <AppDetails />
        ) : (
          <Dashboard />
        )}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
