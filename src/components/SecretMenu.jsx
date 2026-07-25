import { motion } from 'framer-motion';

export function SecretMenu({ open, onClose, onUnlockAll, onTriggerSecret, onToggleVHS, onToggleComicSans }) {
  if (!open) {
    return null;
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 px-4 backdrop-blur-lg">
      <div className="w-full max-w-xl rounded-[2rem] border border-fuchsia-400/30 bg-slate-900/95 p-6 text-white shadow-[0_0_90px_rgba(255,0,255,0.18)]">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-black">Secret Developer Menu</h2>
          <button onClick={onClose} className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-sm">
            Close
          </button>
        </div>

        <div className="mt-6 grid gap-3 md:grid-cols-2">
          <button onClick={onUnlockAll} className="rounded-2xl border border-cyan-400/20 bg-cyan-500/10 p-4 text-left">
            <p className="font-semibold">Unlock all levels</p>
            <p className="text-sm text-slate-400">Skip the pain and continue.</p>
          </button>
          <button onClick={onTriggerSecret} className="rounded-2xl border border-fuchsia-400/20 bg-fuchsia-500/10 p-4 text-left">
            <p className="font-semibold">Trigger secret event</p>
            <p className="text-sm text-slate-400">The universe gets weird.</p>
          </button>
          <button onClick={onToggleVHS} className="rounded-2xl border border-amber-400/20 bg-amber-500/10 p-4 text-left">
            <p className="font-semibold">VHS mode</p>
            <p className="text-sm text-slate-400">The screen becomes a tape nightmare.</p>
          </button>
          <button onClick={onToggleComicSans} className="rounded-2xl border border-emerald-400/20 bg-emerald-500/10 p-4 text-left">
            <p className="font-semibold">Comic Sans</p>
            <p className="text-sm text-slate-400">Weirdly the most cursed option.</p>
          </button>
        </div>
      </div>
    </motion.div>
  );
}
