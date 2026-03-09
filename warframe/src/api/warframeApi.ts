import type {
  Alert,
  Cycle,
  DashboardData,
  Fissure,
  NewsItem,
  Nightwave,
  Sortie,
  VoidTrader
} from '../types/warframe';

const API_BASE = 'https://api.warframestat.us';
const PLATFORM = 'pc';

async function request<T>(path: string): Promise<T> {
  const response = await fetch(`${API_BASE}/${PLATFORM}${path}`);
  if (!response.ok) {
    throw new Error(`Failed ${path}: ${response.status}`);
  }

  return (await response.json()) as T;
}

export const warframeApi = {
  getAlerts: () => request<Alert[]>('/alerts'),
  getFissures: () => request<Fissure[]>('/fissures'),
  getSortie: () => request<Sortie>('/sortie'),
  getNightwave: () => request<Nightwave>('/nightwave'),
  getVoidTrader: () => request<VoidTrader>('/voidTrader'),
  getNews: () => request<NewsItem[]>('/news'),
  getCetusCycle: () => request<Cycle>('/cetusCycle'),
  getEarthCycle: () => request<Cycle>('/earthCycle'),
  getVallisCycle: () => request<Cycle>('/vallisCycle'),
  getCambionCycle: () => request<Cycle>('/cambionCycle')
};

export async function getDashboardData(): Promise<{
  data: DashboardData;
  errors: string[];
}> {
  const requests = {
    alerts: warframeApi.getAlerts(),
    fissures: warframeApi.getFissures(),
    sortie: warframeApi.getSortie(),
    nightwave: warframeApi.getNightwave(),
    voidTrader: warframeApi.getVoidTrader(),
    news: warframeApi.getNews(),
    cetus: warframeApi.getCetusCycle(),
    earth: warframeApi.getEarthCycle(),
    vallis: warframeApi.getVallisCycle(),
    cambion: warframeApi.getCambionCycle()
  };

  const entries = Object.entries(requests) as Array<[keyof typeof requests, Promise<unknown>]>;
  const settled = await Promise.allSettled(entries.map(([, promise]) => promise));

  const errors: string[] = [];
  const values = settled.map((result, index) => {
    if (result.status === 'rejected') {
      errors.push(`${entries[index][0]} failed`);
      return null;
    }

    return result.value;
  });

  const data: DashboardData = {
    alerts: (values[0] as Alert[] | null) ?? [],
    fissures: (values[1] as Fissure[] | null) ?? [],
    sortie: (values[2] as Sortie | null) ?? null,
    nightwave: (values[3] as Nightwave | null) ?? null,
    voidTrader: (values[4] as VoidTrader | null) ?? null,
    news: (values[5] as NewsItem[] | null) ?? [],
    cycles: {
      cetus: (values[6] as Cycle | null) ?? null,
      earth: (values[7] as Cycle | null) ?? null,
      vallis: (values[8] as Cycle | null) ?? null,
      cambion: (values[9] as Cycle | null) ?? null
    }
  };

  return { data, errors };
}
