import { motion } from 'framer-motion';

export function StatsPanel({ open, onClose, stats }) {
  if (!open) {
    return null;
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="fixed inset-0 z-40 flex items-center justify-center bg-slate-950/70 px-4 backdrop-blur-xl">
      <div className="w-full max-w-xl rounded-[2rem] border border-white/20 bg-slate-900/95 p-6 text-white shadow-[0_0_80px_rgba(0,0,0,0.25)]">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-black">Statistics</h2>
          <button onClick={onClose} className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-sm">
            Close
          </button>
        </div>

        <div className="mt-6 grid gap-3 md:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
            <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Levels</p>
            <p className="mt-2 text-3xl font-black">{stats.levelsCompleted}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
            <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Clicks</p>
            <p className="mt-2 text-3xl font-black">{stats.clicks}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
            <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Time</p>
            <p className="mt-2 text-3xl font-black">{stats.speedrunSeconds}s</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
            <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Secret menu</p>
            <p className="mt-2 text-3xl font-black">{stats.secretMenuUses}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
