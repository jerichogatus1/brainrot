import { motion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';

export function PrankStage({ level, onComplete, onAction, difficulty, screenEffects, playSound }) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [wrongCount, setWrongCount] = useState(0);
  const [captchaChecked, setCaptchaChecked] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [countdown, setCountdown] = useState(5);
  const [memoryTarget, setMemoryTarget] = useState('🪄');
  const [showOverlay, setShowOverlay] = useState(false);

  useEffect(() => {
    if (level.type === 'moving-button') {
      const interval = window.setInterval(() => {
        setPosition({ x: Math.random() * 240 - 120, y: Math.random() * 120 - 60 });
      }, 450);
      return () => window.clearInterval(interval);
    }
  }, [level.type]);

  useEffect(() => {
    if (level.type === 'restart-countdown') {
      const interval = window.setInterval(() => {
        setCountdown((value) => {
          if (value <= 1) {
            window.clearInterval(interval);
            setShowOverlay(true);
            return 0;
          }
          return value - 1;
        });
      }, 900);
      return () => window.clearInterval(interval);
    }
  }, [level.type]);

  useEffect(() => {
    if (level.type === 'loading-99') {
      const timeout = window.setTimeout(() => {
        setShowOverlay(true);
      }, 1800);
      return () => window.clearTimeout(timeout);
    }
  }, [level.type]);

  useEffect(() => {
    if (level.type === 'memory-puzzle') {
      setMemoryTarget(Math.random() > 0.5 ? '🪄' : '🧠');
    }
  }, [level.type]);

  const handleComplete = () => {
    onAction();
    onComplete();
  };

  const handleWrong = () => {
    setWrongCount((value) => value + 1);
    playSound('bruh');
  };

  const accentClasses = useMemo(() => {
    if (level.accent === 'from-slate-800 to-slate-950') {
      return 'from-slate-800 via-slate-900 to-slate-950';
    }
    return level.accent;
  }, [level.accent]);

  const stageClassName = `rounded-[2rem] border border-white/20 bg-gradient-to-br ${accentClasses} p-6 text-white shadow-[0_0_60px_rgba(255,255,255,0.15)]`;

  if (level.type === 'moving-button') {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={stageClassName}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-white/70">Level {level.id}</p>
            <h2 className="mt-2 text-2xl font-black">{level.title}</h2>
          </div>
          <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-sm">{difficulty}</span>
        </div>
        <p className="mt-3 text-sm text-slate-100">{level.prompt}</p>
        <div className="relative mt-8 flex min-h-[240px] items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-slate-950/40 p-4">
          <motion.button
            animate={{ x: position.x, y: position.y, scale: [1, 1.03, 1] }}
            transition={{ duration: 0.2 }}
            className="rounded-full bg-white px-6 py-3 font-black text-slate-950"
            onClick={handleComplete}
          >
            Click me
          </motion.button>
        </div>
      </motion.div>
    );
  }

  if (level.type === 'shrinking-button') {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={stageClassName}>
        <h2 className="text-2xl font-black">{level.title}</h2>
        <p className="mt-2 text-sm text-slate-100">{level.prompt}</p>
        <div className="mt-8 flex min-h-[240px] items-center justify-center rounded-2xl border border-white/10 bg-slate-950/40 p-4">
          <motion.button
            animate={{ scale: [1, 0.7, 0.55, 0.4] }}
            transition={{ duration: 1.2, repeat: Infinity, repeatType: 'reverse' }}
            className="rounded-full bg-white px-6 py-3 font-black text-slate-950"
            onClick={handleComplete}
          >
            Tiny button
          </motion.button>
        </div>
      </motion.div>
    );
  }

  if (level.type === 'fake-loading') {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={stageClassName}>
        <h2 className="text-2xl font-black">{level.title}</h2>
        <p className="mt-2 text-sm text-slate-100">{level.prompt}</p>
        <div className="mt-8 rounded-2xl border border-white/10 bg-slate-950/40 p-6">
          <div className="h-3 w-full rounded-full bg-slate-700">
            <motion.div
              className="h-3 rounded-full bg-gradient-to-r from-cyan-400 to-fuchsia-500"
              animate={{ width: ['10%', '55%', '85%', '100%'] }}
              transition={{ duration: 1.5, repeat: Infinity, repeatType: 'mirror' }}
            />
          </div>
          <div className="mt-4 flex items-center justify-between text-sm text-slate-100">
            <span>Installing vibes…</span>
            <button onClick={handleComplete} className="rounded-full border border-white/20 bg-white/10 px-3 py-1">
              Continue
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  if (level.type === 'loading-99') {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={stageClassName}>
        <h2 className="text-2xl font-black">{level.title}</h2>
        <p className="mt-2 text-sm text-slate-100">{level.prompt}</p>
        <div className="mt-8 rounded-2xl border border-white/10 bg-slate-950/40 p-6">
          <div className="h-3 w-full rounded-full bg-slate-700">
            <div className="h-3 w-[99%] rounded-full bg-gradient-to-r from-amber-400 to-rose-500" />
          </div>
          <p className="mt-4 text-sm text-slate-100">{showOverlay ? 'It is still loading because you are not allowed to leave.' : 'Almost there...'}</p>
          <button onClick={handleComplete} className="mt-4 rounded-full bg-white px-5 py-2 font-semibold text-slate-950">
            Wait forever
          </button>
        </div>
      </motion.div>
    );
  }

  if (level.type === 'fake-virus') {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={stageClassName}>
        <h2 className="text-2xl font-black">{level.title}</h2>
        <p className="mt-2 text-sm text-slate-100">{level.prompt}</p>
        <div className="mt-8 rounded-2xl border border-red-400/30 bg-red-500/20 p-6">
          <p className="text-2xl font-black text-white">VIRUS DETECTED</p>
          <p className="mt-2 text-sm text-slate-100">Your computer has been infected by a suspiciously cheerful meme.</p>
          <div className="mt-4 flex gap-3">
            <button onClick={handleComplete} className="rounded-full bg-white px-4 py-2 font-semibold text-slate-950">
              Remove threat
            </button>
            <button onClick={handleWrong} className="rounded-full border border-white/20 bg-slate-950/40 px-4 py-2 font-semibold">
              Ignore threat
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  if (level.type === 'windows-update') {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={stageClassName}>
        <h2 className="text-2xl font-black">{level.title}</h2>
        <p className="mt-2 text-sm text-slate-100">{level.prompt}</p>
        <div className="mt-8 rounded-2xl border border-white/10 bg-slate-950/40 p-6">
          <div className="h-3 w-full rounded-full bg-slate-700">
            <motion.div className="h-3 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400" animate={{ width: ['15%', '69%', '100%'] }} transition={{ duration: 1.2, repeat: Infinity, repeatType: 'mirror' }} />
          </div>
          <p className="mt-4 text-sm text-slate-100">Updating your desktop experience…</p>
          <button onClick={handleComplete} className="mt-4 rounded-full bg-white px-4 py-2 font-semibold text-slate-950">
            Restart later
          </button>
        </div>
      </motion.div>
    );
  }

  if (level.type === 'mouse-follow') {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={stageClassName}>
        <h2 className="text-2xl font-black">{level.title}</h2>
        <p className="mt-2 text-sm text-slate-100">{level.prompt}</p>
        <div className="mt-8 flex min-h-[260px] items-center justify-center rounded-2xl border border-white/10 bg-slate-950/40 p-6">
          <motion.button
            whileHover={{ scale: 1.05 }}
            className="rounded-full bg-white px-5 py-3 font-black text-slate-950"
            onMouseMove={(event) => {
              const target = event.currentTarget.parentElement;
              const rect = target.getBoundingClientRect();
              const x = event.clientX - rect.left - 80;
              const y = event.clientY - rect.top - 24;
              event.currentTarget.style.transform = `translate(${x}px, ${y}px)`;
            }}
            onClick={handleComplete}
          >
            Catch me
          </motion.button>
        </div>
      </motion.div>
    );
  }

  if (level.type === 'reverse-controls') {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={stageClassName}>
        <h2 className="text-2xl font-black">{level.title}</h2>
        <p className="mt-2 text-sm text-slate-100">{level.prompt}</p>
        <div className="mt-8 rounded-2xl border border-white/10 bg-slate-950/40 p-6">
          <p className="text-sm text-slate-100">Move the button to the opposite side of the card and click it.</p>
          <div className="mt-5 flex justify-end">
            <motion.button
              animate={{ x: [0, -50, 0], rotate: 180 }}
              transition={{ duration: 1.3, repeat: Infinity, repeatType: 'mirror' }}
              className="rounded-full bg-white px-5 py-3 font-black text-slate-950"
              onClick={handleComplete}
            >
              Wrong direction
            </motion.button>
          </div>
        </div>
      </motion.div>
    );
  }

  if (level.type === 'duplicate-button') {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={stageClassName}>
        <h2 className="text-2xl font-black">{level.title}</h2>
        <p className="mt-2 text-sm text-slate-100">{level.prompt}</p>
        <div className="mt-8 flex flex-wrap gap-3">
          {['Clone A', 'Clone B', 'Clone C', 'Real one'].map((label, index) => (
            <button
              key={label}
              onClick={label === 'Real one' ? handleComplete : handleWrong}
              className={`rounded-full px-4 py-2 font-semibold ${index === 3 ? 'bg-white text-slate-950' : 'border border-white/20 bg-slate-950/60'}`}
            >
              {label}
            </button>
          ))}
        </div>
      </motion.div>
    );
  }

  if (level.type === 'find-correct') {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={stageClassName}>
        <h2 className="text-2xl font-black">{level.title}</h2>
        <p className="mt-2 text-sm text-slate-100">{level.prompt}</p>
        <p className="mt-2 text-xs text-slate-200">Wrong taps: {wrongCount}</p>
        <div className="mt-6 grid max-h-[320px] grid-cols-10 gap-2 overflow-auto rounded-2xl border border-white/10 bg-slate-950/40 p-3">
          {Array.from({ length: 100 }, (_, index) => (
            <button
              key={index}
              onClick={index === 37 ? handleComplete : handleWrong}
              className={`rounded-lg px-2 py-2 text-xs ${index === 37 ? 'bg-white text-slate-950' : 'bg-slate-800/80 text-slate-200'}`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </motion.div>
    );
  }

  if (level.type === 'captcha') {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={stageClassName}>
        <h2 className="text-2xl font-black">{level.title}</h2>
        <p className="mt-2 text-sm text-slate-100">{level.prompt}</p>
        <div className="mt-8 rounded-2xl border border-white/10 bg-slate-950/40 p-6">
          <label className="flex items-center gap-3 text-sm text-slate-100">
            <input type="checkbox" checked={captchaChecked} onChange={() => setCaptchaChecked((value) => !value)} />
            I am definitely not a robot (please continue).
          </label>
          <button onClick={captchaChecked ? handleComplete : handleWrong} className="mt-4 rounded-full bg-white px-4 py-2 font-semibold text-slate-950">
            Verify
          </button>
        </div>
      </motion.div>
    );
  }

  if (level.type === 'simon-says') {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={stageClassName}>
        <h2 className="text-2xl font-black">{level.title}</h2>
        <p className="mt-2 text-sm text-slate-100">{level.prompt}</p>
        <div className="mt-8 flex flex-wrap gap-3">
          {[
            { label: 'Red', color: 'bg-red-500' },
            { label: 'Green', color: 'bg-emerald-500' },
            { label: 'Blue', color: 'bg-blue-500' },
            { label: 'Yellow', color: 'bg-yellow-400' },
          ].map((button) => (
            <button
              key={button.label}
              onClick={button.label === 'Green' ? handleComplete : handleWrong}
              className={`rounded-full px-4 py-3 font-semibold text-white ${button.color}`}
            >
              {button.label}
            </button>
          ))}
        </div>
      </motion.div>
    );
  }

  if (level.type === 'memory-puzzle') {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={stageClassName}>
        <h2 className="text-2xl font-black">{level.title}</h2>
        <p className="mt-2 text-sm text-slate-100">{level.prompt}</p>
        <div className="mt-8 grid grid-cols-2 gap-3">
          {['🕹️', '🧩', '🧠', '🪄'].map((emoji) => (
            <button
              key={emoji}
              onClick={emoji === memoryTarget ? handleComplete : handleWrong}
              className="rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-6 text-3xl"
            >
              {emoji}
            </button>
          ))}
        </div>
      </motion.div>
    );
  }

  if (level.type === 'rotate-screen') {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={`${stageClassName} rotate-180`}>
        <h2 className="text-2xl font-black">{level.title}</h2>
        <p className="mt-2 text-sm text-slate-100">{level.prompt}</p>
        <button onClick={handleComplete} className="mt-6 rounded-full bg-white px-4 py-2 font-semibold text-slate-950">
          Accept the spin
        </button>
      </motion.div>
    );
  }

  if (level.type === 'upside-down') {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={`${stageClassName} scale-y-[-1]`}>
        <h2 className="text-2xl font-black">{level.title}</h2>
        <p className="mt-2 text-sm text-slate-100">{level.prompt}</p>
        <button onClick={handleComplete} className="mt-6 rounded-full bg-white px-4 py-2 font-semibold text-slate-950">
          Flip back
        </button>
      </motion.div>
    );
  }

  if (level.type === 'gravity') {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={stageClassName}>
        <h2 className="text-2xl font-black">{level.title}</h2>
        <p className="mt-2 text-sm text-slate-100">{level.prompt}</p>
        <div className="mt-8 flex min-h-[240px] items-end justify-center rounded-2xl border border-white/10 bg-slate-950/40 p-6">
          <motion.button animate={{ y: [0, 30, 0] }} transition={{ duration: 0.8, repeat: Infinity }} className="rounded-full bg-white px-4 py-2 font-semibold text-slate-950" onClick={handleComplete}>
            Drop it
          </motion.button>
        </div>
      </motion.div>
    );
  }

  if (level.type === 'dark-mode') {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={`${stageClassName} bg-slate-950 text-white`}>
        <h2 className="text-2xl font-black">{level.title}</h2>
        <p className="mt-2 text-sm text-slate-300">{level.prompt}</p>
        <button onClick={handleComplete} className="mt-6 rounded-full bg-white px-4 py-2 font-semibold text-slate-950">
          Accept darkness
        </button>
      </motion.div>
    );
  }

  if (level.type === 'lights-flicker') {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={stageClassName}>
        <h2 className="text-2xl font-black">{level.title}</h2>
        <p className="mt-2 text-sm text-slate-100">{level.prompt}</p>
        <motion.div animate={{ opacity: [1, 0.2, 0.9, 0.4] }} transition={{ duration: 0.7, repeat: Infinity }} className="mt-8 rounded-2xl border border-white/10 bg-slate-950/40 p-6">
          <p className="text-sm text-slate-100">The room is blinking. You should probably keep pressing the button.</p>
          <button onClick={handleComplete} className="mt-4 rounded-full bg-white px-4 py-2 font-semibold text-slate-950">
            Keep going
          </button>
        </motion.div>
      </motion.div>
    );
  }

  if (level.type === 'fake-notifications') {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={stageClassName}>
        <h2 className="text-2xl font-black">{level.title}</h2>
        <p className="mt-2 text-sm text-slate-100">{level.prompt}</p>
        <div className="mt-8 space-y-3 rounded-2xl border border-white/10 bg-slate-950/40 p-4">
          {['Update available', 'Your browser loves you', 'You have won a prize'].map((message) => (
            <div key={message} className="rounded-xl border border-white/10 bg-white/10 p-3 text-sm">
              {message}
            </div>
          ))}
          <button onClick={handleComplete} className="rounded-full bg-white px-4 py-2 font-semibold text-slate-950">
            Dismiss all
          </button>
        </div>
      </motion.div>
    );
  }

  if (level.type === 'discord-message') {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={stageClassName}>
        <h2 className="text-2xl font-black">{level.title}</h2>
        <p className="mt-2 text-sm text-slate-100">{level.prompt}</p>
        <div className="mt-8 rounded-2xl border border-indigo-400/30 bg-indigo-500/20 p-6">
          <p className="font-semibold text-white">@meme-bot says:</p>
          <p className="mt-2 text-sm text-slate-100">Your account has been gifted an enormous amount of chaos. Reply now.</p>
          <button onClick={handleComplete} className="mt-4 rounded-full bg-white px-4 py-2 font-semibold text-slate-950">
            Reply
          </button>
        </div>
      </motion.div>
    );
  }

  if (level.type === 'error-dialog') {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={stageClassName}>
        <h2 className="text-2xl font-black">{level.title}</h2>
        <p className="mt-2 text-sm text-slate-100">{level.prompt}</p>
        <div className="mt-8 rounded-2xl border border-red-400/30 bg-red-500/20 p-6">
          <p className="text-xl font-black text-white">ERROR 404: SANITY NOT FOUND</p>
          <button onClick={handleComplete} className="mt-4 rounded-full bg-white px-4 py-2 font-semibold text-slate-950">
            Close all dialogs
          </button>
        </div>
      </motion.div>
    );
  }

  if (level.type === 'dvd-logo') {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={stageClassName}>
        <h2 className="text-2xl font-black">{level.title}</h2>
        <p className="mt-2 text-sm text-slate-100">{level.prompt}</p>
        <div className="mt-8 relative h-56 overflow-hidden rounded-2xl border border-white/10 bg-slate-950/40 p-4">
          <motion.div animate={{ x: [0, 220, 0], y: [0, 140, 0] }} transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }} className="absolute left-0 top-0 rounded-full bg-gradient-to-r from-fuchsia-500 to-cyan-400 px-4 py-2 font-black text-white">
            DVD
          </motion.div>
          <button onClick={handleComplete} className="absolute bottom-4 right-4 rounded-full bg-white px-4 py-2 font-semibold text-slate-950">
            Catch it
          </button>
        </div>
      </motion.div>
    );
  }

  if (level.type === 'emoji-rain') {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={stageClassName}>
        <h2 className="text-2xl font-black">{level.title}</h2>
        <p className="mt-2 text-sm text-slate-100">{level.prompt}</p>
        <div className="mt-8 relative h-56 overflow-hidden rounded-2xl border border-white/10 bg-slate-950/40 p-4">
          {['😂', '😱', '🤡', '💀', '🫠'].map((emoji, index) => (
            <motion.div
              key={emoji}
              initial={{ y: -20, x: index * 30 }}
              animate={{ y: 220, x: index * 35 }}
              transition={{ duration: 1.1 + index / 3, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute top-0 text-3xl"
            >
              {emoji}
            </motion.div>
          ))}
          <button onClick={handleComplete} className="absolute bottom-4 right-4 rounded-full bg-white px-4 py-2 font-semibold text-slate-950">
            Survive
          </button>
        </div>
      </motion.div>
    );
  }

  if (level.type === 'screen-shake') {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={stageClassName}>
        <h2 className="text-2xl font-black">{level.title}</h2>
        <p className="mt-2 text-sm text-slate-100">{level.prompt}</p>
        <motion.div animate={{ x: [0, -8, 8, -6, 6, 0] }} transition={{ duration: 0.7, repeat: Infinity }} className="mt-8 rounded-2xl border border-white/10 bg-slate-950/40 p-6">
          <p className="text-sm text-slate-100">Everything is vibrating because your browser is emotionally exhausted.</p>
          <button onClick={handleComplete} className="mt-4 rounded-full bg-white px-4 py-2 font-semibold text-slate-950">
            Stabilize
          </button>
        </motion.div>
      </motion.div>
    );
  }

  if (level.type === 'browser-crash') {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={stageClassName}>
        <h2 className="text-2xl font-black">{level.title}</h2>
        <p className="mt-2 text-sm text-slate-100">{level.prompt}</p>
        <div className="mt-8 rounded-2xl border border-white/10 bg-slate-950/40 p-6">
          <p className="text-2xl font-black text-white">The browser has crashed.</p>
          <p className="mt-2 text-sm text-slate-100">This is not a real crash. It is a very committed prank.</p>
          <button onClick={handleComplete} className="mt-4 rounded-full bg-white px-4 py-2 font-semibold text-slate-950">
            Recover
          </button>
        </div>
      </motion.div>
    );
  }

  if (level.type === 'bsod') {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={`${stageClassName} bg-blue-600`}>
        <h2 className="text-2xl font-black">{level.title}</h2>
        <p className="mt-2 text-sm text-slate-100">{level.prompt}</p>
        <div className="mt-8 rounded-2xl border border-white/20 bg-slate-950/40 p-6">
          <p className="text-2xl font-black text-white">Blue Screen of Death</p>
          <p className="mt-2 text-sm text-slate-100">A genuine faux-blue screen. Continue anyway.</p>
          <button onClick={handleComplete} className="mt-4 rounded-full bg-white px-4 py-2 font-semibold text-slate-950">
            Restart
          </button>
        </div>
      </motion.div>
    );
  }

  if (level.type === 'restart-countdown') {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={stageClassName}>
        <h2 className="text-2xl font-black">{level.title}</h2>
        <p className="mt-2 text-sm text-slate-100">{level.prompt}</p>
        <div className="mt-8 rounded-2xl border border-white/10 bg-slate-950/40 p-6 text-center">
          <p className="text-6xl font-black text-white">{countdown}</p>
          <button onClick={handleComplete} className="mt-4 rounded-full bg-white px-4 py-2 font-semibold text-slate-950">
            Abort reboot
          </button>
        </div>
      </motion.div>
    );
  }

  if (level.type === 'rickroll') {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={stageClassName}>
        <h2 className="text-2xl font-black">{level.title}</h2>
        <p className="mt-2 text-sm text-slate-100">{level.prompt}</p>
        <div className="mt-8 rounded-2xl border border-emerald-400/30 bg-emerald-500/20 p-6">
          <p className="text-xl font-black text-white">Never gonna give you up</p>
          <button onClick={handleComplete} className="mt-4 rounded-full bg-white px-4 py-2 font-semibold text-slate-950">
            Escape the song
          </button>
        </div>
      </motion.div>
    );
  }

  if (level.type === 'impossible-math') {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={stageClassName}>
        <h2 className="text-2xl font-black">{level.title}</h2>
        <p className="mt-2 text-sm text-slate-100">{level.prompt}</p>
        <div className="mt-8 rounded-2xl border border-white/10 bg-slate-950/40 p-6">
          <p className="text-xl font-semibold text-white">What is 2 + 2 + 2 + 2?</p>
          <input value={inputValue} onChange={(event) => setInputValue(event.target.value)} className="mt-4 w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-white" placeholder="Type the answer" />
          <button onClick={() => (inputValue === '8' ? handleComplete() : handleWrong())} className="mt-4 rounded-full bg-white px-4 py-2 font-semibold text-slate-950">
            Solve
          </button>
        </div>
      </motion.div>
    );
  }

  if (level.type === 'fake-ending') {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={stageClassName}>
        <h2 className="text-2xl font-black">{level.title}</h2>
        <p className="mt-2 text-sm text-slate-100">{level.prompt}</p>
        <div className="mt-8 rounded-2xl border border-white/10 bg-slate-950/40 p-6">
          <p className="text-3xl font-black text-white">You have successfully lost several brain cells.</p>
          <button onClick={handleComplete} className="mt-4 rounded-full bg-white px-4 py-2 font-semibold text-slate-950">
            Claim victory
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={stageClassName}>
      <h2 className="text-2xl font-black">{level.title}</h2>
      <p className="mt-2 text-sm text-slate-100">{level.prompt}</p>
      <button onClick={handleComplete} className="mt-6 rounded-full bg-white px-4 py-2 font-semibold text-slate-950">
        Continue
      </button>
    </motion.div>
  );
}
