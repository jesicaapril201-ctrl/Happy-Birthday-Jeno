import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Target, Brain, Trophy, Sparkles, CheckCircle2, ChevronRight } from 'lucide-react';
import { WebShooterGame } from './WebShooterGame';
import { MemoryCardGame } from './MemoryCardGame';
import { SkylineCatchGame } from './SkylineCatchGame';
import { SpideyChibi } from '../SpideyChibi';
import { soundEngine } from '../../utils/audioSynthesizer';

interface GameHubProps {
  onAllGamesComplete: () => void;
  onSkipGames?: () => void;
}

export const GameHub: React.FC<GameHubProps> = ({ onAllGamesComplete, onSkipGames }) => {
  const [activeGameIndex, setActiveGameIndex] = useState(0);
  const [completedGames, setCompletedGames] = useState<boolean[]>([false, false, false]);

  const handleGame1Finished = () => {
    setCompletedGames((prev) => [true, prev[1], prev[2]]);
    setActiveGameIndex(1);
  };

  const handleGame2Finished = () => {
    setCompletedGames((prev) => [prev[0], true, prev[2]]);
    setActiveGameIndex(2);
  };

  const handleGame3Finished = () => {
    setCompletedGames([true, true, true]);
    onAllGamesComplete();
  };

  const gameTitles = [
    { title: 'Tembak Jaring', icon: Target, desc: 'Uji Refleks Tembak Web' },
    { title: 'Spider-Sense', icon: Brain, desc: 'Tes Ingatan Pasangan' },
    { title: 'Skyline Catch', icon: Trophy, desc: 'Tangkap Kue & Hati' },
  ];

  return (
    <div className="w-full max-w-3xl mx-auto py-4 px-3 flex flex-col items-center">
      {/* Top Banner */}
      <div className="text-center mb-6">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-600/20 border border-red-500/40 text-red-300 font-bold font-fredoka text-xs sm:text-sm">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          ZONA TANTANGAN SUPERHERO (3 GAMES)
        </span>
        <h2 className="font-bangers text-3xl sm:text-5xl text-white tracking-wide mt-2 drop-shadow">
          SELESAIKAN 3 MISI SEBELUM TIUP LILIN, JENO! 🕸️🎂
        </h2>
        <p className="text-slate-300 text-xs sm:text-sm font-fredoka mt-1 max-w-md mx-auto">
          Buktikan refleks superhero-mu di 3 misi ini untuk membuka kue ulang tahun rahasia!
        </p>
      </div>

      {/* Mission Progress Indicator (Sequential) */}
      <div className="w-full grid grid-cols-3 gap-2 sm:gap-4 mb-6">
        {gameTitles.map((g, idx) => {
          const Icon = g.icon;
          const isCurrent = activeGameIndex === idx;
          const isDone = completedGames[idx];

          return (
            <div
              key={idx}
              className={`relative flex flex-col sm:flex-row items-center sm:items-start gap-2 p-2.5 sm:p-3 rounded-2xl border-2 transition-all text-left ${
                isCurrent
                  ? 'bg-red-600/30 border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.4)] scale-102'
                  : isDone
                  ? 'bg-emerald-950/40 border-emerald-500/60 opacity-90'
                  : 'bg-slate-900/60 border-slate-800 opacity-60'
              }`}
            >
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 ${
                  isDone
                    ? 'bg-emerald-500 text-slate-950'
                    : isCurrent
                    ? 'bg-red-500 text-white'
                    : 'bg-slate-800 text-slate-400'
                }`}
              >
                {isDone ? <CheckCircle2 className="w-5 h-5" /> : <Icon className="w-4 h-4" />}
              </div>

              <div className="overflow-hidden hidden sm:block">
                <div className="flex items-center gap-1">
                  <span className="font-bangers text-sm text-white tracking-wide">
                    MISI {idx + 1}
                  </span>
                  {isDone && <span className="text-[10px] text-emerald-400 font-bold">✓ TUNTAS</span>}
                </div>
                <p className="text-[11px] text-slate-300 font-fredoka truncate">{g.title}</p>
              </div>

              {/* Mobile label */}
              <span className="sm:hidden font-bangers text-xs text-white">MISI {idx + 1}</span>
            </div>
          );
        })}
      </div>

      {/* Active Game Container */}
      <div className="w-full relative">
        <AnimatePresence mode="wait">
          {activeGameIndex === 0 && (
            <motion.div
              key="game-1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <WebShooterGame onGameComplete={handleGame1Finished} />
            </motion.div>
          )}

          {activeGameIndex === 1 && (
            <motion.div
              key="game-2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <MemoryCardGame onGameComplete={handleGame2Finished} />
            </motion.div>
          )}

          {activeGameIndex === 2 && (
            <motion.div
              key="game-3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <SkylineCatchGame onGameComplete={handleGame3Finished} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Floating mini Spidey guide */}
      <div className="mt-8 flex items-center justify-between w-full bg-slate-900/60 border border-slate-800 rounded-2xl p-3 px-4 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <SpideyChibi size={55} mood="waving" />
          <div className="text-left">
            <p className="font-fredoka text-xs text-slate-300">
              "Ayo selesaikan semua misinya untuk merayakan ulang tahunmu! 🤟"
            </p>
            <p className="text-[10px] text-red-400 font-bold">
              Progress: {completedGames.filter(Boolean).length} / 3 Misi selesai
            </p>
          </div>
        </div>

        {/* Skip to Cake button for convenience if boyfriend wants to see cake directly */}
        <button
          onClick={() => {
            soundEngine.playVictory();
            onAllGamesComplete();
          }}
          className="flex items-center gap-1 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-amber-300 font-fredoka font-semibold text-xs rounded-xl transition cursor-pointer border border-amber-400/30"
          title="Lewati Game langsung ke Kue Ulang Tahun"
        >
          <span>Lanjut ke Kue</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
