'use client';

import type { UsageRecord } from '@/types/database';

interface ActivityTableProps {
  data: UsageRecord[];
}

export function ActivityTable({ data }: ActivityTableProps) {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatTokens = (value: number) => {
    if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
    return value.toString();
  };

  const formatCost = (value: number) => {
    return `$${value.toFixed(4)}`;
  };

  const getModelColor = (model: string) => {
    if (model.includes('claude')) return 'text-orange-400';
    if (model.includes('gpt')) return 'text-emerald-400';
    return 'text-blue-400';
  };

  return (
    <div className="rounded-xl bg-zinc-900 border border-zinc-800 overflow-hidden">
      <div className="p-6 border-b border-zinc-800">
        <h3 className="text-lg font-medium text-white">Recent Activity</h3>
      </div>
      
      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-zinc-800">
              <th className="text-left text-sm font-medium text-zinc-400 px-6 py-3">Date</th>
              <th className="text-left text-sm font-medium text-zinc-400 px-6 py-3">Project</th>
              <th className="text-left text-sm font-medium text-zinc-400 px-6 py-3">Model</th>
              <th className="text-right text-sm font-medium text-zinc-400 px-6 py-3">Tokens</th>
              <th className="text-right text-sm font-medium text-zinc-400 px-6 py-3">Cost</th>
            </tr>
          </thead>
          <tbody>
            {data.map((record) => (
              <tr key={record.id} className="border-b border-zinc-800/50 hover:bg-zinc-800/30">
                <td className="px-6 py-4 text-sm text-zinc-300">{formatDate(record.created_at)}</td>
                <td className="px-6 py-4 text-sm text-white font-medium">{record.project_name}</td>
                <td className={`px-6 py-4 text-sm font-mono ${getModelColor(record.model)}`}>
                  {record.model}
                </td>
                <td className="px-6 py-4 text-sm text-zinc-300 text-right">
                  {formatTokens(record.total_tokens)}
                </td>
                <td className="px-6 py-4 text-sm text-zinc-300 text-right">
                  {formatCost(record.cost_usd)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden divide-y divide-zinc-800">
        {data.map((record) => (
          <div key={record.id} className="p-4 space-y-2">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-white font-medium">{record.project_name}</p>
                <p className={`text-sm font-mono ${getModelColor(record.model)}`}>
                  {record.model}
                </p>
              </div>
              <p className="text-sm text-zinc-400">{formatDate(record.created_at)}</p>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-zinc-400">{formatTokens(record.total_tokens)} tokens</span>
              <span className="text-emerald-500 font-medium">{formatCost(record.cost_usd)}</span>
            </div>
          </div>
        ))}
      </div>

      {data.length === 0 && (
        <div className="p-8 text-center text-zinc-500">
          No activity yet. Start tracking your API usage!
        </div>
      )}
    </div>
  );
}
