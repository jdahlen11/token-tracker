'use client';

import { useEffect, useState } from 'react';
import { Zap, DollarSign, TrendingUp } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { StatsCard } from './StatsCard';
import { UsageGraph } from './UsageGraph';
import { ActivityTable } from './ActivityTable';
import type { UsageRecord, DailyUsage, Stats } from '@/types/database';

export function Dashboard() {
  const [records, setRecords] = useState<UsageRecord[]>([]);
  const [dailyUsage, setDailyUsage] = useState<DailyUsage[]>([]);
  const [stats, setStats] = useState<Stats>({ totalTokens: 0, totalCost: 0, dailyAverage: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      setLoading(true);
      setError(null);

      const { data: usageData, error: fetchError } = await supabase
        .from('usage')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      if (fetchError) throw fetchError;

      const fetchedRecords = (usageData as UsageRecord[]) || [];
      setRecords(fetchedRecords);

      const totalTokens = fetchedRecords.reduce((sum: number, r: UsageRecord) => sum + r.total_tokens, 0);
      const totalCost = fetchedRecords.reduce((sum: number, r: UsageRecord) => sum + r.cost_usd, 0);
      const uniqueDays = new Set(fetchedRecords.map((r: UsageRecord) => r.created_at.split('T')[0])).size;
      const dailyAverage = uniqueDays > 0 ? totalTokens / uniqueDays : 0;

      setStats({ totalTokens, totalCost, dailyAverage });

      const dailyMap = new Map<string, { tokens: number; cost: number }>();
      fetchedRecords.forEach((r: UsageRecord) => { => {
        const date = r.created_at.split('T')[0];
        const existing = dailyMap.get(date) || { tokens: 0, cost: 0 };
        dailyMap.set(date, {
          tokens: existing.tokens + r.total_tokens,
          cost: existing.cost + r.cost_usd,
        });
      });

      const daily = Array.from(dailyMap.entries())
        .map(([date, data]) => ({ date, ...data }))
        .sort((a, b) => a.date.localeCompare(b.date))
        .slice(-7);

      setDailyUsage(daily);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to load data. Check your Supabase connection.');
    } finally {
      setLoading(false);
    }
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toFixed(0);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-xl bg-zinc-900 border border-zinc-800 p-6 animate-pulse">
              <div className="h-10 w-10 bg-zinc-800 rounded-lg" />
              <div className="mt-4 space-y-2">
                <div className="h-4 w-20 bg-zinc-800 rounded" />
                <div className="h-6 w-24 bg-zinc-800 rounded" />
              </div>
            </div>
          ))}
        </div>
        <div className="rounded-xl bg-zinc-900 border border-zinc-800 p-6 animate-pulse">
          <div className="h-[300px] bg-zinc-800 rounded" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl bg-red-900/20 border border-red-800 p-6 text-center">
        <p className="text-red-400">{error}</p>
        <button
          onClick={fetchData}
          className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-white text-sm"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatsCard
          title="Total Tokens"
          value={formatNumber(stats.totalTokens)}
          icon={Zap}
        />
        <StatsCard
          title="Total Cost"
          value={`$${stats.totalCost.toFixed(2)}`}
          icon={DollarSign}
        />
        <StatsCard
          title="Daily Average"
          value={formatNumber(stats.dailyAverage)}
          icon={TrendingUp}
        />
      </div>

      {dailyUsage.length > 0 && <UsageGraph data={dailyUsage} />}

      <ActivityTable data={records} />
    </div>
  );
}
