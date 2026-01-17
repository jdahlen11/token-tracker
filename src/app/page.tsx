import { Dashboard } from '@/components';

export default function Home() {
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <header className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-white">Token Usage Tracker</h1>
              <p className="text-zinc-400 mt-1">{today}</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                Live
              </span>
            </div>
          </div>
        </header>

        <Dashboard />

        <footer className="mt-12 pt-8 border-t border-zinc-800">
          <p className="text-center text-sm text-zinc-500">
            Built with Next.js, Supabase & Tailwind
          </p>
        </footer>
      </div>
    </div>
  );
}
