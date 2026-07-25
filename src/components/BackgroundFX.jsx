import { motion } from 'framer-motion';

const orbs = [
  { id: 1, className: 'left-[5%] top-[10%] bg-fuchsia-500/40', size: 'h-40 w-40' },
  { id: 2, className: 'right-[8%] top-[15%] bg-cyan-500/30', size: 'h-32 w-32' },
  { id: 3, className: 'left-[20%] bottom-[10%] bg-amber-400/30', size: 'h-48 w-48' },
  { id: 4, className: 'right-[20%] bottom-[20%] bg-violet-500/30', size: 'h-24 w-24' },
];

export function BackgroundFX() {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.15),_transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(255,255,255,0.12),_transparent_25%)]" />
      {orbs.map((orb) => (
        <motion.div
          key={orb.id}
          className={`absolute ${orb.className} ${orb.size} rounded-full blur-3xl`}
          animate={{ y: [0, -20, 0], x: [0, 10, 0], scale: [1, 1.08, 1] }}
          transition={{ duration: 8 + orb.id, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}
      <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(255,255,255,0.25)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.25)_1px,transparent_1px)] [background-size:56px_56px]" />
    </div>
  );
}
