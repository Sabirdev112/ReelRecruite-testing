import { useEffect, useState, useRef } from 'react';

const API_ENDPOINTS = {
  latestTests: '/api/latest-tests',
  runs: '/api/runs',
  status: '/api/status',
};

export function useDashboardData(pollInterval = 1000) {
  const [uiTests, setUiTests] = useState([]);
  const [apiTests, setApiTests] = useState([]);
  const [loadTests, setLoadTests] = useState([]);
  const [uiRuns, setUiRuns] = useState([]);
  const [apiRuns, setApiRuns] = useState([]);
  const [loadRuns, setLoadRuns] = useState([]);
  const [status, setStatus] = useState({ running: false, progress: { total: 0, completed: 0, currentTest: '' } });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const pollingRef = useRef(null);

  const safeFetch = async (url) => {
    try {
      // Add cache-busting timestamp
      const separator = url.includes('?') ? '&' : '?';
      const res = await fetch(`${url}${separator}t=${Date.now()}`, { cache: 'no-store' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
      } catch (err) {
      console.warn(`Fetch failed for ${url}:`, err.message);
      return null;
    }
};

  const fetchStatus = async () => {
    const stat = await safeFetch(API_ENDPOINTS.status);
    if (stat) {
      const hasStateChanged = stat.running !== status.running;
      const hasProgressed = stat.progress?.completed > (status.progress?.completed || 0);

      if (hasStateChanged || hasProgressed) {
        fetchDashboard(true);
      }
      setStatus(stat);
    }
  };

  const isFetchingRef = useRef(false);

  const fetchDashboard = async (silent = false) => {
    if (isFetchingRef.current) return;
    isFetchingRef.current = true;
    
    if (!silent) setLoading(true);
    try {
        const data = await safeFetch('/api/telemetry');
        if (data) {
          if (data.uiTests) setUiTests(data.uiTests);
          if (data.apiTests) setApiTests(data.apiTests);
          if (data.loadTests) setLoadTests(data.loadTests);
          if (data.uiRuns) setUiRuns(data.uiRuns);
          if (data.apiRuns) setApiRuns(data.apiRuns);
          if (data.loadRuns) setLoadRuns(data.loadRuns);
          setError(null);
        }
    } catch (err) {
        console.error('Core fetch failure:', err);
        setError('Synchronizing telemetry nodes...');
    } finally {
        if (!silent) setLoading(false);
        isFetchingRef.current = false;
    }
  };

  useEffect(() => {
    let active = true;

    const pollStatus = async () => {
      if (!active) return;
      await fetchStatus();
      setTimeout(pollStatus, 1500); // 1.5s status poll
    };

    const pollData = async () => {
      if (!active) return;
      await fetchDashboard(true);
      setTimeout(pollData, 15000); // 15s full data poll
    };

    // Initial sequence
    fetchDashboard().then(() => {
      pollStatus();
      pollData();
    });

    return () => { active = false; };
  }, [status.running]);

  return {
    uiTests, setUiTests,
    apiTests, setApiTests,
    loadTests, setLoadTests,
    uiRuns, setUiRuns,
    apiRuns, setApiRuns,
    loadRuns, setLoadRuns,
    status, setStatus,
    loading, setLoading,
    error, setError,
    fetchDashboard,
    fetchStatus,
  };
}


