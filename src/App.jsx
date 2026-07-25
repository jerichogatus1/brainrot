import { AnimatePresence, motion } from 'framer-motion';
import Confetti from 'react-confetti';
import { useEffect, useMemo, useState } from 'react';
import { BackgroundFX } from './components/BackgroundFX';
import { StartScreen } from './components/StartScreen';
import { PrankStage } from './components/PrankStage';
import { SettingsPanel } from './components/SettingsPanel';
import { AchievementPanel } from './components/AchievementPanel';
import { StatsPanel } from './components/StatsPanel';
import { SecretMenu } from './components/SecretMenu';
import { useAudio } from './hooks/useAudio';
import { usePersistentState } from './hooks/usePersistentState';
import { ACHIEVEMENTS } from './utils/achievementData';
import { LEVELS } from './utils/levelData';
import brainrotLogo from './assets/images/brainrot.svg';

const randomEvents = [
  { label: 'Vine Boom', emoji: '🎬', sound: 'vineboom' },
  { label: 'Windows XP error sound', emoji: '💥', sound: 'windows_error' },
  { label: 'Emoji explosion', emoji: '💣', sound: 'laugh' },
  { label: 'Fake achievement unlocked', emoji: '🏆', sound: 'success' },
  { label: 'Fake ad popup', emoji: '📢', sound: 'notification' },
  { label: 'Button movement glitch', emoji: '🧲', sound: 'bruh' },
  { label: 'Screen flash', emoji: '⚡', sound: 'notification' },
  { label: 'Screen glitch', emoji: '🪩', sound: 'windows_error' },
  { label: 'Fake lag', emoji: '🐢', sound: 'bruh' },
  { label: 'Mouse trail', emoji: '🖱️', sound: 'laugh' },
  { label: 'Floating memes', emoji: '🧠', sound: 'vineboom' },
];

const credits = [
  'Directed by the guy who said “it is fine”',
  'Sound design by 12 empty MP3 files',
  'UI by 17 suspicious gradients',
  'Produced in a browser tab and a lot of denial',
  'Special thanks to your attention span',
];

export function App() {
  const [difficulty, setDifficulty] = usePersistentState('brainrot-difficulty', 'normal');
  const [muted, setMuted] = usePersistentState('brainrot-muted', false);
  const [stats, setStats] = usePersistentState('brainrot-stats', {
    levelsCompleted: 0,
    clicks: 0,
    speedrunSeconds: 0,
    secretMenuUses: 0,
    pranksSurvived: 0,
  });
  const [progress, setProgress] = usePersistentState('brainrot-progress', {
    started: false,
    currentLevelIndex: 0,
    finished: false,
  });
  const [unlockedAchievements, setUnlockedAchievements] = usePersistentState('brainrot-unlocked-achievements', []);
  const [isStarted, setIsStarted] = useState(progress.started);
  const [currentLevelIndex, setCurrentLevelIndex] = useState(progress.currentLevelIndex);
  const [showSettings, setShowSettings] = useState(false);
  const [showAchievements, setShowAchievements] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [showSecretMenu, setShowSecretMenu] = useState(false);
  const [randomEvent, setRandomEvent] = useState(null);
  const [eventTimer, setEventTimer] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [screenEffects, setScreenEffects] = useState({ vhs: false, comicSans: false, glitch: false, shake: false, invert: false, blur: false });
  const [secretNotice, setSecretNotice] = useState(null);
  const [gameFinished, setGameFinished] = useState(progress.finished);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [creditStep, setCreditStep] = useState(0);

  const { playSound } = useAudio({ muted });

  const currentLevel = useMemo(() => LEVELS[currentLevelIndex] ?? LEVELS[LEVELS.length - 1], [currentLevelIndex]);
  const progressPercent = useMemo(() => ((currentLevelIndex + 1) / LEVELS.length) * 100, [currentLevelIndex]);

  useEffect(() => {
    setProgress({ started: isStarted, currentLevelIndex, finished: gameFinished });
  }, [currentLevelIndex, gameFinished, isStarted, setProgress]);

  useEffect(() => {
    if (!isStarted || gameFinished) {
      return;
    }

    const timer = window.setInterval(() => {
      setStats((prev) => ({ ...prev, speedrunSeconds: prev.speedrunSeconds + 1 }));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [gameFinished, isStarted, setStats]);

  useEffect(() => {
    if (!isStarted || gameFinished) {
      return;
    }

    const interval = window.setInterval(() => {
      const event = randomEvents[Math.floor(Math.random() * randomEvents.length)];
      setRandomEvent(event);
      setEventTimer((value) => value + 1);
      playSound(event.sound);

      if (Math.random() < 0.01) {
        setScreenEffects((prev) => ({ ...prev, vhs: true }));
        setSecretNotice('VHS mode activated');
        window.setTimeout(() => setScreenEffects((prev) => ({ ...prev, vhs: false })), 2200);
      }

      if (Math.random() < 0.005) {
        setScreenEffects((prev) => ({ ...prev, comicSans: true }));
        setSecretNotice('Comic Sans mode engaged');
        window.setTimeout(() => setScreenEffects((prev) => ({ ...prev, comicSans: false })), 2200);
      }

      window.setTimeout(() => setRandomEvent(null), 1600);
      window.setTimeout(() => setSecretNotice(null), 2200);
    }, 4500);

    return () => window.clearInterval(interval);
  }, [gameFinished, isStarted, playSound]);

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === 'Enter' && !isStarted) {
        startGame();
      }

      if (event.key.toLowerCase() === 'm') {
        setMuted((prev) => !prev);
      }

      if (event.key.toLowerCase() === 'f') {
        toggleFullscreen();
      }

      if (event.shiftKey && event.altKey && event.key.toLowerCase() === 'd') {
        setShowSecretMenu(true);
        setStats((prev) => ({ ...prev, secretMenuUses: prev.secretMenuUses + 1 }));
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isStarted, setMuted, setStats]);

  useEffect(() => {
    if (!gameFinished) {
      return;
    }

    const timer = window.setInterval(() => {
      setCreditStep((value) => (value + 1) % credits.length);
    }, 1800);

    return () => window.clearInterval(timer);
  }, [gameFinished]);

  const startGame = () => {
    setIsStarted(true);
    setCurrentLevelIndex(0);
    setGameFinished(false);
    setShowConfetti(false);
    setStats((prev) => ({ ...prev, speedrunSeconds: 0 }));
    playSound('success');
  };

  const toggleMuted = () => {
    setMuted((prev) => !prev);
  };

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
        setIsFullscreen(true);
      } else {
        await document.exitFullscreen();
        setIsFullscreen(false);
      }
    } catch {
      // Browser can reject full-screen if not allowed.
    }
  };

  const handleLevelComplete = () => {
    const nextLevelIndex = currentLevelIndex + 1;
    const nextStats = {
      ...stats,
      levelsCompleted: Math.min(LEVELS.length, stats.levelsCompleted + 1),
      clicks: stats.clicks + 1,
      pranksSurvived: stats.pranksSurvived + 1,
    };

    setStats(nextStats);

    const newlyUnlocked = ACHIEVEMENTS.filter((achievement) => !unlockedAchievements.includes(achievement.id) && achievement.requires(nextStats)).map((achievement) => achievement.id);
    if (newlyUnlocked.length) {
      setUnlockedAchievements((prev) => [...new Set([...prev, ...newlyUnlocked])]);
    }

    if (nextLevelIndex >= LEVELS.length) {
      setGameFinished(true);
      setShowConfetti(true);
      setCurrentLevelIndex(LEVELS.length - 1);
      playSound('success');
      return;
    }

    setCurrentLevelIndex(nextLevelIndex);
    setShowConfetti(false);
    playSound('success');
  };

  const handleLevelAction = () => {
    setStats((prev) => ({ ...prev, clicks: prev.clicks + 1 }));
  };

  const triggerSecretEvent = () => {
    const roll = Math.random();
    if (roll < 0.33) {
      setScreenEffects((prev) => ({ ...prev, vhs: true }));
      setSecretNotice('VHS mode engaged');
      window.setTimeout(() => setScreenEffects((prev) => ({ ...prev, vhs: false })), 2200);
    } else if (roll < 0.66) {
      setScreenEffects((prev) => ({ ...prev, comicSans: true }));
      setSecretNotice('Comic Sans engaged');
      window.setTimeout(() => setScreenEffects((prev) => ({ ...prev, comicSans: false })), 2200);
    } else {
      setSecretNotice('Developer appeared');
    }

    window.setTimeout(() => setSecretNotice(null), 2200);
  };

  const unlockAllLevels = () => {
    setCurrentLevelIndex(LEVELS.length - 1);
    setGameFinished(true);
    setShowConfetti(true);
    setStats((prev) => ({ ...prev, levelsCompleted: LEVELS.length }));
    setUnlockedAchievements((prev) => [...new Set([...prev, ...ACHIEVEMENTS.map((achievement) => achievement.id)])]);
  };

  const toggleVHS = () => {
    setScreenEffects((prev) => ({ ...prev, vhs: !prev.vhs }));
  };

  const toggleComicSans = () => {
    setScreenEffects((prev) => ({ ...prev, comicSans: !prev.comicSans }));
  };

  return (
    <div className={`min-h-screen overflow-hidden bg-slate-950 text-slate-100 ${screenEffects.comicSans ? 'comic-sans' : ''}`}>
      <BackgroundFX />
      {showConfetti ? <Confetti numberOfPieces={180} recycle={false} /> : null}
      <div className={`absolute inset-0 z-10 transition ${screenEffects.vhs ? 'opacity-30' : 'opacity-0'}`} style={{ backgroundImage: 'repeating-linear-gradient(180deg, rgba(255,255,255,0.06) 0px, rgba(0,0,0,0.12) 2px, transparent 4px)' }} />
      <div className={`relative z-20 min-h-screen ${screenEffects.invert ? 'invert' : ''} ${screenEffects.blur ? 'blur-[2px]' : ''} ${screenEffects.glitch ? 'glitch' : ''}`}>
        {!isStarted ? (
          <StartScreen onStart={startGame} difficulty={difficulty} setDifficulty={setDifficulty} muted={muted} onToggleMute={toggleMuted} />
        ) : null}

        {isStarted && !gameFinished ? (
          <div className="mx-auto flex min-h-screen max-w-7xl flex-col px-4 py-4 sm:px-6 lg:px-8">
            <motion.header initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} className="mb-4 rounded-[2rem] border border-white/10 bg-slate-900/70 p-4 shadow-[0_0_40px_rgba(255,255,255,0.12)] backdrop-blur-2xl">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <img src={brainrotLogo} alt="Brainrot logo" className="h-12 w-12 rounded-2xl" />
                  <div>
                    <p className="text-xs uppercase tracking-[0.35em] text-cyan-300">Brainrot.exe</p>
                    <h2 className="text-lg font-black text-white">Level {Math.min(currentLevelIndex + 1, LEVELS.length)} / {LEVELS.length}</h2>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button onClick={() => setShowSettings(true)} className="rounded-full border border-white/20 bg-white/10 px-3 py-2 text-sm text-white">Settings</button>
                  <button onClick={() => setShowAchievements(true)} className="rounded-full border border-white/20 bg-white/10 px-3 py-2 text-sm text-white">Achievements</button>
                  <button onClick={() => setShowStats(true)} className="rounded-full border border-white/20 bg-white/10 px-3 py-2 text-sm text-white">Stats</button>
                  <button onClick={() => setShowSecretMenu(true)} className="rounded-full border border-fuchsia-400/30 bg-fuchsia-500/10 px-3 py-2 text-sm text-fuchsia-200">Dev Menu</button>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-3">
                <div className="h-2 flex-1 rounded-full bg-slate-800">
                  <div className="h-2 rounded-full bg-gradient-to-r from-fuchsia-500 via-pink-500 to-cyan-400" style={{ width: `${progressPercent}%` }} />
                </div>
                <div className="rounded-full border border-white/10 bg-white/10 px-3 py-2 text-sm text-slate-200">
                  Time: {stats.speedrunSeconds}s • Clicks: {stats.clicks}
                </div>
              </div>
            </motion.header>

            <div className="flex-1 rounded-[2rem] border border-white/10 bg-slate-900/70 p-4 shadow-[0_0_40px_rgba(0,0,0,0.2)] backdrop-blur-2xl sm:p-6">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Current prank</p>
                  <h3 className="text-2xl font-black text-white">{currentLevel.title}</h3>
                  <p className="mt-1 text-sm text-slate-300">{currentLevel.subtitle}</p>
                </div>
                <div className="rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm text-slate-200">
                  Difficulty: {difficulty}
                </div>
              </div>

              <PrankStage level={currentLevel} onComplete={handleLevelComplete} onAction={handleLevelAction} difficulty={difficulty} screenEffects={screenEffects} playSound={playSound} />
            </div>
          </div>
        ) : null}

        {gameFinished ? (
          <div className="relative z-30 flex min-h-screen items-center justify-center px-4 py-10">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-3xl rounded-[2rem] border border-white/20 bg-slate-950/80 p-8 shadow-[0_0_70px_rgba(255,255,255,0.18)] backdrop-blur-2xl">
              <p className="text-sm uppercase tracking-[0.4em] text-cyan-300">End of the prank</p>
              <h1 className="mt-3 text-4xl font-black text-white sm:text-5xl">You have successfully lost several brain cells.</h1>
              <p className="mt-4 text-lg text-slate-300">The fake ending has been delivered. The credits roll now. There are actually 999 levels.</p>
              <div className="mt-6 rounded-2xl border border-white/10 bg-white/10 p-4 text-sm text-slate-200">
                {credits[creditStep]}
              </div>
              <div className="mt-6 flex flex-wrap gap-3">
                <button onClick={startGame} className="rounded-full bg-gradient-to-r from-fuchsia-500 via-pink-500 to-cyan-400 px-5 py-3 font-black text-white">Restart the prank</button>
                <button onClick={() => setShowAchievements(true)} className="rounded-full border border-white/20 bg-white/10 px-5 py-3 font-semibold text-white">Review achievements</button>
              </div>
            </motion.div>
          </div>
        ) : null}
      </div>

      <AnimatePresence>{randomEvent ? <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="fixed bottom-4 left-1/2 z-40 -translate-x-1/2 rounded-full border border-white/20 bg-slate-900/80 px-4 py-3 text-sm text-white shadow-[0_0_40px_rgba(255,255,255,0.15)]">{randomEvent.emoji} {randomEvent.label}</motion.div> : null}</AnimatePresence>
      <AnimatePresence>{secretNotice ? <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="fixed right-4 top-4 z-40 rounded-full border border-fuchsia-400/30 bg-fuchsia-500/20 px-4 py-3 text-sm font-semibold text-fuchsia-100">{secretNotice}</motion.div> : null}</AnimatePresence>

      <SettingsPanel open={showSettings} onClose={() => setShowSettings(false)} difficulty={difficulty} setDifficulty={setDifficulty} muted={muted} onToggleMute={toggleMuted} onToggleFullscreen={toggleFullscreen} />
      <AchievementPanel open={showAchievements} onClose={() => setShowAchievements(false)} achievements={ACHIEVEMENTS} unlockedIds={unlockedAchievements} />
      <StatsPanel open={showStats} onClose={() => setShowStats(false)} stats={stats} />
      <SecretMenu open={showSecretMenu} onClose={() => setShowSecretMenu(false)} onUnlockAll={unlockAllLevels} onTriggerSecret={triggerSecretEvent} onToggleVHS={toggleVHS} onToggleComicSans={toggleComicSans} />
    </div>
  );
}
