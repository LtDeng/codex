import { useMemo, useState } from 'react';
import { CycleCard } from './components/CycleCard';
import { CountdownBadge } from './components/CountdownBadge';
import { ErrorBanner } from './components/ErrorBanner';
import { Layout } from './components/Layout';
import { RefreshControls } from './components/RefreshControls';
import { SectionPanel } from './components/SectionPanel';
import { StatusCard } from './components/StatusCard';
import { TopNav } from './components/TopNav';
import { useDashboardData } from './hooks/useDashboardData';
import { isUrgent, safeText } from './utils/format';

const sections = [
  'Overview',
  'Alerts',
  'Fissures',
  'Sortie',
  'Nightwave',
  'Void Trader',
  'Cycles',
  'News'
] as const;

export type Section = (typeof sections)[number];

function App() {
  const [current, setCurrent] = useState<Section>('Overview');
  const { data, loading, errors, refreshing, lastUpdated, hasData, refresh } = useDashboardData(60000);

  const fissureByTier = useMemo(() => {
    return data.fissures.reduce<Record<string, number>>((acc, fissure) => {
      const key = fissure.tier ?? 'Unknown';
      acc[key] = (acc[key] ?? 0) + 1;
      return acc;
    }, {});
  }, [data.fissures]);

  const renderOverview = () => (
    <SectionPanel title="Overview">
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        <StatusCard title="Sortie" urgent={isUrgent(data.sortie?.expiry)}>
          <p>{safeText(data.sortie?.boss, 'No active sortie')}</p>
          <CountdownBadge value={data.sortie?.expiry} urgent={isUrgent(data.sortie?.expiry)} />
        </StatusCard>
        <StatusCard title="Void Trader" urgent={Boolean(data.voidTrader?.active)}>
          <p>{safeText(data.voidTrader?.location)}</p>
          <p>{data.voidTrader?.active ? 'Active now' : 'Not active'}</p>
          <CountdownBadge value={data.voidTrader?.expiry ?? data.voidTrader?.activation} />
        </StatusCard>
        <StatusCard title="Active Alerts">
          <p className="text-2xl font-bold">{data.alerts.length}</p>
        </StatusCard>
        <StatusCard title="Fissures by Tier">
          <ul>
            {Object.entries(fissureByTier).map(([tier, count]) => (
              <li key={tier}>
                {tier}: {count}
              </li>
            ))}
          </ul>
        </StatusCard>
        <StatusCard title="Nightwave">
          <p>Season {safeText(data.nightwave?.season, '-')}</p>
          <p>{data.nightwave?.activeChallenges?.length ?? 0} active challenges</p>
        </StatusCard>
        <StatusCard title="Latest News">
          <p>{safeText(data.news[0]?.message, 'No current news')}</p>
        </StatusCard>
      </div>
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <CycleCard title="Cetus" cycle={data.cycles.cetus} />
        <CycleCard title="Earth" cycle={data.cycles.earth} />
        <CycleCard title="Vallis" cycle={data.cycles.vallis} />
        <CycleCard title="Cambion" cycle={data.cycles.cambion} />
      </div>
    </SectionPanel>
  );

  const content = {
    Overview: renderOverview(),
    Alerts: (
      <SectionPanel title="Alerts">
        <div className="space-y-2">
          {data.alerts.length === 0 ? (
            <p className="text-muted">No active alerts.</p>
          ) : (
            data.alerts.map((alert) => (
              <StatusCard key={alert.id ?? alert.expiry ?? Math.random()} title={safeText(alert.mission?.type)} urgent={isUrgent(alert.expiry)}>
                <p>{safeText(alert.mission?.node)}</p>
                <p>{safeText(alert.reward?.asString, 'Reward unavailable')}</p>
                <CountdownBadge value={alert.expiry} urgent={isUrgent(alert.expiry)} />
              </StatusCard>
            ))
          )}
        </div>
      </SectionPanel>
    ),
    Fissures: (
      <SectionPanel title="Fissures">
        <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-3">
          {data.fissures.filter((f) => !f.expired).map((fissure) => (
            <StatusCard key={fissure.id ?? `${fissure.node}-${fissure.expiry}`} title={safeText(fissure.tier)} urgent={isUrgent(fissure.expiry)}>
              <p>{safeText(fissure.node)}</p>
              <p>{safeText(fissure.missionType)}</p>
              <CountdownBadge value={fissure.expiry} urgent={isUrgent(fissure.expiry)} />
            </StatusCard>
          ))}
        </div>
      </SectionPanel>
    ),
    Sortie: (
      <SectionPanel title="Sortie">
        <StatusCard title={safeText(data.sortie?.boss, 'No sortie')}>
          <p>Faction: {safeText(data.sortie?.faction, '-')}</p>
          <CountdownBadge value={data.sortie?.expiry} urgent={isUrgent(data.sortie?.expiry)} />
          <ul className="mt-2 list-disc pl-4">
            {data.sortie?.variants?.map((variant) => (
              <li key={`${variant.node}-${variant.missionType}`}>
                {safeText(variant.node)} · {safeText(variant.missionType)} · {safeText(variant.modifier)}
              </li>
            ))}
          </ul>
        </StatusCard>
      </SectionPanel>
    ),
    Nightwave: (
      <SectionPanel title="Nightwave">
        <p className="text-sm text-muted">Season {safeText(data.nightwave?.season, '-')}</p>
        <div className="grid gap-2 md:grid-cols-2">
          {data.nightwave?.activeChallenges?.map((challenge) => (
            <StatusCard key={challenge.id ?? challenge.title} title={safeText(challenge.title)} urgent={isUrgent(challenge.expiry)}>
              <p>{safeText(challenge.desc)}</p>
              <p>{challenge.reputation ?? 0} standing</p>
              <CountdownBadge value={challenge.expiry} urgent={isUrgent(challenge.expiry)} />
            </StatusCard>
          )) ?? <p className="text-muted">No active challenges.</p>}
        </div>
      </SectionPanel>
    ),
    'Void Trader': (
      <SectionPanel title="Void Trader">
        <StatusCard title={safeText(data.voidTrader?.character, 'Baro Ki\'Teer')}>
          <p>Location: {safeText(data.voidTrader?.location)}</p>
          <p>Status: {data.voidTrader?.active ? 'Active' : 'Away'}</p>
          <CountdownBadge value={data.voidTrader?.expiry ?? data.voidTrader?.activation} />
          <div className="mt-2 space-y-1">
            {data.voidTrader?.inventory?.slice(0, 8).map((item) => (
              <p key={item.item} className="text-xs text-slate-200">
                {safeText(item.item)} — {item.ducats ?? 0} ducats / {item.credits ?? 0} credits
              </p>
            ))}
          </div>
        </StatusCard>
      </SectionPanel>
    ),
    Cycles: (
      <SectionPanel title="Cycles">
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <CycleCard title="Cetus" cycle={data.cycles.cetus} />
          <CycleCard title="Earth" cycle={data.cycles.earth} />
          <CycleCard title="Vallis" cycle={data.cycles.vallis} />
          <CycleCard title="Cambion" cycle={data.cycles.cambion} />
        </div>
      </SectionPanel>
    ),
    News: (
      <SectionPanel title="News">
        <div className="space-y-2">
          {data.news.slice(0, 12).map((item) => (
            <StatusCard key={item.id ?? item.date} title={safeText(item.message, 'Update')} urgent={Boolean(item.priority)}>
              <p>{safeText(item.asString, 'No details')}</p>
              {item.link ? (
                <a className="text-accent underline" href={item.link} target="_blank" rel="noreferrer">
                  Open source
                </a>
              ) : null}
              <CountdownBadge value={item.date} />
            </StatusCard>
          ))}
        </div>
      </SectionPanel>
    )
  };

  return (
    <Layout>
      <TopNav sections={[...sections]} current={current} onChange={setCurrent} />
      <RefreshControls onRefresh={refresh} refreshing={refreshing} lastUpdated={lastUpdated} />
      <ErrorBanner messages={errors} />
      {loading ? <p className="rounded-lg bg-surface p-6 text-center text-muted">Loading live worldstate…</p> : null}
      {!loading && !hasData ? <p className="rounded-lg bg-surface p-6 text-center text-muted">No data available right now.</p> : null}
      {!loading && hasData ? content[current] : null}
    </Layout>
  );
}

export default App;
