export type ApiDate = string;

export interface AlertMission {
  type?: string;
  node?: string;
  faction?: string;
  minEnemyLevel?: number;
  maxEnemyLevel?: number;
}

export interface AlertReward {
  asString?: string;
  credits?: number;
  countedItems?: Array<{ count?: number; key?: string }>;
}

export interface Alert {
  id?: string;
  activation?: ApiDate;
  expiry?: ApiDate;
  mission?: AlertMission;
  reward?: AlertReward;
  expired?: boolean;
  eta?: string;
}

export interface Fissure {
  id?: string;
  node?: string;
  missionType?: string;
  tier?: string;
  tierNum?: number;
  enemy?: string;
  expired?: boolean;
  isHard?: boolean;
  isStorm?: boolean;
  eta?: string;
  expiry?: ApiDate;
}

export interface SortieVariant {
  missionType?: string;
  modifier?: string;
  modifierDescription?: string;
  node?: string;
}

export interface Sortie {
  id?: string;
  boss?: string;
  faction?: string;
  expired?: boolean;
  eta?: string;
  variants?: SortieVariant[];
  expiry?: ApiDate;
}

export interface NightwaveChallenge {
  id?: string;
  title?: string;
  desc?: string;
  isDaily?: boolean;
  isElite?: boolean;
  reputation?: number;
  expiry?: ApiDate;
  expired?: boolean;
}

export interface Nightwave {
  id?: string;
  season?: number;
  phase?: number;
  activeChallenges?: NightwaveChallenge[];
  expiry?: ApiDate;
}

export interface VoidTraderInventoryItem {
  item?: string;
  ducats?: number;
  credits?: number;
}

export interface VoidTrader {
  id?: string;
  character?: string;
  location?: string;
  startString?: string;
  endString?: string;
  active?: boolean;
  inventory?: VoidTraderInventoryItem[];
  expiry?: ApiDate;
  activation?: ApiDate;
}

export interface NewsItem {
  id?: string;
  message?: string;
  link?: string;
  date?: ApiDate;
  eta?: string;
  priority?: boolean;
  asString?: string;
}

export interface Cycle {
  id?: string;
  expiry?: ApiDate;
  timeLeft?: string;
  isDay?: boolean;
  isCetus?: boolean;
  state?: string;
  shortString?: string;
}

export interface DashboardData {
  alerts: Alert[];
  fissures: Fissure[];
  sortie: Sortie | null;
  nightwave: Nightwave | null;
  voidTrader: VoidTrader | null;
  news: NewsItem[];
  cycles: {
    cetus: Cycle | null;
    earth: Cycle | null;
    vallis: Cycle | null;
    cambion: Cycle | null;
  };
}
