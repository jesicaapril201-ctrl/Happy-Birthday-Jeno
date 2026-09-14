import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Target, Trophy, Sparkles, Crosshair, ArrowRight } from 'lucide-react';
import { soundEngine } from '../../utils/audioSynthesizer';
import confetti from 'canvas-confetti';

interface WebShooterGameProps {
  onGameComplete: () => void;
}

interface TargetItem {
  id: number;
  x: number;
  y: number;
  label: string;
  sub: string;
  type: 'goblin' | 'heart' | 'gift' | 'mask';
  size: number;
}

export const WebShooterGame: React.FC<WebShooterGameProps> = ({ onGameComplete }) => {
  const [score, setScore] = useState(0);
  const targetGoal = 5;
  const [targets, setTargets] = useState<TargetItem[]>([]);
  const [webLines, setWebLines] = useState<{ id: number; toX: number; toY: number }[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isCompleted, setIsCompleted] = useState(false);

  // Spawn targets periodically
  useEffect(() => {
    if (isCompleted) return;

    const items: Array<{ label: string; sub: string; type: TargetItem['type'] }> = [
      { label: '🎃', sub: 'Goblin Glider', type: 'goblin' },
      { label: '❤️', sub: 'Hati Pacar', type: 'heart' },
      { label: '🎁', sub: 'Kado Spidey', type: 'gift' },
      { label: '🕷️', sub: 'Spidey Mask', type: 'mask' },
      { label: '🎈', sub: 'Balon Ultah', type: 'heart' },
    ];

    const spawnInterval = setInterval(() => {
      setTargets((prev) => {
        if (prev.length >= 4) return prev;
        const randomItem = items[Math.floor(Math.random() * items.length)];
        const newTarget: TargetItem = {
          id: Date.now() + Math.random(),
          x: Math.random() * 75 + 10, // 10% to 85% width
          y: Math.random() * 55 + 15, // 15% to 70% height
          label: randomItem.label,
          sub: randomItem.sub,
          type: randomItem.type,
          size: Math.floor(Math.random() * 15) + 55,
        };
        return [...prev, newTarget];
      });
    }, 1100);

    return () => clearInterval(spawnInterval);
  }, [isCompleted]);

  const handleShoot = (targetId: number, targetX: number, targetY: number) => {
    if (isCompleted) return;

    soundEngine.playThwip();
    soundEngine.playPop();

    // Trigger visual web shot
    const lineId = Date.now();
    setWebLines((prev) => [...prev, { id: lineId, toX: targetX, toY: targetY }]);
    setTimeout(() => {
      setWebLines((prev) => prev.filter((l) => l.id !== lineId));
    }, 350);

    // Small confetti burst at target
    confetti({
      particleCount: 15,
      spread: 45,
      origin: { x: targetX / 100, y: targetY / 100 },
      colors: ['#ef4444', '#3b82f6', '#ffffff'],
    });

    // Remove target
    setTargets((prev) => prev.filter((t) => t.id !== targetId));

    const nextScore = score + 1;
    setScore(nextScore);

    if (nextScore >= targetGoal && !isCompleted) {
      setIsCompleted(true);
      soundEngine.playVictory();
      confetti({
        particleCount: 80,
        spread: 80,
        origin: { y: 0.5 },
      });
      setTimeout(() => {
        onGameComplete();
      }, 1200);
    }
  };

  return (
    <div className="flex flex-col items-center w-full max-w-2xl mx-auto select-none">
      {/* Game Header */}
      <div className="w-full flex items-center justify-between mb-4 bg-slate-900/80 border-2 border-red-500/50 rounded-2xl p-3 px-5 shadow-lg backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <Crosshair className="w-6 h-6 text-red-400 animate-spin" style={{ animationDuration: '6s' }} />
          <div>
            <h3 className="font-bangers text-xl text-white tracking-wide">
              MISI 1: TEMBAK JARING SPIDEY!
            </h3>
            <p className="text-xs text-slate-300 font-fredoka">
              Klik atau tap target yang melayang untuk menembak jaring web!
            </p>
          </div>
        </div>

        {/* Score Counter */}
        <div className="flex items-center gap-2 bg-red-600/30 border border-red-500 rounded-xl px-3 py-1.5 font-bangers text-xl text-white">
          <Target className="w-5 h-5 text-red-400" />
          <span>
            {score} / {targetGoal}
          </span>
        </div>
      </div>

      {/* Interactive Arena */}
      <div
        ref={containerRef}
        className="relative w-full h-[380px] bg-gradient-to-b from-slate-950 via-slate-900 to-blue-950/70 border-4 border-slate-900 rounded-3xl overflow-hidden shadow-2xl comic-border-red"
      >
        {/* City Skyline Background Silhouettes */}
        <div className="absolute inset-0 opacity-25 pointer-events-none flex items-end justify-between">
          <div className="w-16 h-48 bg-blue-500/30"></div>
          <div className="w-24 h-64 bg-red-500/20"></div>
          <div className="w-20 h-56 bg-blue-600/30"></div>
          <div className="w-28 h-72 bg-slate-400/20"></div>
          <div className="w-16 h-52 bg-red-600/20"></div>
        </div>

        {/* Dynamic SVG Web lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-30">
          {webLines.map((line) => (
            <g key={line.id}>
              {/* Web line from shooter origin at bottom center (50%, 95%) */}
              <line
                x1="50%"
                y1="95%"
                x2={`${line.toX}%`}
                y2={`${line.toY}%`}
                stroke="#ffffff"
                strokeWidth="4"
                strokeDasharray="6 3"
                className="drop-shadow-[0_0_8px_rgba(255,255,255,0.9)]"
              />
              {/* Web burst on impact */}
              <circle
                cx={`${line.toX}%`}
                cy={`${line.toY}%`}
                r="18"
                fill="none"
                stroke="#ffffff"
                strokeWidth="2.5"
                strokeDasharray="4 2"
              />
            </g>
          ))}
        </svg>

        {/* Floating Targets */}
        <AnimatePresence>
          {targets.map((target) => (
            <motion.button
              key={target.id}
              initial={{ scale: 0, opacity: 0 }}
              animate={{
                scale: [0.95, 1.08, 0.95],
                y: [-8, 8, -8],
                opacity: 1,
              }}
              exit={{ scale: 1.5, opacity: 0 }}
              transition={{
                duration: 2.4,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              style={{
                left: `${target.x}%`,
                top: `${target.y}%`,
                width: `${target.size}px`,
                height: `${target.size}px`,
              }}
              onClick={() => handleShoot(target.id, target.x, target.y)}
              className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full flex flex-col items-center justify-center p-2 cursor-pointer z-20 group transition-transform active:scale-90"
            >
              {/* Glowing Aura */}
              <div className="absolute inset-0 rounded-full bg-red-500/20 group-hover:bg-red-500/40 blur-md transition"></div>

              {/* Target Badge */}
              <div className="relative w-full h-full rounded-full bg-slate-900/90 border-2 border-red-400/80 group-hover:border-white shadow-xl flex items-center justify-center flex-col">
                <span className="text-2xl drop-shadow group-hover:scale-125 transition-transform">
                  {target.label}
                </span>
                <span className="text-[9px] font-bold text-white font-fredoka uppercase tracking-tighter opacity-80 group-hover:opacity-100">
                  {target.sub}
                </span>
              </div>
            </motion.button>
          ))}
        </AnimatePresence>

        {/* Bottom Web Shooter Device Graphic */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center pointer-events-none">
          <div className="px-3 py-1 bg-red-600 text-white rounded-t-lg font-bangers text-xs tracking-wider border-t-2 border-x-2 border-slate-900 shadow">
            WEB-SHOOTER 🤟
          </div>
          <div className="w-20 h-7 bg-gradient-to-r from-red-600 via-blue-600 to-red-600 rounded-t-xl border-2 border-slate-900 shadow-inner flex items-center justify-center">
            <div className="w-3 h-3 rounded-full bg-white shadow-[0_0_8px_#ffffff] animate-ping"></div>
          </div>
        </div>

        {/* Level Clear Overlay */}
        {isCompleted && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute inset-0 bg-slate-950/85 backdrop-blur-sm z-40 flex flex-col items-center justify-center text-center p-6"
          >
            <Trophy className="w-16 h-16 text-amber-400 mb-2 animate-bounce" />
            <h4 className="font-bangers text-3xl sm:text-4xl text-white tracking-wider">
              MISI 1 BERHASIL! 💥
            </h4>
            <p className="text-sm font-fredoka text-slate-300 mt-1 max-w-sm">
              Refleks Spider-Man kamu luar biasa! Lanjut ke Misi 2 untuk menguji Spider-Sense memory kamu!
            </p>
            <button
              onClick={() => {
                soundEngine.playThwip();
                onGameComplete();
              }}
              className="mt-4 flex items-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-500 text-white font-bangers text-base tracking-wider rounded-xl shadow-lg comic-border cursor-pointer transition animate-pulse active:scale-95"
            >
              <Sparkles className="w-4 h-4" />
              <span>LANJUT KE MISI 2 ➔</span>
            </button>
          </motion.div>
        )}
      </div>

      <p className="text-xs text-slate-400 font-fredoka mt-3 text-center">
        Tip: Tangkap 5 target apa saja untuk menuntaskan tantangan tembak jaring!
      </p>
    </div>
  );
};
