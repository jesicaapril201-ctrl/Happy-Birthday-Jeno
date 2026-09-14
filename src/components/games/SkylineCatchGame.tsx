import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { Trophy, Sparkles, Heart, ArrowLeft, ArrowRight } from 'lucide-react';
import { soundEngine } from '../../utils/audioSynthesizer';
import confetti from 'canvas-confetti';

interface SkylineCatchGameProps {
  onGameComplete: () => void;
}

interface FallingObject {
  id: number;
  x: number; // percentage (5% to 90%)
  y: number; // percentage (0% to 100%)
  emoji: string;
  isHazard: boolean;
  speed: number;
}

export const SkylineCatchGame: React.FC<SkylineCatchGameProps> = ({ onGameComplete }) => {
  const [spideyX, setSpideyX] = useState(50); // percentage (10% to 90%)
  const [items, setItems] = useState<FallingObject[]>([]);
  const [score, setScore] = useState(0);
  const targetScore = 6;
  const [isCompleted, setIsCompleted] = useState(false);
  const arenaRef = useRef<HTMLDivElement>(null);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        setSpideyX((prev) => Math.max(12, prev - 10));
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        setSpideyX((prev) => Math.min(88, prev + 10));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Spawn falling objects
  useEffect(() => {
    if (isCompleted) return;

    const spawnInterval = setInterval(() => {
      setItems((prev) => {
        if (prev.length >= 6) return prev;
        const isHazard = Math.random() < 0.25;
        const emojis = isHazard ? ['⚡', '💣'] : ['🎂', '💖', '🎁', '🍰', '🎈'];
        const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];

        return [
          ...prev,
          {
            id: Date.now() + Math.random(),
            x: Math.random() * 76 + 12,
            y: 0,
            emoji: randomEmoji,
            isHazard,
            speed: 1.2 + Math.random() * 0.8,
          },
        ];
      });
    }, 900);

    return () => clearInterval(spawnInterval);
  }, [isCompleted]);

  // Game loop to drop objects and detect collision with Spidey
  useEffect(() => {
    if (isCompleted) return;

    const interval = setInterval(() => {
      setItems((prev) => {
        const next: FallingObject[] = [];

        for (const item of prev) {
          const nextY = item.y + item.speed * 2.2;

          // Collision detection: Spidey is at y ~ 85%, x is spideyX
          if (nextY >= 78 && nextY <= 92 && Math.abs(item.x - spideyX) < 14) {
            // Collision!
            if (item.isHazard) {
              soundEngine.playPop();
              setScore((s) => Math.max(0, s - 1));
            } else {
              soundEngine.playThwip();
              soundEngine.playChime();
              setScore((s) => {
                const updated = s + 1;
                if (updated >= targetScore && !isCompleted) {
                  setIsCompleted(true);
                  soundEngine.playVictory();
                  confetti({
                    particleCount: 100,
                    spread: 90,
                    origin: { y: 0.5 },
                  });
                  setTimeout(() => {
                    onGameComplete();
                  }, 1300);
                }
                return updated;
              });
            }
            continue; // caught! remove from falling list
          }

          if (nextY < 100) {
            next.push({ ...item, y: nextY });
          }
        }
        return next;
      });
    }, 60);

    return () => clearInterval(interval);
  }, [spideyX, isCompleted]);

  // Touch / mouse movement on arena
  const handleArenaMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!arenaRef.current || isCompleted) return;
    const rect = arenaRef.current.getBoundingClientRect();
    const relativeX = ((e.clientX - rect.left) / rect.width) * 100;
    setSpideyX(Math.max(12, Math.min(88, relativeX)));
  };

  const handleArenaTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!arenaRef.current || isCompleted || !e.touches[0]) return;
    const rect = arenaRef.current.getBoundingClientRect();
    const relativeX = ((e.touches[0].clientX - rect.left) / rect.width) * 100;
    setSpideyX(Math.max(12, Math.min(88, relativeX)));
  };

  return (
    <div className="flex flex-col items-center w-full max-w-2xl mx-auto select-none">
      {/* Game Header */}
      <div className="w-full flex items-center justify-between mb-4 bg-slate-900/80 border-2 border-red-500/50 rounded-2xl p-3 px-5 shadow-lg backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <Heart className="w-6 h-6 text-red-500 fill-red-500 animate-bounce" />
          <div>
            <h3 className="font-bangers text-xl text-white tracking-wide">
              MISI 3: TANGKAP KUE & HATI ULTAH!
            </h3>
            <p className="text-xs text-slate-300 font-fredoka">
              Gerakkan Spidey ke kiri & kanan untuk menangkap kue & kado ultah!
            </p>
          </div>
        </div>

        {/* Score Counter */}
        <div className="flex items-center gap-2 bg-red-600/30 border border-red-500 rounded-xl px-3 py-1.5 font-bangers text-xl text-white">
          <Trophy className="w-5 h-5 text-amber-400" />
          <span>
            {score} / {targetScore}
          </span>
        </div>
      </div>

      {/* Interactive Arena */}
      <div
        ref={arenaRef}
        onMouseMove={handleArenaMouseMove}
        onTouchMove={handleArenaTouchMove}
        className="relative w-full h-[380px] bg-gradient-to-b from-slate-950 via-slate-900 to-indigo-950/80 border-4 border-slate-900 rounded-3xl overflow-hidden shadow-2xl comic-border-gold cursor-ew-resize"
      >
        {/* City Skyline & Stars Background */}
        <div className="absolute inset-0 pointer-events-none opacity-20">
          <div className="absolute top-4 left-10 text-white text-xs">✨</div>
          <div className="absolute top-12 right-20 text-white text-xs">⭐</div>
          <div className="absolute top-20 left-1/3 text-white text-xs">✨</div>
          <div className="absolute bottom-0 inset-x-0 h-32 bg-repeat-x flex items-end justify-between px-4">
            <div className="w-12 h-28 bg-slate-400/40 rounded-t"></div>
            <div className="w-16 h-36 bg-blue-500/40 rounded-t"></div>
            <div className="w-20 h-24 bg-red-500/40 rounded-t"></div>
            <div className="w-14 h-32 bg-slate-300/40 rounded-t"></div>
            <div className="w-16 h-40 bg-blue-400/40 rounded-t"></div>
          </div>
        </div>

        {/* Falling items */}
        {items.map((item) => (
          <div
            key={item.id}
            style={{
              left: `${item.x}%`,
              top: `${item.y}%`,
            }}
            className="absolute -translate-x-1/2 -translate-y-1/2 text-3xl filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.6)] select-none pointer-events-none transition-all"
          >
            {item.emoji}
          </div>
        ))}

        {/* Catching Spidey Character */}
        <div
          style={{ left: `${spideyX}%` }}
          className="absolute bottom-4 -translate-x-1/2 flex flex-col items-center pointer-events-none transition-all duration-75"
        >
          {/* Spidey web basket */}
          <div className="relative flex items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-red-600 border-2 border-slate-900 shadow-xl flex items-center justify-center">
              <span className="text-2xl animate-bounce">🕸️</span>
            </div>
            {/* Cute chibi mini head */}
            <div className="absolute -top-3 w-8 h-8 rounded-full bg-red-600 border-2 border-slate-900 flex items-center justify-center shadow">
              <div className="flex gap-1">
                <div className="w-1.5 h-2 bg-white rounded-full border border-black"></div>
                <div className="w-1.5 h-2 bg-white rounded-full border border-black"></div>
              </div>
            </div>
          </div>
          <span className="text-[10px] font-bangers text-amber-300 bg-slate-900/90 px-2 py-0.5 rounded-full border border-red-500 mt-1">
            TANGKAP!
          </span>
        </div>

        {/* Victory Screen */}
        {isCompleted && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute inset-0 bg-slate-950/90 backdrop-blur-sm z-40 flex flex-col items-center justify-center text-center p-6"
          >
            <Trophy className="w-20 h-20 text-amber-400 mb-2 animate-bounce" />
            <h4 className="font-bangers text-4xl sm:text-5xl text-white tracking-wider">
              SEMUA MISI TUNTAS! 🎉🕸️
            </h4>
            <p className="text-base font-fredoka text-slate-200 mt-2 max-w-sm">
              Kamu resmi superhero terhebat! Sekarang saatnya tiup lilin dan make a wish di kue ulang tahunmu!
            </p>
            <button
              onClick={() => {
                soundEngine.playThwip();
                onGameComplete();
              }}
              className="mt-5 flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-600 via-red-500 to-amber-500 hover:from-red-500 hover:to-amber-400 text-white font-bangers text-xl rounded-2xl shadow-xl animate-pulse cursor-pointer transition active:scale-95 comic-border-blue"
            >
              <Sparkles className="w-5 h-5" />
              <span>BUKA KUE ULANG TAHUN SEKARANG 🎂 ➔</span>
            </button>
          </motion.div>
        )}
      </div>

      {/* Touch / Click Buttons for Mobile */}
      <div className="flex sm:hidden items-center justify-center gap-6 mt-4 w-full">
        <button
          onClick={() => setSpideyX((prev) => Math.max(12, prev - 15))}
          className="flex-1 py-3 bg-red-700/80 active:bg-red-600 text-white rounded-2xl flex items-center justify-center gap-2 font-bangers text-lg comic-border"
        >
          <ArrowLeft className="w-6 h-6" /> KIRI
        </button>
        <button
          onClick={() => setSpideyX((prev) => Math.min(88, prev + 15))}
          className="flex-1 py-3 bg-blue-700/80 active:bg-blue-600 text-white rounded-2xl flex items-center justify-center gap-2 font-bangers text-lg comic-border"
        >
          KANAN <ArrowRight className="w-6 h-6" />
        </button>
      </div>

      <p className="text-xs text-slate-400 font-fredoka mt-3 text-center">
        Tip: Gunakan tombol panah keyboard atau geser mouse / sentuh layar untuk menggerakkan Spidey!
      </p>
    </div>
  );
};
