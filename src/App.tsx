import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AppStage, BirthdayConfig, PolaroidPhoto } from './types';
import { EnvelopeIntro } from './components/EnvelopeIntro';
import { GameHub } from './components/games/GameHub';
import { CakeBlowSection } from './components/CakeBlowSection';
import { BirthdayWishesLetter } from './components/BirthdayWishesLetter';
import { PolaroidGallery } from './components/PolaroidGallery';
import { AudioPlayer } from './components/AudioPlayer';

const DEFAULT_CONFIG: BirthdayConfig = {
  boyfriendName: 'Jeno',
  senderName: 'Pacarmu Tersayang',
  age: '20',
  personalMessage: `Selamat ulang tahun untuk superhero terhebat dalam hidupku, Jeno! ❤️

Terima kasih sudah selalu ada buat aku, selalu jadi tempat pulang yang paling nyaman, selalu sabar, dan selalu bikin aku tersenyum bahagia setiap hari. Di mataku, kamu bukan cuma seperti Peter Parker yang keren dan hebat, tapi kamu adalah orang yang paling berharga dengan hati paling tulus dan hangat.

Semoga di usiamu yang baru ini, segala cita-cita dan impian besarmu dimudahkan, rezekimu dilipatgandakan, diberikan kesehatan dan kebahagiaan selalu. Apapun rintangan di masa depan, ingat ya kalau aku akan selalu ada di sampingmu untuk mendukung semua langkahmu.

I love you in every universe, my favorite superhero Jeno! 🕸️🎂✨`,
};

const DEFAULT_PHOTOS: PolaroidPhoto[] = [
  {
    id: 'photo-1',
    url: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=800&q=80',
    caption: 'My Superhero Jeno ❤️',
    backNote: 'Foto pertama kita yang selalu bikin aku tersenyum sendiri. Kamu selalu jadi alasan terbesarku untuk bahagia! 💖',
    date: 'Kenangan Manis #1',
    rotation: -3,
  },
  {
    id: 'photo-2',
    url: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=800&q=80',
    caption: 'Our Adventure Together 🕸️',
    backNote: 'Setiap jalan-jalan bareng kamu rasanya seperti petualangan melompati gedung-gedung kota! Selalu seru dan tak terlupakan 🚀',
    date: 'Kenangan Manis #2',
    rotation: 2,
  },
  {
    id: 'photo-3',
    url: 'https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?auto=format&fit=crop&w=800&q=80',
    caption: 'Happy Birthday, Jeno! 🎂',
    backNote: 'Selamat bertambah usia, cintaku! Semoga kita bisa terus merayakan ulang tahun-ulang tahun berikutnya bersama selamanya ✨',
    date: 'Kenangan Manis #3',
    rotation: -2,
  },
];

export default function App() {
  const [currentStage, setCurrentStage] = useState<AppStage>('envelope');
  const [config, setConfig] = useState<BirthdayConfig>(() => {
    try {
      const saved = localStorage.getItem('spidey_hbd_config');
      if (saved) {
        const parsed = JSON.parse(saved);
        // Ensure boyfriendName defaults to Jeno if it was the generic default
        if (!parsed.boyfriendName || parsed.boyfriendName === 'Sayang') {
          parsed.boyfriendName = 'Jeno';
        }
        return parsed;
      }
      return DEFAULT_CONFIG;
    } catch {
      return DEFAULT_CONFIG;
    }
  });

  const [photos, setPhotos] = useState<PolaroidPhoto[]>(() => {
    try {
      const saved = localStorage.getItem('spidey_hbd_photos');
      return saved ? JSON.parse(saved) : DEFAULT_PHOTOS;
    } catch {
      return DEFAULT_PHOTOS;
    }
  });

  const [customAudio, setCustomAudio] = useState<{ url?: string; name?: string }>({});

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [currentStage]);

  const handleUpdateConfig = (newConfig: BirthdayConfig) => {
    setConfig(newConfig);
    try {
      localStorage.setItem('spidey_hbd_config', JSON.stringify(newConfig));
    } catch {
      // ignore
    }
  };

  const handleUpdatePhotos = (newPhotos: PolaroidPhoto[]) => {
    setPhotos(newPhotos);
    try {
      localStorage.setItem('spidey_hbd_photos', JSON.stringify(newPhotos));
    } catch {
      // ignore
    }
  };

  const handleAudioUpload = (url: string, name: string) => {
    setCustomAudio({ url, name });
  };

  return (
    <div className="min-h-screen bg-[#070b19] text-white selection:bg-red-600 selection:text-white relative overflow-x-hidden font-fredoka flex flex-col justify-between">
      {/* Spider-Man Themed Dynamic Background Canvas */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {/* Subtle Web Grid and Halftone dots */}
        <div className="absolute inset-0 comic-dots-pattern opacity-40"></div>
        <div className="absolute inset-0 web-pattern opacity-60"></div>

        {/* Ambient superhero glow orbs */}
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-red-600/15 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 -right-32 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-32 left-1/3 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl"></div>
      </div>

      {/* Floating Background Audio Player (Music & Voice Note Player) */}
      <AudioPlayer
        customAudioUrl={customAudio.url}
        onAudioUpload={handleAudioUpload}
      />

      {/* Main Content Flow: Amplop -> 3 Games -> Make a wish & Tiup Lilin -> Ucapan Cinta -> Galeri 3 Foto */}
      <main className="relative z-10 w-full flex-grow flex items-center justify-center py-6 px-3">
        <AnimatePresence mode="wait">
          {/* STEP 1: Amplop Rahasia */}
          {currentStage === 'envelope' && (
            <motion.div
              key="stage-envelope"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.35 }}
              className="w-full"
            >
              <EnvelopeIntro
                boyfriendName={config.boyfriendName}
                onOpenComplete={() => setCurrentStage('games')}
              />
            </motion.div>
          )}

          {/* STEP 2: 3 Mini Games */}
          {currentStage === 'games' && (
            <motion.div
              key="stage-games"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.35 }}
              className="w-full"
            >
              <GameHub
                onAllGamesComplete={() => setCurrentStage('cake')}
                onSkipGames={() => setCurrentStage('cake')}
              />
            </motion.div>
          )}

          {/* STEP 3: Make a Wish & Tiup Lilin */}
          {currentStage === 'cake' && (
            <motion.div
              key="stage-cake"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              transition={{ duration: 0.35 }}
              className="w-full"
            >
              <CakeBlowSection
                boyfriendName={config.boyfriendName}
                onProceedToWishes={() => setCurrentStage('wishes')}
              />
            </motion.div>
          )}

          {/* STEP 4: Surat Ucapan Cinta */}
          {currentStage === 'wishes' && (
            <motion.div
              key="stage-wishes"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.35 }}
              className="w-full"
            >
              <BirthdayWishesLetter
                config={config}
                onUpdateConfig={handleUpdateConfig}
                onProceedToGallery={() => setCurrentStage('gallery')}
                onRestart={() => setCurrentStage('envelope')}
              />
            </motion.div>
          )}

          {/* STEP 5: Galeri 3 Foto Polaroid */}
          {currentStage === 'gallery' && (
            <motion.div
              key="stage-gallery"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.35 }}
              className="w-full"
            >
              <PolaroidGallery
                photos={photos}
                onUpdatePhotos={handleUpdatePhotos}
                onRestart={() => setCurrentStage('envelope')}
                onBackToLetter={() => setCurrentStage('wishes')}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer Branding */}
      <footer className="relative z-20 py-4 text-center text-xs text-slate-400 font-fredoka flex flex-col items-center gap-1">
        <p className="flex items-center gap-1.5">
          <span>Spesial untuk superhero kebanggaanku, {config.boyfriendName}</span>
          <span className="text-red-500 animate-pulse">❤️</span>
          <span>🕸️</span>
        </p>
      </footer>
    </div>
  );
}
