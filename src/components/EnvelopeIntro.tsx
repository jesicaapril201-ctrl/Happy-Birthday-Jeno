import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Sparkles, Shield, ArrowRight, Gamepad2 } from 'lucide-react';
import { SpideyChibi } from './SpideyChibi';
import { soundEngine } from '../utils/audioSynthesizer';
import confetti from 'canvas-confetti';

interface EnvelopeIntroProps {
  boyfriendName: string;
  onOpenComplete: () => void;
}

export const EnvelopeIntro: React.FC<EnvelopeIntroProps> = ({
  boyfriendName,
  onOpenComplete,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLetterExtracted, setIsLetterExtracted] = useState(false);
  const [autoAdvanceCountdown, setAutoAdvanceCountdown] = useState<number | null>(null);

  const handleOpenEnvelope = () => {
    if (isOpen) {
      // If already open and clicked again, proceed immediately!
      soundEngine.playThwip();
      onOpenComplete();
      return;
    }

    setIsOpen(true);
    soundEngine.playThwip();

    // Celebratory confetti
    confetti({
      particleCount: 50,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#dc2626', '#2563eb', '#ffffff', '#fbbf24'],
    });

    // Extract letter after flap opens
    setTimeout(() => {
      setIsLetterExtracted(true);
      soundEngine.playChime();
      setAutoAdvanceCountdown(4);
    }, 600);
  };

  // Auto-advance countdown so user never gets stuck
  useEffect(() => {
    if (autoAdvanceCountdown === null) return;
    if (autoAdvanceCountdown <= 0) {
      onOpenComplete();
      return;
    }

    const timer = setTimeout(() => {
      setAutoAdvanceCountdown((prev) => (prev !== null ? prev - 1 : null));
    }, 1000);

    return () => clearTimeout(timer);
  }, [autoAdvanceCountdown, onOpenComplete]);

  const handleProceed = () => {
    soundEngine.playThwip();
    onOpenComplete();
  };

  return (
    <div className="min-h-[85vh] w-full max-w-xl mx-auto flex flex-col items-center justify-center p-4 relative z-10 select-none">
      {/* Top Floating Badge */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-4 text-center"
      >
        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-600/20 border border-red-500/40 text-red-300 font-bold font-fredoka text-xs sm:text-sm shadow-md">
          <Sparkles className="w-4 h-4 text-amber-400" />
          MISI RAHASIA SUPERHERO
          <Sparkles className="w-4 h-4 text-amber-400" />
        </span>
        <h1 className="font-bangers text-4xl sm:text-6xl text-white tracking-wider mt-2 drop-shadow-[0_4px_12px_rgba(220,38,38,0.5)]">
          SURPRISE FOR <span className="text-red-500 underline decoration-blue-500 decoration-wavy underline-offset-8">{boyfriendName.toUpperCase()}</span>! 🕸️
        </h1>
        <p className="text-slate-300 font-fredoka text-xs sm:text-sm mt-1 max-w-md mx-auto">
          Ada paket surat rahasia dari markas khusus buat hari ulang tahunmu!
        </p>
      </motion.div>

      {/* Main Envelope Stage */}
      <div className="relative w-full max-w-[420px] min-h-[340px] flex items-center justify-center my-2">
        {/* Cute Floating Chibi hanging on a web above */}
        <div className="absolute -top-14 -right-2 sm:-right-6 z-30 pointer-events-none">
          <SpideyChibi
            size={120}
            mood={isOpen ? 'celebrating' : 'swinging'}
            showSpeech={isOpen ? 'Ayo main gamenya sayang! 🤟' : 'Buka amplopnya sayang! 🤟'}
          />
        </div>

        {/* Envelope Container */}
        <div
          onClick={handleOpenEnvelope}
          className={`relative w-[330px] sm:w-[380px] h-[230px] rounded-2xl cursor-pointer transition-transform duration-300 ${
            !isOpen ? 'hover:scale-105 active:scale-95' : 'hover:scale-102'
          }`}
        >
          {/* Envelope Back Body */}
          <div className="absolute inset-0 bg-gradient-to-br from-red-700 to-red-900 rounded-2xl shadow-[0_20px_50px_rgba(220,38,38,0.35)] border-4 border-slate-900 overflow-hidden">
            <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]"></div>
          </div>

          {/* Letter / Secret Mission Document inside envelope */}
          <motion.div
            initial={{ y: 0, scale: 0.9, opacity: 0 }}
            animate={
              isLetterExtracted
                ? { y: -95, scale: 1.02, opacity: 1, zIndex: 40 }
                : isOpen
                ? { y: -30, scale: 0.95, opacity: 0.9, zIndex: 20 }
                : { y: 0, scale: 0.9, opacity: 0, zIndex: 1 }
            }
            transition={{ type: 'spring', stiffness: 140, damping: 15 }}
            className="absolute inset-x-2 bottom-2 top-4 bg-[#fffbf0] rounded-xl p-4 sm:p-5 border-2 border-slate-900 shadow-2xl flex flex-col justify-between text-slate-900 overflow-hidden select-none cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              handleProceed();
            }}
          >
            <div>
              <div className="flex items-center justify-between border-b-2 border-dashed border-red-300 pb-1.5 mb-2">
                <span className="font-bangers text-base sm:text-lg text-red-600 tracking-wide flex items-center gap-1.5">
                  <Shield className="w-4 h-4 text-red-600 fill-red-100" />
                  DAILY BUGLE SPECIAL EDITION
                </span>
                <span className="text-[10px] font-bold bg-red-100 text-red-700 px-2 py-0.5 rounded-full">
                  TOP SECRET
                </span>
              </div>

              <h2 className="font-bangers text-xl sm:text-2xl text-slate-900 leading-tight">
                HALO SUPERHERO FAVORITKU, {boyfriendName}!
              </h2>

              <p className="font-fredoka text-xs sm:text-sm text-slate-700 mt-1.5 leading-relaxed">
                Selamat ulang tahun cintaku! 🎂🕷️ Sebelum tiup lilin, kamu harus tuntaskan <span className="font-bold text-red-600">3 Mini Games</span> superhero!
              </p>
            </div>

            <div className="mt-3 pt-2 border-t border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-1 text-xs font-bold text-red-600">
                <Heart className="w-3.5 h-3.5 fill-red-500 text-red-500 animate-pulse" />
                <span className="text-[11px] sm:text-xs">Klik untuk Mulai ➔</span>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleProceed();
                }}
                className="flex items-center gap-1.5 px-3.5 py-1.5 bg-red-600 hover:bg-red-500 text-white font-bangers text-sm sm:text-base tracking-wider rounded-xl shadow-md comic-border cursor-pointer transition active:scale-95"
              >
                <span>MULAI MISI!</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>

          {/* Envelope Left & Right triangular side folds */}
          <div className="absolute inset-0 pointer-events-none z-20">
            <div
              className="absolute left-0 top-0 bottom-0 w-1/2 bg-gradient-to-r from-red-800 to-red-700"
              style={{ clipPath: 'polygon(0 0, 0 100%, 100% 50%)' }}
            ></div>
            <div
              className="absolute right-0 top-0 bottom-0 w-1/2 bg-gradient-to-l from-red-800 to-red-700"
              style={{ clipPath: 'polygon(100% 0, 100% 100%, 0 50%)' }}
            ></div>
            <div
              className="absolute bottom-0 inset-x-0 h-1/2 bg-gradient-to-t from-red-900 to-red-800 border-b-4 border-slate-900 rounded-b-2xl"
              style={{ clipPath: 'polygon(0 100%, 100% 100%, 50% 0)' }}
            ></div>
          </div>

          {/* Top Flap (Triangular flap that flips open upwards) */}
          <motion.div
            initial={false}
            animate={{
              rotateX: isOpen ? 180 : 0,
              zIndex: isOpen ? 5 : 25,
            }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
            style={{ transformOrigin: 'top center' }}
            className="absolute top-0 inset-x-0 h-1/2 bg-gradient-to-b from-red-600 to-red-700 rounded-t-2xl shadow-md border-t-2 border-slate-900 pointer-events-none"
          >
            <div
              className="w-full h-full bg-red-700"
              style={{ clipPath: 'polygon(0 0, 100% 0, 50% 100%)' }}
            ></div>
          </motion.div>

          {/* Wax Seal with Spidey Mask */}
          <AnimatePresence>
            {!isOpen && (
              <motion.div
                exit={{ scale: 0, opacity: 0, rotate: 45 }}
                transition={{ duration: 0.3 }}
                className="absolute top-[42%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 flex flex-col items-center pointer-events-none"
              >
                <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-red-800 via-red-600 to-amber-500 p-1 shadow-2xl border-2 border-slate-900 flex items-center justify-center animate-pulse">
                  <div className="w-full h-full rounded-full bg-red-700 border-2 border-dashed border-white/60 flex items-center justify-center shadow-inner">
                    <span className="font-bangers text-white text-2xl tracking-tighter drop-shadow">
                      🕷️
                    </span>
                  </div>
                </div>

                <span className="mt-2 text-[11px] font-extrabold font-fredoka bg-slate-900/95 text-amber-300 px-3 py-1 rounded-full border border-amber-400/60 shadow-lg whitespace-nowrap animate-bounce">
                  ✨ Klik Untuk Membuka ✨
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Prominent Action Button Below Envelope */}
      <div className="w-full max-w-sm mt-4 flex flex-col items-center gap-2">
        {!isOpen ? (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleOpenEnvelope}
            className="w-full py-3.5 px-6 bg-gradient-to-r from-red-600 via-red-500 to-amber-500 hover:from-red-500 hover:to-amber-400 text-white font-bangers text-xl tracking-wider rounded-2xl shadow-xl comic-border-blue flex items-center justify-center gap-2 cursor-pointer transition"
          >
            <span>BUKA SURAT RAHASIA JENO ✉️</span>
            <Sparkles className="w-5 h-5 text-amber-200 animate-spin" style={{ animationDuration: '3s' }} />
          </motion.button>
        ) : (
          <div className="w-full flex flex-col items-center gap-2">
            <motion.button
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleProceed}
              className="w-full py-4 px-6 bg-gradient-to-r from-red-600 via-red-500 to-amber-500 hover:from-red-500 hover:to-amber-400 text-white font-bangers text-2xl tracking-wider rounded-2xl shadow-2xl comic-border-blue flex items-center justify-center gap-3 cursor-pointer transition animate-pulse"
            >
              <Gamepad2 className="w-7 h-7 text-amber-200" />
              <span>LANJUT KE 3 MINI GAMES! 🚀</span>
              <ArrowRight className="w-6 h-6" />
            </motion.button>

            {autoAdvanceCountdown !== null && autoAdvanceCountdown > 0 && (
              <p className="text-xs text-amber-300/90 font-fredoka animate-pulse">
                Otomatis lanjut dalam {autoAdvanceCountdown} detik... atau klik tombol di atas!
              </p>
            )}
          </div>
        )}
      </div>

      {/* Helper instruction */}
      <p className="text-xs text-slate-400 font-fredoka mt-6 text-center">
        Dibuat dengan segenap cinta untuk Peter Parker nomor 1 di hatiku, Jeno! ❤️
      </p>
    </div>
  );
};
