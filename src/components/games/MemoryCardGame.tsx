import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Brain, Trophy, Sparkles, RefreshCw, Zap } from 'lucide-react';
import { soundEngine } from '../../utils/audioSynthesizer';
import confetti from 'canvas-confetti';

interface MemoryCardGameProps {
  onGameComplete: () => void;
}

interface CardItem {
  id: number;
  pairId: number;
  emoji: string;
  name: string;
  color: string;
  isFlipped: boolean;
  isMatched: boolean;
}

const BASE_ITEMS = [
  { pairId: 1, emoji: '🕷️', name: 'Spidey', color: 'from-red-600 to-red-800' },
  { pairId: 2, emoji: '💖', name: 'Cinta Jeno', color: 'from-pink-600 to-rose-700' },
  { pairId: 3, emoji: '🕸️', name: 'Jaring Web', color: 'from-blue-600 to-blue-800' },
  { pairId: 4, emoji: '🎂', name: 'Kue Ultah', color: 'from-amber-500 to-amber-700' },
];

export const MemoryCardGame: React.FC<MemoryCardGameProps> = ({ onGameComplete }) => {
  const [cards, setCards] = useState<CardItem[]>([]);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isLocked, setIsLocked] = useState(false);

  // Initialize and shuffle cards
  const initializeCards = () => {
    const duplicated = [...BASE_ITEMS, ...BASE_ITEMS].map((item, index) => ({
      ...item,
      id: index,
      isFlipped: false,
      isMatched: false,
    }));

    // Fisher-Yates shuffle
    for (let i = duplicated.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [duplicated[i], duplicated[j]] = [duplicated[j], duplicated[i]];
    }

    setCards(duplicated);
    setFlippedIndices([]);
    setMoves(0);
    setIsCompleted(false);
    setIsLocked(false);
  };

  useEffect(() => {
    initializeCards();
  }, []);

  const handleCardClick = (index: number) => {
    if (isLocked || isCompleted) return;
    const card = cards[index];
    if (card.isFlipped || card.isMatched) return;

    soundEngine.playThwip();

    const newCards = [...cards];
    newCards[index].isFlipped = true;
    setCards(newCards);

    const newFlipped = [...flippedIndices, index];
    setFlippedIndices(newFlipped);

    if (newFlipped.length === 2) {
      setIsLocked(true);
      setMoves((m) => m + 1);

      const [firstIdx, secondIdx] = newFlipped;
      const firstCard = newCards[firstIdx];
      const secondCard = newCards[secondIdx];

      if (firstCard.pairId === secondCard.pairId) {
        // Matched!
        setTimeout(() => {
          soundEngine.playChime();
          const matchedCards = [...cards];
          matchedCards[firstIdx].isMatched = true;
          matchedCards[secondIdx].isMatched = true;
          setCards(matchedCards);
          setFlippedIndices([]);
          setIsLocked(false);

          // Check if all matched
          const allDone = matchedCards.every((c) => c.isMatched);
          if (allDone) {
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
        }, 500);
      } else {
        // Not matched -> flip back
        setTimeout(() => {
          const resetCards = [...cards];
          resetCards[firstIdx].isFlipped = false;
          resetCards[secondIdx].isFlipped = false;
          setCards(resetCards);
          setFlippedIndices([]);
          setIsLocked(false);
        }, 850);
      }
    }
  };

  const matchedCount = cards.filter((c) => c.isMatched).length / 2;

  return (
    <div className="flex flex-col items-center w-full max-w-2xl mx-auto select-none">
      {/* Game Header */}
      <div className="w-full flex items-center justify-between mb-4 bg-slate-900/80 border-2 border-red-500/50 rounded-2xl p-3 px-5 shadow-lg backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <Brain className="w-6 h-6 text-amber-400" />
          <div>
            <h3 className="font-bangers text-xl text-white tracking-wide flex items-center gap-1.5">
              MISI 2: TES INGATAN SPIDER-SENSE!
              <Zap className="w-4 h-4 text-amber-400 fill-amber-400 animate-pulse" />
            </h3>
            <p className="text-xs text-slate-300 font-fredoka">
              Buka dan temukan pasangan kartu superhero yang cocok!
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-red-600/30 border border-red-500 rounded-xl px-3 py-1 text-center">
            <span className="text-[10px] text-slate-300 block font-fredoka uppercase">Pasang</span>
            <span className="font-bangers text-lg text-white">
              {matchedCount} / {BASE_ITEMS.length}
            </span>
          </div>

          <button
            onClick={initializeCards}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition cursor-pointer"
            title="Kocok Ulang Kartu"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Cards Grid (4x2 for 8 cards) */}
      <div className="w-full grid grid-cols-4 gap-2 sm:gap-3 p-3 sm:p-4 bg-slate-950/80 border-4 border-slate-900 rounded-3xl comic-border-blue relative">
        {cards.map((card, idx) => (
          <div
            key={card.id}
            onClick={() => handleCardClick(idx)}
            className="relative h-28 sm:h-32 perspective-[800px] cursor-pointer"
          >
            <motion.div
              animate={{
                rotateY: card.isFlipped || card.isMatched ? 180 : 0,
                scale: card.isMatched ? [1, 1.05, 1] : 1,
              }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              style={{ transformStyle: 'preserve-3d' }}
              className="w-full h-full relative rounded-2xl"
            >
              {/* Back of card (Hidden - Spidey Logo face down) */}
              <div
                className="absolute inset-0 rounded-2xl bg-gradient-to-br from-red-700 via-red-800 to-slate-900 border-2 border-red-400/50 shadow-md flex flex-col items-center justify-center p-2 hover:border-white transition-colors"
                style={{ backfaceVisibility: 'hidden' }}
              >
                <div className="w-10 h-10 rounded-full bg-slate-900/80 border border-red-400 flex items-center justify-center shadow-inner">
                  <span className="font-bangers text-xl text-red-400">🕸️</span>
                </div>
                <span className="text-[10px] font-fredoka font-bold text-red-200 mt-1">
                  SPIDEY
                </span>
              </div>

              {/* Front of card (Revealed face up) */}
              <div
                className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${card.color} border-2 ${
                  card.isMatched ? 'border-amber-400 ring-2 ring-amber-400/50' : 'border-white'
                } shadow-xl flex flex-col items-center justify-center p-2`}
                style={{
                  backfaceVisibility: 'hidden',
                  transform: 'rotateY(180deg)',
                }}
              >
                <span className="text-3xl sm:text-4xl filter drop-shadow-md">{card.emoji}</span>
                <span className="text-[11px] font-fredoka font-bold text-white mt-1 drop-shadow">
                  {card.name}
                </span>
                {card.isMatched && (
                  <span className="absolute top-1 right-1 text-xs">✨</span>
                )}
              </div>
            </motion.div>
          </div>
        ))}

        {/* Victory Screen Modal */}
        {isCompleted && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute inset-0 bg-slate-950/85 backdrop-blur-sm z-40 flex flex-col items-center justify-center text-center p-6 rounded-2xl"
          >
            <Trophy className="w-16 h-16 text-amber-400 mb-2 animate-bounce" />
            <h4 className="font-bangers text-3xl sm:text-4xl text-white tracking-wider">
              MISI 2 SELESAI! 🧠⚡
            </h4>
            <p className="text-sm font-fredoka text-slate-300 mt-1 max-w-sm">
              Spider-Sense ingatanmu tajam banget ({moves} langkah)! Misi terakhir menanti sebelum kue ulang tahun!
            </p>
            <button
              onClick={() => {
                soundEngine.playThwip();
                onGameComplete();
              }}
              className="mt-4 flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bangers text-base tracking-wider rounded-xl shadow-lg comic-border cursor-pointer transition animate-pulse active:scale-95"
            >
              <Sparkles className="w-4 h-4" />
              <span>LANJUT KE MISI 3 ➔</span>
            </button>
          </motion.div>
        )}
      </div>

      <p className="text-xs text-slate-400 font-fredoka mt-3 text-center">
        Tip: Cocokkan 4 pasang kartu rahasia (total 8 kartu) untuk menuntaskan misi ini dengan cepat!
      </p>
    </div>
  );
};
