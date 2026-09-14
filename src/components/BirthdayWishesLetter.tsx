import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Heart, Sparkles, Copy, Check, RotateCcw, Shield, Star, Share2, ArrowRight, ArrowDown } from 'lucide-react';
import { BirthdayConfig } from '../types';
import { soundEngine } from '../utils/audioSynthesizer';
import { SpideyChibi } from './SpideyChibi';
import confetti from 'canvas-confetti';

interface BirthdayWishesLetterProps {
  config: BirthdayConfig;
  onUpdateConfig?: (config: BirthdayConfig) => void;
  onProceedToGallery: () => void;
  onRestart: () => void;
}

export const BirthdayWishesLetter: React.FC<BirthdayWishesLetterProps> = ({
  config,
  onProceedToGallery,
  onRestart,
}) => {
  const [copied, setCopied] = useState(false);

  // Automatically scroll to top when letter is opened
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    const timer = setTimeout(() => {
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    }, 60);
    return () => clearTimeout(timer);
  }, []);

  const handleCopyMessage = () => {
    const textToCopy = `🕸️ SPECIAL BIRTHDAY MISSION FOR MY SUPERHERO 🕸️\n\nHappy Birthday ${config.boyfriendName}! 🎉\n\n${config.personalMessage}\n\nWith all my love,\n${config.senderName} ❤️`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    soundEngine.playChime();
    setTimeout(() => setCopied(false), 2500);
  };

  const handleShowerLove = () => {
    soundEngine.playThwip();
    confetti({
      particleCount: 70,
      spread: 80,
      origin: { y: 0.7 },
      colors: ['#ef4444', '#ec4899', '#f43f5e', '#3b82f6', '#fbbf24'],
    });
  };

  return (
    <div className="w-full max-w-3xl mx-auto py-6 px-4 flex flex-col items-center select-none">
      {/* Top Banner */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-6"
      >
        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-600/20 border border-red-500/40 text-red-300 font-bold font-fredoka text-xs sm:text-sm">
          <Heart className="w-4 h-4 text-red-500 fill-red-500 animate-pulse" />
          SURAT CINTA & DOA PALING TULUS
        </span>
        <h2 className="font-bangers text-4xl sm:text-6xl text-white tracking-wide mt-3 drop-shadow">
          HAPPY BIRTHDAY, MY SUPERHERO! 🕷️❤️
        </h2>
        <p className="text-slate-300 text-sm font-fredoka mt-1 max-w-md mx-auto">
          Pesan cinta dari lubuk hati terdalam khusus untuk hari spesialmu!
        </p>
      </motion.div>

      {/* Main Comic Letter Scroll / Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative w-full bg-[#fffef7] rounded-3xl p-6 sm:p-10 border-4 border-slate-900 shadow-[0_25px_60px_rgba(220,38,38,0.3)] comic-border-red text-slate-900 overflow-hidden"
      >
        {/* Top Comic Header Banner */}
        <div className="flex flex-col sm:flex-row items-center justify-between border-b-4 border-slate-900 pb-4 mb-6 gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-12 h-12 rounded-2xl bg-red-600 border-2 border-slate-900 flex items-center justify-center shadow text-white font-bangers text-2xl">
              🤟
            </div>
            <div>
              <span className="text-xs font-black font-bangers text-red-600 tracking-wider flex items-center gap-1">
                <Shield className="w-3.5 h-3.5 fill-red-600" />
                OFFICIAL PETER PARKER COMMEMORATIVE EDITION
              </span>
              <h3 className="font-bangers text-2xl sm:text-3xl text-slate-900 leading-none">
                UNTUK KESAYANGAN TERCINTA: {config.boyfriendName.toUpperCase()}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold bg-red-100 border border-red-300 text-red-700 px-3 py-1 rounded-full font-fredoka">
              ❤️ 100% Cinta Abadi
            </span>
          </div>
        </div>

        {/* Letter Body Text */}
        <div className="space-y-4 font-fredoka text-slate-800 text-sm sm:text-base leading-relaxed">
          <p className="font-bold text-red-600 text-lg">
            Hai, Spider-Man kesayanganku... 🕸️✨
          </p>

          <p className="whitespace-pre-line text-slate-800 leading-relaxed font-normal">
            {config.personalMessage}
          </p>

          <div className="my-6 p-4 rounded-2xl bg-red-50 border-2 border-dashed border-red-300 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-red-600 text-white flex items-center justify-center shrink-0 shadow text-xl">
              🕷️
            </div>
            <p className="font-caveat text-xl sm:text-2xl text-red-700 leading-tight">
              "In every universe, across the entire multiverse, my Spider-Sense will always choose and love you." ❤️
            </p>
          </div>

          {/* Signature */}
          <div className="pt-4 flex flex-col items-end text-right">
            <span className="text-xs font-fredoka text-slate-500">Dengan seluruh cintaku,</span>
            <span className="font-caveat text-3xl font-bold text-red-600 mt-1">
              {config.senderName} ❤️
            </span>
            <span className="text-[11px] font-fredoka text-slate-400">
              (Your favorite Mary Jane / Gwen)
            </span>
          </div>
        </div>

        {/* Floating Spidey Chibi in bottom left */}
        <div className="absolute -bottom-8 -left-6 opacity-30 sm:opacity-40 pointer-events-none">
          <SpideyChibi size={130} mood="happy" />
        </div>
      </motion.div>

      {/* Interactive Action Buttons right below the letter */}
      <div className="w-full flex flex-wrap items-center justify-center gap-3 mt-6">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleShowerLove}
          className="flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-500 text-white font-bangers text-lg tracking-wide rounded-2xl shadow-lg comic-border-blue cursor-pointer transition active:scale-95"
        >
          <Heart className="w-5 h-5 fill-white text-white animate-pulse" />
          <span>HUJANI CINTA! ❤️</span>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleCopyMessage}
          className="flex items-center gap-2 px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bangers text-lg tracking-wide rounded-2xl shadow-lg border-2 border-slate-700 cursor-pointer transition"
        >
          {copied ? <Check className="w-5 h-5 text-emerald-400" /> : <Copy className="w-5 h-5" />}
          <span>{copied ? 'TERSALIN DI CLIPBOARD!' : 'SALIN UCAPAN'}</span>
        </motion.button>
      </div>

      {/* Downward Scroll Indicator to Finale */}
      <div className="my-10 flex flex-col items-center text-center">
        <span className="text-xs font-bold text-slate-400 font-fredoka uppercase tracking-widest mb-2 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          KEJUTAN TERAKHIR MENANTI DI BAWAH
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
        </span>
        <div className="w-10 h-10 rounded-full bg-slate-900 border-2 border-red-500/80 flex items-center justify-center text-red-400 animate-bounce shadow-lg">
          <ArrowDown className="w-5 h-5" />
        </div>
      </div>

      {/* Grand Finale Button to proceed to Polaroid Gallery (Revealed at the bottom after scrolling) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        className="w-full max-w-xl mb-12"
      >
        <button
          onClick={() => {
            soundEngine.playThwip();
            onProceedToGallery();
          }}
          className="w-full flex items-center justify-center gap-3 px-8 py-5 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bangers text-2xl sm:text-3xl tracking-wider rounded-3xl shadow-[0_15px_40px_rgba(79,70,229,0.45)] comic-border-red cursor-pointer transition animate-pulse"
        >
          <span>BUKA 3 FOTO KENANGAN KITA 📸</span>
          <ArrowRight className="w-7 h-7" />
        </button>
        <p className="text-center text-xs text-slate-400 font-fredoka mt-2.5">
          🎁 Misi Paling Akhir: Lihat 3 Foto Polaroid Kenangan & Pesan Rahasia di Belakangnya
        </p>
      </motion.div>
    </div>
  );
};
