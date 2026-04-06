import { useEffect, useState, useRef } from 'react';

const API_ENDPOINTS = {
  latestTests: '/api/latest-tests',
  runs: '/api/runs',
  status: '/api/status',
};

export function useDashboardData(pollInterval = 2500) {
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
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (err) {
      console.warn(`Fetch failed for ${url}:`, err.message);
      return null;
    }
  };

  const fetchDashboard = async (silent = false) => {
    if (!silent) setLoading(true);

    try {
      const [
        uiT, apiT, loadT,
        uiR, apiR, loadR,
        stat
      ] = await Promise.all([
        safeFetch(`${API_ENDPOINTS.latestTests}?type=ui`),
        safeFetch(`${API_ENDPOINTS.latestTests}?type=api`),
        safeFetch(`${API_ENDPOINTS.latestTests}?type=load`),
        safeFetch(`${API_ENDPOINTS.runs}?type=ui`),
        safeFetch(`${API_ENDPOINTS.runs}?type=api`),
        safeFetch(`${API_ENDPOINTS.runs}?type=load`),
        safeFetch(API_ENDPOINTS.status)
      ]);

      if (uiT) setUiTests(uiT);
      if (apiT) setApiTests(apiT);
      if (loadT) setLoadTests(loadT);
      if (uiR) setUiRuns(uiR);
      if (apiR) setApiRuns(apiR);
      if (loadR) setLoadRuns(loadR);
      if (stat) setStatus(stat);

      if (uiT || apiT || loadT || uiR || apiR || loadR || stat) {
        setError(null);
      } else {
        throw new Error('All telemetry streams failed to connect');
      }
    } catch (err) {
      console.error('Core fetch failure:', err);
      setError('Connection disrupted. Synchronizing telemetry nodes...');
    } finally {
      if (!silent) setLoading(false);
    }
  };

  useEffect(() => {
    let active = true;
    const poll = async () => {
      await fetchDashboard(true);
      if (active) setTimeout(poll, pollInterval);
    };

    fetchDashboard();
    const timeout = setTimeout(poll, pollInterval);

    return () => {
      active = false;
      clearTimeout(timeout);
    };
  }, [pollInterval]);

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
  };
}


