import { useCallback, useEffect, useMemo, useState } from 'react';
import { getDashboardData } from '../api/warframeApi';
import type { DashboardData } from '../types/warframe';

const EMPTY_DATA: DashboardData = {
  alerts: [],
  fissures: [],
  sortie: null,
  nightwave: null,
  voidTrader: null,
  news: [],
  cycles: {
    cetus: null,
    earth: null,
    vallis: null,
    cambion: null
  }
};

export function useDashboardData(pollMs = 60000) {
  const [data, setData] = useState<DashboardData>(EMPTY_DATA);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const load = useCallback(async (isManual = false) => {
    if (isManual) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    try {
      const result = await getDashboardData();
      setData(result.data);
      setErrors(result.errors);
      setLastUpdated(new Date());
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown dashboard error';
      setErrors([message]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    void load();
    const interval = window.setInterval(() => {
      void load();
    }, pollMs);

    return () => {
      window.clearInterval(interval);
    };
  }, [load, pollMs]);

  const hasData = useMemo(
    () =>
      data.alerts.length > 0 ||
      data.fissures.length > 0 ||
      data.sortie !== null ||
      data.news.length > 0 ||
      data.voidTrader !== null,
    [data]
  );

  return {
    data,
    loading,
    refreshing,
    errors,
    lastUpdated,
    hasData,
    refresh: () => load(true)
  };
}
