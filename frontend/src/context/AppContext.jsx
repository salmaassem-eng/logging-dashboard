import React, { createContext, useState, useEffect, useCallback } from 'react';

export const AppContext = createContext();

const API_BASE = 'http://localhost:5000/api';

export const AppProvider = ({ children }) => {
  const [developer, setDeveloper] = useState(() => {
    const saved = localStorage.getItem('log_dev');
    return saved ? JSON.parse(saved) : null;
  });

  const [apps, setApps] = useState([]);
  const [selectedAppId, setSelectedAppId] = useState(null);
  
  // Log specific states
  const [logs, setLogs] = useState([]);
  const [logsMetrics, setLogsMetrics] = useState({
    totalLogs: 0,
    errorRate: 0,
    warningCount: 0,
    errorCount: 0,
  });
  const [logsPagination, setLogsPagination] = useState({
    page: 1,
    limit: 10,
    totalPages: 1,
    totalLogs: 0,
  });
  const [isLoadingLogs, setIsLoadingLogs] = useState(false);

  // Sync developer context to localStorage
  useEffect(() => {
    if (developer) {
      localStorage.setItem('log_dev', JSON.stringify(developer));
    } else {
      localStorage.removeItem('log_dev');
      localStorage.removeItem('token');
    }
  }, [developer]);

  // Fetch all applications
  const fetchApps = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const res = await fetch(`${API_BASE}/applications`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await res.json();
      
      if (res.ok) {
        setApps(data.data);
      } else if (res.status === 401) {
        // Session expired
        logout();
      }
    } catch (error) {
      console.error('Failed to fetch applications:', error);
    }
  }, []);

  // Fetch applications when logged in
  useEffect(() => {
    if (developer) {
      fetchApps();
    } else {
      setApps([]);
    }
  }, [developer, fetchApps]);

  // Auth Operations
  const login = async (email, password) => {
    try {
      const res = await fetch(`${API_BASE}/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      
      const data = await res.json();

      if (!res.ok) {
        return {
          success: false,
          message: data.message || data.error || 'Authentication failed',
        };
      }

      // Store JWT token
      localStorage.setItem('token', data.token);
      setDeveloper({
        id: data.developer.id,
        name: data.developer.username,
        email: data.developer.email,
        apiKey: data.developer.apiKey,
      });

      return { success: true };
    } catch (err) {
      return { success: false, message: 'Server connection timeout. Verify the backend is active.' };
    }
  };

  const register = async (name, email, password) => {
    try {
      const res = await fetch(`${API_BASE}/users/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: name, email, password }),
      });
      
      const data = await res.json();

      if (!res.ok) {
        return {
          success: false,
          message: data.error || data.message || 'Registration failed',
        };
      }

      localStorage.setItem('token', data.token);
      setDeveloper({
        id: data.developer.id,
        name: data.developer.username,
        email: data.developer.email,
        apiKey: data.developer.apiKey,
      });

      return { success: true };
    } catch (err) {
      return { success: false, message: 'Server connection timeout. Verify the backend is active.' };
    }
  };

  const logout = async () => {
    try {
      await fetch(`${API_BASE}/users/logout`, { method: 'POST' });
    } catch (e) {}

    localStorage.removeItem('token');
    localStorage.removeItem('log_dev');
    setDeveloper(null);
    setApps([]);
    setSelectedAppId(null);
    setLogs([]);
  };

  // API Key Management (Mocked client side since user owns key. Can refresh in local state for dashboard demo)
  const regenerateApiKey = async () => {
    // Note: To keep things aligned, we generate a new client-side mock key for presentation, 
    // or let it remain persistent.
    if (!developer) return;
    const newKey = 'pk_live_' + Array.from({ length: 32 }, () => 
      Math.floor(Math.random() * 16).toString(16)
    ).join('');
    
    const updatedDev = { ...developer, apiKey: newKey };
    setDeveloper(updatedDev);
  };

  // Application CRUD operations
  const createApp = async (name, platform, description) => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const res = await fetch(`${API_BASE}/applications`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ name }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || data.message || 'Failed to create application');
      }

      // Refresh applications list
      await fetchApps();
      return data.data;
    } catch (error) {
      console.error('Error creating app:', error);
      throw error;
    }
  };

  const deleteApp = async (id) => {
    const token = localStorage.getItem('token');
    const app = apps.find((a) => a.id === id);
    if (!app || !token) return;

    try {
      const res = await fetch(`${API_BASE}/applications/${app.name}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (res.ok) {
        setApps(apps.filter((a) => a.id !== id));
        if (selectedAppId === id) {
          setSelectedAppId(null);
        }
      } else {
        const data = await res.json();
        console.error('Failed to delete application:', data.message);
      }
    } catch (error) {
      console.error('Error deleting application:', error);
    }
  };

  // Fetch paginated, sorted and filtered logs from the server
  const fetchLogs = useCallback(async (appName, queryParams = {}) => {
    const token = localStorage.getItem('token');
    if (!token || !appName) return;

    setIsLoadingLogs(true);
    try {
      const { page = 1, limit = 10, search = '', level = 'ALL', sort = 'recent' } = queryParams;
      
      const query = new URLSearchParams({
        page,
        limit,
        search,
        level,
        sort,
      });

      const res = await fetch(`${API_BASE}/applications/${appName}/logs?${query}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (res.ok) {
        setLogs(data.data || []);
        setLogsMetrics(data.metrics || {
          totalLogs: 0,
          errorRate: 0,
          warningCount: 0,
          errorCount: 0,
        });
        setLogsPagination(data.pagination || {
          page: 1,
          limit: 10,
          totalPages: 1,
          totalLogs: 0,
        });
      }
    } catch (error) {
      console.error('Failed to fetch logs:', error);
    } finally {
      setIsLoadingLogs(false);
    }
  }, []);

  // Ingest logs directly from the UI for demo/validation purposes using Developer's API Key
  const simulateLog = async (appId, message, level) => {
    const app = apps.find((a) => a.id === appId);
    if (!app || !developer) return;

    try {
      const res = await fetch(`${API_BASE}/applications/${app.name}/logs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': developer.apiKey,
        },
        body: JSON.stringify({
          message,
          level: level.toUpperCase(),
        }),
      });

      if (res.ok) {
        // Refresh application summary statistics on Dashboard and logs table if active
        await fetchApps();
        if (selectedAppId === appId) {
          // Trigger logs list reload keeping active search criteria
          await fetchLogs(app.name);
        }
      }
    } catch (error) {
      console.error('Failed to push simulated telemetry:', error);
    }
  };

  const selectedApp = apps.find((app) => app.id === selectedAppId) || null;

  return (
    <AppContext.Provider
      value={{
        developer,
        apps,
        selectedAppId,
        selectedApp,
        setSelectedAppId,
        logs,
        logsMetrics,
        logsPagination,
        isLoadingLogs,
        login,
        register,
        logout,
        regenerateApiKey,
        createApp,
        deleteApp,
        fetchLogs,
        simulateLog,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
