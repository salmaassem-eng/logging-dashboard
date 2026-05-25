import React, { createContext, useState, useEffect } from 'react';
import { initialApps, generateApiKey } from '../utils/mockData';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // Pre-seed developer account
  const defaultDeveloper = {
    name: 'Salma Assem',
    email: 'Salma@devops.io',
    apiKey: generateApiKey(),
    joinedDate: '2026-01-10T11:00:00Z',
  };

  const [developer, setDeveloper] = useState(() => {
    const saved = localStorage.getItem('log_dev');
    return saved ? JSON.parse(saved) : defaultDeveloper;
  });

  const [apps, setApps] = useState(() => {
    const saved = localStorage.getItem('log_apps');
    return saved ? JSON.parse(saved) : initialApps;
  });

  const [selectedAppId, setSelectedAppId] = useState(null);

  // Sync state to local storage
  useEffect(() => {
    if (developer) {
      localStorage.setItem('log_dev', JSON.stringify(developer));
    } else {
      localStorage.removeItem('log_dev');
    }
  }, [developer]);

  useEffect(() => {
    localStorage.setItem('log_apps', JSON.stringify(apps));
  }, [apps]);

  // Auth Operations
  const login = (email, password) => {
    // Basic verification: accept any credentials, seed with name from email
    const name = email.split('@')[0];
    const formattedName = name.charAt(0).toUpperCase() + name.slice(1);
    const user = {
      name: formattedName,
      email: email,
      apiKey: generateApiKey(),
      joinedDate: new Date().toISOString(),
    };
    setDeveloper(user);
    return { success: true };
  };

  const register = (name, email, password) => {
    const user = {
      name: name,
      email: email,
      apiKey: generateApiKey(),
      joinedDate: new Date().toISOString(),
    };
    setDeveloper(user);
    return { success: true };
  };

  const logout = () => {
    setDeveloper(null);
    setSelectedAppId(null);
  };

  // API Key Management
  const regenerateApiKey = () => {
    if (!developer) return;
    const updatedDev = { ...developer, apiKey: generateApiKey() };
    setDeveloper(updatedDev);

    // Also update API keys on all apps to match the developer's new key or keep them unique?
    // Let's assume each app has a unique key but they belong to the developer. Or we update the developer key.
    // The requirement says: "They can view their account's API key."
    // Let's keep application API keys separate, or they are generated per app, or they represent the developer's global key.
    // Let's also regenerate the app keys for demonstration, or keep them distinct. Let's make app keys regenerate if we want, or keep them as is.
  };

  // Application Management
  const createApp = (name, platform, description) => {
    const newApp = {
      id: 'app-' + Math.random().toString(36).substr(2, 9),
      name,
      platform,
      description: description || 'No description provided.',
      apiKey: generateApiKey(),
      createdAt: new Date().toISOString(),
      metrics: {
        totalLogs: 0,
        errorRate: 0.0,
        warningCount: 0,
        errorCount: 0,
      },
      logs: [],
    };
    setApps([newApp, ...apps]);
    return newApp;
  };

  const deleteApp = (id) => {
    setApps(apps.filter(app => app.id !== id));
    if (selectedAppId === id) {
      setSelectedAppId(null);
    }
  };

  // Get current selected application
  const selectedApp = apps.find(app => app.id === selectedAppId) || null;

  // Add dummy logs utility (telemetry simulation)
  const simulateLog = (appId, message, level) => {
    setApps(prevApps => {
      return prevApps.map(app => {
        if (app.id !== appId) return app;

        // Check if log message with this level already exists
        const logs = [...app.logs];
        const existingLogIndex = logs.findIndex(
          l => l.message === message && l.level === level
        );

        const now = new Date().toISOString();

        if (existingLogIndex > -1) {
          const log = { ...logs[existingLogIndex] };
          log.count += 1;
          log.lastOccurrence = now;
          logs[existingLogIndex] = log;
        } else {
          logs.unshift({
            id: 'log-' + Math.random().toString(36).substr(2, 9),
            message,
            level,
            count: 1,
            firstOccurrence: now,
            lastOccurrence: now,
          });
        }

        // Recalculate metrics
        const totalLogs = logs.reduce((sum, l) => sum + l.count, 0);
        const warningCount = logs.filter(l => l.level === 'warn').reduce((sum, l) => sum + l.count, 0);
        const errorCount = logs.filter(l => l.level === 'error' || l.level === 'critical').reduce((sum, l) => sum + l.count, 0);
        const errorRate = totalLogs > 0 ? parseFloat(((errorCount / totalLogs) * 100).toFixed(1)) : 0;

        return {
          ...app,
          metrics: {
            totalLogs,
            errorRate,
            warningCount,
            errorCount,
          },
          logs,
        };
      });
    });
  };

  return (
    <AppContext.Provider
      value={{
        developer,
        apps,
        selectedAppId,
        selectedApp,
        setSelectedAppId,
        login,
        register,
        logout,
        regenerateApiKey,
        createApp,
        deleteApp,
        simulateLog,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
