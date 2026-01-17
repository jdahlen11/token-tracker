'use client';

import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

export function StatsCard({ title, value, icon: Icon, trend }: StatsCardProps) {
  return (
    <div className="rounded-xl bg-zinc-900 border border-zinc-800 p-6">
      <div className="flex items-center justify-between">
        <div className="rounded-lg bg-zinc-800 p-2">
          <Icon className="h-5 w-5 text-emerald-500" />
        </div>
        {trend && (
          <span
            className={`text-sm font-medium ${
              trend.isPositive ? 'text-emerald-500' : 'text-red-500'
            }`}
          >
            {trend.isPositive ? '+' : ''}{trend.value}%
          </span>
        )}
      </div>
      <div className="mt-4">
        <p className="text-sm text-zinc-400">{title}</p>
        <p className="mt-1 text-2xl font-semibold text-white">{value}</p>
      </div>
    </div>
  );
}
