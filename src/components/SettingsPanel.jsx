import { motion } from 'framer-motion';

export function SettingsPanel({ open, onClose, difficulty, setDifficulty, muted, onToggleMute, onToggleFullscreen }) {
  if (!open) {
    return null;
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="fixed inset-0 z-40 flex items-center justify-center bg-slate-950/70 px-4 backdrop-blur-xl">
      <div className="w-full max-w-xl rounded-[2rem] border border-white/20 bg-slate-900/90 p-6 text-white shadow-[0_0_80px_rgba(0,0,0,0.35)]">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-black">Settings</h2>
          <button onClick={onClose} className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-sm">
            Close
          </button>
        </div>

        <div className="mt-6 space-y-4">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Difficulty</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {['easy', 'normal', 'chaos'].map((mode) => (
                <button key={mode} onClick={() => setDifficulty(mode)} className={`rounded-full px-3 py-2 text-sm ${difficulty === mode ? 'bg-white text-slate-950' : 'bg-slate-800 text-slate-100'}`}>
                  {mode}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/10 p-4">
            <div>
              <p className="font-semibold">Audio</p>
              <p className="text-sm text-slate-400">Toggle prank sounds.</p>
            </div>
            <button onClick={onToggleMute} className="rounded-full bg-white px-3 py-2 font-semibold text-slate-950">
              {muted ? 'Muted' : 'Active'}
            </button>
          </div>

          <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/10 p-4">
            <div>
              <p className="font-semibold">Fullscreen</p>
              <p className="text-sm text-slate-400">Pretend the chaos is bigger.</p>
            </div>
            <button onClick={onToggleFullscreen} className="rounded-full bg-cyan-500 px-3 py-2 font-semibold text-white">
              Fullscreen
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
