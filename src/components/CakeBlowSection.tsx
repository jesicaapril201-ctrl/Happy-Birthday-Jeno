import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Heart, Mic, MicOff, Wind, Cake as CakeIcon, ArrowRight, Check } from 'lucide-react';
import { SpideyChibi } from './SpideyChibi';
import { soundEngine } from '../utils/audioSynthesizer';
import confetti from 'canvas-confetti';

interface CakeBlowSectionProps {
  boyfriendName: string;
  onProceedToWishes: () => void;
}

export const CakeBlowSection: React.FC<CakeBlowSectionProps> = ({
  boyfriendName,
  onProceedToWishes,
}) => {
  const [wish, setWish] = useState('');
  const [isWishSaved, setIsWishSaved] = useState(false);
  const [areCandlesBlown, setAreCandlesBlown] = useState(false);
  const [isListeningMic, setIsListeningMic] = useState(false);
  const [blowProgress, setBlowProgress] = useState(0); // 0 to 100
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const microphoneStreamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Handle extinguishing the candles
  const extinguishCandles = () => {
    if (areCandlesBlown) return;

    soundEngine.playBlow();
    setAreCandlesBlown(true);
    stopMicListening();

    // Celebration Confetti
    const count = 120;
    confetti({
      particleCount: count,
      spread: 100,
      origin: { y: 0.6 },
      colors: ['#dc2626', '#2563eb', '#ffffff', '#fbbf24', '#ec4899'],
    });

    setTimeout(() => {
      soundEngine.playVictory();
    }, 400);
  };

  // Start microphone detection
  const startMicListening = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      microphoneStreamRef.current = stream;

      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();
      audioContextRef.current = ctx;

      const source = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);
      analyserRef.current = analyser;

      setIsListeningMic(true);

      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      const checkAudioLevel = () => {
        if (!analyserRef.current) return;
        analyserRef.current.getByteFrequencyData(dataArray);

        // Average low-mid frequencies typical for breath/wind puff
        let sum = 0;
        const checkRange = Math.min(30, bufferLength);
        for (let i = 0; i < checkRange; i++) {
          sum += dataArray[i];
        }
        const average = sum / checkRange;

        // Threshold for blow detection
        if (average > 65) {
          setBlowProgress((prev) => {
            const next = prev + 25;
            if (next >= 100) {
              extinguishCandles();
            }
            return Math.min(100, next);
          });
        } else {
          setBlowProgress((prev) => Math.max(0, prev - 5));
        }

        animationFrameRef.current = requestAnimationFrame(checkAudioLevel);
      };

      checkAudioLevel();
    } catch {
      setIsListeningMic(false);
    }
  };

  const stopMicListening = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    if (microphoneStreamRef.current) {
      microphoneStreamRef.current.getTracks().forEach((track) => track.stop());
      microphoneStreamRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close().catch(() => {});
      audioContextRef.current = null;
    }
    setIsListeningMic(false);
  };

  useEffect(() => {
    return () => {
      stopMicListening();
    };
  }, []);

  return (
    <div className="w-full max-w-3xl mx-auto py-6 px-4 flex flex-col items-center select-none">
      {/* Top Banner */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-6"
      >
        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-600/20 border border-red-500/40 text-red-300 font-bold font-fredoka text-xs sm:text-sm">
          <CakeIcon className="w-4 h-4 text-red-400" />
          KUE ULANG TAHUN SPIDEY & TIUP LILIN
        </span>
        <h2 className="font-bangers text-4xl sm:text-6xl text-white tracking-wide mt-3 drop-shadow-[0_4px_12px_rgba(220,38,38,0.5)]">
          MAKE A WISH, <span className="text-red-500">{boyfriendName.toUpperCase()}</span>! 🎂✨
        </h2>
        <p className="text-slate-300 text-sm font-fredoka mt-1 max-w-md mx-auto">
          Tulis harapan terbaikmu di tahun ini, lalu tiup lilin ulang tahunnya!
        </p>
      </motion.div>

      {/* Wish Input Card */}
      {!isWishSaved && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md bg-slate-900/90 border-2 border-red-500/70 rounded-2xl p-5 mb-8 shadow-xl backdrop-blur-sm"
        >
          <div className="flex items-center gap-2 mb-2">
            <Heart className="w-5 h-5 text-red-500 fill-red-500 animate-pulse" />
            <h3 className="font-bangers text-lg text-white tracking-wide">
              HARAPAN ULANG TAHUN (MAKE A WISH)
            </h3>
          </div>
          <p className="text-xs text-slate-300 font-fredoka mb-3">
            Tuliskan impian atau doa rahasiamu sebelum meniup lilin:
          </p>

          <div className="relative">
            <input
              type="text"
              value={wish}
              onChange={(e) => setWish(e.target.value)}
              placeholder="Contoh: Semoga selalu bahagia, sehat, & sukses bareng kamu ❤️"
              className="w-full bg-slate-950 border border-slate-700 focus:border-red-500 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 outline-none transition font-fredoka"
            />
          </div>

          <div className="mt-3 flex justify-end">
            <button
              onClick={() => {
                soundEngine.playChime();
                setIsWishSaved(true);
              }}
              className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-bangers text-sm tracking-wide rounded-xl shadow-md cursor-pointer transition active:scale-95"
            >
              <Check className="w-4 h-4" />
              <span>SIMPAN & SIAP TIUP!</span>
            </button>
          </div>
        </motion.div>
      )}

      {isWishSaved && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 px-4 py-2 bg-red-950/60 border border-red-500/50 rounded-full flex items-center gap-2 text-xs text-red-200 font-fredoka"
        >
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>Harapan tersimpan: "{wish || 'Semoga selalu bahagia bersama kamu ❤️'}"</span>
          <button
            onClick={() => setIsWishSaved(false)}
            className="text-[10px] text-slate-400 hover:text-white underline ml-1 cursor-pointer"
          >
            Ubah
          </button>
        </motion.div>
      )}

      {/* Spider-Man Birthday Cake SVG Illustration Stage */}
      <div className="relative w-full max-w-[400px] h-[360px] flex items-center justify-center my-2">
        {/* Floating Spidey Chibi spectator */}
        <div className="absolute -top-10 -left-6 sm:-left-12 z-30 pointer-events-none">
          <SpideyChibi
            size={110}
            mood={areCandlesBlown ? 'cheering' : 'happy'}
            showSpeech={areCandlesBlown ? 'HOREEE!! 🎉' : 'Ayo tiup sayang! 🎂'}
          />
        </div>

        {/* 3D-styled Layered Cake */}
        <div className="relative w-full h-full flex flex-col items-center justify-end pb-8">
          {/* Plate / Stand */}
          <div className="absolute bottom-4 w-72 h-8 bg-gradient-to-r from-slate-400 via-white to-slate-400 rounded-full shadow-[0_15px_30px_rgba(0,0,0,0.8)] border-2 border-slate-600"></div>

          {/* Bottom Cake Tier (Royal Blue with Web lines) */}
          <div className="relative w-64 h-24 bg-gradient-to-b from-blue-600 to-blue-800 rounded-2xl border-4 border-slate-900 shadow-2xl flex items-center justify-center overflow-hidden">
            {/* Red drip frosting along top edge */}
            <div className="absolute top-0 inset-x-0 h-6 bg-red-600 border-b-2 border-slate-900 flex justify-around">
              <div className="w-5 h-7 bg-red-600 rounded-b-full border-b-2 border-x-2 border-slate-900 -mt-1"></div>
              <div className="w-6 h-9 bg-red-600 rounded-b-full border-b-2 border-x-2 border-slate-900 -mt-1"></div>
              <div className="w-5 h-6 bg-red-600 rounded-b-full border-b-2 border-x-2 border-slate-900 -mt-1"></div>
              <div className="w-7 h-8 bg-red-600 rounded-b-full border-b-2 border-x-2 border-slate-900 -mt-1"></div>
            </div>

            {/* Black Spider emblem in middle */}
            <div className="relative z-10 w-10 h-10 rounded-full bg-slate-900/90 border border-red-400 flex items-center justify-center shadow">
              <span className="text-xl">🕷️</span>
            </div>

            {/* Cake texture webbing */}
            <div className="absolute inset-0 opacity-20 bg-[linear-gradient(45deg,#ffffff_25%,transparent_25%),linear-gradient(-45deg,#ffffff_25%,transparent_25%)] [background-size:20px_20px]"></div>
          </div>

          {/* Middle Cake Tier (Vibrant Spidey Red with web lines) */}
          <div className="relative w-48 h-20 bg-gradient-to-b from-red-500 to-red-700 rounded-2xl border-4 border-slate-900 shadow-xl flex items-center justify-center -mt-2 overflow-hidden">
            {/* Blue and white frosting drips */}
            <div className="absolute top-0 inset-x-0 h-5 bg-blue-600 border-b-2 border-slate-900 flex justify-around">
              <div className="w-4 h-6 bg-blue-600 rounded-b-full border-b-2 border-slate-900"></div>
              <div className="w-5 h-7 bg-blue-600 rounded-b-full border-b-2 border-slate-900"></div>
              <div className="w-4 h-5 bg-blue-600 rounded-b-full border-b-2 border-slate-900"></div>
            </div>

            <span className="relative z-10 font-bangers text-white text-xl tracking-wider drop-shadow-md">
              HBD {boyfriendName.toUpperCase()}
            </span>
          </div>

          {/* Top Cake Tier (Red & Blue swirl) */}
          <div className="relative w-36 h-14 bg-gradient-to-r from-red-600 via-blue-600 to-red-600 rounded-2xl border-4 border-slate-900 shadow-lg flex items-center justify-center -mt-2">
            {/* Whipped cream dollops */}
            <div className="absolute -top-3 inset-x-2 flex justify-between">
              <div className="w-5 h-4 bg-white rounded-full border-2 border-slate-900 shadow"></div>
              <div className="w-5 h-4 bg-white rounded-full border-2 border-slate-900 shadow"></div>
              <div className="w-5 h-4 bg-white rounded-full border-2 border-slate-900 shadow"></div>
            </div>
          </div>

          {/* Birthday Candles (3 Candles) */}
          <div className="relative -mt-6 z-20 flex items-end justify-center gap-6">
            {[0, 1, 2].map((idx) => (
              <div key={idx} className="flex flex-col items-center">
                {/* Flame or Smoke Puff */}
                <AnimatePresence>
                  {!areCandlesBlown ? (
                    <motion.div
                      exit={{ scale: 0, opacity: 0 }}
                      className="relative w-5 h-8 flex items-center justify-center mb-1 cursor-pointer"
                      onClick={extinguishCandles}
                    >
                      {/* Outer Flame Glow */}
                      <div className="absolute w-8 h-10 rounded-full bg-amber-500/40 blur-md animate-flame"></div>
                      {/* Flame Core */}
                      <div className="w-4 h-7 bg-gradient-to-t from-red-500 via-amber-400 to-yellow-200 rounded-full border border-amber-300 shadow-[0_0_12px_#f59e0b] animate-flame"></div>
                    </motion.div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: [0.8, 0], y: [-5, -25], x: [0, idx % 2 === 0 ? 5 : -5] }}
                      transition={{ duration: 1.8, repeat: Infinity }}
                      className="w-3 h-6 text-slate-400 font-bold text-xs mb-1"
                    >
                      💨
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Candle Wick */}
                <div className="w-0.5 h-2 bg-slate-900"></div>

                {/* Candle Body with Spidey stripes */}
                <div
                  className={`w-4 h-12 rounded-t-sm border-2 border-slate-900 shadow-md ${
                    idx === 1
                      ? 'bg-gradient-to-b from-red-500 to-blue-600'
                      : idx === 0
                      ? 'bg-gradient-to-b from-blue-500 to-red-500'
                      : 'bg-gradient-to-b from-amber-400 to-red-500'
                  }`}
                ></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Interactive Blow Controls */}
      {!areCandlesBlown ? (
        <div className="flex flex-col items-center gap-4 w-full max-w-md mt-4">
          {/* Main "TIUP LILIN" button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={extinguishCandles}
            className="w-full py-4 bg-gradient-to-r from-red-600 via-red-500 to-amber-500 hover:from-red-500 hover:to-amber-400 text-white font-bangers text-2xl tracking-wider rounded-2xl shadow-xl comic-border-blue flex items-center justify-center gap-2 cursor-pointer transition active:scale-95"
          >
            <Wind className="w-7 h-7 animate-bounce" />
            <span>TIUP LILIN SEKARANG! 💨</span>
          </motion.button>

          {/* Alternative Microphone Detection */}
          <div className="flex items-center gap-3">
            <button
              onClick={isListeningMic ? stopMicListening : startMicListening}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-fredoka font-semibold border transition cursor-pointer ${
                isListeningMic
                  ? 'bg-emerald-950/70 border-emerald-500 text-emerald-300'
                  : 'bg-slate-900/70 border-slate-700 text-slate-400 hover:text-white'
              }`}
            >
              {isListeningMic ? <Mic className="w-3.5 h-3.5 animate-pulse" /> : <MicOff className="w-3.5 h-3.5" />}
              <span>{isListeningMic ? 'Mikrofon Aktif (Tiup ke Mic HP/Laptop!)' : 'Aktifkan Sensor Tiup Mikrofon'}</span>
            </button>
          </div>

          {/* Blow progress bar when mic is active */}
          {isListeningMic && (
            <div className="w-full max-w-xs bg-slate-800 rounded-full h-2 overflow-hidden border border-slate-700">
              <div
                className="bg-gradient-to-r from-red-500 to-amber-400 h-full transition-all duration-100"
                style={{ width: `${blowProgress}%` }}
              ></div>
            </div>
          )}
        </div>
      ) : (
        /* After blown banner */
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center text-center mt-4 p-6 bg-slate-900/90 border-2 border-red-500 rounded-3xl shadow-2xl backdrop-blur-md w-full max-w-md"
        >
          <div className="w-14 h-14 rounded-full bg-red-600/30 border border-red-500 flex items-center justify-center mb-2">
            <Sparkles className="w-8 h-8 text-amber-400 animate-spin" style={{ animationDuration: '4s' }} />
          </div>

          <h3 className="font-bangers text-3xl sm:text-4xl text-white tracking-wider">
            HARAPANMU DIKABULKAN! ✨🎉
          </h3>

          <p className="text-sm font-fredoka text-slate-300 mt-2 leading-relaxed">
            Semoga semua impianmu tercapai, selalu jadi superhero kebanggaan, dan bahagia selalu bersamaku, {boyfriendName}! ❤️
          </p>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              soundEngine.playThwip();
              onProceedToWishes();
            }}
            className="mt-6 flex items-center gap-2 px-7 py-3.5 bg-gradient-to-r from-red-600 via-red-500 to-amber-500 hover:from-red-500 hover:to-amber-400 text-white font-bangers text-xl tracking-wide rounded-2xl shadow-xl comic-border-blue cursor-pointer"
          >
            <span>LANJUT KE SURAT UCAPAN PENUH CINTA 💌</span>
            <ArrowRight className="w-5 h-5 animate-pulse" />
          </motion.button>
        </motion.div>
      )}
    </div>
  );
};
