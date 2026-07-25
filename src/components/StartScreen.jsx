import { motion } from 'framer-motion';

export function StartScreen({ onStart, difficulty, setDifficulty, muted, onToggleMute }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative z-10 mx-auto flex min-h-screen max-w-5xl flex-col items-center justify-center px-6 py-12"
    >
      <motion.div
        className="w-full max-w-3xl rounded-[2rem] border border-white/20 bg-slate-950/70 p-8 shadow-[0_0_80px_rgba(255,255,255,0.1)] backdrop-blur-2xl"
        whileHover={{ scale: 1.01 }}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.4em] text-cyan-300">Prank simulator</p>
            <h1 className="mt-2 text-5xl font-black text-white sm:text-6xl">Brainrot.exe</h1>
          </div>
          <button
            onClick={onToggleMute}
            className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-white"
          >
            {muted ? 'Unmute' : 'Mute'}
          </button>
        </div>

        <p className="mt-6 max-w-2xl text-lg text-slate-300">
          The game is simple: press start, survive the chaos, and try not to lose your dignity.
          Every level changes the rules and every prank is more ridiculous than the last.
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-2xl border border-fuchsia-400/20 bg-gradient-to-br from-fuchsia-500/20 via-cyan-500/10 to-transparent p-5">
            <h2 className="text-xl font-semibold text-white">Choose your suffering</h2>
            <div className="mt-4 flex flex-wrap gap-3">
              {['easy', 'normal', 'chaos'].map((mode) => (
                <button
                  key={mode}
                  onClick={() => setDifficulty(mode)}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                    difficulty === mode
                      ? 'bg-white text-slate-950'
                      : 'bg-slate-900/70 text-slate-200 hover:bg-slate-800'
                  }`}
                >
                  {mode === 'easy' ? 'Easy' : mode === 'normal' ? 'Normal' : 'Chaos'}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/10 p-5">
            <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Objective</p>
            <p className="mt-3 text-2xl font-semibold text-white">Survive 31 layers of fake urgency.</p>
            <button
              onClick={onStart}
              className="mt-5 w-full rounded-2xl bg-gradient-to-r from-fuchsia-500 via-pink-500 to-cyan-400 px-6 py-4 text-lg font-black text-white shadow-[0_0_40px_rgba(255,255,255,0.2)] transition hover:scale-[1.02]"
            >
              Start the prank
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
