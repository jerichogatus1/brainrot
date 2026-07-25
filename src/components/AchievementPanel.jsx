import { motion } from 'framer-motion';

export function AchievementPanel({ open, onClose, achievements, unlockedIds }) {
  if (!open) {
    return null;
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="fixed inset-0 z-40 flex items-center justify-center bg-slate-950/70 px-4 backdrop-blur-xl">
      <div className="w-full max-w-2xl rounded-[2rem] border border-white/20 bg-slate-900/95 p-6 text-white shadow-[0_0_80px_rgba(0,0,0,0.25)]">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-black">Achievements</h2>
          <button onClick={onClose} className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-sm">
            Close
          </button>
        </div>

        <div className="mt-6 grid gap-3 md:grid-cols-2">
          {achievements.map((achievement) => {
            const unlocked = unlockedIds.includes(achievement.id);
            return (
              <motion.div key={achievement.id} layout className={`rounded-2xl border p-4 ${unlocked ? 'border-fuchsia-400/40 bg-fuchsia-500/10' : 'border-white/10 bg-white/5'}`}>
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{achievement.icon}</span>
                  <div>
                    <p className="font-semibold">{achievement.title}</p>
                    <p className="text-sm text-slate-400">{achievement.description}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
